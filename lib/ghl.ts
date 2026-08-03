import type { LeadFormValues } from "@/lib/schema";
import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  PROVINCE_OPTIONS,
  SERVICE_OPTIONS,
  SUB_SERVICE_OPTIONS,
} from "@/lib/constants";
import type { LawyerApplicationValues } from "@/lib/lawyer-schema";
import { PRACTICE_AREA_OPTIONS } from "@/lib/lawyer-constants";
import type { LawyerApplication } from "@/lib/generated/prisma/client";

// GoHighLevel API v2 (LeadConnector) — https://highlevel.stoplight.io/docs/integrations
// Auth: a Private Integration token scoped to one location, created under
// Settings -> Private Integrations in the GHL sub-account. Needs the
// contacts.write/readonly, opportunities.write/readonly,
// objects/schema.write/readonly, and objects/record.write/readonly scopes.
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Client-lead pipeline
const GHL_PIPELINE_ID = process.env.GHL_PIPELINE_ID;
const GHL_PIPELINE_STAGE_ID = process.env.GHL_PIPELINE_STAGE_ID;

// Lawyers are stored as a "Lawyer" Custom Object record — not a Contact —
// so they never show up in the same Contacts tab as client leads.
const GHL_LAWYER_OBJECT_KEY = "custom_objects.lawyer";

function ghlHeaders() {
  return {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: GHL_API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((opt) => opt.value === value)?.label ?? value;
}

/* ------------------------------------------------------------------ */
/* Custom fields                                                       */
/*                                                                    */
/* GHL contacts natively cover name, email, phone, address, city,      */
/* state, country and date of birth. The remaining intake fields have  */
/* no native equivalent, so they are mapped to custom fields — created */
/* on first use if the location doesn't have them yet, then cached for */
/* the lifetime of the server instance.                                */
/* ------------------------------------------------------------------ */

const LEAD_CUSTOM_FIELDS = [
  { name: "Nationality", dataType: "TEXT" },
  { name: "Gender", dataType: "TEXT" },
  { name: "Service", dataType: "TEXT" },
  { name: "Sub-service", dataType: "TEXT" },
  { name: "Case Details", dataType: "LARGE_TEXT" },
] as const;

type LeadCustomFieldName = (typeof LEAD_CUSTOM_FIELDS)[number]["name"];

let customFieldIdsPromise: Promise<Map<string, string>> | null = null;

async function fetchCustomFields(): Promise<{ id: string; name: string }[]> {
  const res = await fetch(
    `${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields?model=contact`,
    { headers: ghlHeaders() }
  );
  if (!res.ok) {
    throw new Error(`list customFields ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  }
  const body = await res.json();
  return (body?.customFields ?? []) as { id: string; name: string }[];
}

async function createCustomField(name: string, dataType: string): Promise<string | undefined> {
  const res = await fetch(`${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ name, dataType, model: "contact" }),
  });
  if (!res.ok) {
    console.error(
      `GoHighLevel custom field "${name}" could not be created:`,
      res.status,
      (await res.text().catch(() => "")).slice(0, 300)
    );
    return undefined;
  }
  const body = await res.json();
  return body?.customField?.id;
}

/**
 * Maps each intake custom field name to its GHL id, creating any that are
 * missing. Resolved once per instance and reused; on failure it returns an
 * empty map so the sync still writes the native fields and the note rather
 * than failing outright.
 */
function getCustomFieldIds(): Promise<Map<string, string>> {
  customFieldIdsPromise ??= (async () => {
    const ids = new Map<string, string>();
    try {
      const existing = await fetchCustomFields();
      const byName = new Map(existing.map((f) => [f.name, f.id]));

      for (const field of LEAD_CUSTOM_FIELDS) {
        const found = byName.get(field.name);
        const id = found ?? (await createCustomField(field.name, field.dataType));
        if (id) ids.set(field.name, id);
      }
    } catch (err) {
      console.error("GoHighLevel custom field setup failed:", err);
    }

    // Only a complete map is worth keeping. A partial one — a token that was
    // missing the customFields scope, say — would otherwise stick for the life
    // of the instance and never pick the missing fields up once that's fixed.
    if (ids.size < LEAD_CUSTOM_FIELDS.length) customFieldIdsPromise = null;

    return ids;
  })();

  return customFieldIdsPromise;
}

async function buildCustomFieldValues(
  values: Record<LeadCustomFieldName, string>
): Promise<{ id: string; value: string }[]> {
  const ids = await getCustomFieldIds();
  return LEAD_CUSTOM_FIELDS.flatMap((field) => {
    const id = ids.get(field.name);
    const value = values[field.name];
    return id && value ? [{ id, value }] : [];
  });
}

type SyncResult = {
  ok: boolean;
  contactId?: string;
  opportunityId?: string;
  recordId?: string;
};

