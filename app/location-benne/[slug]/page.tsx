import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../_components/SiteShell";
import { getCityFaq, getEstimatedPrices, getLocalProfile } from "../../_data/local/content";
import {
  formatDepartmentLabel,
  formatPopulation,
  departmentGenitive,
  getCity,
  getCitiesForDepartment,
  getDepartmentByCode,
  getNearbyCities,
  isIndexableCity,
} from "../../_data/local/geo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  const department = getDepartmentByCode(city.department_code);
  if (!department) return {};
  const indexable = isIndexableCity(city);
  return {
    title: `Location de benne à ${city.name} (${city.zip}) — Prix & devis`,
    description: `Location de benne à ${city.name} : prix indicatifs, volumes, déchets acceptés, accès camion et autorisation de voirie. Devis local gratuit.`,
    alternates: { canonical: `/location-benne/${city.slug}` },
    robots: { index: indexable, follow: true },
    openGraph: {
      title: `Location de benne à ${city.name}`,
      description: `Préparez votre location de benne à ${city.name} avec des repères de prix, de volume et d’accès adaptés à la commune.`,
      url: `/location-benne/${city.slug}`,
      images: [{ url: "/og.png", width: 1792, height: 1024, alt: `Location de benne à ${city.name}` }],
    },
  };
}

