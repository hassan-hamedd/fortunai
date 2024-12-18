/*
  Warnings:

  - Added the required column `realmId` to the `AccountantQuickBooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountantQuickBooks" ADD COLUMN     "realmId" TEXT NOT NULL;
