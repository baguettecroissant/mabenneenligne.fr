export const MEASUREMENT_CONSENT_KEY = "mbel_measurement_v1";
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

export function saveMeasurementChoice(choice: "granted" | "denied"): boolean {
  try {
    window.localStorage.setItem(MEASUREMENT_CONSENT_KEY, JSON.stringify({ choice, timestamp: Date.now() }));
    return measurementChoice() === choice;
  } catch {
    return false;
  }
}

export function measurementChoice(): "granted" | "denied" | null {
  try {
    const raw = window.localStorage.getItem(MEASUREMENT_CONSENT_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const { choice, timestamp } = value as Record<string, unknown>;
    if (choice !== "granted" && choice !== "denied") return null;
    if (typeof timestamp !== "number" || !Number.isFinite(timestamp) || timestamp > Date.now() || Date.now() - timestamp > MAX_AGE_MS) return null;
    return choice;
  } catch {
    return null;
  }
}

export function safeMeasurementPath(pathname: string): string {
  if (pathname === "/") return "/";
  if (pathname === "/devis" || pathname === "/devis/") return "/devis";
  if (pathname === "/departements" || pathname.startsWith("/departements/")) return "/departements/";
  if (pathname === "/location-benne" || pathname.startsWith("/location-benne/")) return "/location-benne/";
  if (pathname === "/regions" || pathname.startsWith("/regions/")) return "/regions/";
  if (pathname === "/guides" || pathname.startsWith("/guides/")) return "/guides/";
  return "/autre/";
}

export function canMeasure(): boolean {
  try {
    return measurementChoice() === "granted" && ["mabenneenligne.fr", "www.mabenneenligne.fr"].includes(window.location.hostname);
  } catch {
    return false;
  }
}

export function trackMeasurementPageview(): void {
  if (!canMeasure()) return;
  try {
    void fetch("https://nhmvgsrwhjsjnpncpiaj.supabase.co/functions/v1/analytics-collect", {
      method: "POST",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ domain: "mabenneenligne.fr", pathname: safeMeasurementPath(window.location.pathname), event_name: "pageview" }),
    }).catch(() => {});
  } catch {
    // Analytics must never block navigation.
  }
}
