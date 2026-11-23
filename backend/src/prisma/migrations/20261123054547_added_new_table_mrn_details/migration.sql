-- CreateTable
CREATE TABLE "MRNDetail" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "mrnId" INTEGER NOT NULL,
    "branchPartId" INTEGER NOT NULL,
    "binId" INTEGER NOT NULL,
    "invoiceQty" DECIMAL(14,3) NOT NULL,
    "receivedQty" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "shortQty" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "damageQty" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "excessQty" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "rate" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(14,2) NOT NULL,
    "reason" TEXT,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MRNDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MRNDetail_mrnId_idx" ON "MRNDetail"("mrnId");

-- CreateIndex
CREATE INDEX "MRNDetail_tenantId_branchPartId_idx" ON "MRNDetail"("tenantId", "branchPartId");

-- CreateIndex
CREATE INDEX "MRNDetail_tenantId_binId_idx" ON "MRNDetail"("tenantId", "binId");

-- AddForeignKey
ALTER TABLE "MRNDetail" ADD CONSTRAINT "MRNDetail_mrnId_fkey" FOREIGN KEY ("mrnId") REFERENCES "MRNMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRNDetail" ADD CONSTRAINT "MRNDetail_branchPartId_fkey" FOREIGN KEY ("branchPartId") REFERENCES "BranchPartMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRNDetail" ADD CONSTRAINT "MRNDetail_binId_fkey" FOREIGN KEY ("binId") REFERENCES "BinMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
