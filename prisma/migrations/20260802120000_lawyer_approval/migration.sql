-- Lawyer applications must be vetted before the applicant can hold the LAWYER
-- role or be matched to a client lead. Existing rows default to false, which is
-- deliberate: every application on record was accepted through a public
-- endpoint with no vetting, so none of them should be trusted retroactively.
ALTER TABLE "LawyerApplication" ADD COLUMN "approved" BOOLEAN NOT NULL DEFAULT false;
