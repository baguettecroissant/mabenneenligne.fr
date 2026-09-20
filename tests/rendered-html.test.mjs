import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test, { beforeEach } from "node:test";
import { activeContact } from "./helpers/territory-fixture.mjs";

beforeEach((t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected network request: rendered tests must mock every fetch.");
  });
});

const root = new URL("../", import.meta.url);

test("built worker exposes the territory proxy with mocked upstream and rejects other methods and queries", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (...args) => {
    calls.push(args);
    return Response.json(activeContact);
  });
  const active = await request("/api/territory-contact?department=67");
  assert.equal(active.status, 200);
  assert.deepEqual(await active.json(), activeContact);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "https://prix-location-benne.fr/api/public/territory-contact?department=67");
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]) {
    const rejected = await request("/api/territory-contact?department=67", { method });
    assert.equal(rejected.status, 405, method);
    assert.equal(rejected.headers.get("allow"), "GET");
    if (method !== "HEAD") assert.deepEqual(await rejected.json(), { active: false, department: "67" });
  }
  const invalid = await request("/api/territory-contact?department=67&department=67");
  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), { active: false, department: "67" });
  assert.equal(calls.length, 1);
});
async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

async function request(path, init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, init),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the branded homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>MaBenneEnLigne/);
  assert.match(html, /Louez votre benne/);
  assert.match(html, /Livrée en 24h/);
  assert.match(html, /Devis gratuit/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("ships production metadata and generated assets", async () => {
  const [layout, page, pkg] = await Promise.all([readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"), readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), readFile(new URL("../package.json", import.meta.url), "utf8")]);
  assert.match(layout, /mabenneenligne\.fr/);
  assert.match(layout, /\/og\.png/);
  assert.match(page, /FAQPage/);
  assert.doesNotMatch(pkg, /react-loading-skeleton/);
  await Promise.all(["hero-homepage.png", "hero-devenir-partenaire.png", "services-waste-streams.png", "og.png"].map(file => access(new URL(`../public/${file}`, import.meta.url))));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  assert.ok(root);
});

test("ships indexation essentials with self-referencing canonical URLs", async () => {
  const [robotsResponse, homeResponse, contactResponse, legalResponse] = await Promise.all([
    request("/robots.txt"),
    render("/"),
    render("/contact"),
    render("/mentions-legales"),
  ]);
  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/www\.mabenneenligne\.fr\/sitemap\.xml/);
  for (const [response, canonical] of [[homeResponse, "https://www.mabenneenligne.fr/"], [contactResponse, "https://www.mabenneenligne.fr/contact"], [legalResponse, "https://www.mabenneenligne.fr/mentions-legales"]]) {
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}"`));
  }
  await access(new URL("../public/favicon.png", import.meta.url));
});

test("uses e-mail and forms as the public contact channels", async () => {
  const [homeResponse, contactResponse] = await Promise.all([render("/"), render("/contact")]);
  const html = `${await homeResponse.text()}${await contactResponse.text()}`;
  assert.doesNotMatch(html, /tel:|01 89 00 00 00/i);
  assert.match(html, /contact@mabenneenligne\.fr/);
});

test("renders a complete expert guide with visible evidence and structured data", async () => {
  const response = await render("/guides/choisir-taille-benne");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /La réponse en 30 secondes/);
  assert.match(html, /Ce qu’il faut retenir/);
  assert.match(html, /Sources officielles et ressources utiles/);
  assert.match(html, /FAQPage/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /Article/);
  assert.match(html, /choisir-taille-benne\.jpg/);
});

test("includes one optimized editorial image per guide", async () => {
  const names = [
    "choisir-taille-benne.jpg",
    "prix-location-benne-2026.jpg",
    "autorisation-voirie-benne.jpg",
    "tri-dechets-chantier.jpg",
    "dib-vs-gravats.jpg",
    "location-benne-particulier.jpg",
    "dechets-interdits-benne.jpg",
  ];
  await Promise.all(names.map((name) => access(new URL(`../public/guides/${name}`, import.meta.url))));
});

test("renders a data-rich city page with local navigation and structured data", async () => {
  const response = await render("/location-benne/paris-75001");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Location de benne à/);
  assert.match(html, /Paris/);
  assert.match(html, /Code INSEE/);
  assert.match(html, /2[\s ]103[\s ]778 habitants/);
  assert.match(html, /Quel prix pour une benne/);
  assert.match(html, /FAQPage/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /Service/);
  assert.match(html, /Référentiel public des communes/);
});

test("renders region and department hubs with crawlable city links", async () => {
  const [regionResponse, departmentResponse] = await Promise.all([
    render("/regions/ile-de-france"),
    render("/departements/paris-75"),
  ]);
  assert.equal(regionResponse.status, 200);
  assert.equal(departmentResponse.status, 200);
  const [regionHtml, departmentHtml] = await Promise.all([regionResponse.text(), departmentResponse.text()]);
  assert.match(regionHtml, /Départements de/);
  assert.match(regionHtml, /Île-de-France/);
  assert.match(regionHtml, /location-benne\/paris-75001/);
  assert.match(departmentHtml, /Annuaire complet/);
  assert.match(departmentHtml, /location-benne\/paris-75001/);
  assert.match(departmentHtml, /CollectionPage/);
});

