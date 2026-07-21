import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero, SiteShell } from "../_components/SiteShell";
import { guides } from "./data";

export const metadata: Metadata = {
  title: "Guides experts de la location de benne",
  description: "Guides complets sur les tailles de benne, les prix 2026, l’autorisation de voirie, le tri des déchets et les règles de chantier.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Le centre de ressources MaBenneEnLigne" title={<>Des réponses fiables pour <em>un chantier maîtrisé.</em></>} text="Des guides complets, sourcés et régulièrement mis à jour pour choisir votre benne, maîtriser votre budget et respecter les bonnes filières." />
      <section className="guide-hub-intro"><div className="container"><div><strong>7</strong><span>guides experts</span></div><div><strong>100%</strong><span>centrés sur vos décisions</span></div><div><strong>2026</strong><span>informations mises à jour</span></div><p>Chaque dossier apporte une réponse directe, des tableaux pratiques, des cas concrets, une FAQ et des liens vers les sources officielles.</p></div></section>
      <section className="content-section alt"><div className="container"><div className="section-heading split"><div><span className="eyebrow">Tous nos dossiers</span><h2>De la première question à l’enlèvement</h2></div><p>Commencez par le sujet qui correspond à votre besoin. Les guides sont reliés entre eux pour vous permettre d’approfondir sans refaire votre recherche.</p></div><div className="article-grid guide-index-grid">{guides.map((guide) => <Link className="article-card visual" href={`/guides/${guide.slug}`} key={guide.slug}><img src={guide.image} alt={guide.imageAlt} loading="lazy" width="1280" height="720"/><div><small>{guide.category} · {guide.read}</small><h2>{guide.title}</h2><p>{guide.excerpt}</p><span>{guide.wordCount.toLocaleString("fr-FR")} mots · Mis à jour en 2026</span><strong>Lire le guide complet →</strong></div></Link>)}</div></div></section>
      <section className="content-section"><div className="container split-content"><div><span className="eyebrow">Notre exigence éditoriale</span><h2>Utile avant d’être optimisé.</h2><p>Nos contenus répondent d’abord aux décisions concrètes d’un particulier, d’un artisan ou d’un responsable de chantier. Ils sont structurés pour être compris rapidement, citables et faciles à vérifier.</p></div><div className="feature-list">{["Une réponse courte dès le début de chaque guide","Des explications détaillées sans jargon inutile","Des tableaux et cas pratiques directement exploitables","Des sources officielles françaises clairement indiquées","Une date de mise à jour et une responsabilité éditoriale visibles"].map((item) => <div key={item}><span>✓</span><strong>{item}</strong></div>)}</div></div></section>
      <CtaBand />
    </SiteShell>
  );
}
