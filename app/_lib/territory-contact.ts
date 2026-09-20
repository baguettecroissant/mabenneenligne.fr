export type ActiveTerritoryContact = {
  active: true;
  department: "67";
  display_name: "Alsace Recycle";
  phone: string;
  hours?: string;
  updated_at: string;
};

// Closed public contract: no coercion, nested values or undocumented fields.
// Inactive or unrecognized responses must never expose contact information.
export function parseActiveTerritoryContact(input: unknown): ActiveTerritoryContact | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  const required = ["active", "department", "display_name", "phone", "updated_at"];
  const keys = Object.keys(value);
  if (!required.every((key) => Object.hasOwn(value, key)) || keys.some((key) => !required.includes(key) && key !== "hours")) return null;
  if (value.active !== true || value.department !== "67" || value.display_name !== "Alsace Recycle") return null;
  if (typeof value.phone !== "string" || value.phone !== value.phone.trim() || !/^\+[1-9]\d{1,14}$/.test(value.phone)) return null;
  if (Object.hasOwn(value, "hours") && (typeof value.hours !== "string" || !value.hours.trim() || value.hours.length > 200 || /[\u0000-\u001f\u007f<>]/.test(value.hours))) return null;
  if (typeof value.updated_at !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value.updated_at)) return null;
  const timestamp = Date.parse(value.updated_at);
  if (!Number.isFinite(timestamp)) return null;
  const canonical = value.updated_at.length === 20 ? value.updated_at.replace("Z", ".000Z") : value.updated_at;
  if (new Date(timestamp).toISOString() !== canonical) return null;

  return {
    active: true,
    department: "67",
    display_name: "Alsace Recycle",
    phone: value.phone,
    ...(typeof value.hours === "string" ? { hours: value.hours } : {}),
    updated_at: value.updated_at,
  };
}
