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
    echo "Detected Prisma migrations — running 'prisma migrate deploy'"
    if ! run_with_retries "cd packages/db && bunx prisma migrate deploy"; then
      echo "prisma migrate deploy failed after ${RETRIES} attempts"
      # In production we should fail; in non-production continue
      if [ "${NODE_ENV:-}" = "production" ]; then
        exit 1
      else
        echo "Continuing despite migration failure (non-production)"
      fi
    fi
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