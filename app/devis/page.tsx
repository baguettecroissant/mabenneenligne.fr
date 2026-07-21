import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "../_components/QuoteForm";
import { SiteShell } from "../_components/SiteShell";
import { cities } from "../_data/local/geo";

export const metadata: Metadata = {
  title: "Devis gratuit de location de benne",
  description: "Décrivez votre chantier et recevez un devis local de location de benne. Formulaire gratuit, sécurisé et sans engagement.",
  alternates: { canonical: "/devis" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DevisPage({ searchParams }: Props) {
  const query = await searchParams;
  const cityName = typeof query.ville === "string" ? query.ville : "";
  const postalCode = typeof query.codePostal === "string" ? query.codePostal : "";
  const city = cities.find((item) => item.postalCodes.includes(postalCode) && item.name.localeCompare(cityName, "fr", { sensitivity: "base" }) === 0);
  const initialCity = city ? { name: city.name, slug: city.slug, zip: postalCode || city.zip, departmentName: city.department_name, departmentCode: city.department_code, region: city.region } : undefined;

  return <SiteShell>
    <section className="devis-hero"><div className="container"><span className="eyebrow light">100% gratuit · sans engagement</span><h1>Votre devis <em>location de benne</em></h1><p>Décrivez votre chantier en deux étapes. Nous vérifions le bon volume, la disponibilité locale et les conditions d’accès.</p><div className="devis-hero-steps"><span className="active"><b>1</b> Votre projet</span><i /><span><b>2</b> Vos coordonnées</span></div></div></section>
    <section className="devis-trustbar"><div className="container"><span><b>✓</b> Demande gratuite</span><span><b>⌁</b> Réponse locale</span><span><b>▣</b> Données sécurisées</span></div></section>
    <section className="devis-main"><div className="container devis-layout"><div><QuoteForm initialCity={initialCity} /></div><aside className="devis-sidebar"><section><h2>Pourquoi passer par nous ?</h2><ul><li><span>✓</span><p><strong>Un seul formulaire</strong><small>Votre besoin est transmis avec toutes les informations utiles.</small></p></li><li><span>⌖</span><p><strong>Une réponse adaptée à la zone</strong><small>La disponibilité est vérifiée pour l’adresse réelle du chantier.</small></p></li><li><span>▣</span><p><strong>Des données protégées</strong><small>Vos informations restent dans le parcours MaBenneEnLigne.</small></p></li></ul></section><section className="delivery-card"><span>24–48h</span><strong>Délai de livraison généralement constaté</strong><small>Sous réserve de disponibilité, d’accès et d’autorisation de voirie.</small></section><section className="devis-help"><h2>Besoin d’aide ?</h2><Link href="/guides/choisir-taille-benne">Choisir le bon volume →</Link><Link href="/guides/dib-vs-gravats">DIB ou gravats ? →</Link><Link href="/guides/autorisation-voirie-benne">Préparer la voirie →</Link></section></aside></div></section>
  </SiteShell>;
}
