import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../_components/SiteShell";
import { departments, formatPopulation, regions } from "../_data/local/geo";

export const metadata: Metadata = {
  title: "Location de benne par département — Annuaire France",
  description: "Accédez aux pages locales de location de benne par région, département et commune : prix indicatifs, accès, volumes et devis local.",
  alternates: { canonical: "/departements" },
};

export default function DepartmentsPage() {
  return (
    <SiteShell>
      <section className="page-hero local-hub-hero">
        <div className="container"><div className="page-hero-copy"><span className="eyebrow light">Annuaire national</span><h1>Location de benne par <em>département</em></h1><p>Parcourez une hiérarchie claire de la France vers votre commune. Chaque hub rassemble les villes, les repères de prix et les contraintes de pose utiles à votre chantier.</p><div className="hero-actions"><Link className="button" href="/devis">Vérifier mon adresse →</Link><Link className="button button-ghost" href="/regions">Voir les régions</Link></div></div></div>
      </section>
      <section className="hub-kpis"><div className="container"><div><strong>{regions.length}</strong><span>régions métropolitaines</span></div><div><strong>{departments.length}</strong><span>hubs départementaux</span></div><div><strong>34 746</strong><span>communes accessibles</span></div><div><strong>1</strong><span>demande de devis</span></div></div></section>
      <section className="content-section">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">Navigation territoriale</span><h2>Trouvez votre département</h2><p>Les départements sont regroupés par région afin de faciliter la navigation et de créer un maillage local compréhensible pour les utilisateurs comme pour les moteurs de recherche.</p></div>
          <div className="region-department-list">
            {regions.map((region) => <section key={region.slug} id={region.slug}><div className="region-line"><div><h3>{region.name}</h3><p>{region.departments.length} département{region.departments.length > 1 ? "s" : ""} · {formatPopulation(region.population)} habitants recensés</p></div><Link href={`/regions/${region.slug}`}>Voir le hub régional →</Link></div><div className="department-grid">{region.departments.map((department) => <Link className="department-card" href={`/departements/${department.slug}`} key={department.slug}><span className="department-code">{department.code}</span><strong>{department.name}<small>{department.cityCount} communes</small></strong></Link>)}</div></section>)}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
