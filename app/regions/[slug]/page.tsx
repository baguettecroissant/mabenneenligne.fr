import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../_components/SiteShell";
import { formatPopulation, getCitiesForRegion, getRegion } from "../../_data/local/geo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) return {};
  return { title: `Location de benne en ${region.name}`, description: `Trouvez votre page locale de location de benne en ${region.name} par département et par ville. Prix, accès et devis gratuit.`, alternates: { canonical: `/regions/${region.slug}` } };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();
  const cities = getCitiesForRegion(region.slug);
  const topCities = cities.slice(0, 20);
  const urbanShare = region.population ? Math.round((cities.filter((city) => (city.population ?? 0) >= 10000).reduce((sum, city) => sum + (city.population ?? 0), 0) / region.population) * 100) : 0;
  return <SiteShell><nav className="breadcrumb-bar" aria-label="Fil d’Ariane"><div className="container"><Link href="/">Accueil</Link><span>›</span><Link href="/regions">Régions</Link><span>›</span><strong>{region.name}</strong></div></nav><section className="local-department-hero"><div className="container"><span className="eyebrow light">Hub régional · {region.departments.length} départements</span><h1>Location de benne en <em>{region.name}</em></h1><p>Parcourez les {region.cityCount} communes du territoire via leurs hubs départementaux et accédez aux repères locaux de prix, de tri et de livraison.</p><div className="hero-actions"><Link className="button" href="/devis">Demander un devis local →</Link><a className="button button-ghost" href="#departements">Choisir un département</a></div></div></section><section className="hub-kpis"><div className="container"><div><strong>{region.departments.length}</strong><span>départements</span></div><div><strong>{region.cityCount}</strong><span>communes</span></div><div><strong>{formatPopulation(region.population)}</strong><span>habitants recensés</span></div><div><strong>{urbanShare}%</strong><span>dans des villes de 10 000+ habitants</span></div></div></section><section className="content-section" id="departements"><div className="container"><div className="section-heading"><span className="eyebrow">Maillage régional</span><h2>Départements de {region.name}</h2><p>Choisissez un département pour accéder à toutes ses communes et aux informations adaptées au contexte local.</p></div><div className="department-grid">{region.departments.map((department) => <Link className="department-card" href={`/departements/${department.slug}`} key={department.slug}><span className="department-code">{department.code}</span><strong>{department.name}<small>{department.cityCount} communes</small></strong></Link>)}</div></div></section><section className="content-section alt"><div className="container"><div className="section-heading"><span className="eyebrow">Principales villes</span><h2>Pages locales les plus demandées en {region.name}</h2><p>Ces villes constituent les principaux points d’entrée ; les pages voisines et les hubs départementaux complètent ensuite le parcours.</p></div><div className="popular-city-grid">{topCities.map((city) => <Link href={`/location-benne/${city.slug}`} key={city.slug}><span>{city.zip}</span><h3>{city.name}</h3><p>{city.department_name}</p><strong>Voir la page locale →</strong></Link>)}</div></div></section><section className="content-section"><div className="container local-two-columns"><div><span className="eyebrow">Préparer la logistique</span><h2>Une demande locale, pas un simple code postal</h2><p>À l’échelle d’une région, les écarts de distance, de relief, de circulation et d’accès sont importants. Le devis doit partir de l’adresse réelle du chantier et du centre de traitement mobilisable, jamais d’un tarif générique présenté comme garanti.</p><p>Indiquez le flux, le volume, les dates, la durée et les contraintes de manœuvre. Cette méthode donne au transporteur les informations nécessaires pour confirmer la faisabilité avant la réservation.</p></div><aside className="local-detail-card"><span>Parcours conseillé</span><h3>Région → département → commune</h3><p>Cette hiérarchie rend les pages locales faciles à parcourir et évite d’isoler des milliers de pages sans contexte territorial.</p><Link href="/departements">Voir l’annuaire des départements →</Link></aside></div></section></SiteShell>;
}
