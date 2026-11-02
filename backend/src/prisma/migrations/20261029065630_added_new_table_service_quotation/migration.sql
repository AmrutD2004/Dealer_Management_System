-- CreateEnum
CREATE TYPE "Action" AS ENUM ('NEW', 'SUPPLEMENT');

-- CreateEnum
CREATE TYPE "serviceQuotationStatus" AS ENUM ('DRAFT', 'INPROGRESS', 'APPROVED', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "ServiceQuotation" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "quotationNo" TEXT NOT NULL,
    "originalQuotationId" INTEGER,
    "action" "Action" NOT NULL,
    "status" "serviceQuotationStatus" NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "currentReading" DECIMAL(8,2) NOT NULL,
    "serviceCategoryId" INTEGER NOT NULL,
    "serviceTypeId" INTEGER NOT NULL,
    "repairOrderTypeId" INTEGER NOT NULL,
    "insurancePartyName" TEXT,
    "partsBasicAmount" DECIMAL(12,2) NOT NULL,
    "partsDiscountAmount" DECIMAL(12,2) NOT NULL,
    "partsTaxAmount" DECIMAL(12,2) NOT NULL,
    "partsTotalAmount" DECIMAL(12,2) NOT NULL,
    "labourBasicAmount" DECIMAL(12,2) NOT NULL,
    "labourDiscountAmount" DECIMAL(12,2) NOT NULL,
    "labourTaxAmount" DECIMAL(12,2) NOT NULL,
    "labourTotalAmount" DECIMAL(12,2) NOT NULL,
    "grandTotal" DECIMAL(12,2) NOT NULL,
    "closeAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceQuotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceQuotation_tenantId_quotationNo_idx" ON "ServiceQuotation"("tenantId", "quotationNo");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceQuotation_tenantId_quotationNo_key" ON "ServiceQuotation"("tenantId", "quotationNo");

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_originalQuotationId_fkey" FOREIGN KEY ("originalQuotationId") REFERENCES "ServiceQuotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategoryMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_repairOrderTypeId_fkey" FOREIGN KEY ("repairOrderTypeId") REFERENCES "RepairOrderTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotation" ADD CONSTRAINT "ServiceQuotation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
