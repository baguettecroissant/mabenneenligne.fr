import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../_components/SiteShell";
import { formatPopulation, regions } from "../_data/local/geo";

export const metadata: Metadata = {
  title: "Location de benne par région en France",
  description: "Explorez les hubs régionaux de MaBenneEnLigne puis accédez à votre département et à votre commune.",
  alternates: { canonical: "/regions" },
};

export default function RegionsPage() {
  return <SiteShell><section className="page-hero local-hub-hero"><div className="container"><div className="page-hero-copy"><span className="eyebrow light">France métropolitaine</span><h1>Location de benne par <em>région</em></h1><p>Les hubs régionaux structurent la couverture locale et facilitent le passage vers le bon département, puis vers la page de votre commune.</p><div className="hero-actions"><Link className="button" href="/departements">Voir tous les départements →</Link></div></div></div></section><section className="content-section"><div className="container"><div className="section-heading"><span className="eyebrow">13 hubs régionaux</span><h2>Choisissez votre région</h2><p>Chaque hub présente les départements, les principales villes et les points de vigilance logistiques utiles à la location d’une benne.</p></div><div className="region-card-grid">{regions.map((region) => <Link href={`/regions/${region.slug}`} key={region.slug}><span>{region.departments.length} département{region.departments.length > 1 ? "s" : ""}</span><h2>{region.name}</h2><p>{region.cityCount} communes · {formatPopulation(region.population)} habitants</p><strong>Explorer la région →</strong></Link>)}</div></div></section></SiteShell>;
}
