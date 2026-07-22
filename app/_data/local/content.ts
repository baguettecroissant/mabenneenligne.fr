import type { City, Department } from "./geo";
import { departmentGenitive } from "./geo";

export type LocalProfile = {
  scale: "rural" | "bourg" | "ville" | "agglomeration" | "metropole";
  scaleLabel: string;
  intro: string;
  logistics: string;
  accessAdvice: string;
  seasonalAdvice: string;
  likelyProjects: string[];
  priceFactor: number;
};

const overseasRegions = new Set([
  "Guadeloupe",
  "Guyane",
  "La Réunion",
  "Martinique",
  "Mayotte",
  "Polynésie française",
  "Saint-Pierre-et-Miquelon",
  "Wallis-et-Futuna",
]);

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result);
}

function choose<T>(items: T[], city: City, offset = 0) {
  return items[(hash(city.slug) + offset) % items.length];
}

export function getLocalProfile(city: City, department: Department): LocalProfile {
  const population = city.population ?? 0;
  const scale = population >= 150000 ? "metropole" : population >= 40000 ? "agglomeration" : population >= 10000 ? "ville" : population >= 2000 ? "bourg" : "rural";

  const intros = {
    rural: [
      `À ${city.name}, la location d’une benne devient pertinente dès qu’un chantier dépasse quelques trajets en remorque : rénovation d’un bâti ancien, débarras d’une dépendance ou entretien d’une grande parcelle.`,
      `Pour un chantier à ${city.name}, une benne évite de multiplier les allers-retours et permet de regrouper l’évacuation des déchets sur un seul créneau, sous réserve de confirmer la desserte avec le transporteur.`,
    ],
    bourg: [
      `À ${city.name}, les demandes concernent aussi bien les rénovations de maisons que les débarras, l’entretien extérieur et les petits chantiers d’artisans. Le bon devis dépend surtout du flux de déchets et de l’accès réel à l’adresse de pose.`,
      `La location de benne à ${city.name} répond aux projets qui produisent trop de déchets pour une voiture ou une remorque. Le tri en amont et un emplacement accessible sont les deux leviers les plus efficaces pour maîtriser le coût.`,
    ],
    ville: [
      `À ${city.name}, il faut arbitrer entre volume utile, contraintes de stationnement et accès du camion. Une benne bien dimensionnée simplifie les rénovations, débarras et chantiers professionnels sans créer de rotations inutiles.`,
      `Les chantiers à ${city.name} demandent une préparation précise : type de déchets, largeur d’accès, emplacement privé ou public et durée d’immobilisation. Ces informations permettent d’obtenir un tarif comparable et sans surprise.`,
    ],
    agglomeration: [
      `À ${city.name}, la circulation, le stationnement et les créneaux de livraison pèsent autant que le volume de la benne. Une demande complète permet au loueur de sélectionner le véhicule et l’horaire adaptés au quartier.`,
      `Pour louer une benne à ${city.name}, anticipez l’accès du camion et la réservation de l’emplacement. En secteur urbain, une bonne préparation réduit les attentes, les refus de pose et les frais de déplacement supplémentaires.`,
    ],
    metropole: [
      `À ${city.name}, la location de benne doit être organisée comme une opération logistique : adresse exacte, accès poids lourd, occupation éventuelle du domaine public, horaires et filière de traitement.`,
      `Dans une grande ville comme ${city.name}, le prix ne dépend pas seulement du volume. Les conditions d’accès, le temps de manutention et les règles de voirie peuvent modifier l’organisation de la livraison et de l’enlèvement.`,
    ],
  } as const;

  const logistics = {
    rural: `Le point de vigilance à ${city.name} est la distance entre le chantier, le dépôt du transporteur et l’exutoire autorisé. Regrouper les déchets en une seule rotation est souvent plus rationnel, mais le sol doit rester suffisamment porteur pour le camion et la benne.`,
    bourg: `Dans une commune de la taille de ${city.name}, vérifiez les virages, les portails, les lignes aériennes et la possibilité pour le camion de repartir sans manœuvre dangereuse. Une photographie de l’accès aide le transporteur à valider la pose.`,
    ville: `À ${city.name}, réservez une zone plane et dégagée. La largeur du portail ne suffit pas : le camion doit aussi disposer d’une longueur de recul et d’une hauteur libre compatibles avec la dépose de la benne.`,
    agglomeration: `À ${city.name}, prévoyez le créneau de livraison hors des périodes les plus chargées lorsque cela est possible. Si la benne empiète sur la chaussée ou le trottoir, la mairie doit confirmer les règles d’occupation temporaire.`,
    metropole: `À ${city.name}, un repérage précis est indispensable : sens de circulation, restrictions de tonnage, aire de recul, mobilier urbain et sécurisation de la zone. La pose sur domaine public doit être autorisée avant l’arrivée du camion.`,
  } as const;

  const regionalSeason = city.coordinates.lat < 20
    ? `Sous climat tropical ou subtropical, protégez les déchets légers des pluies intenses et évitez toute stagnation d’eau dans la benne.`
    : city.coordinates.lat > 47
      ? `En période humide ou froide, préservez l’accès du camion : un terrain meuble peut devenir impraticable et nécessiter des plaques de roulage.`
      : city.coordinates.lng > 4 && city.coordinates.lat < 45
        ? `Par temps sec et venteux, couvrez les matériaux légers et limitez les poussières lors du chargement.`
        : `Après de fortes pluies, contrôlez la portance du sol et protégez les déchets sensibles à l’eau avant la livraison.`;

  const projectPools = {
    rural: ["rénovation de maison ou de grange", "débarras de garage, cave ou dépendance", "taille de haies et entretien de terrain", "réfection de cour ou de terrasse"],
    bourg: ["rénovation de maison", "débarras après déménagement ou succession", "aménagement de jardin", "chantier d’un artisan local"],
    ville: ["rénovation d’appartement ou de maison", "dépose de cuisine ou de salle de bain", "débarras de local", "travaux de toiture ou d’aménagement"],
    agglomeration: ["rénovation d’immeuble ou de commerce", "curage avant travaux", "débarras de bureaux ou de logement", "chantier de second œuvre"],
    metropole: ["curage et rénovation lourde", "réhabilitation de locaux", "débarras à accès contraint", "chantier professionnel multi-flux"],
  } as const;

  const projects = [...projectPools[scale]];
  const rotation = hash(city.slug) % projects.length;
  const likelyProjects = [...projects.slice(rotation), ...projects.slice(0, rotation)];
  const overseasFactor = overseasRegions.has(department.region) ? 1.18 : 1;
  const scaleFactor = scale === "metropole" ? 1.15 : scale === "agglomeration" ? 1.09 : scale === "ville" ? 1.04 : scale === "rural" ? 1.03 : 1;

  return {
    scale,
    scaleLabel: {
      rural: "commune rurale",
      bourg: "bourg et bassin de proximité",
      ville: "ville intermédiaire",
      agglomeration: "agglomération urbaine",
      metropole: "grande aire urbaine",
    }[scale],
    intro: choose([...intros[scale]], city),
    logistics: logistics[scale],
    accessAdvice: choose([
      `Mesurez la largeur du passage et gardez une marge pour les rétroviseurs du camion. Signalez les câbles, branches, pentes et sols fragiles dès la demande de devis.`,
      `Envoyez au loueur une photo prise depuis la rue et une seconde depuis l’emplacement prévu. Il pourra confirmer la longueur de recul et le type de camion nécessaire.`,
      `Prévoyez une surface plane, stable et protégée. Des bastaings peuvent répartir la charge, mais leur usage doit être validé avec le transporteur avant la pose.`,
    ], city, 7),
    seasonalAdvice: `${regionalSeason} À ${city.name}, confirmez aussi le maintien de l’accès jusqu’au jour de l’enlèvement.`,
    likelyProjects,
    priceFactor: overseasFactor * scaleFactor,
  };
}

