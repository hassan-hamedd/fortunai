/*
  Warnings:

  - You are about to drop the column `period` on the `TrialBalance` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `TrialBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `TrialBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrialBalance" DROP COLUMN "period",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
