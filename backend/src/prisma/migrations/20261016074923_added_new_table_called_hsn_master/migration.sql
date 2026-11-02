-- CreateTable
CREATE TABLE "HSNMaster" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "description" TEXT,
    "taxRate" DECIMAL(5,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HSNMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HSNMaster_tenantId_hsnCode_key" ON "HSNMaster"("tenantId", "hsnCode");

-- AddForeignKey
ALTER TABLE "HSNMaster" ADD CONSTRAINT "HSNMaster_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
