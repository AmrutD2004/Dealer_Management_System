-- CreateTable
CREATE TABLE "DealerBayMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "bayCode" TEXT NOT NULL,
    "bayName" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealerBayMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCardAllocation" (
    "id" SERIAL NOT NULL,
    "jobCardId" INTEGER NOT NULL,
    "mechanicId" INTEGER NOT NULL,
    "bayId" INTEGER NOT NULL,
    "bayInDateTime" TIMESTAMP(3) NOT NULL,
    "bayOutTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCardAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealerBayMaster_branchId_bayCode_key" ON "DealerBayMaster"("branchId", "bayCode");

-- CreateIndex
CREATE INDEX "JobCardAllocation_jobCardId_idx" ON "JobCardAllocation"("jobCardId");

-- CreateIndex
CREATE INDEX "JobCardAllocation_mechanicId_idx" ON "JobCardAllocation"("mechanicId");

-- CreateIndex
CREATE INDEX "JobCardAllocation_bayId_idx" ON "JobCardAllocation"("bayId");

-- AddForeignKey
ALTER TABLE "DealerBayMaster" ADD CONSTRAINT "DealerBayMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealerBayMaster" ADD CONSTRAINT "DealerBayMaster_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCardAllocation" ADD CONSTRAINT "JobCardAllocation_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCardAllocation" ADD CONSTRAINT "JobCardAllocation_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCardAllocation" ADD CONSTRAINT "JobCardAllocation_bayId_fkey" FOREIGN KEY ("bayId") REFERENCES "DealerBayMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
