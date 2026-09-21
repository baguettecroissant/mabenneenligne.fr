import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { activeContact } from "./helpers/territory-fixture.mjs";
import { loadComponent } from "./helpers/component-harness.mjs";

const closed = { active: false, department: "67" };
const endpoint = "https://mabenneenligne.fr/api/territory-contact";
const upstream = "https://prix-location-benne.fr/api/public/territory-contact?department=67";
const route = async () => loadComponent("app/api/territory-contact/route.ts");

const actualCentralContract = {
  active: true,
  department: "67",
  display_name: "Alsace Recycle",
  phone_e164: "+33102030405",
  phone_display: "01 02 03 04 05",
  hours: "Lundi au vendredi, 8 h à 17 h",
};

afterEach(() => mock.restoreAll());

test("proxy accepts the exact contract emitted by prix-location-benne", async () => {
  mock.method(globalThis, "fetch", async () => Response.json(actualCentralContract));
  const { GET } = await route();
  const response = await GET(new Request(endpoint + "?department=67"));
  assert.deepEqual(await response.json(), actualCentralContract);
});

test("valid active contact has exact public fields and a short cache with no stale serving", async () => {
  const { GET } = await route();
  for (const payload of [
    activeContact,
    { ...activeContact, hours: null },
    { ...activeContact, phone_e164: "+33987654321", phone_display: "09 87 65 43 21", hours: "x".repeat(200) },
  ]) {
    mock.method(globalThis, "fetch", async () => Response.json(payload, { headers: { "content-type": "application/json; charset=utf-8" } }));
    const response = await GET(new Request(endpoint + "?department=67"));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), payload);
    assert.equal(response.headers.get("cache-control"), "public, max-age=60, s-maxage=60, must-revalidate");
    mock.restoreAll();
  }
});

test("strict schema rejects missing or extra fields, coercions, unsafe text and malformed or mismatched French numbers", async () => {
  const { GET } = await route();
  const invalid = [null, [], "active", 67, true, {}, { ...activeContact, extra: "private" }, { ...activeContact, department: "68" }, { ...activeContact, active: "true" }, { ...activeContact, display_name: "Someone else" }];
  for (const key of Object.keys(activeContact)) {
    invalid.push(Object.fromEntries(Object.entries(activeContact).filter(([field]) => field !== key)));
    for (const value of [null, {}, [], true, false, 67, 0, "true", ""]) {
      if (value !== activeContact[key] && !(key === "hours" && (value === null || value === "true"))) invalid.push({ ...activeContact, [key]: value });
    }
  }
  for (const phone_e164 of ["0102030405", "+00102030405", "+33010203040", "+3310203040", "+331020304050", "+44102030405", "+33 1 02 03 04 05", "tel:+33102030405", "+1234567890123456", "+33102030405\n", " +33102030405", "+33102030405;ext=1"]) invalid.push({ ...activeContact, phone_e164 });
  for (const phone_display of ["01 02 03 04 06", "02 02 03 04 05", "0102030405", "+33102030405", "01 02 03 04", "01 02 03 04 050", "01  02 03 04 05", "01\t02 03 04 05", "01\u00a002 03 04 05", "01 02 03 04 05\n", " 01 02 03 04 05", "01 02 03 04 05;ext=1", "<01 02 03 04 05>"]) invalid.push({ ...activeContact, phone_display });
  for (const display_name of ["", " ", "Alsace Recycle ", "alsace recycle", "x".repeat(101), "Alsace\nRecycle", "<Alsace Recycle>"]) invalid.push({ ...activeContact, display_name });
  for (const hours of ["", " ", "x".repeat(201), "<script>bad</script>"]) invalid.push({ ...activeContact, hours });
  for (const code of [...Array.from({ length: 32 }, (_, index) => index), ...Array.from({ length: 33 }, (_, index) => index + 127)]) {
    invalid.push({ ...activeContact, hours: `8 h${String.fromCharCode(code)}17 h` });
    invalid.push({ ...activeContact, display_name: `Alsace${String.fromCharCode(code)}Recycle` });
  }
  for (const payload of invalid) {
    mock.method(globalThis, "fetch", async () => Response.json(payload));
    const response = await GET(new Request(endpoint + "?department=67"));
    assert.deepEqual(await response.json(), closed, JSON.stringify(payload));
    assert.equal(response.headers.get("cache-control"), "no-store");
    mock.restoreAll();
  }
});

test("shared parser rejects boxed primitives, coercions and noncanonical own keys", () => {
  const { parseActiveTerritoryContact } = loadComponent("app/_lib/territory-contact.ts");
  const coerce = () => { throw new Error("Contact fields must never be coerced"); };
  for (const key of Object.keys(activeContact)) {
    for (const value of [undefined, Object(activeContact[key]), Symbol("private"), 67n, coerce, { toString: coerce, valueOf: coerce }]) {
      assert.equal(parseActiveTerritoryContact({ ...activeContact, [key]: value }), null, key);
    }
    const inherited = { ...activeContact };
    delete inherited[key];
    Object.setPrototypeOf(inherited, { [key]: activeContact[key] });
    assert.equal(parseActiveTerritoryContact(inherited), null, key);
  }
  assert.equal(parseActiveTerritoryContact({ ...activeContact, [Symbol("private")]: "extra" }), null);
  assert.equal(parseActiveTerritoryContact(Object.defineProperty({ ...activeContact }, "private", { value: "extra" })), null);
});

test("shared parser accepts only enumerable data properties on a plain object without invoking accessors", () => {
  const { parseActiveTerritoryContact } = loadComponent("app/_lib/territory-contact.ts");
  assert.equal(parseActiveTerritoryContact(Object.assign(Object.create(null), activeContact)), null);
  assert.equal(parseActiveTerritoryContact(Object.assign(Object.create({ inherited: true }), activeContact)), null);

  const hidden = { ...activeContact };
  Object.defineProperty(hidden, "hours", { value: activeContact.hours, enumerable: false });
  assert.equal(parseActiveTerritoryContact(hidden), null);

  for (const key of Object.keys(activeContact)) {
    let reads = 0;
    const accessor = { ...activeContact };
    Object.defineProperty(accessor, key, {
      enumerable: true,
      get() {
        reads += 1;
        return reads === 1 ? activeContact[key] : "attacker-controlled";
      },
    });
    assert.equal(parseActiveTerritoryContact(accessor), null, key);
    assert.equal(reads, 0, `${key} accessor must not be invoked`);
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
    () => new Response(null, { status: 302, headers: { location: "https://attacker.invalid/" } }),
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
  assert.equal(options.redirect, "manual", "Cloudflare Workers rejects redirect:error before making the subrequest");
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
