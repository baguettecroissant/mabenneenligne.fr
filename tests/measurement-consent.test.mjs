import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { elements, loadComponent, mount } from "./helpers/component-harness.mjs";

const collector = "https://nhmvgsrwhjsjnpncpiaj.supabase.co/functions/v1/analytics-collect";

test("le choix est présent dans le shell commun et réouvrable depuis le footer", () => {
  const source = readFileSync(new URL("../app/_components/SiteShell.tsx", import.meta.url), "utf8");
  assert.match(source, /<Header\s*\/>\s*<MeasurementConsent\s*\/>\s*<main>/);
  assert.match(source, /<MeasurementPreferencesButton\s*\/>/);
  const footerBrand = source.match(/className="footer-brand">([\s\S]*?)<div className="trust-pill">/)?.[1] ?? "";
  assert.match(footerBrand, /<MeasurementPreferencesButton\s*\/>/, "les préférences doivent rester visibles sur mobile");
});

test("le panneau reste dans le flux et ne couvre pas les CTA mobiles", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.measurement-panel\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.match(css, /\.measurement-panel\s*\{[^}]*position:\s*relative/);
});

test("la politique décrit le choix explicite, la catégorie de page et la limite du clic", () => {
  const source = readFileSync(new URL("../app/politique-confidentialite/page.tsx", import.meta.url), "utf8");
  assert.match(source, /accord explicite/i);
  assert.match(source, /catégorie de page/i);
  assert.match(source, /pas un appel abouti/i);
});

test("après un choix rouvert depuis le footer, le focus revient au bouton d’origine", async (t) => {
  const previousWindow = globalThis.window;
  const store = new Map([["mbel_measurement_v1", JSON.stringify({ choice: "denied", timestamp: Date.now() })]]);
  globalThis.window = Object.assign(new EventTarget(), {
    location: { hostname: "mabenneenligne.fr", pathname: "/location-benne/bischwiller-67240" },
    localStorage: { getItem(key) { return store.get(key) ?? null; }, setItem(key, value) { store.set(key, value); } },
  });
  const { MeasurementConsent, MeasurementPreferencesButton } = loadComponent("app/_components/MeasurementConsent.tsx", { "next/navigation": { usePathname: () => "/location-benne/bischwiller-67240" } });
  const view = mount(MeasurementConsent);
  t.after(() => { view.unmount(); globalThis.window = previousWindow; });
  await view.flushEffects();
  let restoredFocus = 0;
  let restoredScroll = 0;
  const opener = { isConnected: true, focus() { restoredFocus++; }, scrollIntoView() { restoredScroll++; } };
  MeasurementPreferencesButton().props.onClick({ currentTarget: opener });
  await view.flushEffects();
  const decline = elements(view.tree(), (node) => node.type === "button" && node.props?.["data-measurement-choice"] === "denied")[0];
  decline.props.ref.current = { focus() {}, scrollIntoView() {} };
  decline.props.onClick();
  await view.flushEffects();
  assert.equal(restoredFocus, 1, "le focus clavier doit revenir au bouton du footer");
  assert.equal(restoredScroll, 1, "le bouton rendu actif doit être visible après retour");
});

test("le choix de mesure peut être refusé, réouvert, accepté puis révoqué", async (t) => {
  const previousWindow = globalThis.window;
  const store = new Map();
  let route = "/location-benne/bischwiller-67240";
  const events = new EventTarget();
  globalThis.window = Object.assign(events, {
    location: { hostname: "mabenneenligne.fr", pathname: route },
    localStorage: { getItem(key) { return store.get(key) ?? null; }, setItem(key, value) { store.set(key, value); } },
  });
  const calls = [];
  t.mock.method(globalThis, "fetch", (...args) => { calls.push(args); return Promise.resolve(new Response(null, { status: 204 })); });
  const { MeasurementConsent } = loadComponent("app/_components/MeasurementConsent.tsx", { "next/navigation": { usePathname: () => route } });
  const view = mount(MeasurementConsent);
  t.after(() => { view.unmount(); globalThis.window = previousWindow; });
  const panel = () => elements(view.tree(), (node) => Object.hasOwn(node.props ?? {}, "data-measurement-panel"))[0];
  const choose = (choice) => elements(view.tree(), (node) => node.type === "button" && node.props?.["data-measurement-choice"] === choice)[0];
  await view.flushEffects();
  assert.equal(panel().props.hidden, false);
  assert.equal(calls.length, 0);
  choose("denied").props.onClick();
  await view.flushEffects();
  assert.equal(panel().props.hidden, true);
  assert.equal(calls.length, 0);
  globalThis.window.dispatchEvent(new Event("measurement-preferences-open"));
  await view.flushEffects();
  assert.equal(panel().props.hidden, false);
  choose("granted").props.onClick();
  await view.flushEffects();
  assert.equal(panel().props.hidden, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], collector);
  assert.deepEqual(JSON.parse(calls[0][1].body), { domain: "mabenneenligne.fr", pathname: "/location-benne/", event_name: "pageview" });
  route = "/location-benne/strasbourg-67000";
  globalThis.window.location.pathname = route;
  view.rerender({});
  await view.flushEffects();
  assert.equal(calls.length, 2, "navigation vers une autre ville : nouvelle page vue");
  globalThis.window.dispatchEvent(new Event("measurement-preferences-open"));
  await view.flushEffects();
  choose("denied").props.onClick();
  await view.flushEffects();
  route = "/departements/bas-rhin";
  globalThis.window.location.pathname = route;
  view.rerender({});
  await view.flushEffects();
  assert.equal(calls.length, 2, "révocation : plus aucune page vue");
});
