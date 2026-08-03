-- Rebuilds "Lead" so its physical column order matches the order the intake
-- form collects the fields and the GoHighLevel note lists them. Postgres
-- cannot reorder columns in place: country and state were added by ALTER TABLE
-- and sat at the end of the table, after the operational columns.
--
-- Prisma runs each migration inside a transaction, so either every statement
-- below lands or none of them do. "Lead_backup_20260803" is kept afterwards as
-- a safety net — drop it once the data has been eyeballed, since it holds a
-- full copy of client personal data:
--     DROP TABLE "Lead_backup_20260803";

-- 1. Copy the data out before anything is dropped.
CREATE TABLE "Lead_backup_20260803" AS SELECT * FROM "Lead";

-- 2. Remove everything that depends on "Lead": the presentation view, and the
--    inbound foreign key from CaseUpdate.
DROP VIEW IF EXISTS "lead_ordered";
ALTER TABLE "CaseUpdate" DROP CONSTRAINT "CaseUpdate_leadId_fkey";

-- 3. Drop and recreate the table with the columns in the intended order. The
--    old table has to go first so the primary-key index name is free to reuse.
DROP TABLE "Lead";

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Client details, in the agreed sequence.
    "nationality" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    -- Pakistani citizens carry a province where others carry a state; it sits
    -- beside "state" because both fill the same State/Region slot.
    "province" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "subService" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,

    -- Operational columns trail the client's own details.
    "status" TEXT NOT NULL DEFAULT 'open',
    "hearingDate" TIMESTAMP(3),
    "matchedLawyerId" TEXT,
    "lawyerNotifiedAt" TIMESTAMP(3),
    "clientUserId" TEXT,
    "ghlContactId" TEXT,
    "ghlOpportunityId" TEXT,
    "ghlNotifiedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- 4. Restore the rows. Columns are listed explicitly on both sides so the copy
--    cannot silently depend on either table's ordering.
INSERT INTO "Lead" (
    "id", "createdAt",
    "nationality", "fullName", "email", "phone", "gender", "dob",
    "country", "state", "province", "city", "address",
    "service", "subService", "message", "consent",
    "status", "hearingDate", "matchedLawyerId", "lawyerNotifiedAt",
    "clientUserId", "ghlContactId", "ghlOpportunityId", "ghlNotifiedAt"
)
SELECT
    "id", "createdAt",
    "nationality", "fullName", "email", "phone", "gender", "dob",
    "country", "state", "province", "city", "address",
    "service", "subService", "message", "consent",
    "status", "hearingDate", "matchedLawyerId", "lawyerNotifiedAt",
    "clientUserId", "ghlContactId", "ghlOpportunityId", "ghlNotifiedAt"
FROM "Lead_backup_20260803";

-- 5. Put the foreign keys back, exactly as they were.
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_matchedLawyerId_fkey"
    FOREIGN KEY ("matchedLawyerId") REFERENCES "LawyerApplication"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Lead" ADD CONSTRAINT "Lead_clientUserId_fkey"
    FOREIGN KEY ("clientUserId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CaseUpdate" ADD CONSTRAINT "CaseUpdate_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. Fail loudly if a single row went missing.
DO $$
DECLARE
    original BIGINT;
    restored BIGINT;
BEGIN
    SELECT count(*) INTO original FROM "Lead_backup_20260803";
    SELECT count(*) INTO restored FROM "Lead";
    IF original <> restored THEN
        RAISE EXCEPTION 'Lead rebuild lost rows: % before, % after', original, restored;
    END IF;
END $$;

-- 7. Recreate the presentation view against the rebuilt table.
CREATE OR REPLACE VIEW "lead_ordered" AS
SELECT
  "id",
  "createdAt",
  "nationality",
  "fullName",
  "email",
  "phone",
  "gender",
  "dob",
  "country",
  COALESCE("state", "province") AS "stateOrRegion",
  "city",
  "address",
  "service",
  "subService",
  "message" AS "caseDetails",
  "consent",
  "province" AS "provinceKey",
  "status",
  "hearingDate",
  "matchedLawyerId",
  "clientUserId",
  "ghlContactId",
  "ghlOpportunityId",
  "ghlNotifiedAt",
  "lawyerNotifiedAt"
FROM "Lead";
