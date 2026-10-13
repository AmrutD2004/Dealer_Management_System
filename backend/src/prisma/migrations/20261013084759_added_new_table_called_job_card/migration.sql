-- CreateEnum
CREATE TYPE "JobCardStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "JobCardVehicleStatus" AS ENUM ('MOBILIZE', 'IMMOBILIZE');

-- CreateTable
CREATE TABLE "JobCard" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "jobCardNo" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "currentKmReading" INTEGER NOT NULL,
    "previousKmReading" INTEGER,
    "vehicleStatus" "JobCardVehicleStatus" NOT NULL,
    "supervisorId" INTEGER,
    "technicianId" INTEGER,
    "serviceCategoryId" INTEGER NOT NULL,
    "serviceTypeId" INTEGER NOT NULL,
    "repairOrderTypeId" INTEGER NOT NULL,
    "isRevisit" BOOLEAN NOT NULL DEFAULT false,
    "estimateCloseAt" TIMESTAMP(3) NOT NULL,
    "revisedEstimateCloseAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "status" "JobCardStatus" NOT NULL DEFAULT 'OPEN',
    "driverName" TEXT,
    "driverMobileNo" TEXT,
    "isBreakdown" BOOLEAN NOT NULL DEFAULT false,
    "breakdownPersonAttended" TEXT,
    "breakdownDateTime" TIMESTAMP(3),
    "breakdownStartDateTime" TIMESTAMP(3),
    "breakdownEndDateTime" TIMESTAMP(3),
    "dealerVanStartKm" INTEGER,
    "dealerVanEndKm" INTEGER,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobCard_tenantId_status_idx" ON "JobCard"("tenantId", "status");

-- CreateIndex
CREATE INDEX "JobCard_tenantId_branchId_status_idx" ON "JobCard"("tenantId", "branchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JobCard_tenantId_jobCardNo_key" ON "JobCard"("tenantId", "jobCardNo");

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategoryMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_repairOrderTypeId_fkey" FOREIGN KEY ("repairOrderTypeId") REFERENCES "RepairOrderTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
