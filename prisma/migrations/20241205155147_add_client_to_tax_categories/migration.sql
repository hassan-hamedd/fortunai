/*
  Warnings:

  - A unique constraint covering the columns `[clientId,name]` on the table `TaxCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `TaxCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaxCategory" ADD COLUMN     "clientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TaxCategory_clientId_name_key" ON "TaxCategory"("clientId", "name");

-- AddForeignKey
ALTER TABLE "TaxCategory" ADD CONSTRAINT "TaxCategory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
