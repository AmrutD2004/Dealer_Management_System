-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "vehicleNumber" TEXT,
    "chassisNumber" TEXT NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT,
    "color" TEXT,
    "manufacturingYear" TIMESTAMP(3),
    "registrationDate" DATE,
    "purchaseDate" DATE,
    "fuelType" TEXT,
    "transmissionType" TEXT,
    "currentOdometerReading" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vehicle_tenantId_vehicleNumber_idx" ON "Vehicle"("tenantId", "vehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tenantId_chassisNumber_key" ON "Vehicle"("tenantId", "chassisNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tenantId_engineNumber_key" ON "Vehicle"("tenantId", "engineNumber");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
