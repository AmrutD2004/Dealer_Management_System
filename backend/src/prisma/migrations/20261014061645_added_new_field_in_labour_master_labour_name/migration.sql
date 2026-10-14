/*
  Warnings:

  - Added the required column `labourName` to the `LabourMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LabourMaster" ADD COLUMN     "labourName" TEXT NOT NULL;
