import {
  GENDERS,
  NATIONALITIES,
  PROVINCES,
  SERVICES,
  SERVICE_SUBSERVICE_MAP,
  type ServiceKey,
} from "./schema";

export type SelectOption = {
  value: string;
  label: string;
};

type SubServiceKey = (typeof SERVICE_SUBSERVICE_MAP)[ServiceKey][number];

const NATIONALITY_LABELS: Record<(typeof NATIONALITIES)[number], string> = {
  "pakistani-national": "Pakistani National",
  "overseas-pakistani": "Overseas Pakistani",
  "foreign-national": "Foreign National",
};

const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  male: "Male",
  female: "Female",
};
const PROVINCE_LABELS: Record<(typeof PROVINCES)[number], string> = {
  punjab: "Punjab",
  sindh: "Sindh",
  kpk: "Khyber Pakhtunkhwa",
  balochistan: "Balochistan",
  "gilgit-baltistan": "Gilgit-Baltistan",
  "azad-kashmir": "Azad Jammu & Kashmir",
  islamabad: "Islamabad Capital Territory",
};

const SERVICE_LABELS: Record<ServiceKey, string> = {
  "public-institution-complaints": "Public Institution Complaints",
  "facilitation-center": "Facilitation Center",
  "overseas-pakistani": "Local & Overseas Pakistani",
  "regulatory-government": "Regulatory And Government",
  "women-desk": "Women Desk",
  litigation: "Litigation",
  "due-diligence": "Due Diligence",
  "ip-trademark": "IP & Trademark",
};

const SUB_SERVICE_LABELS: Record<SubServiceKey, string> = {
  // Public Institution Complaints
  cda: "CDA (Capital Development Authority)",
  hec: "HEC (Higher Education Commission)",
  nadra: "NADRA (National Database & Registration Authority)",
  pemra: "PEMRA (Pakistan Electronic Media Regulatory Authority)",
  fbr: "FBR (Federal Board of Revenue)",
  secp: "SECP (Securities & Exchange Commission)",
  pta: "PTA (Pakistan Telecom Authority)",
  ogra: "OGRA (Oil & Gas Regulatory Authority)",
  nepra: "NEPRA (National Electric Power Regulatory Authority)",
  pesco: "PESCO (Electricity Distribution Companies)",
  sbp: "SBP (State Bank of Pakistan)",
  ppra: "PPRA (Public Procurement Regulatory Authority)",

  // Facilitation Center
  "secp-registration": "SECP Registration",
  "pfa-license": "Pakistan Food Authority License",
  "ihra-license": "IHRA License",
  "drap-licensing": "DRAP Licensing",
  "ntn-registration": "NTN Registration",
  "strn-registration": "Sales Tax Registration (STRN)",
  "tax-filing": "Tax Filing Service",
  "property-transfer": "Property Transfer",
  "agreement-drafting": "Agreement Drafting",
  "tv-channel-registration": "TV Channel Registration",
  "restaurant-license": "Restaurant License & Registration",
  "chamber-of-commerce-registration": "Chamber of Commerce Registration",
  "succession-certification": "Succession Certification",
  "family-registration-certificate": "Family Registration Certificate (FRC)",
  "child-registration-certificate": "Child Registration Certificate (B-Form)",
  "ip-service": "IP Service",

  // Overseas Pakistani
  "property-verification-due-diligence": "Property Verification & Due Diligence",
  "property-sale-purchase-transfer": "Sale, Purchase & Transfer of Property",
  "property-dispute-illegal-possession": "Property Dispute & Illegal Possession",
  "power-of-attorney": "Power of Attorney Services",
  "overseas-family-law": "Family Law (Divorce, Custody, Maintenance)",
  "inheritance-succession-matters": "Inheritance & Succession Matters",
  "will-drafting": "Will",
  "civil-litigation-court-representation": "Civil Litigation and Court Representation",
  "corporate-business-legal-services": "Corporate & Business Legal Services",
  "documentation-affidavits-notarial": "Documentation, Affidavits & Notarial Service",

  // Regulatory And Government
  "hec-degree-attestation": "HEC Matters & Degree Attestation",
  "nadra-complaint-resolution": "NADRA Services & Complaint Resolution",
  "cda-development-authority-issues": "CDA Matters & Development Authority Issues",
  "fbr-tax-authority-complaints": "FBR & Tax Authority Complaints",
  "utility-authority": "Utility Authority (WAPDA, K-Electric)",
  "excise-taxation-department": "Excise And Taxation Department",
  "public-authority-complaints-followups": "Public Authority Complaints Drafting And Follow-ups",
  "regulatory-delay-maladministration": "Regulatory Delay & Maladministration",

  // Women Desk
  "harassment-cases": "Harassment Cases",
  "khula-process": "Khula Process",
  "divorce-proceedings": "Divorce Proceedings",
  "child-custody-guardianship": "Child Custody & Guardianship",
  "maintenance-financial-support": "Maintenance & Financial Support",
  "domestic-violence-protection": "Domestic Violence Protection",
  "womens-family-law": "Family Law (Divorce, Custody)",
  "inheritance-succession-rights": "Inheritance & Succession Rights",
  "dower-haq-mehr-recovery": "Dower (Haq Mehr) Recovery",

  // Litigation
  "civil-litigation": "Civil Litigation",
  "commercial-arbitration": "Commercial Arbitration",
  "constitutional-petitions": "Constitutional Petitions",
  "adr-mediation": "ADR & Mediation",

  // Due Diligence
  "property-title-verification": "Property Title Verification",
  "corporate-ma-due-diligence": "Corporate / M&A Due Diligence",
  "company-background-verification": "Company & Background Verification",
  "contract-compliance-review": "Contract & Compliance Review",
  "litigation-encumbrance-search": "Litigation & Encumbrance Search",

  // IP & Trademark
  trademark: "Trademark",
  copyright: "Copyright",
  "industrial-design": "Industrial Design",
  "patent-innovation": "Patent & Innovation",
  "brand-protection": "Brand Protection",
};

export const toOptions = <V extends string>(
  values: readonly V[],
  labels: Record<V, string>
): SelectOption[] => values.map((value) => ({ value, label: labels[value] }));

export const NATIONALITY_OPTIONS = toOptions(NATIONALITIES, NATIONALITY_LABELS);
export const GENDER_OPTIONS = toOptions(GENDERS, GENDER_LABELS);
export const PROVINCE_OPTIONS = toOptions(PROVINCES, PROVINCE_LABELS);
export const SERVICE_OPTIONS = toOptions(SERVICES, SERVICE_LABELS);

export const SUB_SERVICE_OPTIONS = Object.fromEntries(
  SERVICES.map((service) => [
    service,
    toOptions(SERVICE_SUBSERVICE_MAP[service], SUB_SERVICE_LABELS),
  ])
) as Record<ServiceKey, SelectOption[]>;

export const CONTACT = {
  email: "paklawofficial@gmail.com",
  phonePrimary: "0303 5561111",
  phone: "+92 303 5521111",
  address: ["Office No.20 Street No.29 F-8/1", "Islamabad, Pakistan"],
};

/**
 * wa.me wants a bare international number — no plus, spaces or leading zero.
 * The primary line is written in local Pakistani form, so its 0 prefix is
 * swapped for the 92 country code.
 */
export const WHATSAPP_PRIMARY_HREF = `https://wa.me/92${CONTACT.phonePrimary
  .replace(/\D/g, "")
  .replace(/^0/, "")}`;
