-- Pakistani citizens carry a province; overseas / foreign leads carry a
-- country (+ state) instead. Make province optional and add country/state.
ALTER TABLE "Lead" ALTER COLUMN "province" DROP NOT NULL;
ALTER TABLE "Lead" ADD COLUMN "country" TEXT;
ALTER TABLE "Lead" ADD COLUMN "state" TEXT;
