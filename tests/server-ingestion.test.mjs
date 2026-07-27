import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { validatePublicLeadRequest } from "../app/api/leads/request-security.ts";

const route = readFileSync(new URL("../app/api/leads/route.ts", import.meta.url), "utf8");

test("MaBenne forwards leads through the authenticated central connector", () => {
  assert.doesNotMatch(route, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(route, /\/rest\/v1\/benne_leads/);
  assert.match(route, /MARKETPLACE_INGEST_URL/);
  assert.match(route, /MARKETPLACE_INGEST_KEY/);
  assert.match(route, /"X-Marketplace-Source":\s*"mabenneenligne\.fr"/);
  for (const field of ["source_site", "source_domain", "source_campaign", "source_submission_id", "consent_marketplace_at", "privacy_policy_version", "lead_fingerprint"]) {
    assert.match(route, new RegExp(`${field}:`));
  }
});

test("MaBenne exige son Origin et un corps JSON", () => {
  assert.equal(validatePublicLeadRequest(new Request("https://mabenneenligne.fr/api/leads", {
    method: "POST", headers: { Origin: "https://evil.example", "Content-Type": "application/json" },
  })).status, 403);
  assert.equal(validatePublicLeadRequest(new Request("https://mabenneenligne.fr/api/leads", {
    method: "POST", headers: { Origin: "https://mabenneenligne.fr", "Content-Type": "text/plain" },
  })).status, 415);
  assert.equal(validatePublicLeadRequest(new Request("https://mabenneenligne.fr/api/leads", {
    method: "POST", headers: { Origin: "https://mabenneenligne.fr", "Content-Type": "application/json; charset=utf-8" },
  })).status, 200);
});
