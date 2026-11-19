-- CreateTable
CREATE TABLE "BinMaster" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "binCode" TEXT NOT NULL,
    "binDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BinMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchPartMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "partId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "binId" INTEGER NOT NULL,
    "stockInHand" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "isDefaultBin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minimumLevel" INTEGER,
    "maximumLevel" INTEGER,
    "reorderLevel" INTEGER,
    "safetyStock" INTEGER,
    "reservationQty" INTEGER,
    "mrp" DECIMAL(12,2),
    "sellingPrice" DECIMAL(12,2),
    "latestLandedCost" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchPartMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BinMaster_binCode_storeId_key" ON "BinMaster"("binCode", "storeId");

-- CreateIndex
CREATE INDEX "BranchPartMaster_tenantId_partId_idx" ON "BranchPartMaster"("tenantId", "partId");

-- CreateIndex
CREATE INDEX "BranchPartMaster_tenantId_storeId_binId_idx" ON "BranchPartMaster"("tenantId", "storeId", "binId");

-- CreateIndex
CREATE UNIQUE INDEX "BranchPartMaster_tenantId_branchId_partId_storeId_binId_key" ON "BranchPartMaster"("tenantId", "branchId", "partId", "storeId", "binId");

-- AddForeignKey
ALTER TABLE "BinMaster" ADD CONSTRAINT "BinMaster_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "StoreMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchPartMaster" ADD CONSTRAINT "BranchPartMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchPartMaster" ADD CONSTRAINT "BranchPartMaster_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchPartMaster" ADD CONSTRAINT "BranchPartMaster_partId_fkey" FOREIGN KEY ("partId") REFERENCES "PartMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchPartMaster" ADD CONSTRAINT "BranchPartMaster_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "StoreMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchPartMaster" ADD CONSTRAINT "BranchPartMaster_binId_fkey" FOREIGN KEY ("binId") REFERENCES "BinMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
