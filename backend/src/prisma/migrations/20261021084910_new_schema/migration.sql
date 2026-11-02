-- CreateTable
CREATE TABLE "BrandMaster" (
    "id" SERIAL NOT NULL,
    "brandCode" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModelMaster" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "modelCode" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleModelMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleVariantMaster" (
    "id" SERIAL NOT NULL,
    "modelId" INTEGER NOT NULL,
    "variantCode" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "fuelType" TEXT,
    "transmissionType" TEXT,
    "productionFrom" TIMESTAMP(3),
    "productionTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleVariantMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandMaster_brandCode_key" ON "BrandMaster"("brandCode");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModelMaster_modelCode_key" ON "VehicleModelMaster"("modelCode");

-- CreateIndex
CREATE INDEX "VehicleModelMaster_brandId_idx" ON "VehicleModelMaster"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModelMaster_brandId_modelCode_key" ON "VehicleModelMaster"("brandId", "modelCode");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleVariantMaster_variantCode_key" ON "VehicleVariantMaster"("variantCode");

-- CreateIndex
CREATE INDEX "VehicleVariantMaster_modelId_idx" ON "VehicleVariantMaster"("modelId");

-- AddForeignKey
ALTER TABLE "VehicleModelMaster" ADD CONSTRAINT "VehicleModelMaster_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleVariantMaster" ADD CONSTRAINT "VehicleVariantMaster_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModelMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