function price(value: number | null) {
  return value === null ? "Sur étude" : `dès ${value} €`;
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  const department = getDepartmentByCode(city.department_code);
  if (!department) notFound();

  const profile = getLocalProfile(city, department);
  const prices = getEstimatedPrices(profile);
  const nearby = getNearbyCities(city, 8);
  const departmentCities = getCitiesForDepartment(city.department_code);
  const populationRank = departmentCities.findIndex((item) => item.slug === city.slug) + 1;
  const faq = getCityFaq(city, department, profile);
  const quoteHref = `/devis?ville=${encodeURIComponent(city.name)}&codePostal=${city.zip}`;
  const population = city.population ? `${formatPopulation(city.population)} habitants` : "population à confirmer";
  const minimumPrice = Math.min(...prices.flatMap((row) => [row.gravats, row.melanges, row.verts]).filter((value): value is number => value !== null));

  const breadcrumbs = [
    { name: "Accueil", item: "https://www.mabenneenligne.fr" },
    { name: "Régions", item: "https://www.mabenneenligne.fr/regions" },
    { name: department.region, item: `https://www.mabenneenligne.fr/regions/${department.regionSlug}` },
    { name: formatDepartmentLabel(department), item: `https://www.mabenneenligne.fr/departements/${department.slug}` },
    { name: city.name, item: `https://www.mabenneenligne.fr/location-benne/${city.slug}` },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Location de benne à ${city.name}`,
      serviceType: "Location de benne et évacuation de déchets",
      description: `Service de mise en relation pour la location de benne à ${city.name}, ${department.name}.`,
      provider: { "@type": "Organization", name: "MaBenneEnLigne", url: "https://www.mabenneenligne.fr" },
      areaServed: {
        "@type": "City",
        name: city.name,
        postalCode: city.zip,
        containedInPlace: { "@type": "AdministrativeArea", name: department.name },
      },
      offers: { "@type": "Offer", priceCurrency: "EUR", price: minimumPrice, url: `https://www.mabenneenligne.fr${quoteHref}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
    },
  ];

  return (
    <SiteShell>
      {schema.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }} />
      ))}

      <nav className="breadcrumb-bar" aria-label="Fil d’Ariane">
        <div className="container">
          <Link href="/">Accueil</Link><span>›</span>
          <Link href="/regions">Régions</Link><span>›</span>
          <Link href={`/departements/${department.slug}`}>{department.name}</Link><span>›</span>
          <strong>{city.name}</strong>
        </div>
      </nav>

      <section className="local-hero">
        <div className="container local-hero-grid">
          <div>
            <span className="eyebrow light">{city.zip} · {profile.scaleLabel} · {department.region}</span>
            <h1>Location de benne à <em>{city.name}</em></h1>
            <p>{profile.intro} Comparez une offre tout compris, avec livraison, enlèvement et traitement clairement détaillés.</p>
            <div className="hero-actions">
              <Link className="button button-large" href={quoteHref}>Recevoir mon prix à {city.name} →</Link>
              <a className="button button-ghost" href="#prix">Voir les prix indicatifs</a>
            </div>
            <div className="local-trust"><span>✓ Devis gratuit</span><span>✓ Réponse locale</span><span>✓ Filières autorisées</span></div>
          </div>
          <aside className="local-summary" aria-label={`Repères pour ${city.name}`}>
            <span>Repères locaux</span>
            <dl>
              <div><dt>Commune</dt><dd>{city.name}</dd></div>
              <div><dt>Code{city.postalCodes.length > 1 ? "s" : ""} postal{city.postalCodes.length > 1 ? "aux" : ""}</dt><dd>{city.postalCodes.length > 3 ? `${city.postalCodes[0]} à ${city.postalCodes.at(-1)}` : city.postalCodes.join(", ")}</dd></div>
              <div><dt>Code INSEE</dt><dd>{city.inseeCode}</dd></div>
              <div><dt>Population</dt><dd>{population}</dd></div>
              <div><dt>Département</dt><dd>{department.name} ({department.code})</dd></div>
              <div><dt>Budget indicatif</dt><dd>à partir de {minimumPrice} €</dd></div>
            </dl>
            <small>Tarif à confirmer selon l’adresse, le déchet, le poids et la disponibilité.</small>
          </aside>
        </div>
      </section>

      <section className="local-answer">
        <div className="container">
          <div><span>01</span><p><strong>Choisissez le flux</strong>Gravats, déchets mélangés, bois ou déchets verts ne suivent pas le même tarif.</p></div>
          <div><span>02</span><p><strong>Validez l’accès</strong>Le camion doit pouvoir entrer, reculer, déposer puis reprendre la benne en sécurité.</p></div>
          <div><span>03</span><p><strong>Comparez le total</strong>Vérifiez poids inclus, durée, transport, traitement et éventuels suppléments.</p></div>
        </div>
      </section>

      <section className="local-context-strip">
        <div className="container">
          <div><span>Contexte communal</span><strong>{city.population ? `${formatPopulation(city.population)} habitants` : "Donnée démographique non disponible"}</strong><p>{populationRank > 0 ? `${city.name} occupe le rang ${populationRank} sur ${department.cityCount} communes du département par population.` : `Commune rattachée au département ${department.name}.`}</p></div>
          <div><span>Proximité réelle</span><strong>{nearby.slice(0, 3).map((item) => item.city.name).join(" · ")}</strong><p>{nearby.slice(0, 3).map((item) => `${item.city.name} à environ ${item.distance} km`).join(", ")}.</p></div>
          <div><span>Repères administratifs</span><strong>{city.postalCodes.length > 1 ? `${city.postalCodes.length} codes postaux` : city.zip}</strong><p>Code INSEE {city.inseeCode} · région {department.region}.</p></div>
        </div>
      </section>

      <section className="content-section" id="prix">
        <div className="container local-content-grid">
          <div className="local-main">
            <div className="section-heading">
              <span className="eyebrow">Budget 2026 · estimation transparente</span>
              <h2>Quel prix pour une benne à {city.name} ?</h2>
              <p>Ces montants servent à cadrer le budget. Le prix final dépend de la distance au dépôt et au centre de traitement, du tonnage inclus, du flux et des conditions d’accès.</p>
            </div>
            <div className="local-table-wrap">
              <table className="local-price-table">
                <thead><tr><th>Volume</th><th>Gravats triés</th><th>Déchets mélangés</th><th>Déchets verts</th><th>Projet type</th></tr></thead>
                <tbody>{prices.map((row) => <tr key={row.volume}><th>{row.volume}</th><td>{price(row.gravats)}</td><td>{price(row.melanges)}</td><td>{price(row.verts)}</td><td>{row.usage}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="local-note"><strong>À comparer sur chaque devis</strong><p>Transport aller-retour, durée de mise à disposition, poids compris, prix de la tonne supplémentaire, traitement, attente du camion et autorisation éventuelle.</p></div>
          </div>
          <aside className="local-aside">
            <span className="eyebrow">Réponse rapide</span>
            <h2>Le bon réflexe à {city.name}</h2>
            <p>Décrivez le chantier, joignez deux photos de l’accès et séparez les gravats des autres déchets. Vous obtiendrez un devis plus précis et plus simple à comparer.</p>
            <Link className="button" href={quoteHref}>Demander le tarif exact →</Link>
          </aside>
        </div>
      </section>

      <section className="content-section alt">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Dimensionnement utile</span>
            <h2>Quelle benne choisir pour votre projet ?</h2>
            <p>Le volume dépend moins de la surface du chantier que de la nature, de la densité et du niveau de tri des déchets.</p>
          </div>
          <div className="local-project-grid">
            {profile.likelyProjects.map((project, index) => {
              const values = [
                { volume: "8–10 m³", waste: "gravats ou déchets triés", tip: "Idéal pour un chantier ciblé ; surveillez surtout le poids des matériaux inertes." },
                { volume: "15 m³", waste: "encombrants et second œuvre", tip: "Bon compromis pour un débarras ou une rénovation de plusieurs pièces." },
                { volume: "15–20 m³", waste: "bois, plâtre, mobilier", tip: "Triez les flux valorisables pour limiter le coût de traitement." },
                { volume: "20–30 m³", waste: "déchets légers volumineux", tip: "Réservé aux matériaux peu denses ; les gravats ne vont pas en 30 m³." },
              ][index];
              return <article className="local-project-card" key={project}><span>Cas {index + 1}</span><h3>{project}</h3><strong>{values.volume}</strong><p>{values.waste}</p><small>{values.tip}</small></article>;
            })}
          </div>
          <p className="local-center-link">Besoin d’un calcul plus précis ? <Link href="/guides/choisir-taille-benne">Consultez le guide des volumes →</Link></p>
        </div>
      </section>

      <section className="content-section">
        <div className="container local-two-columns">
          <div>
            <span className="eyebrow">Livraison à {city.name}</span>
            <h2>Préparer l’accès du camion et l’emplacement</h2>
            <p>{profile.logistics}</p>
            <p>{profile.accessAdvice}</p>
            <ul className="local-checklist">
              <li>Surface plane, stable et sans réseau fragile sous la zone de pose</li>
              <li>Largeur, hauteur et longueur de recul communiquées au transporteur</li>
              <li>Absence de véhicule, câble, branche ou mobilier dans la zone de manœuvre</li>
              <li>Adresse et contact sur place confirmés avant le créneau</li>
            </ul>
          </div>
          <aside className="local-detail-card">
            <span>Conseil saisonnier</span>
            <h3>Maintenir l’accès jusqu’à l’enlèvement</h3>
            <p>{profile.seasonalAdvice}</p>
            <hr />
            <span>Domaine public</span>
            <h3>Autorisation à vérifier en mairie</h3>
            <p>Si la benne occupe une rue, une place ou un trottoir, demandez les conditions locales avant de réserver. Le délai et la signalisation peuvent varier.</p>
            <Link href="/guides/autorisation-voirie-benne">Comprendre la démarche →</Link>
          </aside>
        </div>
      </section>

      <section className="content-section dark">
        <div className="container">
          <div className="section-heading light centered"><span className="eyebrow light">Tri et conformité</span><h2>Ce qui va dans la benne… et ce qui doit rester à part</h2><p>Un tri correct évite les refus, améliore la valorisation et rend le devis plus fiable.</p></div>
          <div className="waste-rules-grid">
            <article><span className="waste-good">Accepté selon la benne</span><h3>Flux courants</h3><ul><li>Béton, briques, tuiles et pierres propres</li><li>Bois, métal, plastiques et cartons</li><li>Mobilier et encombrants non dangereux</li><li>Branches, feuilles, tontes et tailles</li></ul></article>
            <article><span className="waste-warn">À déclarer avant devis</span><h3>Flux particuliers</h3><ul><li>Plâtre et isolants</li><li>Terres, souches et gros troncs</li><li>Pneus et équipements électriques</li><li>Matériaux très lourds ou très longs</li></ul></article>
            <article><span className="waste-stop">Benne standard interdite</span><h3>Déchets dangereux</h3><ul><li>Amiante et matériaux suspects</li><li>Peintures liquides, solvants et huiles</li><li>Bouteilles de gaz et batteries</li><li>Déchets médicaux ou chimiques</li></ul></article>
          </div>
          <div className="local-dark-links"><Link href="/guides/tri-dechets-chantier">Guide du tri →</Link><Link href="/guides/dechets-interdits-benne">Liste des déchets interdits →</Link><Link href="/guides/dib-vs-gravats">DIB ou gravats ? →</Link></div>
        </div>
      </section>

      <section className="content-section alt">
        <div className="container local-two-columns local-process">
          <div>
            <span className="eyebrow">Une demande exploitable</span>
            <h2>Obtenir un devis fiable à {city.name}</h2>
            <ol>
              <li><span>1</span><div><strong>Décrivez le projet</strong><p>Adresse, dates souhaitées, type de travaux et nature exacte des déchets.</p></div></li>
              <li><span>2</span><div><strong>Documentez l’accès</strong><p>Photos depuis la rue, largeur du portail et emplacement de la benne.</p></div></li>
              <li><span>3</span><div><strong>Validez le prix complet</strong><p>Transport, traitement, poids, durée et conditions d’annulation.</p></div></li>
              <li><span>4</span><div><strong>Préparez la pose</strong><p>Zone dégagée, autorisation obtenue et contact disponible sur place.</p></div></li>
            </ol>
          </div>
          <aside className="local-quote-card"><span>{city.zip}</span><h3>Recevez un tarif adapté à votre adresse</h3><p>Votre demande est transmise avec les informations utiles pour vérifier la couverture autour de {city.name}.</p><Link className="button" href={quoteHref}>Démarrer mon devis →</Link><small>Gratuit et sans engagement.</small></aside>
        </div>
      </section>

      <section className="content-section">
        <div className="container local-faq">
          <div className="section-heading"><span className="eyebrow">Questions locales</span><h2>FAQ — Location de benne à {city.name}</h2><p>Les réponses essentielles avant de réserver dans le département {departmentGenitive(department)}.</p></div>
          <div className="accordion">{faq.map((item, index) => <details key={item.question} open={index === 0}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="content-section alt local-nearby">
        <div className="container">
          <div className="section-heading split"><div><span className="eyebrow">Maillage de proximité</span><h2>Location de benne autour de {city.name}</h2></div><p>Explorez les communes les plus proches ou revenez au hub départemental pour comparer les zones couvertes.</p></div>
          <div className="nearby-grid">{nearby.map(({ city: nearCity, distance }) => <Link href={`/location-benne/${nearCity.slug}`} key={nearCity.slug}><strong>{nearCity.name}</strong><span>{nearCity.zip}</span><small>environ {distance} km</small></Link>)}</div>
          <div className="hub-links"><Link href={`/departements/${department.slug}`}>Toutes les villes {departmentGenitive(department)} →</Link><Link href={`/regions/${department.regionSlug}`}>Toute la région {department.region} →</Link></div>
        </div>
      </section>

      <section className="local-method">
        <div className="container"><strong>Méthode éditoriale locale</strong><p>Cette page combine les données géographiques de la commune, sa place dans le département, sa population indicative et la proximité des communes voisines. Les prix restent des repères : seule l’adresse complète permet de confirmer la desserte et le tarif.</p><a href="https://geo.api.gouv.fr/decoupage-administratif/communes" target="_blank" rel="noreferrer">Référentiel public des communes ↗</a></div>
      </section>
    </SiteShell>
  );
}
