-- CreateTable
CREATE TABLE "LawyerApplication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "barCouncilNumber" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "practiceAreas" TEXT[],
    "lawDegree" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "cvUrl" TEXT,
    "ghlNotifiedAt" TIMESTAMP(3),
    "ghlContactId" TEXT,
    "ghlOpportunityId" TEXT,

    CONSTRAINT "LawyerApplication_pkey" PRIMARY KEY ("id")
);
