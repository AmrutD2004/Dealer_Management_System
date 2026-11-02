/*
  Warnings:

  - You are about to drop the column `parentId` on the `PartCategoryMaster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PartCategoryMaster" DROP CONSTRAINT "PartCategoryMaster_parentId_fkey";

-- AlterTable
ALTER TABLE "PartCategoryMaster" DROP COLUMN "parentId";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "vehicleInTime" TIMESTAMP(3);
