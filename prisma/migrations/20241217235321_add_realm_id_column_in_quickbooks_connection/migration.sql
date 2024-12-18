/*
  Warnings:

  - Added the required column `realmId` to the `QuickBooksConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuickBooksConnection" ADD COLUMN     "realmId" TEXT NOT NULL;
