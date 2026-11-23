-- CreateEnum
CREATE TYPE "MRNType" AS ENUM ('CREDIT', 'CASH', 'AGAINST_DC');

-- CreateEnum
CREATE TYPE "MRNStatus" AS ENUM ('GENERATED', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('LOCAL_STATE', 'OTHER_STATE');

-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('PRINCIPAL', 'SUPPLIER', 'CO_DEALER', 'DISTRIBUTOR', 'OFF_LINE_DISTRIBUTOR');

-- CreateTable
CREATE TABLE "MRNMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "mrnNo" TEXT NOT NULL,
    "mrnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mrnType" "MRNType" NOT NULL,
    "purchaseType" "PurchaseType" NOT NULL,
    "partyType" "PartyType",
    "partyCode" TEXT,
    "partyName" TEXT,
    "dcNo" TEXT,
    "dcDate" TIMESTAMP(3),
    "invoiceNo" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "status" "MRNStatus" NOT NULL DEFAULT 'GENERATED',
    "totalTaxableValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalDiscountValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalInvoiceValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalMRNValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MRNMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MRNMaster_tenantId_branchId_status_idx" ON "MRNMaster"("tenantId", "branchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MRNMaster_tenantId_mrnNo_key" ON "MRNMaster"("tenantId", "mrnNo");

-- AddForeignKey
ALTER TABLE "MRNMaster" ADD CONSTRAINT "MRNMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRNMaster" ADD CONSTRAINT "MRNMaster_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRNMaster" ADD CONSTRAINT "MRNMaster_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "StoreMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRNMaster" ADD CONSTRAINT "MRNMaster_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRNMaster" ADD CONSTRAINT "MRNMaster_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
