import type { Metadata } from "next";

import LegalPage from "@/components/legal-page";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — Pak Law",
  description:
    "What personal information Pak Law collects, how it is used, and who it is shared with.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="2 August 2026">
      <p>
        This policy explains what we collect when you use this website, why we collect it,
        and who it is shared with.
      </p>

      <h2>1. What We Collect</h2>
      <ul>
        <li>
          <strong>Your enquiry:</strong> nationality category, full name, email address,
          phone number, gender, date of birth, street address, city, and either your
          province (within Pakistan) or your country and state/region, together with the
          service you need and the description of your matter.
        </li>
        <li>
          <strong>Lawyer applications:</strong> if you apply to join as a lawyer, we also
          collect your bar council number, years of experience, practice areas, law degree,
          university, graduation year, professional biography and — if you upload one —
          your CV.
        </li>
        <li>
          <strong>Case records:</strong> if your matter proceeds, hearing dates and case
          notes recorded by your assigned lawyer.
        </li>
        <li>
          <strong>Login codes:</strong> the one-time codes sent to your phone to access the
          client or lawyer portal.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To respond to your enquiry and arrange your consultation.</li>
        <li>To match you with a lawyer suited to your matter and location.</li>
        <li>To let you sign in to the portal and follow the progress of your case.</li>
        <li>To keep our own records of the matters we have handled.</li>
      </ul>

      <h2>3. Confidentiality</h2>
      <p>
        Details of your legal matter are treated as confidential and are shared only with
        the lawyer assigned to your case, or where disclosure is required by law.
      </p>

      <h2>4. Who We Share It With</h2>
      <p>
        We do not sell your personal data. We share it only with the lawyer assigned to your
        matter, and with the service providers that operate this platform on our behalf —
        our customer relationship management system, our website hosting and database
        providers, our file storage provider (for uploaded CVs), and the messaging provider
        that delivers login codes. These providers act on our instructions and are bound by
        confidentiality obligations.
      </p>

      <h2>5. Data Security &amp; Retention</h2>
      <p>
        We apply reasonable technical and organisational safeguards to protect your data.
        Login codes expire within minutes of being issued. Other information is retained
        only as long as needed for the purposes described above, or as required by law.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by
        contacting us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. We will
        respond in accordance with applicable Pakistani data protection law. Note that we
        may need to retain certain records where the law requires it.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use a single essential cookie, set only after you sign in to the portal, to keep
        you logged in. We do not use advertising or analytics cookies, and we do not track
        you across other websites.
      </p>

      <h2>8. Children</h2>
      <p>
        This service is not intended for children. We do not knowingly accept enquiries from
        anyone under 14 years of age.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;last updated&rdquo; date
        above reflects the most recent change.
      </p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </p>
    </LegalPage>
  );
}
