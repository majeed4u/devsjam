#!/bin/sh
set -e

RETRIES=5
SLEEP=2

run_with_retries() {
  cmd="$1"
  i=0
  until [ "$i" -ge "$RETRIES" ]; do
    if sh -c "$cmd"; then
      return 0
    fi
    i=$((i+1))
    echo "Command failed — retrying in ${SLEEP}s ($i/$RETRIES)"
    sleep $SLEEP
  done
  return 1
}

echo "DB migration step (NODE_ENV=${NODE_ENV:-development}, RUN_MIGRATIONS=${RUN_MIGRATIONS:-false})"

# Decide whether to run migrations (deploy) or db push
if [ "${RUN_MIGRATIONS:-}" = "true" ] || [ "${NODE_ENV:-}" = "production" ]; then
  if [ -d packages/db/prisma/migrations ] && [ "$(ls -A packages/db/prisma/migrations)" ]; then
    echo "Detected Prisma migrations — checking status"
    
    # Check migration status first
    cd packages/db
    MIGRATE_STATUS=$(bunx prisma migrate status 2>&1 || true)
    
    if echo "$MIGRATE_STATUS" | grep -q "Database schema is up to date"; then
      echo "✅ Database is already up to date, skipping migration"
    elif echo "$MIGRATE_STATUS" | grep -q "P3005"; then
      echo "⚠️  Database schema exists but migrations not tracked (P3005)"
      echo "🔧 Baselining database with existing migrations..."
      
      # Get the first migration folder name
      FIRST_MIGRATION=$(ls -1 prisma/migrations 2>/dev/null | grep -v '\.toml$' | head -1)
      if [ -n "$FIRST_MIGRATION" ]; then
        echo "Marking migration as applied: $FIRST_MIGRATION"
        bunx prisma migrate resolve --applied "$FIRST_MIGRATION"
        echo "✅ Database baselined successfully"
      else
        echo "❌ No migrations found to baseline"
        if [ "${NODE_ENV:-}" = "production" ]; then
          exit 1
        fi
      fi
    elif echo "$MIGRATE_STATUS" | grep -q "not yet been applied"; then
      echo "📦 Pending migrations detected, applying..."
      set +e
      DEPLOY_OUTPUT=$(bunx prisma migrate deploy 2>&1)
      DEPLOY_EXIT=$?
      set -e
      echo "$DEPLOY_OUTPUT"
      if [ $DEPLOY_EXIT -ne 0 ]; then
        if echo "$DEPLOY_OUTPUT" | grep -q "P3005"; then
          echo "⚠️  P3005: schema exists but not tracked — baselining all migrations..."
          for MIGRATION in $(ls -1 prisma/migrations 2>/dev/null | grep -v '\.toml$'); do
            echo "Marking as applied: $MIGRATION"
            bunx prisma migrate resolve --applied "$MIGRATION"
          done
          echo "✅ All migrations baselined successfully"
        else
          echo "prisma migrate deploy failed"
          if [ "${NODE_ENV:-}" = "production" ]; then
            exit 1
          else
            echo "Continuing despite migration failure (non-production)"
          fi
        fi
      else
        echo "✅ Migrations applied successfully"
      fi
    else
      echo "🚀 Running 'prisma migrate deploy'"
      if ! run_with_retries "bunx prisma migrate deploy"; then
        echo "prisma migrate deploy failed after ${RETRIES} attempts"
        if [ "${NODE_ENV:-}" = "production" ]; then
          exit 1
        else
          echo "Continuing despite migration failure (non-production)"
        fi
      fi
    fi
    cd /app
  else
    echo "No Prisma migrations found; skipping 'prisma migrate deploy'"
  fi
else
  echo "Running 'prisma db push' for development/preview environments"
  if ! run_with_retries "cd packages/db && bunx prisma db push"; then
    echo "prisma db push failed after ${RETRIES} attempts — continuing startup"
  fi
fi

# Replace the shell process with the app process
exec "$@"