export function getEstimatedPrices(profile: LocalProfile) {
  const bases = [
    { volume: "8 m³", gravats: 349, melanges: 449, verts: 319, usage: "petite rénovation, taille ou débarras ciblé" },
    { volume: "10 m³", gravats: 389, melanges: 499, verts: 369, usage: "pièce complète, terrasse ou garage" },
    { volume: "15 m³", gravats: 519, melanges: 679, verts: 479, usage: "rénovation moyenne ou débarras de logement" },
    { volume: "20 m³", gravats: 629, melanges: 779, verts: 599, usage: "maison, chantier conséquent ou encombrants" },
    { volume: "30 m³", gravats: 799, melanges: 1099, verts: null, usage: "fort volume de déchets légers" },
  ];
  const round = (value: number | null) => value === null ? null : Math.round((value * profile.priceFactor) / 10) * 10;
  return bases.map((row) => ({ ...row, gravats: round(row.gravats), melanges: round(row.melanges), verts: round(row.verts) }));
}

export function getCityFaq(city: City, department: Department, profile: LocalProfile) {
  const answers = [
    {
      question: `Combien coûte une location de benne à ${city.name} ?`,
      answer: `Le tarif dépend du volume, du déchet, du poids inclus, de la durée et de la distance logistique. Pour ${city.name}, utilisez les fourchettes indicatives de cette page comme repère, puis demandez un prix écrit précisant livraison, enlèvement et traitement.`,
    },
    {
      question: `Faut-il une autorisation pour poser une benne à ${city.name} ?`,
      answer: `Sur une propriété privée, aucune autorisation de voirie n’est normalement nécessaire. Dès que la benne occupe une chaussée, une place ou un trottoir, contactez la mairie de ${city.name} pour connaître la procédure et les délais applicables.`,
    },
    {
      question: `Quelle taille de benne choisir à ${city.name} ?`,
      answer: `Une benne de 8 à 10 m³ convient souvent à un chantier ciblé. Les volumes de 15 à 20 m³ sont adaptés aux rénovations et débarras plus importants. Le 30 m³ est réservé aux déchets légers et volumineux ; les gravats lourds nécessitent un volume plus petit et une limite de tonnage claire.`,
    },
    {
      question: `Quels déchets sont refusés dans une benne standard ?`,
      answer: `L’amiante, les produits chimiques, solvants, peintures liquides, huiles, batteries, bouteilles de gaz et déchets médicaux suivent des filières spécialisées. Signalez-les avant le devis afin d’éviter un refus d’enlèvement ou une facturation de tri.`,
    },
    {
      question: `La livraison est-elle possible partout dans le département ${departmentGenitive(department)} ?`,
      answer: `La couverture et le délai doivent être confirmés pour l’adresse exacte. Le code postal ${city.zip}, la nature de l’accès et la disponibilité d’un transporteur autour de ${city.name} permettent d’établir une réponse fiable.`,
    },
    {
      question: `Comment préparer la livraison à ${city.name} ?`,
      answer: `${profile.accessAdvice} Dégagez l’emplacement avant l’arrivée et indiquez un contact joignable pendant le créneau de pose.`,
    },
  ];
  const rotation = hash(city.slug) % answers.length;
  return [...answers.slice(rotation), ...answers.slice(0, rotation)];
}
