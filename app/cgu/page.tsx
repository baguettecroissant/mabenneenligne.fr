import type { Metadata } from "next";
import { PageHero, SiteShell } from "../_components/SiteShell";

export const metadata: Metadata = {
  title: "CGV et CGU",
  description: "Conditions générales d’utilisation et cadre des demandes de devis MaBenneEnLigne.",
  alternates: { canonical: "/cgu" },
};

export default function TermsPage() {
  return <SiteShell><PageHero eyebrow="Cadre contractuel" title="CGV et CGU" text="Les règles d’utilisation du site et le cadre applicable aux demandes de devis de location de benne." /><article className="content-section"><div className="container legal">
    <p><strong>Dernière mise à jour : 21 juillet 2026.</strong></p>
    <h2>1. Objet et champ d’application</h2>
    <p>Les présentes conditions générales d’utilisation (CGU) encadrent l’accès au site mabenneenligne.fr. Elles précisent également le cadre des demandes de devis adressées à WADE STUDIO LTD sous la marque MaBenneEnLigne. Elles s’appliquent aux particuliers comme aux professionnels, sous réserve des dispositions impératives qui leur sont respectivement applicables.</p>
    <h2>2. Demande de devis : aucun achat en ligne</h2>
    <p>Le site permet de décrire un besoin de location de benne et de demander une réponse par e-mail. L’envoi du formulaire est gratuit, sans engagement, et ne constitue ni une commande, ni une réservation, ni une acceptation de prix. Aucune prestation et aucun paiement ne sont conclus directement sur le site à ce stade.</p>
    <p>Lorsqu’une prestation est possible, un devis ou un document contractuel précise notamment le prestataire, le prix, les taxes applicables, les déchets acceptés, le tonnage éventuel, la durée, les conditions de pose et d’enlèvement, les délais et les modalités de règlement. Le contrat ne naît qu’après l’acceptation expresse de ce document selon les modalités qu’il prévoit.</p>
    <h2>3. Informations transmises</h2>
    <p>L’utilisateur s’engage à fournir des informations exactes, complètes et à jour. L’adresse de pose, l’accès pour le véhicule, le type de déchets, le volume estimé et les dates souhaitées sont déterminants pour la faisabilité et le prix. Toute information inexacte ou modification du chantier peut nécessiter un nouveau chiffrage ou rendre la prestation impossible.</p>
    <h2>4. Déchets, accès et autorisations</h2>
    <p>Le client doit respecter le flux de déchets déclaré et les consignes communiquées. Les déchets dangereux, l’amiante, les produits chimiques, les batteries, les bouteilles de gaz et tout déchet non admis par le partenaire sont exclus sauf accord écrit spécifique. Le client garantit un accès sûr et praticable pour le véhicule et obtient, lorsque nécessaire, les autorisations d’occupation du domaine public. Le prestataire peut refuser ou interrompre une pose dangereuse ou non conforme.</p>
    <h2>5. Prix, surcharges, report et annulation</h2>
    <p>Les informations « à partir de » du site sont indicatives. Le devis validé fixe le prix et les prestations incluses. Il peut prévoir une facturation complémentaire notamment en cas de déchets non conformes, de surcharge pondérale, de durée excédentaire, de déplacement inutile, d’accès impossible ou de formalités non obtenues. Les règles de report et d’annulation applicables à une réservation sont indiquées dans le devis ou le document contractuel ; elles tiennent compte de la mobilisation du partenaire.</p>
    <h2>6. Responsabilités</h2>
    <p>MaBenneEnLigne s’efforce de présenter un service fiable et des informations utiles. La disponibilité, les délais et la faisabilité restent toutefois dépendants du partenaire local, des contraintes de chantier, de la voirie, de la météo et de l’acceptation des déchets. Rien dans ces conditions ne limite les droits impératifs du consommateur ni la responsabilité qui ne pourrait être exclue par la loi.</p>
    <h2>7. Données personnelles</h2>
    <p>Les données des formulaires sont traitées pour gérer la demande, préparer une offre et, le cas échéant, la transmettre au partenaire capable de l’exécuter. Les modalités, les droits des personnes et les contacts sont détaillés dans la <a href="/politique-confidentialite">politique de confidentialité</a>.</p>
    <h2>8. Propriété intellectuelle et utilisation du site</h2>
    <p>L’utilisateur s’interdit de perturber le fonctionnement du site, d’extraire systématiquement ses contenus ou d’utiliser les formulaires à des fins frauduleuses, publicitaires ou contraires à la loi. Les contenus du site sont protégés ; leur réutilisation nécessite une autorisation préalable écrite.</p>
    <h2>9. Droit applicable et litiges</h2>
    <p>Les présentes conditions sont soumises au droit applicable au contrat concerné. Pour les consommateurs résidant en France, les règles protectrices impératives du droit français demeurent applicables. En cas de difficulté, écrivez d’abord à <a href="mailto:contact@mabenneenligne.fr">contact@mabenneenligne.fr</a> afin de rechercher une solution amiable. À défaut, les juridictions compétentes sont déterminées par les règles légales applicables.</p>
    <h2>10. Modification des conditions</h2>
    <p>Les CGU peuvent être mises à jour pour tenir compte d’une évolution du site ou de la réglementation. La version applicable est celle publiée à la date de consultation ; un contrat déjà conclu reste régi par les documents acceptés lors de sa conclusion.</p>
  </div></article></SiteShell>;
}
