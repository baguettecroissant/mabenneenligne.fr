import { isDepartmentCode, parseActiveTerritoryContact } from "../../_lib/territory-contact";

const UPSTREAM = "https://prix-location-benne.fr/api/public/territory-contact";

function inactive(status = 200, headers: Record<string, string> = {}, department = "") {
  return Response.json({ active: false, department }, { status, headers: { "cache-control": "no-store", ...headers } });
}

function methodNotAllowed() {
  return inactive(405, { allow: "GET" });
}

export async function GET(request: Request) {
  if (request.method !== "GET") return methodNotAllowed();
  const query = new URL(request.url).searchParams;
  const department = query.get("department");
  if (query.size !== 1 || !isDepartmentCode(department)) return inactive(400);
  const upstream = new URL(UPSTREAM);
  upstream.searchParams.set("department", department);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(upstream.toString(), {
      headers: { accept: "application/json" },
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) return inactive(200, {}, department);
    const contact = parseActiveTerritoryContact(await response.json(), department);
    if (controller.signal.aborted || !contact) return inactive(200, {}, department);
    return Response.json(contact, { headers: { "cache-control": "public, max-age=60, s-maxage=60, must-revalidate" } });
  } catch {
    return inactive(200, {}, department);
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
