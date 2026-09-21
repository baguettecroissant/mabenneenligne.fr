export type ActiveTerritoryContact = {
  active: true;
  department: "67";
  display_name: "Alsace Recycle";
  phone_e164: string;
  phone_display: string;
  hours: string | null;
};

function isSafeText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength && !/[\p{Cc}<>]/u.test(value);
}

// Closed public contract: no coercion, nested values or undocumented fields.
// Inactive or unrecognized responses must never expose contact information.
export function parseActiveTerritoryContact(input: unknown): ActiveTerritoryContact | null {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.getPrototypeOf(input) !== Object.prototype) return null;
  const required = ["active", "department", "display_name", "phone_e164", "phone_display", "hours"];
  const ownKeys = Reflect.ownKeys(input);
  if (ownKeys.length !== required.length || !ownKeys.every((key) => typeof key === "string" && required.includes(key))) return null;
  const descriptors = Object.getOwnPropertyDescriptors(input);
  const value: Record<string, unknown> = {};
  for (const key of required) {
    const descriptor = descriptors[key];
    if (!descriptor?.enumerable || !Object.hasOwn(descriptor, "value")) return null;
    value[key] = descriptor.value;
  }
  if (value.active !== true || value.department !== "67") return null;
  if (!isSafeText(value.display_name, 100) || value.display_name !== "Alsace Recycle") return null;
  if (typeof value.phone_e164 !== "string" || value.phone_e164.length !== 12 || !/^\+33[1-9]\d{8}$/.test(value.phone_e164)) return null;
  const nationalNumber = `0${value.phone_e164.slice(3)}`;
  if (typeof value.phone_display !== "string" || value.phone_display !== nationalNumber.replace(/(\d{2})(?=\d)/g, "$1 ")) return null;
  if (value.hours !== null && !isSafeText(value.hours, 200)) return null;

  return {
    active: true,
    department: "67",
    display_name: "Alsace Recycle",
    phone_e164: value.phone_e164,
    phone_display: value.phone_display,
    hours: value.hours,
  };
}
