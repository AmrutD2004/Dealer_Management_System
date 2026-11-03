-- AlterTable
ALTER TABLE "ServiceAppointment" ADD COLUMN     "originalAppointmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_originalAppointmentId_fkey" FOREIGN KEY ("originalAppointmentId") REFERENCES "ServiceAppointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
