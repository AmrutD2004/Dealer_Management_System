-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "customerCode" TEXT NOT NULL,
    "title" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "mobileNo" TEXT NOT NULL,
    "alternateMobileNo" TEXT,
    "dateOfBirth" DATE,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "laborDiscountPercent" DECIMAL(5,2) NOT NULL,
    "partDiscountPercent" DECIMAL(5,2) NOT NULL,
    "authorizedBy" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tenantId_customerCode_key" ON "Customer"("tenantId", "customerCode");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_authorizedBy_fkey" FOREIGN KEY ("authorizedBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
