-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
