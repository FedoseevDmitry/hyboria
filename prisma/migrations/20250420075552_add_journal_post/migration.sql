-- DropForeignKey
ALTER TABLE "JournalPost" DROP CONSTRAINT "JournalPost_journalId_fkey";

-- AlterTable
ALTER TABLE "JournalPost" ADD COLUMN     "image" TEXT;

-- AddForeignKey
ALTER TABLE "JournalPost" ADD CONSTRAINT "JournalPost_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
