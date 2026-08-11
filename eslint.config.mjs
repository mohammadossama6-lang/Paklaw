import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prisma's generated client — not our code, already carries its own
    // eslint-disable header, excluded here for speed/robustness.
    "lib/generated/**",
    // Git worktrees live here and carry their own .next build output, which
    // isn't matched by the ".next/**" pattern above and would otherwise
    // flood `eslint .` with thousands of errors from bundled vendor code.
    ".claude/**",
  ]),
]);

export default eslintConfig;