test("ships the official geography source and LLM discovery file", async () => {
  const [source, llms] = await Promise.all([
    readFile(new URL("../app/_data/local/source.json", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
  ]);
  assert.match(source, /geo\.api\.gouv\.fr/);
  assert.match(source, /France métropolitaine \(DOM-TOM exclus\)/);
  assert.match(source, /"cityCount": 34746/);
  assert.match(llms, /Organisation des pages locales/);
  assert.match(llms, /\/location-benne\/\{ville-code-postal\}/);
});

test("uses progressive indexation and keeps the sitemap below protocol limits", async () => {
  const [smallCityResponse, sitemapResponse] = await Promise.all([
    render("/location-benne/l-abergement-clemenciat-01400"),
    render("/sitemap.xml"),
  ]);
  assert.equal(smallCityResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);
  const [smallCityHtml, sitemapXml] = await Promise.all([smallCityResponse.text(), sitemapResponse.text()]);
  assert.match(smallCityHtml, /name="robots" content="noindex, follow"/);
  assert.doesNotMatch(sitemapXml, /l-abergement-clemenciat-01400/);
  assert.match(sitemapXml, /location-benne\/paris-75001/);
  assert.ok((sitemapXml.match(/<url>/g) ?? []).length < 50000);
});

test("limits local coverage to metropolitan France", async () => {
  const [regionsResponse, cityResponse] = await Promise.all([
    render("/regions"),
    request("/api/cities/search?q=Papeete", { headers: { accept: "application/json" } }),
  ]);
  assert.equal(regionsResponse.status, 200);
  const [regionsHtml, cityPayload] = await Promise.all([regionsResponse.text(), cityResponse.json()]);
  assert.match(regionsHtml, /13 hubs régionaux/);
  assert.doesNotMatch(regionsHtml, /Polynésie française|Nouvelle-Calédonie/);
  assert.deepEqual(cityPayload.cities, []);
});

test("renders the complete two-step quote journey", async () => {
  const response = await render("/devis");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Votre devis/);
  assert.match(html, /Étape 1 sur 2/);
  assert.match(html, /Décrivez votre besoin/);
  assert.match(html, /Type de déchet/);
  assert.match(html, /Volume estimé/);
  assert.match(html, /Confidentialité/);
});

test("preselected Bas-Rhin quotes disclose the exclusive recipient in rendered HTML", async () => {
  const response = await render("/devis?ville=Strasbourg&codePostal=67000");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Votre demande est transmise exclusivement à Alsace Recycle pour le Bas-Rhin \(67\)\./);
  assert.doesNotMatch(html, /Données transmises uniquement à MaBenneEnLigne et aux partenaires nécessaires au devis/);
  assert.match(html, /Continuer vers mes coordonnées/);
});

test("generic and non-67 quotes retain the generic recipient notice", async () => {
  for (const path of ["/devis", "/devis?ville=Paris&codePostal=75001"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Données transmises uniquement à MaBenneEnLigne et aux partenaires nécessaires au devis/);
    assert.doesNotMatch(html, /Alsace Recycle|territory_phone_click|tel:/);
  }
});

test("privacy policy discloses the Bas-Rhin recipient and minimal cookieless phone click measurement", async () => {
  const response = await render("/politique-confidentialite");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Alsace Recycle/);
  assert.match(html, /Bas-Rhin \(67\)/);
  assert.match(html, /exclusivement/);
  assert.match(html, /sans cookie/i);
  assert.match(html, /domaine/i);
  assert.match(html, /chemin[^<.]*sans[^<.]*paramètre/i);
  assert.match(html, /département/i);
  assert.match(html, /emplacement/i);
  assert.match(html, /sans[^<.]*numéro de téléphone/i);
});

test("searches the official city dataset for the quote autocomplete", async () => {
  const response = await request("/api/cities/search?q=Lille", {
    headers: { accept: "application/json" },
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.ok(Array.isArray(payload.cities));
  assert.ok(payload.cities.some((city) => city.name === "Lille" && city.zip === "59000"));
});

test("rejects an incomplete lead before contacting the marketplace connector", async () => {
  const response = await request("/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
    },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.match(payload.error, /manquantes ou invalides/i);
});

test("uses the authenticated server-side marketplace connector", async () => {
  const [route, envExample] = await Promise.all([
    readFile(new URL("../app/api/leads/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  assert.match(route, /MARKETPLACE_INGEST_KEY/);
  assert.match(route, /X-Marketplace-Source/);
  assert.match(route, /source_site/);
  assert.doesNotMatch(route, /SUPABASE_SERVICE_ROLE_KEY|\/rest\/v1\/benne_leads/);
  assert.doesNotMatch(route, /viteundevis|viteunedevis|\bvud\b/i);
  assert.match(envExample, /MARKETPLACE_INGEST_URL/);
  assert.match(envExample, /MARKETPLACE_INGEST_KEY/);
  assert.doesNotMatch(envExample, /SUPABASE|ANON_KEY/);
});
