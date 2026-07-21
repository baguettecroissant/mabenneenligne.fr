import { cities, getCity } from "../../_data/local/geo";

const wasteTypes = new Set(["gravats", "dib", "dechets-verts", "bois", "encombrants", "mixte"]);
const volumes = new Set(["8", "10", "15", "20", "30", "a-definir"]);
const profiles = new Set(["particulier", "professionnel"]);
const buckets = new Map<string, { count: number; resetAt: number }>();

function text(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function rateLimited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!input) return Response.json({ error: "Requête invalide" }, { status: 400 });

  if (text(input.website, 100)) return Response.json({ ok: true }, { status: 201 });
  const ip = clientIp(request);
  if (rateLimited(ip)) return Response.json({ error: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429, headers: { "retry-after": "600" } });

  const nom = text(input.nom, 100);
  const prenom = text(input.prenom, 100);
  const email = text(input.email, 180).toLowerCase();
  const telephone = text(input.telephone, 30);
  const adresse = text(input.adresse, 250);
  const citySlug = text(input.citySlug, 160);
  const requestedCity = getCity(citySlug);
  const codePostal = text(input.codePostal, 5);
  const villeInput = text(input.ville, 120);
  const city = requestedCity ?? cities.find((item) => item.postalCodes.includes(codePostal) && item.name.localeCompare(villeInput, "fr", { sensitivity: "base" }) === 0);
  const typeDechet = text(input.typeDechet, 40);
  const volume = text(input.volume, 20);
  const profil = text(input.typeClient, 30);
  const dateLivraison = text(input.dateLivraison, 10);
  const dateRetrait = text(input.dateRetrait, 10);
  const entreprise = text(input.societe, 160);
  const message = text(input.message, 1500);
  const consent = input.consent === true;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = telephone.replace(/\D/g, "").length >= 10;
  if (!nom || !prenom || !emailValid || !phoneValid || !adresse || !city || !wasteTypes.has(typeDechet) || !volumes.has(volume) || !profiles.has(profil) || !consent) {
    return Response.json({ error: "Certaines informations sont manquantes ou invalides." }, { status: 400 });
  }
  if (dateLivraison && !/^\d{4}-\d{2}-\d{2}$/.test(dateLivraison)) return Response.json({ error: "Date de livraison invalide." }, { status: 400 });
  if (dateRetrait && !/^\d{4}-\d{2}-\d{2}$/.test(dateRetrait)) return Response.json({ error: "Date de retrait invalide." }, { status: 400 });
  if (dateLivraison && dateRetrait && dateRetrait < dateLivraison) return Response.json({ error: "La date de retrait doit suivre la date de livraison." }, { status: 400 });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return Response.json({ error: "Le service de devis est momentanément indisponible." }, { status: 503 });

  const payload = {
    nom,
    prenom,
    email,
    telephone,
    adresse,
    ville: city.name,
    code_postal: city.postalCodes.includes(codePostal) ? codePostal : city.zip,
    departement: city.department_code,
    profil,
    entreprise: profil === "professionnel" ? entreprise : "",
    volume: volume === "a-definir" ? "À définir" : `${volume}m³`,
    type_dechet: typeDechet,
    date_livraison: dateLivraison || null,
    date_retrait: dateRetrait || null,
    message,
    ip_address: ip,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) || "",
    marketplace_visible: true,
    is_sold: false,
    source_site: "mabenneenligne.fr",
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/benne_leads?select=id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Supabase benne_leads insert failed", response.status, await response.text());
    return Response.json({ error: "L’enregistrement n’a pas abouti. Réessayez dans quelques instants." }, { status: 502 });
  }

  const rows = await response.json().catch(() => []) as Array<{ id?: string }>;
  return Response.json({ ok: true, reference: rows[0]?.id ?? null }, { status: 201 });
}
