import { mkdir, writeFile } from "node:fs/promises";

const endpoints = {
  communes: "https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,centre&format=json&geometry=centre",
  departements: "https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion",
  regions: "https://geo.api.gouv.fr/regions?fields=nom,code",
};

const territories = {
  "975": "Saint-Pierre-et-Miquelon",
  "977": "Saint-Barthélemy",
  "978": "Saint-Martin",
  "984": "Terres australes et antarctiques françaises",
  "986": "Wallis-et-Futuna",
  "987": "Polynésie française",
  "988": "Nouvelle-Calédonie",
  "989": "Île de Clipperton",
};

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "MaBenneEnLigne geographic data updater" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

const [communes, departements, regions] = await Promise.all(Object.values(endpoints).map(getJson));
const departmentByCode = new Map(departements.map((department) => [department.code, department]));
const regionByCode = new Map(regions.map((region) => [region.code, region]));
const usedSlugs = new Set();

const cities = communes.map((commune) => {
  const department = departmentByCode.get(commune.codeDepartement);
  const region = regionByCode.get(commune.codeRegion);
  const postalCodes = commune.codesPostaux?.length ? commune.codesPostaux : [commune.code];
  const zip = postalCodes[0];
  const baseSlug = `${slugify(commune.nom)}-${zip}`;
  const slug = usedSlugs.has(baseSlug) ? `${baseSlug}-${commune.code.toLowerCase()}` : baseSlug;
  usedSlugs.add(slug);
  return {
    name: commune.nom,
    slug,
    zip,
    postalCodes,
    inseeCode: commune.code,
    department_name: department?.nom ?? territories[commune.codeDepartement] ?? commune.codeDepartement,
    department_code: commune.codeDepartement,
    region: region?.nom ?? territories[commune.codeDepartement] ?? commune.codeRegion,
    coordinates: { lat: commune.centre?.coordinates?.[1] ?? 0, lng: commune.centre?.coordinates?.[0] ?? 0 },
    population: commune.population ?? 0,
  };
}).sort((a, b) => a.department_code.localeCompare(b.department_code, "fr", { numeric: true }) || a.name.localeCompare(b.name, "fr"));

await mkdir(new URL("../app/_data/local/", import.meta.url), { recursive: true });
await writeFile(new URL("../app/_data/local/cities.json", import.meta.url), `${JSON.stringify(cities)}\n`);
await writeFile(new URL("../app/_data/local/source.json", import.meta.url), `${JSON.stringify({ source: endpoints.communes, updatedAt: new Date().toISOString(), cityCount: cities.length, departmentCount: departements.length, territoryCount: Object.keys(territories).length, regionCount: regions.length }, null, 2)}\n`);
console.log(`Updated ${cities.length} communes, ${departements.length} departments and ${regions.length} regions.`);
