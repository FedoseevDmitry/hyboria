-- CreateTable
CREATE TABLE "JournalPost" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalPost" ADD CONSTRAINT "JournalPost_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
