import rawCities from "./cities.json";

export type City = {
  name: string;
  slug: string;
  zip: string;
  postalCodes: string[];
  inseeCode: string;
  department_name: string;
  department_code: string;
  region: string;
  coordinates: { lat: number; lng: number };
  population?: number;
};

export type Department = {
  code: string;
  name: string;
  slug: string;
  region: string;
  regionSlug: string;
  cityCount: number;
  population: number;
};

export type Region = {
  name: string;
  slug: string;
  departments: Department[];
  cityCount: number;
  population: number;
};

const regionNames: Record<string, string> = {
  "centre-val-de-loire": "Centre-Val de Loire",
  "hauts-de-france": "Hauts-de-France",
  "ile-de-france": "Île-de-France",
  "pays-de-la-loire": "Pays de la Loire",
  "polynesie-francaise": "Polynésie française",
  "provence-alpes-cote-d-azur": "Provence-Alpes-Côte d’Azur",
  "saint-pierre-et-miquelon": "Saint-Pierre-et-Miquelon",
  "wallis-et-futuna": "Wallis-et-Futuna",
};

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function displayRegion(value: string) {
  const slug = slugify(value);
  return regionNames[slug] ?? value;
}

const isMetropolitanDepartment = (code: string) => !/^(97|98)/.test(code);

export const cities = (rawCities as City[]).filter(
  (city) => city.name && city.slug && city.zip && city.department_code && isMetropolitanDepartment(city.department_code),
);

const cityBySlug = new Map(cities.map((city) => [city.slug, city]));
const citiesByDepartment = new Map<string, City[]>();

for (const city of cities) {
  const list = citiesByDepartment.get(city.department_code) ?? [];
  list.push(city);
  citiesByDepartment.set(city.department_code, list);
}

for (const list of citiesByDepartment.values()) {
  list.sort((a, b) => (b.population ?? 0) - (a.population ?? 0) || a.name.localeCompare(b.name, "fr"));
}

export const departments: Department[] = Array.from(citiesByDepartment.entries())
  .map(([code, departmentCities]) => {
    const sample = departmentCities[0];
    const region = displayRegion(sample.region);
    return {
      code,
      name: sample.department_name,
      slug: `${slugify(sample.department_name)}-${code.toLowerCase()}`,
      region,
      regionSlug: slugify(region),
      cityCount: departmentCities.length,
      population: departmentCities.reduce((sum, city) => sum + (city.population ?? 0), 0),
    };
  })
  .sort((a, b) => a.code.localeCompare(b.code, "fr", { numeric: true }));

const departmentBySlug = new Map(departments.map((department) => [department.slug, department]));
const departmentByCode = new Map(departments.map((department) => [department.code, department]));

const regionMap = new Map<string, Department[]>();
for (const department of departments) {
  const list = regionMap.get(department.regionSlug) ?? [];
  list.push(department);
  regionMap.set(department.regionSlug, list);
}

export const regions: Region[] = Array.from(regionMap.entries())
  .map(([slug, regionDepartments]) => ({
    name: regionDepartments[0].region,
    slug,
    departments: regionDepartments.sort((a, b) => a.code.localeCompare(b.code, "fr", { numeric: true })),
    cityCount: regionDepartments.reduce((sum, department) => sum + department.cityCount, 0),
    population: regionDepartments.reduce((sum, department) => sum + department.population, 0),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

const regionBySlug = new Map(regions.map((region) => [region.slug, region]));
const topCitySlugs = new Set(
  departments.flatMap((department) => (citiesByDepartment.get(department.code) ?? []).slice(0, 10).map((city) => city.slug)),
);

export function getCity(slug: string) {
  return cityBySlug.get(slug);
}

export function getDepartment(slug: string) {
  return departmentBySlug.get(slug);
}

export function getDepartmentByCode(code: string) {
  return departmentByCode.get(code);
}

export function getRegion(slug: string) {
  return regionBySlug.get(slug);
}

export function getCitiesForDepartment(code: string) {
  return citiesByDepartment.get(code) ?? [];
}

export function getCitiesForRegion(slug: string) {
  const region = getRegion(slug);
  if (!region) return [];
  return region.departments
    .flatMap((department) => getCitiesForDepartment(department.code))
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0) || a.name.localeCompare(b.name, "fr"));
}

function distanceKm(a: City, b: City) {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.coordinates.lat - a.coordinates.lat);
  const dLng = toRad(b.coordinates.lng - a.coordinates.lng);
  const lat1 = toRad(a.coordinates.lat);
  const lat2 = toRad(b.coordinates.lat);
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function getNearbyCities(city: City, limit = 8) {
  return getCitiesForDepartment(city.department_code)
    .filter((candidate) => candidate.slug !== city.slug)
    .map((candidate) => ({ city: candidate, distance: Math.round(distanceKm(city, candidate)) }))
    .sort((a, b) => a.distance - b.distance || (b.city.population ?? 0) - (a.city.population ?? 0))
    .slice(0, limit);
}

export function isIndexableCity(city: City) {
  return (city.population ?? 0) >= 2000 || topCitySlugs.has(city.slug);
}

export function formatPopulation(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatDepartmentLabel(department: Department) {
  return `${department.name} (${department.code})`;
}

const pluralDepartmentCodes = new Set(["04", "05", "06", "08", "13", "22", "28", "40", "64", "65", "66", "79", "78", "88", "92"]);
const feminineDepartmentCodes = new Set(["16", "17", "19", "20", "21", "23", "24", "26", "33", "2A", "2B", "31", "43", "44", "46", "48", "50", "51", "52", "53", "55", "57", "58", "71", "72", "73", "74", "76", "77", "80", "85", "87", "93", "971", "972", "973", "974", "976"]);

export function departmentGenitive(department: Department) {
  if (department.code === "75") return "de Paris";
  if (pluralDepartmentCodes.has(department.code)) return `des ${department.name}`;
  if (/^[AEIOUYHÉÈÊËÀÂÄÎÏÔÖÙÛÜ]/i.test(department.name)) return `de l’${department.name}`;
  if (feminineDepartmentCodes.has(department.code)) return `de la ${department.name}`;
  return `du ${department.name}`;
}
