import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { elements, loadComponent, mount, textContent } from "./helpers/component-harness.mjs";
import { activeContact } from "./helpers/territory-fixture.mjs";

const component = () => loadComponent("app/_components/TerritoryContactCta.tsx").TerritoryContactCta;
const phoneLink = (view) => elements(view.tree(), (node) => node.type === "a" && node.props.href?.startsWith("tel:"))[0];

test("active 67 contact renders an accessible phone CTA, hours and form alternative", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (...args) => { calls.push(args); return Response.json(activeContact); });
  const view = mount(component(), { departmentCode: "67", placement: "city_page" });
  t.after(() => view.unmount());
  assert.equal(view.tree(), null);
  await view.flushEffects();
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/api/territory-contact?department=67");
  assert.equal(calls[0][1].credentials, "omit");
  assert.equal(calls[0][1].referrerPolicy, "no-referrer");
  assert.equal(view.tree().props["aria-label"], "Contact Alsace Recycle pour le Bas-Rhin");
  assert.equal(phoneLink(view).props.href, `tel:${activeContact.phone_e164}`);
  assert.equal(textContent(phoneLink(view)), `Appeler Alsace Recycle ${activeContact.phone_display}`);
  assert.match(textContent(view.tree()), /Bas-Rhin uniquement/);
  assert.ok(textContent(view.tree()).includes(activeContact.hours));
  const alternative = elements(view.tree(), (node) => node.type === "a" && node.props.href === "/devis")[0];
  assert.ok(alternative, "The quote form remains an explicit alternative");
  assert.doesNotMatch(textContent(view.tree()), /clic d’appel.*mesuré.*sans cookie.*donnée saisie/i);
  assert.equal(elements(view.tree(), (node) => node.type === "a" && node.props.href === "/politique-confidentialite").length, 0);
});

test("null hours hide the hours row and preserve the form alternative", async (t) => {
  const contact = { ...activeContact, hours: null };
  t.mock.method(globalThis, "fetch", async () => Response.json(contact));
  const view = mount(component(), { departmentCode: "67", placement: "quote_form" });
  t.after(() => view.unmount());
  await view.flushEffects();
  assert.ok(phoneLink(view));
  assert.doesNotMatch(textContent(view.tree()), /undefined|null|Horaires/);
  assert.ok(elements(view.tree(), (node) => node.type === "a" && node.props.href === "#quote-project").length);
});

test("inactive, error, malformed and mismatched responses never render", async (t) => {
  for (const reply of [
    () => Response.json({ active: false, department: "67" }),
    () => { throw new Error("offline"); },
    () => Response.json(activeContact, { status: 500 }),
    () => new Response("invalid", { headers: { "content-type": "application/json" } }),
    () => new Response(JSON.stringify(activeContact), { headers: { "content-type": "text/html" } }),
    () => Response.json({ ...activeContact, department: "68" }),
    () => Response.json({ ...activeContact, department: 67 }),
    () => Response.json({ ...activeContact, display_name: "Another provider" }),
    () => Response.json({ ...activeContact, active: "true" }),
    () => Response.json({ ...activeContact, phone_e164: "+33102030405;ext=1" }),
    () => Response.json({ ...activeContact, phone_e164: 33102030405 }),
    () => Response.json({ ...activeContact, phone_display: "01 02 03 04 06" }),
    () => Response.json({ ...activeContact, phone_display: "01<script>02 03 04 05" }),
    () => Response.json({ ...activeContact, phone_display: 102030405 }),
    () => Response.json({ ...activeContact, hours: false }),
    () => Response.json({ ...activeContact, hours: "Lundi\nvendredi" }),
    () => Response.json({ ...activeContact, hours: "<script>" }),
    () => Response.json({ ...activeContact, extra: "private" }),
    ...Object.keys(activeContact).map((key) => () => {
      const contact = { ...activeContact };
      delete contact[key];
      return Response.json(contact);
    }),
  ]) {
    const fetch = t.mock.method(globalThis, "fetch", reply);
    const view = mount(component(), { departmentCode: "67", placement: "department_page" });
    await view.flushEffects();
    assert.equal(view.tree(), null);
    view.unmount();
    fetch.mock.restore();
  }
});

