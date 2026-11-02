-- CreateEnum
CREATE TYPE "PartStatus" AS ENUM ('ACTIVE', 'SUPERSEDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('EA', 'PCS', 'SET', 'PAIR', 'L', 'ML', 'KG', 'G', 'M', 'BOX', 'PACK', 'KIT');

-- CreateTable
CREATE TABLE "PartCategoryMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartCategoryMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "partNo" TEXT NOT NULL,
    "partDescription" TEXT NOT NULL,
    "partCategoryId" INTEGER,
    "hsnId" INTEGER NOT NULL,
    "sellingPrice" DECIMAL(12,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "unitOfMeasure" "UnitOfMeasure" NOT NULL,
    "reorderLevel" INTEGER,
    "isFastMoving" BOOLEAN NOT NULL DEFAULT false,
    "status" "PartStatus" NOT NULL DEFAULT 'ACTIVE',
    "supersededById" INTEGER,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartFitment" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "partId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "variantId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "position" TEXT,
    "isOem" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartFitment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartCategoryMaster_tenantId_code_key" ON "PartCategoryMaster"("tenantId", "code");

-- CreateIndex
CREATE INDEX "PartMaster_tenantId_status_idx" ON "PartMaster"("tenantId", "status");

-- CreateIndex
CREATE INDEX "PartMaster_tenantId_partCategoryId_idx" ON "PartMaster"("tenantId", "partCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PartMaster_tenantId_partNo_key" ON "PartMaster"("tenantId", "partNo");

-- CreateIndex
CREATE INDEX "PartFitment_tenantId_variantId_idx" ON "PartFitment"("tenantId", "variantId");

-- CreateIndex
CREATE INDEX "PartFitment_tenantId_modelId_idx" ON "PartFitment"("tenantId", "modelId");

-- AddForeignKey
ALTER TABLE "PartCategoryMaster" ADD CONSTRAINT "PartCategoryMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartCategoryMaster" ADD CONSTRAINT "PartCategoryMaster_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PartCategoryMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartMaster" ADD CONSTRAINT "PartMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartMaster" ADD CONSTRAINT "PartMaster_partCategoryId_fkey" FOREIGN KEY ("partCategoryId") REFERENCES "PartCategoryMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartMaster" ADD CONSTRAINT "PartMaster_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES "HSNMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartMaster" ADD CONSTRAINT "PartMaster_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "PartMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_partId_fkey" FOREIGN KEY ("partId") REFERENCES "PartMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModelMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariantMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartFitment" ADD CONSTRAINT "PartFitment_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
