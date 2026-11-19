/*
  Warnings:

  - Made the column `variantId` on table `PartFitment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PartFitment" DROP CONSTRAINT "PartFitment_variantId_fkey";

-- AlterTable
ALTER TABLE "PartFitment" ALTER COLUMN "variantId" SET NOT NULL;

-- CreateTable
CREATE TABLE "StoreMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "IsBlocked" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    "IsMainStore" BOOLEAN NOT NULL,
    "branchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreMaster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariantMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreMaster" ADD CONSTRAINT "StoreMaster_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreMaster" ADD CONSTRAINT "StoreMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
