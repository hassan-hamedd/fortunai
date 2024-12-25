/*
  Warnings:

  - Added the required column `authorEmail` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "authorEmail" TEXT NOT NULL,
ADD COLUMN     "authorName" TEXT NOT NULL;
