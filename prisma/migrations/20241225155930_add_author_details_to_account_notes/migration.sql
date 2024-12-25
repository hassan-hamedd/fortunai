/*
  Warnings:

  - Added the required column `authorEmail` to the `AccountNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `AccountNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `AccountNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountNote" ADD COLUMN     "authorEmail" TEXT NOT NULL,
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "authorName" TEXT NOT NULL;
