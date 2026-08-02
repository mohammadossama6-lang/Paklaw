import type { Metadata } from "next";

import LegalPage from "@/components/legal-page";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions — Pak Law",
  description:
    "The terms governing your use of the Pak Law website and the consultations booked through it.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="2 August 2026">
      <h2>1. About Pak Law</h2>
      <p>
        Pak Law (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a legal services
        platform that connects clients with independent, licensed advocates and law firms
        across Pakistan. By using this website or requesting a consultation, you agree to
        these Terms &amp; Conditions.
      </p>

      <h2>2. No Lawyer–Client Relationship via the Website</h2>
      <p>
        Content on this website is for general information only and does not constitute
        legal advice. Submitting the enquiry form does not create a lawyer–client
        relationship. That relationship is formed only when you formally engage a lawyer
        after your consultation.
      </p>

      <h2>3. Consultations</h2>
      <ul>
        <li>The initial consultation offered through this website is free of charge.</li>
        <li>Requests are subject to confirmation by our team, and we may decline a matter.</li>
        <li>You must provide accurate personal details when submitting an enquiry.</li>
        <li>
          We aim to respond within one business day, but we do not guarantee any particular
          response time.
        </li>
      </ul>

      <h2>4. Fees for Further Work</h2>
      <p>
        Any fees for legal work beyond the initial consultation are agreed directly and
        separately between you and your assigned lawyer. This website does not process
        payments, and we do not collect payment details through it.
      </p>

      <h2>5. Compensation &amp; Incident Claims</h2>
      <p>
        Outcomes of compensation claims — including claims relating to building fires,
        collapses and similar incidents — depend on the facts of each case and on
        applicable law. We make no guarantee of any particular outcome.
      </p>

      <h2>6. Your Responsibilities</h2>
      <ul>
        <li>Provide truthful, complete information and genuine documents.</li>
        <li>Do not use the platform for any unlawful purpose.</li>
        <li>
          Do not submit another person&apos;s personal details unless you are entitled to do
          so.
        </li>
      </ul>

      <h2>7. Lawyer Applications</h2>
      <ul>
        <li>
          Submitting the lawyer registration form is an application only. It does not create
          any partnership, employment or agency relationship with Pak Law.
        </li>
        <li>
          Applications are reviewed before approval, and we may decline or withdraw an
          approval at our discretion.
        </li>
        <li>
          Applicants must hold a valid licence to practise and must keep their bar council
          details accurate and current.
        </li>
        <li>
          Approved lawyers are independent practitioners, responsible for their own
          professional conduct, insurance and regulatory compliance.
        </li>
      </ul>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by the laws of Pakistan, Pak Law is not liable for
        indirect or consequential losses arising from use of this website. Legal services
        are delivered by independent advocates who are responsible for their own
        professional conduct and advice.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. The &ldquo;last updated&rdquo; date
        above reflects the most recent change, and continued use of the website after a
        change constitutes acceptance of the revised terms.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These terms are governed by the laws of the Islamic Republic of Pakistan, and the
        courts of Pakistan shall have exclusive jurisdiction.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </p>
    </LegalPage>
  );
}
