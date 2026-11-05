-- DropForeignKey
ALTER TABLE "PartFitment" DROP CONSTRAINT "PartFitment_variantId_fkey";

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariantMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
