import Link from "next/link";
import type { ReactNode } from "react";
import { ServicesMenu } from "./ServicesMenu";

const services = [
  ["Gravats & inertes", "/nos-services/location-benne-gravats"],
  ["DIB / Tout-venant", "/nos-services/location-benne-dib"],
  ["Déchets verts", "/nos-services/location-benne-dechets-verts"],
  ["Bois", "/nos-services/location-benne-bois"],
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`logo ${light ? "logo-light" : ""}`} href="/" aria-label="MaBenneEnLigne, accueil">
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>MaBenne<span>EnLigne</span></span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="topbar"><div className="container topbar-inner"><span>Livraison sous 24 à 48h</span><span>Service client du lundi au samedi</span><span>Paiement 100% sécurisé</span></div></div>
      <div className="container nav-wrap">
        <Logo />
        <nav className="desktop-nav" aria-label="Navigation principale">
          <ServicesMenu services={services} />
          <Link href="/tarifs">Tarifs</Link><Link href="/departements">Zones locales</Link><Link href="/comment-ca-marche">Comment ça marche</Link><Link href="/guides">Guides</Link>
        </nav>
        <div className="nav-actions"><a className="phone" href="tel:+33189000000"><span>☎</span><strong>01 89 00 00 00</strong></a><Link className="button button-small" href="/devis">Devis gratuit <span>→</span></Link></div>
        <details className="mobile-menu"><summary aria-label="Ouvrir le menu"><span /><span /><span /></summary><nav>{services.slice(0, 1).map(([label, href]) => <Link key={href} href="/nos-services">Nos services</Link>)}<Link href="/tarifs">Tarifs</Link><Link href="/regions">Régions</Link><Link href="/departements">Départements</Link><Link href="/comment-ca-marche">Comment ça marche</Link><Link href="/guides">Guides</Link><Link href="/devenir-partenaire">Devenir partenaire</Link><Link className="button" href="/devis">Devis gratuit</Link></nav></details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer"><div className="container footer-grid">
      <div className="footer-brand"><Logo light /><p>La plateforme n°1 de location de benne en ligne en France.</p><a href="tel:+33189000000">☎ 01 89 00 00 00</a><a href="mailto:contact@mabenneenligne.fr">✉ contact@mabenneenligne.fr</a><div className="trust-pill">✓ Service client 6j/7</div></div>
      <div><h3>Services</h3>{services.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/pro">Offre Pro</Link><Link href="/tarifs">Tarifs</Link></div>
      <div><h3>Zones locales</h3><Link href="/regions">Toutes les régions</Link><Link href="/departements">Tous les départements</Link><Link href="/notre-reseau">Notre réseau</Link><Link href="/devenir-partenaire">Devenir partenaire</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></div>
      <div><h3>Légal</h3><Link href="/mentions-legales">Mentions légales</Link><Link href="/cgu">CGV & CGU</Link><Link href="/politique-confidentialite">Confidentialité</Link><h3 className="footer-mini-title">Nos engagements</h3><span>Centres de traitement agréés</span><span>Transporteurs certifiés</span><span>Traçabilité des déchets</span></div>
    </div><div className="container footer-bottom"><span>© 2026 MaBenneEnLigne — Tous droits réservés</span><span>Un service national, au plus près de vos chantiers.</span></div></footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export function PageHero({ eyebrow, title, text, image, children }: { eyebrow?: string; title: ReactNode; text: string; image?: string; children?: ReactNode }) {
  return <section className={`page-hero ${image ? "page-hero-image" : ""}`} style={image ? { backgroundImage: `linear-gradient(90deg, rgba(11,29,46,.96) 0%, rgba(15,43,70,.82) 48%, rgba(15,43,70,.2) 100%), url(${image})` } : undefined}><div className="container"><div className="page-hero-copy">{eyebrow && <span className="eyebrow light">{eyebrow}</span>}<h1>{title}</h1><p>{text}</p>{children}</div></div></section>;
}

export function CtaBand({ title = "Prêt à réserver votre benne ?", text = "Recevez votre tarif exact et sans engagement pour votre ville.", secondary }: { title?: string; text?: string; secondary?: boolean }) {
  return <section className="cta-band"><div className="container"><div><span className="eyebrow light">Simple, rapide, transparent</span><h2>{title}</h2><p>{text}</p></div><div className="cta-actions"><Link className="button" href="/devis">Demander mon devis gratuit <span>→</span></Link>{secondary && <Link className="button button-ghost" href="/contact">Nous contacter</Link>}</div></div></section>;
}
