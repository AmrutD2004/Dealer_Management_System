-- CreateEnum
CREATE TYPE "RepairType" AS ENUM ('QUICK_REPAIR', 'MINOR_MECHANICAL', 'MAJOR_MECHANICAL', 'MINOR_ACCIDENTAL', 'MAJOR_ACCIDENTAL', 'SCHEDULE_MAINTENANCE');

-- CreateTable
CREATE TABLE "RepairOrderTypeMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "code" "RepairType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairOrderTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepairOrderTypeMaster_tenantId_code_key" ON "RepairOrderTypeMaster"("tenantId", "code");

-- AddForeignKey
ALTER TABLE "RepairOrderTypeMaster" ADD CONSTRAINT "RepairOrderTypeMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
