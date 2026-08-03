-- A read-only presentation of Lead with the client's details in the order the
-- intake form collects them and the GoHighLevel note lists them.
--
-- Postgres cannot reorder a table's columns in place, and `country`/`state`
-- were added later by ALTER TABLE so they physically sit at the end of "Lead".
-- Rather than rebuild the table — which would mean copying every row and
-- dropping something CaseUpdate has a foreign key to — this view presents the
-- same rows in the agreed sequence. It stores nothing and can be dropped at
-- any time without touching the data.
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
  -- Pakistani citizens carry a province where everyone else carries a state;
  -- both belong in the State/Region slot, matching how the GHL note reads.
  COALESCE("state", "province") AS "stateOrRegion",
  "city",
  "address",
  "service",
  "subService",
  "message" AS "caseDetails",
  -- Everything below is operational rather than client-supplied, so it trails
  -- the thirteen fields above.
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
