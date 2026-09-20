import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { activeContact } from "./helpers/territory-fixture.mjs";
import { loadComponent } from "./helpers/component-harness.mjs";

const closed = { active: false, department: "67" };
const endpoint = "https://mabenneenligne.fr/api/territory-contact";
const upstream = "https://prix-location-benne.fr/api/public/territory-contact?department=67";
const route = async () => loadComponent("app/api/territory-contact/route.ts");

afterEach(() => mock.restoreAll());

test("valid active contact has exact public fields and a short cache with no stale serving", async () => {
  const { GET } = await route();
  for (const payload of [activeContact, Object.fromEntries(Object.entries(activeContact).filter(([key]) => key !== "hours"))]) {
    mock.method(globalThis, "fetch", async () => Response.json(payload, { headers: { "content-type": "application/json; charset=utf-8" } }));
    const response = await GET(new Request(endpoint + "?department=67"));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), payload);
    assert.equal(response.headers.get("cache-control"), "public, max-age=60, s-maxage=60, must-revalidate");
    mock.restoreAll();
  }
});

test("strict schema rejects missing or extra fields, coercions, invalid E.164 and impossible ISO dates", async () => {
  const { GET } = await route();
  const invalid = [null, [], "active", 67, true, {}, { ...activeContact, extra: "private" }, { ...activeContact, department: "68" }, { ...activeContact, active: "true" }, { ...activeContact, display_name: "Someone else" }];
  for (const key of Object.keys(activeContact)) {
    if (key !== "hours") invalid.push(Object.fromEntries(Object.entries(activeContact).filter(([field]) => field !== key)));
    for (const value of [null, {}, [], true, 67]) {
      if (value !== activeContact[key]) invalid.push({ ...activeContact, [key]: value });
    }
  }
  for (const phone of ["0102030405", "+00102030405", "+33 1 02 03 04 05", "tel:+33102030405", "+1234567890123456", "+33102030405\n", " +33102030405"]) invalid.push({ ...activeContact, phone });
  for (const updated_at of ["2026-02-30T08:00:00.000Z", "2025-02-29T08:00:00.000Z", "2026-13-01T08:00:00.000Z", "2026-09-20T24:00:00.000Z", "2026-09-20", "2026-09-20T08:00:00", "yesterday", "2026-09-20T08:00:00.000Z\n"]) invalid.push({ ...activeContact, updated_at });
  for (const hours of ["", " ", "x".repeat(201), "8 h\n17 h", "<script>bad</script>"]) invalid.push({ ...activeContact, hours });
  for (const payload of invalid) {
    mock.method(globalThis, "fetch", async () => Response.json(payload));
    const response = await GET(new Request(endpoint + "?department=67"));
    assert.deepEqual(await response.json(), closed, JSON.stringify(payload));
    assert.equal(response.headers.get("cache-control"), "no-store");
    mock.restoreAll();
  }
});

test("proxy permits exactly one department=67 parameter", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected fetch"); });
  const { GET } = await route();
  for (const query of ["", "?department=68", "?department=067", "?department=", "?department=67&department=67", "?department=67&department=68", "?department=67&extra=1", "?other=67", "?department=67%20"]) {
    const response = await GET(new Request(endpoint + query));
    assert.equal(response.status, 400, query);
    assert.deepEqual(await response.json(), closed);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("proxy rejects unsupported methods without upstream access", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected fetch"); });
  const handlers = await route();
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]) {
    assert.equal(typeof handlers[method], "function", method);
    const response = await handlers[method](new Request(endpoint + "?department=67", { method }));
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET");
    assert.deepEqual(await response.json(), closed);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  const response = await handlers.GET(new Request(endpoint + "?department=67", { method: "POST" }));
  assert.equal(response.status, 405);
  assert.equal(fetch.mock.callCount(), 0);
});

test("upstream errors and non-JSON responses fail closed without leaking details", async () => {
  const { GET } = await route();
  for (const reply of [
    () => { throw new Error("private upstream diagnostics"); },
    () => Response.json({ message: "private upstream diagnostics" }, { status: 503 }),
    () => new Response('{"active":true}', { headers: { "content-type": "text/plain" } }),
    () => new Response("<html>bad gateway</html>", { headers: { "content-type": "application/json" } }),
    () => Response.json({ active: false, department: "67", secret: "private" }),
  ]) {
    mock.method(globalThis, "fetch", reply);
    const response = await GET(new Request(endpoint + "?department=67"));
    assert.deepEqual(await response.json(), closed);
    assert.equal(response.headers.get("cache-control"), "no-store");
    mock.restoreAll();
  }
});

test("inactive contact stays inactive and upstream request has no visitor headers or secrets", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => Response.json(closed));
  const { GET } = await route();
  const response = await GET(new Request(endpoint + "?department=67", { headers: { cookie: "session=private", authorization: "Bearer private", referer: "https://example.test/private" } }));
  assert.deepEqual(await response.json(), closed);
  assert.equal(fetch.mock.callCount(), 1);
  const [url, options] = fetch.mock.calls[0].arguments;
  assert.equal(url, upstream);
  assert.deepEqual(Object.fromEntries(new Headers(options.headers)), { accept: "application/json" });
  assert.equal(options.credentials, "omit");
  assert.equal(options.redirect, "error");
  assert.equal(options.cache, "no-store");
  assert.ok(options.signal instanceof AbortSignal);
});

test("AbortController timeout covers fetch and response body and is always cleared", async () => {
  const { GET } = await route();
  for (const stage of ["fetch", "body"]) {
    let fire;
    let signal;
    const timer = {};
    mock.method(globalThis, "setTimeout", (callback, delay) => {
      assert.ok(delay > 0 && delay <= 5000);
      fire = callback;
      return timer;
    });
    const clear = mock.method(globalThis, "clearTimeout", () => {});
    mock.method(globalThis, "fetch", async (_url, options) => {
      signal = options.signal;
      const pending = () => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")), { once: true }));
      if (stage === "fetch") return pending();
      return { ok: true, headers: new Headers({ "content-type": "application/json" }), json: pending };
    });
    const pendingResponse = GET(new Request(endpoint + "?department=67"));
    await Promise.resolve();
    await Promise.resolve();
    fire();
    const response = await pendingResponse;
    assert.ok(signal.aborted);
    assert.deepEqual(await response.json(), closed);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.ok(clear.mock.calls.some(({ arguments: args }) => args[0] === timer));
    mock.restoreAll();
  }
});
