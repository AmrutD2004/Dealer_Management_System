-- CreateTable
CREATE TABLE "ServiceTypeMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "serviceCategoryMasterId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTypeMaster_tenantId_code_key" ON "ServiceTypeMaster"("tenantId", "code");

-- AddForeignKey
ALTER TABLE "ServiceTypeMaster" ADD CONSTRAINT "ServiceTypeMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTypeMaster" ADD CONSTRAINT "ServiceTypeMaster_serviceCategoryMasterId_fkey" FOREIGN KEY ("serviceCategoryMasterId") REFERENCES "ServiceCategoryMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
