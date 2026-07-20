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
  city: string;
  address1?: string;
  source: string;
  tags: string[];
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
      address1: params.address1,
      city: params.city,
      source: params.source,
      tags: params.tags,
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
    console.error(
      "GoHighLevel opportunity creation failed:",
      res.status,
      await res.text().catch(() => "")
    );
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

function buildLeadNote(lead: LeadFormValues, matchedLawyer?: LawyerApplication) {
  return [
    `New consultation request from paklaw.com`,
    ``,
    `Nationality: ${labelFor(NATIONALITY_OPTIONS, lead.nationality)}`,
    `Gender: ${labelFor(GENDER_OPTIONS, lead.gender)}`,
    `Date of birth: ${lead.dob}`,
    `Province: ${labelFor(PROVINCE_OPTIONS, lead.province)}`,
    `City: ${lead.city}`,
    `Address: ${lead.address}`,
    `Service: ${labelFor(SERVICE_OPTIONS, lead.service)}`,
    `Sub-service: ${labelFor(SUB_SERVICE_OPTIONS[lead.service], lead.subService)}`,
    ``,
    `Message:`,
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

  const contactId = await upsertContact({
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    city: lead.city,
    address1: lead.address,
    source: "PakLaw website",
    tags,
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
