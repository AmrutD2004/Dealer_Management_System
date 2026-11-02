/*
  Warnings:

  - You are about to drop the column `fuelType` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `transmissionType` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `variant` on the `Vehicle` table. All the data in the column will be lost.
  - The `manufacturingYear` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `brandId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "fuelType",
DROP COLUMN "manufacturer",
DROP COLUMN "model",
DROP COLUMN "transmissionType",
DROP COLUMN "variant",
ADD COLUMN     "brandId" INTEGER NOT NULL,
ADD COLUMN     "modelId" INTEGER NOT NULL,
ADD COLUMN     "variantId" INTEGER NOT NULL,
DROP COLUMN "manufacturingYear",
ADD COLUMN     "manufacturingYear" INTEGER;

-- CreateIndex
CREATE INDEX "Vehicle_variantId_idx" ON "Vehicle"("variantId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModelMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariantMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
