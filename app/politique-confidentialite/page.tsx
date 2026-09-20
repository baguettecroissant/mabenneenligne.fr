import type { Metadata } from "next";
import { PageHero, SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment MaBenneEnLigne traite les données des demandes de devis et de partenariat.",
  alternates: { canonical: "/politique-confidentialite" },
};

export default function PrivacyPage() {
  return <SiteShell><PageHero eyebrow="Protection des données" title="Politique de confidentialité" text="Comment MaBenneEnLigne collecte, utilise et protège les données de vos demandes." /><article className="content-section"><div className="container legal">
    <p><strong>Dernière mise à jour : 20 septembre 2026.</strong></p>
    <h2>Responsable du traitement</h2><p>WADE STUDIO LTD, 432 Ave Bounty, Morcellement Balaclava, Mauritius, traite les données sous la marque MaBenneEnLigne. Contact : <a href="mailto:contact@mabenneenligne.fr">contact@mabenneenligne.fr</a>.</p>
    <h2>Données et finalités</h2><p>Les formulaires peuvent recueillir l’identité, l’e-mail, le téléphone, l’adresse ou la ville du chantier, le besoin de benne, les déchets, le volume, les dates et les informations de candidature partenaire. Ces données servent à répondre à une demande, établir un devis, vérifier la faisabilité, sélectionner un partenaire, organiser la prestation lorsqu’elle est confirmée, prévenir les abus et assurer le suivi administratif.</p>
    <h2>Base légale et destinataires</h2><p>Le traitement repose sur les mesures précontractuelles demandées par la personne, l’exécution d’un contrat lorsqu’il est conclu, les obligations légales applicables et l’intérêt légitime de WADE STUDIO LTD à sécuriser et améliorer son service. Les données sont accessibles aux équipes habilitées, à Supabase pour le stockage technique et, si nécessaire à votre demande, au loueur ou transporteur susceptible d’exécuter la prestation.</p>
    <p>Pour un chantier situé dans le Bas-Rhin (67), votre demande de devis est transmise exclusivement à Alsace Recycle, le partenaire destinataire de votre demande dans ce département. Dans les autres départements, elle est transmise à MaBenneEnLigne et aux partenaires nécessaires à son traitement.</p>
    <h2>Mesure des clics sur le contact téléphonique</h2><p>Les clics sur le contact téléphonique proposé pour le Bas-Rhin sont comptabilisés sans cookie. Seuls le domaine, le chemin de la page sans paramètres de recherche ni fragment, le type d’événement, le site source, le département et l’emplacement du lien sont envoyés à notre outil de mesure hébergé sur Supabase. Cette mesure est réalisée sans numéro de téléphone, coordonnées ni données saisies dans le formulaire. Elle ne conditionne pas l’ouverture de l’appel.</p>
    <h2>Durées de conservation</h2><p>Les demandes non suivies d’un contrat sont conservées pendant une durée proportionnée au traitement et au suivi commercial, en principe 24 mois après le dernier contact. Les documents contractuels et comptables sont conservés pendant les durées légales applicables. Les données sont supprimées ou anonymisées lorsqu’elles ne sont plus nécessaires.</p>
    <h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, l’opposition ou la portabilité de vos données, dans les limites prévues par la réglementation. Écrivez à <a href="mailto:contact@mabenneenligne.fr">contact@mabenneenligne.fr</a>. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL ou l’autorité de contrôle compétente de votre lieu de résidence.</p>
    <h2>Cookies</h2><p>À la date de cette mise à jour, le site ne dépose pas de cookies publicitaires ou de mesure d’audience non essentiels. Si des traceurs nécessitant le consentement sont ajoutés, une information et un mécanisme de choix seront mis en place avant leur activation.</p>
  </div></article></SiteShell>;
}
