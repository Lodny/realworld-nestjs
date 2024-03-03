-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_articleId_fkey";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
