-- AlterTable
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "archived" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Post_archived_idx" ON "Post"("archived");
