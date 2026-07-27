const allowedOrigins = new Set([
  "https://mabenneenligne.fr",
  "https://www.mabenneenligne.fr",
]);

export function validatePublicLeadRequest(request: Request): { status: 200 | 403 | 415 } {
  const origin = request.headers.get("origin") || "";
  const isLocal = /^http:\/\/localhost(?::\d+)?$/.test(origin);
  if (!allowedOrigins.has(origin) && !isLocal) return { status: 403 };

  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("application/json")) return { status: 415 };

  return { status: 200 };
}
