/**
 * Applies pending Prisma migrations, but only for a production deployment.
 *
 *   node scripts/migrate-deploy.mjs
 *
 * This runs as the first step of `npm run build`, which means it ran on every
 * Vercel build — previews included. Preview deployments are given the same
 * environment variables as production unless a separate branch database is
 * configured, so pushing a branch was enough to apply that branch's migrations
 * to live data, before anyone had reviewed the pull request. A migration that
 * drops or rewrites a column would have taken production with it.
 *
 * Vercel sets VERCEL_ENV to "production", "preview" or "development". Only the
 * first migrates; the others skip and let the build carry on, so previews still
 * build and run against whatever schema production is already on.
 *
 * Outside Vercel (VERCEL_ENV unset) this also skips, so a local `npm run build`
 * cannot migrate a remote database by accident. Run migrations locally with
 * `npx prisma migrate dev`, which is the command intended for it.
 */
import { spawnSync } from "node:child_process";

const env = process.env.VERCEL_ENV;

if (env !== "production") {
  const where = env ? `a ${env} deployment` : "a non-Vercel build";
  console.log(`Skipping prisma migrate deploy — this is ${where}.`);
  process.exit(0);
}

console.log("Production deployment: applying pending migrations.");

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error("Could not run prisma migrate deploy:", result.error.message);
  process.exit(1);
}

// A failed migration must fail the build. Deploying code that expects a schema
// the database does not have is worse than not deploying at all.
process.exit(result.status ?? 1);
