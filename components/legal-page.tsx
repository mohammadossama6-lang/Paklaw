import type { ReactNode } from "react";

import Footer from "@/components/footer";

/**
 * Shared shell for the Terms and Privacy pages: a readable measure, the site's
 * serif headings, and the same footer as the home page (which is rendered per
 * page here rather than in the root layout).
 */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
        <h1 className="font-serif text-3xl italic tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>

        <div
          className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted
            [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2
            [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink
            [&_li]:mt-1.5
            [&_strong]:font-semibold [&_strong]:text-ink
            [&_ul]:list-disc [&_ul]:pl-5"
        >
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
