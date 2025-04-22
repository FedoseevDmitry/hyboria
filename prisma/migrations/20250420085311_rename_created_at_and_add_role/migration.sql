/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `JournalPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "JournalPost" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
