/**
 * Formats a date-only value (stored as UTC midnight) using its UTC calendar
 * date, not the viewer's local timezone — otherwise timezones behind UTC
 * render the day before whatever was actually entered.
 */
export function formatCaseDate(date: Date): string {
  return date.toLocaleDateString(undefined, { timeZone: "UTC" });
}
