import { City } from "country-state-city";

/**
 * City list for a country (+ optional state/region), fetched on demand by the
 * intake form's city dropdown.
 *
 * The full worldwide dataset is ~148,000 cities, so it deliberately stays on
 * the server and is never bundled into the page. Responses are immutable for a
 * given country/state pair, so they cache aggressively.
 *
 *   GET /api/locations/cities?country=GB&state=ENG
 *   -> { cities: ["Abingdon", "Accrington", ...], scope: "state" }
 *
 * `scope` reports whether the list is narrowed to the requested state or is
 * the country-wide fallback (see below).
 */

const ISO_COUNTRY = /^[A-Z]{2}$/;
const ISO_STATE = /^[A-Z0-9]{1,3}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") ?? "").toUpperCase();
  const state = (searchParams.get("state") ?? "").toUpperCase();

  if (!ISO_COUNTRY.test(country)) {
    return Response.json({ message: "A valid country code is required." }, { status: 400 });
  }
  // A free-text state (countries with no subdivision list) isn't a lookup key —
  // fall back to the whole country rather than rejecting the request.
  const useState = state.length > 0 && ISO_STATE.test(state);

  let raw = useState ? City.getCitiesOfState(country, state) : null;
  let scope: "state" | "country" = "state";

  // ~31% of the world's subdivisions have no cities indexed against them — the
  // dataset files UK cities under ENG/SCT/WLS/NIR rather than the 247 counties,
  // and France, Italy and others are similar. Rather than drop the user into a
  // bare text box, widen to the whole country whenever the narrow lookup is
  // empty.
  if (!raw || raw.length === 0) {
    raw = City.getCitiesOfCountry(country) ?? [];
    scope = "country";
  }

  // De-duplicate: the dataset repeats some names across districts.
  const cities = [...new Set(raw.map((c) => c.name))].sort((a, b) => a.localeCompare(b));

  return Response.json(
    { cities, scope },
    {
      headers: {
        // The list only changes when the dataset ships with a new deploy, so
        // cache hard — but not `immutable`, or a corrected list would be stuck
        // in browsers for a day with no way to revalidate.
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    }
  );
}
