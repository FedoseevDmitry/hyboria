/*
  Warnings:

  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- DropForeignKey
ALTER TABLE "JournalPost" DROP CONSTRAINT "JournalPost_journalId_fkey";

-- DropTable
DROP TABLE "Journal";

-- DropTable
DROP TABLE "JournalPost";

-- CreateTable
CREATE TABLE "journal" (
    "id" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journalPost" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journalPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "journal_slug_key" ON "journal"("slug");

-- AddForeignKey
ALTER TABLE "journal" ADD CONSTRAINT "journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journalPost" ADD CONSTRAINT "journalPost_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