test("other or missing department codes never fetch or render even with a 67 URL", async (t) => {
  const previousWindow = globalThis.window;
  globalThis.window = { location: { pathname: "/location-benne/strasbourg-67000", search: "?department=67" } };
  t.after(() => { globalThis.window = previousWindow; });
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json(activeContact));
  for (const departmentCode of [undefined, "", "68", "75", "067", 67]) {
    const view = mount(component(), { departmentCode, placement: "city_page" });
    await view.flushEffects();
    assert.equal(view.tree(), null);
    view.unmount();
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("changing territory immediately hides stale contact and cancels pending fetch", async (t) => {
  let resolve;
  let signal;
  t.mock.method(globalThis, "fetch", (_url, options) => {
    signal = options.signal;
    return new Promise((done) => { resolve = done; });
  });
  const view = mount(component(), { departmentCode: "67", placement: "city_page" });
  t.after(() => view.unmount());
  await view.flushEffects();
  view.rerender({ departmentCode: "68", placement: "city_page" });
  assert.equal(view.tree(), null);
  await view.flushEffects();
  assert.ok(signal.aborted);
  resolve(Response.json(activeContact));
  await view.flushEffects();
  assert.equal(view.tree(), null);
});

test("contact loading times out after five seconds and ignores a late response", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let resolve;
  let signal;
  t.mock.method(globalThis, "fetch", (_url, options) => {
    signal = options.signal;
    return new Promise((done) => { resolve = done; });
  });
  const view = mount(component(), { departmentCode: "67", placement: "city_page" });
  t.after(() => view.unmount());
  await view.flushEffects();
  t.mock.timers.tick(4999);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  assert.equal(signal.aborted, true);
  resolve(Response.json(activeContact));
  await view.flushEffects();
  assert.equal(view.tree(), null);
});

test("phone click sends exactly the cookieless analytics allowlist without blocking navigation", async (t) => {
  const previousWindow = globalThis.window;
  globalThis.window = { location: { pathname: "/location-benne/strasbourg-67000", search: "?email=private@example.test", hash: "#private" } };
  t.after(() => { globalThis.window = previousWindow; });
  for (const outcome of ["pending", "reject", "throw"]) {
    const calls = [];
    const fetch = t.mock.method(globalThis, "fetch", (...args) => {
      calls.push(args);
      if (calls.length === 1) return Promise.resolve(Response.json(activeContact));
      if (outcome === "throw") throw new Error("blocked");
      if (outcome === "reject") return Promise.reject(new Error("offline"));
      return new Promise(() => {});
    });
    const view = mount(component(), { departmentCode: "67", placement: "city_page" });
    await view.flushEffects();
    let prevented = false;
    const result = phoneLink(view).props.onClick({ preventDefault() { prevented = true; } });
    assert.equal(result, undefined);
    assert.equal(prevented, false);
    assert.equal(phoneLink(view).props.href, `tel:${activeContact.phone_e164}`);
    assert.equal(calls.length, 2);
    const [url, options] = calls[1];
    assert.equal(url, "https://nhmvgsrwhjsjnpncpiaj.supabase.co/functions/v1/analytics-collect");
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "omit");
    assert.equal(options.referrerPolicy, "no-referrer");
    assert.equal(options.keepalive, true);
    assert.deepEqual(JSON.parse(options.body), {
      domain: "mabenneenligne.fr",
      pathname: "/location-benne/strasbourg-67000",
      event_name: "territory_phone_click",
      event_detail: { source_site: "mabenneenligne.fr", department: "67", placement: "city_page" },
    });
    for (const privateValue of [activeContact.phone_e164, activeContact.phone_display, activeContact.display_name, activeContact.hours, "private@example.test", "#private"]) {
      assert.ok(!options.body.includes(privateValue), `Analytics exclude ${privateValue}`);
    }
    await view.flushEffects();
    view.unmount();
    fetch.mock.restore();
  }
});

test("phone and form links have explicit 48px targets and visible keyboard focus", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.territory-contact a\s*\{[^}]*min-height:\s*48px/);
  assert.match(css, /\.territory-contact a\s*\{[^}]*min-width:\s*48px/);
  assert.match(css, /\.territory-contact a:focus-visible\s*\{[^}]*outline:\s*3px solid/);
});
