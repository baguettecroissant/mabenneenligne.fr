import { cities, slugify } from "../../../_data/local/geo";

function normalize(value: string) {
  return slugify(value).replace(/-/g, " ");
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 60) ?? "";
  if (query.length < 2) return Response.json({ cities: [] });

  const normalized = normalize(query);
  const digits = query.replace(/\D/g, "");
  const ranked = cities
    .map((city) => {
      const name = normalize(city.name);
      const postalMatch = digits.length >= 2 && city.postalCodes.some((code) => code.startsWith(digits));
      const nameStarts = name.startsWith(normalized);
      const nameIncludes = name.includes(normalized);
      const exactPostal = digits.length === 5 && city.postalCodes.includes(digits);
      const score = exactPostal ? 4 : postalMatch ? 3 : nameStarts ? 2 : nameIncludes ? 1 : 0;
      return { city, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.city.population ?? 0) - (a.city.population ?? 0) || a.city.name.localeCompare(b.city.name, "fr"))
    .slice(0, 8)
    .map(({ city }) => ({
      name: city.name,
      slug: city.slug,
      zip: city.postalCodes.find((code) => digits && code.startsWith(digits)) ?? city.zip,
      departmentName: city.department_name,
      departmentCode: city.department_code,
      region: city.region,
    }));

  return Response.json(
    { cities: ranked },
    { headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}
