/*
  Warnings:

  - You are about to drop the column `supervisorId` on the `JobCard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobCard" DROP CONSTRAINT "JobCard_supervisorId_fkey";

-- AlterTable
ALTER TABLE "JobCard" DROP COLUMN "supervisorId",
ADD COLUMN     "serviceAdvisorId" INTEGER;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_serviceAdvisorId_fkey" FOREIGN KEY ("serviceAdvisorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
