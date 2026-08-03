-- Removes the diagnostic leads created while verifying the intake pipeline,
-- and drops the backup table left behind by the column reorder.
--
-- Every address below is an @example.com address that only ever came from a
-- scripted test, so this cannot touch a real enquiry. Matching is on the exact
-- email — no pattern — so a genuine client whose message happens to mention
-- one of these words is unaffected.
--
-- The GoHighLevel contacts with these addresses have to be deleted separately;
-- SQL cannot reach the CRM.

-- Any case updates first: CaseUpdate.leadId is ON DELETE RESTRICT, so a lead
-- with one attached would otherwise block the delete. None are expected.
DELETE FROM "CaseUpdate"
WHERE "leadId" IN (
    SELECT "id" FROM "Lead" WHERE "email" IN (
        'paklaw-diagnostic-test@example.com',
        'paklaw-ghl-diagnostic@example.com',
        'paklaw-newcontact-test@example.com',
        'paklaw-order-test@example.com',
        'paklaw-postrebuild@example.com',
        'paklaw-mapping@example.com',
        'paklaw-scope-recheck@example.com',
        'paklaw-province-map@example.com',
        'paklaw-diag-fields@example.com'
    )
);

DELETE FROM "Lead"
WHERE "email" IN (
    'paklaw-diagnostic-test@example.com',
    'paklaw-ghl-diagnostic@example.com',
    'paklaw-newcontact-test@example.com',
    'paklaw-order-test@example.com',
    'paklaw-postrebuild@example.com',
    'paklaw-mapping@example.com',
    'paklaw-scope-recheck@example.com',
    'paklaw-province-map@example.com',
    'paklaw-diag-fields@example.com'
);

-- The reorder's safety copy. It holds a full duplicate of client personal
-- data, so it shouldn't outlive its purpose now the rebuilt table is proven.
DROP TABLE IF EXISTS "Lead_backup_20260803";