async function upsertContact(params: {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  country?: string;
  state?: string;
  city: string;
  address1?: string;
  source: string;
  tags: string[];
  customFields?: { id: string; value: string }[];
}): Promise<string | undefined> {
  const [firstName, ...rest] = params.fullName.trim().split(/\s+/);

  const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName: rest.join(" ") || undefined,
      email: params.email,
      phone: params.phone,
      // GHL has native fields for these — previously they were only mentioned
      // in the note, leaving the contact record itself incomplete.
      dateOfBirth: params.dateOfBirth,
      country: params.country,
      state: params.state,
      address1: params.address1,
      city: params.city,
      source: params.source,
      tags: params.tags,
      ...(params.customFields?.length ? { customFields: params.customFields } : {}),
    }),
  });

  if (!res.ok) {
    console.error(
      "GoHighLevel contact upsert failed:",
      res.status,
      await res.text().catch(() => "")
    );
    return undefined;
  }

  const body = await res.json();
  return body?.contact?.id;
}

async function addNote(contactId: string, body: string) {
  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    console.error(
      "GoHighLevel note creation failed:",
      res.status,
      await res.text().catch(() => "")
    );
  }
}

/**
 * Updates the hearing_date custom field on a client's GHL contact and drops
 * a note recording the change — called when a lawyer submits a hearing-date
 * update through the portal, so GHL stays in sync without the lawyer ever
 * touching GHL directly.
 */
export async function updateCaseHearingDate(
  contactId: string,
  hearingDate: Date
): Promise<SyncResult> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("GHL_API_KEY / GHL_LOCATION_ID is not set — skipping GoHighLevel sync.");
    return { ok: false };
  }

  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
    method: "PUT",
    headers: ghlHeaders(),
    body: JSON.stringify({
      customFields: [{ key: "hearing_date", field_value: hearingDate.toISOString() }],
    }),
  });

  if (!res.ok) {
    console.error(
      "GoHighLevel hearing-date update failed:",
      res.status,
      await res.text().catch(() => "")
    );
    return { ok: false };
  }

  const formattedDate = hearingDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  await addNote(contactId, `Hearing date updated to ${formattedDate} by lawyer.`);
  return { ok: true, contactId };
}

async function createOpportunity(params: {
  pipelineId: string | undefined;
  pipelineStageId: string | undefined;
  contactId: string;
  name: string;
}): Promise<string | undefined> {
  if (!params.pipelineId || !params.pipelineStageId) {
    console.warn(
      "GHL pipeline/stage env vars are not set — skipping opportunity creation."
    );
    return undefined;
  }

  const res = await fetch(`${GHL_API_BASE}/opportunities/`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      pipelineId: params.pipelineId,
      pipelineStageId: params.pipelineStageId,
      contactId: params.contactId,
      name: params.name,
      status: "open",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");

    // GHL refuses a second open opportunity for the same contact. That is the
    // normal case for a returning client — and because contacts/upsert matches
    // on phone OR email, it also fires whenever anyone re-submits the form.
    // The existing opportunity is the right one to link this lead to, so take
    // the id GHL hands back rather than treating this as a failure. The full
    // enquiry is still recorded as a note on the contact either way.
    try {
      const parsed = JSON.parse(text);
      if (parsed?.code === "OPPORTUNITY_NO_DUPLICATE" && parsed?.meta?.existingId) {
        return parsed.meta.existingId as string;
      }
    } catch {
      /* fall through to the error below */
    }

    console.error("GoHighLevel opportunity creation failed:", res.status, text);
    return undefined;
  }

  const body = await res.json();
  return body?.opportunity?.id;
}

async function createObjectRecord(
  objectKey: string,
  properties: Record<string, string | number>
): Promise<string | undefined> {
  const res = await fetch(`${GHL_API_BASE}/objects/${objectKey}/records`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ locationId: GHL_LOCATION_ID, properties }),
  });

  if (!res.ok) {
    console.error(
      "GoHighLevel custom object record creation failed:",
      res.status,
      await res.text().catch(() => "")
    );
    return undefined;
  }

  const body = await res.json();
  return body?.record?.id;
}

/**
 * The note is the full record of the enquiry as staff read it in GoHighLevel,
 * so it lists every field in one fixed order:
 *
 *   Nationality, Full Name, Email, Phone Number, Gender, Date of Birth,
 *   Country, State/Region, City, Address, Service, Sub-service, Case Details
 *
 * Name, email and phone are repeated here even though they also populate the
 * contact's own fields — the note is meant to be readable on its own.
 *
 * Every line is always emitted, blank ones included: a missing line would
 * shift the order and make the notes harder to scan side by side.
 */
