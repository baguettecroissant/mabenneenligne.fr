import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../_components/SiteShell";
import { departmentGenitive, formatPopulation, getCitiesForDepartment, getDepartment, getRegion } from "../../_data/local/geo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const department = getDepartment(slug);
  if (!department) return {};
  return {
    title: `Location de benne — ${department.name} (${department.code})`,
    description: `Location de benne dans le département ${departmentGenitive(department)} : villes, prix indicatifs, volumes et conseils de pose. Devis local gratuit.`,
    alternates: { canonical: `/departements/${department.slug}` },
  };
}

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const department = getDepartment(slug);
  if (!department) notFound();
  const cities = getCitiesForDepartment(department.code);
  const region = getRegion(department.regionSlug);
  const popularCities = cities.slice(0, 12);
  const alphabetical = [...cities].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const groups = Map.groupBy(alphabetical, (city) => city.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").charAt(0).toUpperCase());
  const largeCities = cities.filter((city) => (city.population ?? 0) >= 10000).length;
  const average = department.cityCount ? Math.round(department.population / department.cityCount) : 0;
  const neighbors = region?.departments.filter((item) => item.code !== department.code).slice(0, 8) ?? [];
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Location de benne — ${department.name}`,
    description: `Annuaire des pages locales de location de benne pour les communes ${departmentGenitive(department)}.`,
    url: `https://www.mabenneenligne.fr/departements/${department.slug}`,
    about: { "@type": "AdministrativeArea", name: department.name },
    hasPart: popularCities.map((city) => ({ "@type": "WebPage", name: `Location de benne à ${city.name}`, url: `https://www.mabenneenligne.fr/location-benne/${city.slug}` })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="breadcrumb-bar" aria-label="Fil d’Ariane"><div className="container"><Link href="/">Accueil</Link><span>›</span><Link href="/regions">Régions</Link><span>›</span><Link href={`/regions/${department.regionSlug}`}>{department.region}</Link><span>›</span><strong>{department.name}</strong></div></nav>
      <section className="local-department-hero"><div className="container"><span className="eyebrow light">Département {department.code} · {department.region}</span><h1>Location de benne · <em>{department.name}</em></h1><p>Accédez aux informations de prix, de volume, de voirie et d’accès camion pour chacune des {department.cityCount} communes du département.</p><div className="hero-actions"><Link className="button" href={`/devis?departement=${department.code}`}>Obtenir un devis local →</Link><a className="button button-ghost" href="#villes">Choisir une ville</a></div></div></section>
      <section className="hub-kpis"><div className="container"><div><strong>{department.cityCount}</strong><span>communes</span></div><div><strong>{formatPopulation(department.population)}</strong><span>habitants recensés</span></div><div><strong>{largeCities}</strong><span>villes de plus de 10 000 habitants</span></div><div><strong>{formatPopulation(average)}</strong><span>habitants par commune en moyenne</span></div></div></section>
      <section className="content-section">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">Principales zones de demande</span><h2>Location de benne : villes {departmentGenitive(department)}</h2><p>Commencez par une ville importante ou consultez l’annuaire complet plus bas. Chaque page locale rattache la commune à son département et aux villes proches.</p></div>
          <div className="popular-city-grid">{popularCities.map((city) => <Link href={`/location-benne/${city.slug}`} key={city.slug}><span>{city.zip}</span><h3>{city.name}</h3><p>{city.population ? `${formatPopulation(city.population)} habitants` : "Données locales"}</p><strong>Prix et conseils locaux →</strong></Link>)}</div>
        </div>
      </section>
      <section className="content-section alt"><div className="container local-two-columns"><div><span className="eyebrow">Logistique départementale</span><h2>Bien préparer une demande locale</h2><p>Le coût réel dépend du trajet entre le dépôt du transporteur, l’adresse du chantier et la filière de traitement. Dans un département composé de nombreuses communes, la distance et l’accessibilité peuvent peser davantage que la taille de la ville.</p><p>Pour obtenir une réponse exploitable, indiquez le code postal, le type de déchets, le volume estimé, la durée, la largeur d’accès et l’emplacement prévu. Une photo depuis la voie d’accès évite la plupart des erreurs de véhicule ou de manœuvre.</p><Link className="text-link" href="/guides/prix-location-benne-2026">Comprendre la composition d’un prix →</Link></div><aside className="local-detail-card"><span>Règle commune</span><h3>Terrain privé ou domaine public ?</h3><p>Sur terrain privé, la pose est généralement plus simple. Sur une chaussée, une place ou un trottoir, l’autorisation dépend de la collectivité gestionnaire. Vérifiez la procédure avant de confirmer la date.</p><Link href="/guides/autorisation-voirie-benne">Guide de l’autorisation de voirie →</Link></aside></div></section>
      <section className="content-section" id="villes"><div className="container"><div className="section-heading"><span className="eyebrow">Annuaire complet</span><h2>Toutes les communes {departmentGenitive(department)}</h2><p>{department.cityCount} pages locales organisées par ordre alphabétique. Les petites communes restent accessibles même lorsqu’elles ne sont pas encore proposées à l’indexation.</p></div><div className="alphabetical-cities">{Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([letter, items]) => <section key={letter}><h3>{letter}</h3><div>{items.map((city) => <Link href={`/location-benne/${city.slug}`} key={city.slug}><strong>{city.name}</strong><span>{city.zip}</span></Link>)}</div></section>)}</div></div></section>
      {neighbors.length > 0 && <section className="content-section alt"><div className="container"><div className="section-heading"><span className="eyebrow">Maillage régional</span><h2>Autres départements en {department.region}</h2></div><div className="department-grid">{neighbors.map((item) => <Link className="department-card" href={`/departements/${item.slug}`} key={item.slug}><span className="department-code">{item.code}</span><strong>{item.name}<small>{item.cityCount} communes</small></strong></Link>)}</div><p className="local-center-link"><Link href={`/regions/${department.regionSlug}`}>Voir le hub de la région {department.region} →</Link></p></div></section>}
    </SiteShell>
  );
}
