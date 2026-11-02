/*
  Warnings:

  - A unique constraint covering the columns `[code,tenantId]` on the table `ServiceCategoryMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ServiceCategoryMaster_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategoryMaster_code_tenantId_key" ON "ServiceCategoryMaster"("code", "tenantId");
