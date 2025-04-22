/*
  Warnings:

  - You are about to drop the column `character` on the `journal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `journal` table. All the data in the column will be lost.
  - Added the required column `characterName` to the `journal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `journal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "journal" DROP COLUMN "character",
DROP COLUMN "updatedAt",
ADD COLUMN     "characterName" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
