/*
  Warnings:

  - You are about to drop the column `ghlContactId` on the `LawyerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `ghlOpportunityId` on the `LawyerApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LawyerApplication" DROP COLUMN "ghlContactId",
DROP COLUMN "ghlOpportunityId",
ADD COLUMN     "ghlRecordId" TEXT;
