/*
  Warnings:

  - A unique constraint covering the columns `[modelId,fuelType,variantCode]` on the table `VehicleVariantMaster` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fuelType` on table `VehicleVariantMaster` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transmissionType` on table `VehicleVariantMaster` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VehicleVariantMaster" ALTER COLUMN "fuelType" SET NOT NULL,
ALTER COLUMN "transmissionType" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VehicleVariantMaster_modelId_fuelType_variantCode_key" ON "VehicleVariantMaster"("modelId", "fuelType", "variantCode");
