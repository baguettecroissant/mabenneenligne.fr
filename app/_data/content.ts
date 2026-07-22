export const prices = [
  { volume: "8 m³", gravats: "349 €", dib: "449 €", verts: "319 €", bois: "349 €" },
  { volume: "10 m³", gravats: "389 €", dib: "499 €", verts: "369 €", bois: "389 €" },
  { volume: "15 m³", gravats: "519 €", dib: "679 €", verts: "479 €", bois: "519 €" },
  { volume: "20 m³", gravats: "629 €", dib: "779 €", verts: "599 €", bois: "629 €" },
  { volume: "30 m³", gravats: "799 €", dib: "1 099 €", verts: "—", bois: "799 €" },
];
export const departments = [
  { slug: "nord-59", name: "Nord", code: "59", cities: ["Lille", "Roubaix", "Tourcoing", "Dunkerque", "Valenciennes"], status: "immédiate" },
  { slug: "pas-de-calais-62", name: "Pas-de-Calais", code: "62", cities: ["Arras", "Calais", "Lens", "Boulogne-sur-Mer", "Béthune"], status: "immédiate" },
  { slug: "loiret-45", name: "Loiret", code: "45", cities: ["Orléans", "Montargis", "Gien", "Fleury-les-Aubrais"], status: "immédiate" },
  { slug: "rhone-69", name: "Rhône", code: "69", cities: ["Lyon", "Villeurbanne", "Vénissieux", "Bron"], status: "immédiate" },
  { slug: "gironde-33", name: "Gironde", code: "33", cities: ["Bordeaux", "Mérignac", "Pessac", "Libourne"], status: "active" },
  { slug: "loire-atlantique-44", name: "Loire-Atlantique", code: "44", cities: ["Nantes", "Saint-Nazaire", "Rezé", "Orvault"], status: "active" },
  { slug: "bouches-du-rhone-13", name: "Bouches-du-Rhône", code: "13", cities: ["Marseille", "Aix-en-Provence", "Arles", "Aubagne"], status: "active" },
  { slug: "haute-garonne-31", name: "Haute-Garonne", code: "31", cities: ["Toulouse", "Colomiers", "Blagnac", "Muret"], status: "active" },
];
export const faqs = [
  ["Combien coûte la location d’une benne ?", "Nos tarifs démarrent à 319 € HT et varient selon le volume, le type de déchet et votre ville. Le devis reçu est tout compris : livraison, 7 jours de location, enlèvement et traitement."],
  ["Quel délai prévoir pour la livraison ?", "Dans les zones couvertes, une livraison sous 24 à 48 heures est généralement possible, sous réserve de disponibilité et d’accès au chantier."],
  ["Faut-il une autorisation de voirie ?", "Oui, si la benne est posée sur la voie publique. La demande se fait auprès de votre mairie, idéalement 8 à 15 jours avant la pose."],
  ["Que se passe-t-il si je dépasse le tonnage inclus ?", "Le tonnage supplémentaire est facturé selon le type de déchet et le tarif du centre de traitement. Votre conseiller vous précise les seuils avant validation."],
  ["Quels déchets sont interdits ?", "L’amiante, les produits chimiques, peintures, solvants, batteries, pneus et déchets médicaux ne doivent jamais être déposés dans une benne standard."],
  ["Comment fonctionne le paiement ?", "Après validation du devis, le paiement sécurisé réserve définitivement votre benne et déclenche la mission du transporteur."],
];
export const services = {
  "location-benne-gravats": { title: "Location de benne pour gravats", short: "Gravats & inertes", waste: "Béton, briques, tuiles, pierres et terres non polluées", image: "/services/gravats.png" },
  "location-benne-dib": { title: "Location de benne DIB / Tout-venant", short: "DIB / Tout-venant", waste: "Plâtre, isolants, meubles, plastiques et déchets de rénovation", image: "/services/dib.png" },
  "location-benne-dechets-verts": { title: "Location de benne pour déchets verts", short: "Déchets verts", waste: "Branches, tailles, feuilles, tontes et résidus de jardin", image: "/services/dechets-verts.png" },
  "location-benne-bois": { title: "Location de benne pour bois", short: "Bois", waste: "Palettes, charpentes, menuiseries et chutes de bois non traité", image: "/services/bois.png" },
};
