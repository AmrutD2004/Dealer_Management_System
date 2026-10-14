-- CreateTable
CREATE TABLE "JobCardCustomerVoice" (
    "id" SERIAL NOT NULL,
    "jobCardId" INTEGER NOT NULL,
    "customerVoiceDescription" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "actionToBeTaken" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCardCustomerVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabourMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "labourCode" TEXT NOT NULL,
    "labourDescription" TEXT NOT NULL,
    "standardHours" DECIMAL(6,2) NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabourMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabourMaster_tenantId_labourCode_key" ON "LabourMaster"("tenantId", "labourCode");

-- AddForeignKey
ALTER TABLE "JobCardCustomerVoice" ADD CONSTRAINT "JobCardCustomerVoice_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCardCustomerVoice" ADD CONSTRAINT "JobCardCustomerVoice_actionToBeTaken_fkey" FOREIGN KEY ("actionToBeTaken") REFERENCES "LabourMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourMaster" ADD CONSTRAINT "LabourMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
