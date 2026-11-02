-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- CreateEnum
CREATE TYPE "Sources" AS ENUM ('CUSTOMER', 'SERVICE_SUPERVISOR', 'FORM_PREVIOUS_JOB_CARD', 'TEST_DRIVE');

-- CreateTable
CREATE TABLE "ServiceQuotationPart" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "serviceQuotationId" INTEGER NOT NULL,
    "partId" INTEGER NOT NULL,
    "partNo" TEXT,
    "partDescription" TEXT,
    "quantity" INTEGER NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,
    "basicAmount" DECIMAL(12,2) NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountRate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "hsnCode" TEXT,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceQuotationPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceQuotationLabour" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "serviceQuotationId" INTEGER NOT NULL,
    "labourId" INTEGER NOT NULL,
    "labourName" TEXT,
    "labourCode" TEXT,
    "labourDescription" TEXT,
    "rate" DECIMAL(12,2) NOT NULL,
    "basicAmount" DECIMAL(12,2) NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountRate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceQuotationLabour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceQuotationCustomerVoice" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "serviceQuotationId" INTEGER NOT NULL,
    "customerVoice" TEXT NOT NULL,
    "source" "Sources" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceQuotationCustomerVoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceQuotationPart_tenantId_serviceQuotationId_idx" ON "ServiceQuotationPart"("tenantId", "serviceQuotationId");

-- CreateIndex
CREATE INDEX "ServiceQuotationPart_tenantId_partId_idx" ON "ServiceQuotationPart"("tenantId", "partId");

-- CreateIndex
CREATE INDEX "ServiceQuotationLabour_tenantId_serviceQuotationId_idx" ON "ServiceQuotationLabour"("tenantId", "serviceQuotationId");

-- CreateIndex
CREATE INDEX "ServiceQuotationLabour_tenantId_labourId_idx" ON "ServiceQuotationLabour"("tenantId", "labourId");

-- CreateIndex
CREATE INDEX "ServiceQuotationCustomerVoice_tenantId_serviceQuotationId_idx" ON "ServiceQuotationCustomerVoice"("tenantId", "serviceQuotationId");

-- AddForeignKey
ALTER TABLE "ServiceQuotationPart" ADD CONSTRAINT "ServiceQuotationPart_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationPart" ADD CONSTRAINT "ServiceQuotationPart_serviceQuotationId_fkey" FOREIGN KEY ("serviceQuotationId") REFERENCES "ServiceQuotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationPart" ADD CONSTRAINT "ServiceQuotationPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "PartMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationLabour" ADD CONSTRAINT "ServiceQuotationLabour_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationLabour" ADD CONSTRAINT "ServiceQuotationLabour_serviceQuotationId_fkey" FOREIGN KEY ("serviceQuotationId") REFERENCES "ServiceQuotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationLabour" ADD CONSTRAINT "ServiceQuotationLabour_labourId_fkey" FOREIGN KEY ("labourId") REFERENCES "LabourMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationCustomerVoice" ADD CONSTRAINT "ServiceQuotationCustomerVoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceQuotationCustomerVoice" ADD CONSTRAINT "ServiceQuotationCustomerVoice_serviceQuotationId_fkey" FOREIGN KEY ("serviceQuotationId") REFERENCES "ServiceQuotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
