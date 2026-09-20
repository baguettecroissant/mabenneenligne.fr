import { cities, getCity } from "../../_data/local/geo";
import { validatePublicLeadRequest } from "./request-security";

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
  const requestSecurity = validatePublicLeadRequest(request);
  if (requestSecurity.status === 403) return Response.json({ error: "Origine non autorisée" }, { status: 403 });
  if (requestSecurity.status === 415) return Response.json({ error: "Le formulaire doit être envoyé en JSON" }, { status: 415 });
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
  const sourceSubmissionId = text(input.source_submission_id, 80);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = telephone.replace(/\D/g, "").length >= 10;
  if (!nom || !prenom || !emailValid || !phoneValid || !adresse || !city || !wasteTypes.has(typeDechet) || !volumes.has(volume) || !profiles.has(profil) || !consent || !/^mabenne-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sourceSubmissionId)) {
    return Response.json({ error: "Certaines informations sont manquantes ou invalides." }, { status: 400 });
  }
  if (dateLivraison && !/^\d{4}-\d{2}-\d{2}$/.test(dateLivraison)) return Response.json({ error: "Date de livraison invalide." }, { status: 400 });
  if (dateRetrait && !/^\d{4}-\d{2}-\d{2}$/.test(dateRetrait)) return Response.json({ error: "Date de retrait invalide." }, { status: 400 });
  if (dateLivraison && dateRetrait && dateRetrait < dateLivraison) return Response.json({ error: "La date de retrait doit suivre la date de livraison." }, { status: 400 });

  const ingestUrl = process.env.MARKETPLACE_INGEST_URL;
  const ingestKey = process.env.MARKETPLACE_INGEST_KEY;
  if (!ingestUrl || !ingestKey) return Response.json({ error: "Le service de devis est momentanément indisponible." }, { status: 503 });

  const codePostalFinal = city.postalCodes.includes(codePostal) ? codePostal : city.zip;
  const consentAt = new Date().toISOString();
  const fingerprintInput = [email, telephone.replace(/\D/g, ""), codePostalFinal, typeDechet, volume, consentAt.slice(0, 10)].join("|");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fingerprintInput));
  const leadFingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");

  const payload = {
    nom,
    prenom,
    email,
    telephone,
    adresse,
    ville: city.name,
    code_postal: codePostalFinal,
    departement: city.department_code,
    profil,
    entreprise: profil === "professionnel" ? entreprise : "",
    volume: volume === "a-definir" ? "À définir" : `${volume}m³`,
    type_dechet: typeDechet,
    date_livraison: dateLivraison,
    date_retrait: dateRetrait,
    message,
    consent: true,
    source_site: "mabenneenligne.fr",
    source_domain: "mabenneenligne.fr",
    source_campaign: "organic-form",
    source_submission_id: sourceSubmissionId,
    consent_marketplace_at: consentAt,
    privacy_policy_version: "2026-09-20",
    lead_fingerprint: leadFingerprint,
  };

  const response = await fetch(ingestUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ingestKey}`,
      "X-Marketplace-Source": "mabenneenligne.fr",
      "content-type": "application/json",
      "X-Marketplace-Visitor-Ip": ip,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null) as { success?: boolean; duplicate?: boolean } | null;
  if (!response.ok || result?.success !== true) {
    console.error("Marketplace connector failed", response.status);
    return Response.json({ error: "L’enregistrement n’a pas abouti. Réessayez dans quelques instants." }, { status: 502 });
  }

  return Response.json({ ok: true, duplicate: result.duplicate === true }, { status: result.duplicate ? 200 : 201 });
}
