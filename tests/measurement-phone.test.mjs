import assert from "node:assert/strict";
import { test } from "node:test";
import { elements, loadComponent, mount } from "./helpers/component-harness.mjs";
import { activeContact } from "./helpers/territory-fixture.mjs";

const Component = () => loadComponent("app/_components/TerritoryContactCta.tsx").TerritoryContactCta;
const phone = (view) => elements(view.tree(), (node) => node.type === "a" && node.props.href?.startsWith("tel:"))[0];

test("sans choix de mesure, le téléphone reste utilisable sans événement analytique", async (t) => {
  const previousWindow = globalThis.window;
  globalThis.window = { location: { hostname: "mabenneenligne.fr", pathname: "/location-benne/bischwiller-67240" }, localStorage: { getItem() { return null; } } };
  t.after(() => { globalThis.window = previousWindow; });
  const calls = [];
  t.mock.method(globalThis, "fetch", (...args) => { calls.push(args); return Promise.resolve(Response.json(activeContact)); });
  const view = mount(Component(), { departmentCode: "67", placement: "city_page" });
  t.after(() => view.unmount());
  await view.flushEffects();
  assert.ok(phone(view));
  let prevented = false;
  assert.equal(phone(view).props.onClick({ preventDefault() { prevented = true; } }), undefined);
  assert.equal(prevented, false);
  assert.equal(calls.length, 1, "seul le GET du contact doit être émis");
});

test("une preview Cloudflare ne comptabilise pas les clics téléphone", async (t) => {
  const previousWindow = globalThis.window;
  globalThis.window = { location: { hostname: "feat.mabenneenligne-fr.pages.dev", pathname: "/location-benne/bischwiller-67240" }, localStorage: { getItem() { return JSON.stringify({ choice: "granted", timestamp: Date.now() }); } } };
  t.after(() => { globalThis.window = previousWindow; });
  const calls = [];
  t.mock.method(globalThis, "fetch", (...args) => { calls.push(args); return Promise.resolve(Response.json(activeContact)); });
  const view = mount(Component(), { departmentCode: "67", placement: "city_page" });
  t.after(() => view.unmount());
  await view.flushEffects();
  assert.ok(phone(view));
  phone(view).props.onClick({ preventDefault() { throw new Error("navigation blocked"); } });
  assert.equal(calls.length, 1);
});

test("un choix explicite de mesure est enregistré, réversible et distinct du formulaire", (t) => {
  const previousWindow = globalThis.window;
  const store = new Map();
  globalThis.window = { location: { hostname: "mabenneenligne.fr" }, localStorage: { getItem(key) { return store.get(key) ?? null; }, setItem(key, value) { store.set(key, value); } } };
  t.after(() => { globalThis.window = previousWindow; });
  const { measurementChoice, saveMeasurementChoice } = loadComponent("app/_lib/phone-measurement.ts");
  assert.equal(measurementChoice(), null);
  saveMeasurementChoice("granted");
  assert.equal(measurementChoice(), "granted");
  saveMeasurementChoice("denied");
  assert.equal(measurementChoice(), "denied");
});

test("pageview après accord seulement, sans chemin personnel ni émission depuis une preview", (t) => {
  const previousWindow = globalThis.window;
  const store = new Map();
  globalThis.window = {
    location: { hostname: "mabenneenligne.fr", pathname: "/location-benne/private%40example.test", search: "?phone=0612345678" },
    localStorage: { getItem(key) { return store.get(key) ?? null; }, setItem(key, value) { store.set(key, value); } },
  };
  t.after(() => { globalThis.window = previousWindow; });
  const calls = [];
  t.mock.method(globalThis, "fetch", (...args) => { calls.push(args); return Promise.resolve(new Response(null, { status: 204 })); });
  const { saveMeasurementChoice, trackMeasurementPageview } = loadComponent("app/_lib/phone-measurement.ts");
  trackMeasurementPageview();
  assert.equal(calls.length, 0);
  saveMeasurementChoice("denied");
  trackMeasurementPageview();
  assert.equal(calls.length, 0);
  saveMeasurementChoice("granted");
  trackMeasurementPageview();
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "https://nhmvgsrwhjsjnpncpiaj.supabase.co/functions/v1/analytics-collect");
  assert.deepEqual(JSON.parse(calls[0][1].body), { domain: "mabenneenligne.fr", pathname: "/location-benne/", event_name: "pageview" });
  assert.equal(calls[0][1].credentials, "omit");
  assert.equal(calls[0][1].referrerPolicy, "no-referrer");
  globalThis.window.location.hostname = "feat.mabenneenligne-fr.pages.dev";
  trackMeasurementPageview();
  assert.equal(calls.length, 1);
});
