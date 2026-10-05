import assert from "node:assert/strict";
import test from "node:test";
import { elements, loadComponent, mount, textContent } from "./helpers/component-harness.mjs";

const exclusiveNotice = "Votre demande est transmise exclusivement à Alsace Recycle, partenaire exclusif pour le département Bas-Rhin (67).";
const moselleNotice = "Votre demande est transmise exclusivement à AD Services, partenaire exclusif pour le département Moselle (57).";
const genericNotice = "Données transmises uniquement à MaBenneEnLigne et aux partenaires nécessaires au devis";
const basRhinCity = { name: "Strasbourg", slug: "strasbourg-67000", zip: "67000", departmentName: "Bas-Rhin", departmentCode: "67", region: "Grand Est" };
const otherCity = { name: "Paris", slug: "paris-75001", zip: "75001", departmentName: "Paris", departmentCode: "75", region: "Île-de-France" };
const moselleCity = { name: "Metz", slug: "metz-57000", zip: "57000", departmentName: "Moselle", departmentCode: "57", region: "Grand Est" };
// The live partner contract, as the central API would return it (no partner in Paris).
const partners = {
  "67": { active: true, department: "67", display_name: "Alsace Recycle", phone_e164: "+33102030405", phone_display: "01 02 03 04 05", hours: null },
  "57": { active: true, department: "57", display_name: "AD Services", phone_e164: "+33102030406", phone_display: "01 02 03 04 06", hours: null },
};

function TerritoryContactCta() { return null; }
const useTerritoryContact = (departmentCode) => partners[departmentCode] ?? null;
const { QuoteForm } = loadComponent("app/_components/QuoteForm.tsx", {
  "next/link": ({ children }) => children,
  "./TerritoryContactCta": { TerritoryContactCta, useTerritoryContact, default: TerritoryContactCta },
});

function ctas(view) {
  return elements(view.tree(), (element) => element.type === TerritoryContactCta);
}

function selectCity(view, city) {
  const autocomplete = elements(view.tree(), (element) => element.type?.name === "CityAutocomplete")[0];
  assert.ok(autocomplete, "The form exposes its city selector.");
  autocomplete.props.onSelect(city);
}

test("selected Bas-Rhin city shows the exclusive recipient and a correctly scoped phone alternative", (t) => {
  const view = mount(QuoteForm, { initialCity: basRhinCity });
  t.after(() => view.unmount());
  const copy = textContent(view.tree());
  assert.ok(copy.includes(exclusiveNotice));
  assert.ok(!copy.includes(genericNotice));
  assert.equal(ctas(view).length, 1);
  assert.equal(ctas(view)[0].props.departmentCode, "67");
  assert.equal(ctas(view)[0].props.placement, "quote_form");
  assert.equal(ctas(view)[0].props.contact.display_name, "Alsace Recycle");
  assert.equal(elements(view.tree(), (element) => element.type === "form").length, 1);
  assert.match(copy, /Continuer vers mes coordonnées/);
});

test("a Moselle city names its own partner, never the Bas-Rhin one", (t) => {
  const view = mount(QuoteForm, { initialCity: moselleCity });
  t.after(() => view.unmount());
  const copy = textContent(view.tree());
  assert.ok(copy.includes(moselleNotice));
  assert.doesNotMatch(copy, /Alsace Recycle|Bas-Rhin/);
  assert.equal(ctas(view)[0].props.departmentCode, "57");
  assert.equal(ctas(view)[0].props.departmentName, "Moselle");
});

test("no selected city or a city without partner retains generic recipient copy and no territorial CTA", (t) => {
  for (const initialCity of [undefined, otherCity]) {
    const view = mount(QuoteForm, { initialCity });
    t.after(() => view.unmount());
    const copy = textContent(view.tree());
    assert.ok(copy.includes(genericNotice));
    assert.doesNotMatch(copy, /Alsace Recycle|exclusivement/);
    assert.equal(ctas(view).length, 0);
  }
});

test("changing and clearing the selected city updates recipient copy and removes the Bas-Rhin CTA", (t) => {
  const view = mount(QuoteForm);
  t.after(() => view.unmount());
  selectCity(view, basRhinCity);
  assert.ok(textContent(view.tree()).includes(exclusiveNotice));
  assert.equal(ctas(view)[0]?.props.departmentCode, "67");
  selectCity(view, otherCity);
  assert.ok(textContent(view.tree()).includes(genericNotice));
  assert.doesNotMatch(textContent(view.tree()), /Alsace Recycle/);
  assert.equal(ctas(view).length, 0);
  selectCity(view, basRhinCity);
  selectCity(view, null);
  assert.ok(textContent(view.tree()).includes(genericNotice));
  assert.doesNotMatch(textContent(view.tree()), /Alsace Recycle/);
  assert.equal(ctas(view).length, 0);
});

test("the exclusive recipient remains clear on the contact-details step", (t) => {
  const previousWindow = globalThis.window;
  globalThis.window = { scrollTo() {} };
  t.after(() => { globalThis.window = previousWindow; });
  const view = mount(QuoteForm, { initialCity: basRhinCity });
  t.after(() => view.unmount());
  const button = (label) => elements(view.tree(), (element) => element.type === "button" && textContent(element).includes(label))[0];
  button("Gravats").props.onClick();
  button("8 m³").props.onClick();
  button("Continuer vers mes coordonnées").props.onClick();
  assert.match(textContent(view.tree()), /Étape 2 sur 2/);
  assert.ok(textContent(view.tree()).includes(exclusiveNotice));
  assert.ok(!textContent(view.tree()).includes(genericNotice));
  assert.match(textContent(view.tree()), /Envoyer ma demande gratuite/);
});

test("the successful Bas-Rhin request confirms the exclusive recipient without any live submission", async (t) => {
  const requests = [];
  t.mock.method(globalThis, "fetch", async (...args) => {
    requests.push(args);
    return Response.json({ ok: true });
  });
  const view = mount(QuoteForm, { initialCity: basRhinCity });
  t.after(() => view.unmount());
  const form = elements(view.tree(), (element) => element.type === "form")[0];
  await form.props.onSubmit({ preventDefault() {}, currentTarget: { checkValidity: () => true } });
  assert.equal(requests.length, 1);
  assert.equal(requests[0][0], "/api/leads");
  assert.ok(textContent(view.tree()).includes(exclusiveNotice));
  assert.ok(!textContent(view.tree()).includes(genericNotice));
});
