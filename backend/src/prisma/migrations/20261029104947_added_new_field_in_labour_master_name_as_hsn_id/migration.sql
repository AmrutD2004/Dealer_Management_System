-- AlterTable
ALTER TABLE "LabourMaster" ADD COLUMN     "hsnId" INTEGER;

-- AddForeignKey
ALTER TABLE "LabourMaster" ADD CONSTRAINT "LabourMaster_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES "HSNMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
