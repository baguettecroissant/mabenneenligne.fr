import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
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

test("searches the official city dataset for the quote autocomplete", async () => {
  const response = await request("/api/cities/search?q=Lille", {
    headers: { accept: "application/json" },
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.ok(Array.isArray(payload.cities));
  assert.ok(payload.cities.some((city) => city.name === "Lille" && city.zip === "59000"));
});

test("rejects an incomplete lead before contacting Supabase", async () => {
  const response = await request("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.match(payload.error, /manquantes ou invalides/i);
});

test("uses a server-side Supabase integration with no lead broker", async () => {
  const [route, envExample] = await Promise.all([
    readFile(new URL("../app/api/leads/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  assert.match(route, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(route, /\/rest\/v1\/benne_leads/);
  assert.match(route, /source_site/);
  assert.doesNotMatch(route, /viteundevis|viteunedevis|\bvud\b/i);
  assert.match(envExample, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(envExample, /ANON_KEY/);
});
