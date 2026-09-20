import assert from "node:assert/strict";
import test from "node:test";
import { elements, loadComponent } from "./helpers/component-harness.mjs";

function TerritoryContactCta() { return null; }
function Link() { return null; }
const mocks = {
  "next/link": Link,
  "next/navigation": { notFound() { throw new Error("Page not found"); } },
  "../../_components/SiteShell": { SiteShell() { return null; } },
  "../../_components/TerritoryContactCta": { TerritoryContactCta, default: TerritoryContactCta },
};
const { default: CityPage } = loadComponent("app/location-benne/[slug]/page.tsx", mocks);
const { default: DepartmentPage } = loadComponent("app/departements/[slug]/page.tsx", mocks);
const geo = loadComponent("app/_data/local/geo.ts");

function contacts(tree) {
  return elements(tree, (element) => element.type === TerritoryContactCta);
}

test("Bas-Rhin city page passes its data department to the CTA and preserves the quote form link", async () => {
  const tree = await CityPage({ params: Promise.resolve({ slug: "strasbourg-67000" }) });
  const ctas = contacts(tree);
  assert.equal(ctas.length, 1);
  assert.equal(ctas[0].props.departmentCode, "67");
  assert.equal(ctas[0].props.placement, "city_page");
  assert.ok(elements(tree, (element) => element.type === Link && element.props.href === "/devis?ville=Strasbourg&codePostal=67000").length > 0);
});

test("other city pages omit the territorial CTA", async () => {
  const tree = await CityPage({ params: Promise.resolve({ slug: "paris-75001" }) });
  assert.equal(contacts(tree).length, 0);
});

test("city CTA scope follows the explicit department code, not the city name, slug or postcode", async () => {
  const { default: Page } = loadComponent("app/location-benne/[slug]/page.tsx", {
    ...mocks,
    "../../_data/local/geo": { ...geo, getCity: () => ({ ...geo.getCity("strasbourg-67000"), department_code: "75" }) },
  });
  const tree = await Page({ params: Promise.resolve({ slug: "strasbourg-67000" }) });
  assert.equal(contacts(tree).length, 0);
});

test("Bas-Rhin department page passes its data code to the CTA and preserves the quote form link", async () => {
  const tree = await DepartmentPage({ params: Promise.resolve({ slug: "bas-rhin-67" }) });
  const ctas = contacts(tree);
  assert.equal(ctas.length, 1);
  assert.equal(ctas[0].props.departmentCode, "67");
  assert.equal(ctas[0].props.placement, "department_page");
  assert.ok(elements(tree, (element) => element.type === Link && element.props.href === "/devis?departement=67").length > 0);
});

test("other department pages omit the territorial CTA", async () => {
  const tree = await DepartmentPage({ params: Promise.resolve({ slug: "paris-75" }) });
  assert.equal(contacts(tree).length, 0);
});

test("department CTA scope follows the explicit record code, not the route slug", async () => {
  const { default: Page } = loadComponent("app/departements/[slug]/page.tsx", {
    ...mocks,
    "../../_data/local/geo": { ...geo, getDepartment: () => ({ ...geo.getDepartment("bas-rhin-67"), code: "75" }) },
  });
  const tree = await Page({ params: Promise.resolve({ slug: "bas-rhin-67" }) });
  assert.equal(contacts(tree).length, 0);
});
