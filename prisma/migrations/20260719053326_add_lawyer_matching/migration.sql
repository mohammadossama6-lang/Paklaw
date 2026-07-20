-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "lawyerNotifiedAt" TIMESTAMP(3),
ADD COLUMN     "matchedLawyerId" TEXT;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_matchedLawyerId_fkey" FOREIGN KEY ("matchedLawyerId") REFERENCES "LawyerApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
