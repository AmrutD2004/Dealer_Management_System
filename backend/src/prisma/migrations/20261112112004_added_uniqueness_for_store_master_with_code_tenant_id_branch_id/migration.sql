/*
  Warnings:

  - A unique constraint covering the columns `[code,tenantId,branchId]` on the table `StoreMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoreMaster_code_tenantId_branchId_key" ON "StoreMaster"("code", "tenantId", "branchId");
