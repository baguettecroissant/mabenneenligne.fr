import { parseActiveTerritoryContact } from "../../_lib/territory-contact";

const UPSTREAM = "https://prix-location-benne.fr/api/public/territory-contact?department=67";
const INACTIVE = { active: false, department: "67" } as const;

function inactive(status = 200, headers: Record<string, string> = {}) {
  return Response.json(INACTIVE, { status, headers: { "cache-control": "no-store", ...headers } });
}

function methodNotAllowed() {
  return inactive(405, { allow: "GET" });
}

export async function GET(request: Request) {
  if (request.method !== "GET") return methodNotAllowed();
  const query = new URL(request.url).searchParams;
  if (query.size !== 1 || query.get("department") !== "67") return inactive(400);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(UPSTREAM, {
      headers: { accept: "application/json" },
      credentials: "omit",
      redirect: "error",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) return inactive();
    const contact = parseActiveTerritoryContact(await response.json());
    if (controller.signal.aborted || !contact) return inactive();
    return Response.json(contact, { headers: { "cache-control": "public, max-age=60, s-maxage=60, must-revalidate" } });
  } catch {
    return inactive();
  } finally {
    clearTimeout(timeout);
  }
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
export const HEAD = methodNotAllowed;