function buildLeadNote(lead: LeadFormValues, matchedLawyer?: LawyerApplication) {
  // Pakistani citizens carry a province rather than a state; it belongs in the
  // State/Region slot so the sequence reads the same for every nationality.
  const stateOrProvince =
    lead.state || (lead.province ? labelFor(PROVINCE_OPTIONS, lead.province) : "");

  return [
    `New consultation request from paklaw.ai`,
    ``,
    `Nationality: ${labelFor(NATIONALITY_OPTIONS, lead.nationality)}`,
    `Full Name: ${lead.fullName}`,
    `Email: ${lead.email}`,
    `Phone Number: ${lead.phone}`,
    `Gender: ${labelFor(GENDER_OPTIONS, lead.gender)}`,
    `Date of Birth: ${lead.dob}`,
    `Country: ${lead.country ?? ""}`,
    `State/Region: ${stateOrProvince}`,
    `City: ${lead.city}`,
    `Address: ${lead.address}`,
    `Service: ${labelFor(SERVICE_OPTIONS, lead.service)}`,
    `Sub-service: ${labelFor(SUB_SERVICE_OPTIONS[lead.service], lead.subService)}`,
    ``,
    `Case Details:`,
    lead.message,
    ...(matchedLawyer
      ? [
          ``,
          `Matched lawyer: ${matchedLawyer.fullName} (${matchedLawyer.phone}, ${matchedLawyer.email}) — ${matchedLawyer.city}`,
        ]
      : []),
  ].join("\n");
}

/**
 * Creates/updates a GoHighLevel contact for this lead, attaches the full
 * intake details as a note (GHL's API requires custom-field IDs for
 * structured data we don't have configured, so a note keeps this working
 * without any extra GHL-side setup), drops a new Opportunity into the
 * configured client-lead pipeline, and — if a lawyer was matched — tags the
 * contact with the matched lawyer's name so staff can see the suggestion.
 */
export async function syncLeadToGoHighLevel(
  lead: LeadFormValues,
  matchedLawyer?: LawyerApplication | null
): Promise<SyncResult> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("GHL_API_KEY / GHL_LOCATION_ID is not set — skipping GoHighLevel sync.");
    return { ok: false };
  }

  const tags = [labelFor(SERVICE_OPTIONS, lead.service), labelFor(NATIONALITY_OPTIONS, lead.nationality)];
  if (matchedLawyer) tags.push(`Matched Lawyer: ${matchedLawyer.fullName}`);

  // Pakistani citizens carry a province where others carry a state; both map
  // onto GHL's single native "state" field.
  const stateOrProvince =
    lead.state || (lead.province ? labelFor(PROVINCE_OPTIONS, lead.province) : undefined);

  // Best-effort: if the custom fields can't be read or created (a token
  // without the customFields scope, say), fall back to the native fields plus
  // the note rather than failing the whole sync.
  const customFields = await buildCustomFieldValues({
    Nationality: labelFor(NATIONALITY_OPTIONS, lead.nationality),
    Gender: labelFor(GENDER_OPTIONS, lead.gender),
    Service: labelFor(SERVICE_OPTIONS, lead.service),
    "Sub-service": labelFor(SUB_SERVICE_OPTIONS[lead.service], lead.subService),
    "Case Details": lead.message,
  }).catch((err) => {
    console.error("GoHighLevel custom field mapping failed:", err);
    return [];
  });

  const contactId = await upsertContact({
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    dateOfBirth: lead.dob,
    country: lead.country ?? undefined,
    state: stateOrProvince,
    city: lead.city,
    address1: lead.address,
    source: "Pak Law website",
    tags,
    customFields,
  });

  if (!contactId) return { ok: false };

  await addNote(contactId, buildLeadNote(lead, matchedLawyer ?? undefined));

  const opportunityId = await createOpportunity({
    pipelineId: GHL_PIPELINE_ID,
    pipelineStageId: GHL_PIPELINE_STAGE_ID,
    contactId,
    name: `${lead.fullName} — ${labelFor(SERVICE_OPTIONS, lead.service)}`,
  });

  return { ok: true, contactId, opportunityId };
}

/**
 * Creates a "Lawyer" Custom Object record in GHL for a lawyer applicant —
 * deliberately not a Contact, so lawyers never appear in the same Contacts
 * tab/list as client leads.
 */
export async function syncLawyerApplicationToGoHighLevel(
  app: LawyerApplicationValues,
  cvUrl?: string
): Promise<SyncResult> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("GHL_API_KEY / GHL_LOCATION_ID is not set — skipping GoHighLevel sync.");
    return { ok: false };
  }

  const recordId = await createObjectRecord(GHL_LAWYER_OBJECT_KEY, {
    lawyer_name: app.fullName,
    email: app.email,
    phone: app.phone,
    city: app.city,
    province: labelFor(PROVINCE_OPTIONS, app.province),
    bar_council_number: app.barCouncilNumber,
    years_of_experience: app.yearsOfExperience,
    practice_areas: app.practiceAreas.map((area) => labelFor(PRACTICE_AREA_OPTIONS, area)).join(", "),
    law_degree: app.lawDegree,
    university: app.university,
    graduation_year: app.graduationYear,
    bio: app.bio,
    ...(cvUrl ? { cv_url: cvUrl } : {}),
  });

  if (!recordId) return { ok: false };

  return { ok: true, recordId };
}
