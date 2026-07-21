import type { Metadata } from "next";
import { PageHero, SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales, données personnelles et informations d’édition de MaBenneEnLigne.",
  alternates: { canonical: "/mentions-legales" },
};

export default function LegalPage() {
  return <SiteShell><PageHero eyebrow="Informations légales" title="Mentions légales" text="Les informations d’identification et les règles applicables à l’utilisation du site mabenneenligne.fr." /><article className="content-section"><div className="container legal">
    <p><strong>Dernière mise à jour : 21 juillet 2026.</strong></p>
    <h2>1. Éditeur du site</h2>
    <p>Le site <strong>mabenneenligne.fr</strong> est exploité sous la marque MaBenneEnLigne par :</p>
    <p><strong>WADE STUDIO LTD</strong><br />Private Company Limited by Shares<br />432 Ave Bounty, Morcellement Balaclava, Mauritius<br />N° d’immatriculation : C227533<br />Directeur de la publication : WADE STUDIO LTD<br />Contact : <a href="mailto:contact@mabenneenligne.fr">contact@mabenneenligne.fr</a></p>
    <h2>2. Hébergement et outils techniques</h2>
    <p>Le site est hébergé sur l’infrastructure de la plateforme OpenAI Sites. Les demandes formulées sur le site sont enregistrées dans l’outil Supabase, utilisé pour le stockage sécurisé et le traitement des informations nécessaires à la demande de devis ou de partenariat.</p>
    <h2>3. Rôle de MaBenneEnLigne</h2>
    <p>MaBenneEnLigne présente des informations sur la location de bennes et recueille des demandes de devis. Selon la zone et le besoin, WADE STUDIO LTD peut intervenir comme intermédiaire de mise en relation et de coordination avec un loueur ou transporteur indépendant. Les modalités exactes de la prestation, le partenaire intervenant, les déchets admis, le prix, les délais et les éventuelles contraintes de pose sont précisés dans le devis ou le document contractuel correspondant.</p>
    <h2>4. Prix, contenus et disponibilité</h2>
    <p>Les prix, délais, zones desservies et informations publiés sur le site sont indicatifs et peuvent évoluer selon l’adresse, le type de déchets, le volume, l’accès au chantier, la durée d’immobilisation et les capacités locales. Une demande envoyée depuis le site ne vaut ni devis accepté, ni réservation, ni contrat. Seuls les documents écrits transmis pour une demande donnée fixent les conditions applicables.</p>
    <h2>5. Propriété intellectuelle</h2>
    <p>La structure du site, les textes, visuels, marques, logos, bases de données et autres éléments qui le composent sont protégés par les droits de propriété intellectuelle. Toute reproduction, représentation, adaptation ou extraction non autorisée est interdite, sauf exceptions prévues par la loi.</p>
    <h2>6. Données personnelles</h2>
    <p>Les données envoyées via les formulaires sont traitées par WADE STUDIO LTD pour répondre à la demande, établir un devis, sélectionner un partenaire pertinent, coordonner la prestation lorsqu’elle est confirmée et assurer le suivi administratif. Les destinataires sont les équipes habilitées de WADE STUDIO LTD, ses prestataires techniques et, lorsque cela est nécessaire à la demande, le loueur ou transporteur concerné.</p>
    <p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, l’opposition ou la portabilité de vos données en écrivant à <a href="mailto:contact@mabenneenligne.fr">contact@mabenneenligne.fr</a>. Vous pouvez aussi introduire une réclamation auprès de l’autorité de contrôle compétente, notamment la CNIL pour les personnes concernées en France. Les détails sont disponibles dans notre <a href="/politique-confidentialite">politique de confidentialité</a>.</p>
    <h2>7. Liens externes et responsabilité</h2>
    <p>Les liens vers des sites tiers sont fournis à titre informatif. WADE STUDIO LTD ne contrôle pas leur contenu ni leurs pratiques. Malgré le soin apporté aux informations publiées, le site ne peut garantir l’absence totale d’erreur ou d’indisponibilité ; il ne remplace pas l’analyse du chantier et les documents contractuels transmis avant toute prestation.</p>
  </div></article></SiteShell>;
}
