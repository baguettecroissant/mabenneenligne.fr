import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, SiteShell } from "../../_components/SiteShell";
import { guides, type GuideSection } from "../data";

const baseUrl = "https://www.mabenneenligne.fr";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return {
    title: guide.seoTitle,
    description: guide.excerpt,
    authors: [{ name: "Rédaction MaBenneEnLigne", url: "/a-propos" }],
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.seoTitle,
      description: guide.excerpt,
      url: `${baseUrl}/guides/${guide.slug}`,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      authors: ["MaBenneEnLigne"],
      images: [{ url: guide.image, width: 1280, height: 720, alt: guide.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: guide.seoTitle, description: guide.excerpt, images: [guide.image] },
  };
}

function SectionContent({ section }: { section: GuideSection }) {
  return (
    <section id={section.id} className="guide-section">
      <h2>{section.title}</h2>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.bullets && <ul className="guide-checklist">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {section.table && <div className="guide-table-wrap"><table className="guide-table"><thead><tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>}
      {section.callout && <aside className={`guide-callout ${section.callout.tone ?? "info"}`}><strong>{section.callout.title}</strong><p>{section.callout.text}</p></aside>}
    </section>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const related = guides.filter((item) => item.slug !== guide.slug).slice(0, 3);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: [`${baseUrl}${guide.image}`],
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    wordCount: guide.wordCount,
    inLanguage: "fr-FR",
    mainEntityOfPage: `${baseUrl}/guides/${guide.slug}`,
    author: { "@type": "Organization", name: "Rédaction MaBenneEnLigne", url: `${baseUrl}/a-propos` },
    publisher: { "@type": "Organization", name: "MaBenneEnLigne", url: baseUrl },
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guide.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: baseUrl }, { "@type": "ListItem", position: 2, name: "Guides", item: `${baseUrl}/guides` }, { "@type": "ListItem", position: 3, name: guide.title, item: `${baseUrl}/guides/${guide.slug}` }] };
  return (
    <SiteShell>
      <PageHero image={guide.image} eyebrow={`${guide.category} · Guide expert ${guide.read}`} title={guide.title} text={guide.excerpt}>
        <div className="guide-byline"><span className="author-mark">MB</span><span><strong>Rédaction MaBenneEnLigne</strong><small>Relu par le pôle logistique · Mis à jour le 21 juillet 2026</small></span></div>
      </PageHero>
      <nav className="breadcrumb-bar" aria-label="Fil d’Ariane"><div className="container"><Link href="/">Accueil</Link><span>›</span><Link href="/guides">Guides</Link><span>›</span><strong>{guide.category}</strong></div></nav>
      <article className="guide-article">
        <div className="container guide-layout">
          <aside className="guide-toc">
            <strong>Dans ce guide</strong>
            <nav>{guide.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}<a href="#questions"><span>FAQ</span>Questions fréquentes</a></nav>
            <Link className="button button-small" href="/devis">Obtenir mon devis →</Link>
          </aside>
          <div className="guide-body">
            <section className="answer-box" aria-labelledby="reponse-courte"><span>La réponse en 30 secondes</span><h2 id="reponse-courte">L’essentiel</h2><p>{guide.quickAnswer}</p></section>
            <section className="takeaways"><h2>Ce qu’il faut retenir</h2><ul>{guide.takeaways.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul></section>
            {guide.sections.map((section) => <SectionContent section={section} key={section.id} />)}
            <section id="questions" className="guide-section guide-faq"><span className="eyebrow">Questions fréquentes</span><h2>Les réponses aux questions les plus posées</h2><div className="accordion">{guide.faq.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
            <section className="guide-method"><div className="author-mark">MB</div><div><span>À propos de ce guide</span><h2>Rédigé pour décider, pas pour remplir une page</h2><p>Ce contenu combine les retours opérationnels de notre réseau, les règles d’acceptation des filières et les sources publiques disponibles à la date de mise à jour. Les pratiques et tarifs locaux pouvant évoluer, le devis du transporteur et les consignes de l’autorité compétente restent déterminants.</p><Link href="/a-propos">Découvrir MaBenneEnLigne →</Link></div></section>
            <section className="guide-sources"><h2>Sources officielles et ressources utiles</h2><p>Ces références permettent de vérifier et approfondir les informations réglementaires présentées dans ce guide.</p><ul>{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<span>↗</span></a></li>)}</ul></section>
          </div>
        </div>
      </article>
      <section className="content-section alt related-guides"><div className="container"><div className="section-heading split"><div><span className="eyebrow">Pour aller plus loin</span><h2>Guides complémentaires</h2></div><Link className="text-link" href="/guides">Voir tous les guides →</Link></div><div className="article-grid">{related.map((item) => <Link className="article-card visual" href={`/guides/${item.slug}`} key={item.slug}><img src={item.image} alt="" loading="lazy" width="1280" height="720"/><div><small>{item.category} · {item.read}</small><h3>{item.title}</h3><p>{item.excerpt}</p><strong>Lire le guide →</strong></div></Link>)}</div></div></section>
      <CtaBand title="Besoin d’une réponse pour votre chantier ?" text="Décrivez vos déchets et votre accès : un conseiller vous recommande la benne et le prix adaptés." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </SiteShell>
  );
}
