-- CreateEnum
CREATE TYPE "appointAction" AS ENUM ('NEW_REQUIREMENT', 'RE_SCHEDULE', 'CANCEL');

-- CreateEnum
CREATE TYPE "appointmentSource" AS ENUM ('INWARD_CALL', 'OUTWARD_CALL', 'WHATSAPP', 'SMS', 'WALK_IN');

-- CreateEnum
CREATE TYPE "appointmentStatus" AS ENUM ('OPEN', 'RE_SCHEDULE', 'CANCEL');

-- CreateEnum
CREATE TYPE "appointCancleReasons" AS ENUM ('CUSTOMER_IN_HURRY', 'PARTS_NOT_AVAILABLE', 'CUSTOMER_BUSY', 'BAY_NOT_AVAILABLE');

-- CreateTable
CREATE TABLE "ServiceAppointment" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "action" "appointAction" NOT NULL,
    "appointmentNo" TEXT NOT NULL,
    "appointDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointOn" TIMESTAMP(3) NOT NULL,
    "callDateAndTime" TIMESTAMP(3) NOT NULL,
    "source" "appointmentSource" NOT NULL,
    "status" "appointmentStatus" NOT NULL,
    "cancleReason" "appointCancleReasons" NOT NULL,
    "estimateCharge" DECIMAL(12,2) NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "currentReading" TEXT,
    "customerId" INTEGER NOT NULL,
    "creId" INTEGER NOT NULL,
    "serviceAdvisorId" INTEGER NOT NULL,
    "repairOrderTypeId" INTEGER NOT NULL,
    "serviceCategoryId" INTEGER NOT NULL,
    "serviceTypeId" INTEGER NOT NULL,

    CONSTRAINT "ServiceAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAppointmentCustomerVoice" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "serviceAppointmentId" INTEGER NOT NULL,
    "customerVoice" TEXT NOT NULL,

    CONSTRAINT "ServiceAppointmentCustomerVoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceAppointment_tenantId_appointmentNo_idx" ON "ServiceAppointment"("tenantId", "appointmentNo");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAppointment_tenantId_appointmentNo_key" ON "ServiceAppointment"("tenantId", "appointmentNo");

-- CreateIndex
CREATE INDEX "ServiceAppointmentCustomerVoice_tenantId_serviceAppointment_idx" ON "ServiceAppointmentCustomerVoice"("tenantId", "serviceAppointmentId");

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategoryMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_repairOrderTypeId_fkey" FOREIGN KEY ("repairOrderTypeId") REFERENCES "RepairOrderTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_serviceAdvisorId_fkey" FOREIGN KEY ("serviceAdvisorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_creId_fkey" FOREIGN KEY ("creId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointmentCustomerVoice" ADD CONSTRAINT "ServiceAppointmentCustomerVoice_serviceAppointmentId_fkey" FOREIGN KEY ("serviceAppointmentId") REFERENCES "ServiceAppointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointmentCustomerVoice" ADD CONSTRAINT "ServiceAppointmentCustomerVoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
