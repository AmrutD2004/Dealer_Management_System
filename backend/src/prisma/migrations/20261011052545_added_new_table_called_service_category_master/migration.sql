-- CreateEnum
CREATE TYPE "ServiceCategoryMasterCode" AS ENUM ('PDI', 'WARRANTY', 'EXTENDED_WARRANTY', 'POST_WARRANTY', 'ACCIDENT', 'IN_TRANSIT');

-- CreateTable
CREATE TABLE "ServiceCategoryMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "code" "ServiceCategoryMasterCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategoryMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategoryMaster_code_key" ON "ServiceCategoryMaster"("code");

-- AddForeignKey
ALTER TABLE "ServiceCategoryMaster" ADD CONSTRAINT "ServiceCategoryMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
