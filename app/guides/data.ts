export type GuideTable = { headers: string[]; rows: string[][] };
export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: GuideTable;
  callout?: { title: string; text: string; tone?: "warning" | "tip" | "info" };
};
export type Guide = {
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  category: string;
  read: string;
  wordCount: number;
  image: string;
  imageAlt: string;
  datePublished: string;
  dateModified: string;
  quickAnswer: string;
  takeaways: string[];
  sections: GuideSection[];
  faq: [string, string][];
  sources: { label: string; url: string }[];
};

export const guides: Guide[] = [
  {
    slug: "choisir-taille-benne",
    title: "Comment choisir la taille de sa benne ?",
    seoTitle: "Quelle taille de benne choisir ? Guide 8, 10, 15 et 20 m³",
    excerpt: "8, 10, 15 ou 20 m³ : la méthode complète pour estimer le bon volume selon vos travaux, vos déchets, leur poids et l’accès au chantier.",
    category: "Choisir sa benne",
    read: "9 min",
    wordCount: 1142,
    image: "/guides/choisir-taille-benne.jpg",
    imageAlt: "Quatre bennes orange de tailles croissantes alignées dans un dépôt professionnel",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    quickAnswer: "Pour des gravats lourds, choisissez généralement une benne de 8 à 10 m³ afin de rester sous la charge autorisée. Pour des déchets de rénovation mélangés et plus légers, 10 à 15 m³ conviennent à la plupart des chantiers. Les bennes de 20 à 30 m³ sont surtout adaptées aux déchets volumineux et peu denses. Le bon choix dépend toujours du volume ET du poids.",
    takeaways: [
      "8 m³ : petits travaux, salle de bain, maçonnerie ou gravats denses.",
      "10 à 15 m³ : rénovation moyenne, débarras ou déchets non dangereux mélangés.",
      "20 à 30 m³ : gros volumes légers ; jamais de chargement massif de gravats sans validation.",
      "Ajoutez 15 à 20 % de marge à votre estimation, mais ne surdimensionnez pas automatiquement.",
    ],
    sections: [
      {
        id: "volume-et-poids",
        title: "Taille de benne : pourquoi le volume ne suffit pas",
        paragraphs: [
          "Le volume d’une benne est exprimé en mètres cubes, mais le camion transporte une masse. Deux bennes remplies à la même hauteur peuvent donc peser très différemment : un mètre cube de branches, de bois ou d’isolant est bien plus léger qu’un mètre cube de béton concassé.",
          "C’est la raison pour laquelle une grande benne n’est pas toujours un meilleur choix. Pour des matériaux denses, une benne plus compacte limite le risque de surcharge et facilite une évacuation conforme. Pour des encombrants ou des déchets de rénovation légers, le volume devient au contraire le critère principal.",
        ],
        callout: { title: "La règle la plus importante", text: "Ne remplissez jamais une benne de 15, 20 ou 30 m³ de gravats lourds sans accord explicite du loueur. La limite réelle est fixée par le véhicule, le contenant et le tonnage prévu au devis.", tone: "warning" },
      },
      {
        id: "tableau-tailles",
        title: "Quelle benne pour quels travaux ?",
        paragraphs: ["Les dimensions exactes varient selon les transporteurs. Le tableau ci-dessous donne des repères d’usage : le type de déchet, l’accès et le poids restent prioritaires."],
        table: {
          headers: ["Volume", "Projets typiques", "Déchets adaptés", "Point de vigilance"],
          rows: [
            ["8 m³", "Salle de bain, petite maçonnerie, terrasse", "Gravats, béton, briques, tuiles", "Format privilégié pour les matériaux lourds"],
            ["10 m³", "Rénovation d’une pièce, petit débarras", "Gravats modérés, bois, DIB triés", "Vérifier le tonnage si déchets minéraux"],
            ["15 m³", "Rénovation d’un appartement ou d’un étage", "DIB, meubles, plâtre séparé, bois", "Ne pas charger intégralement en gravats"],
            ["20 m³", "Rénovation complète, grand débarras", "Déchets volumineux et relativement légers", "Besoin d’un accès camion plus confortable"],
            ["30 m³", "Gros chantier, curage, déchets très volumineux", "Bois, emballages, encombrants légers", "Disponibilité et emprise au sol à confirmer"],
          ],
        },
      },
      {
        id: "estimer-volume",
        title: "Méthode simple pour estimer le volume de déchets",
        paragraphs: [
          "Commencez par regrouper mentalement les déchets par famille : minéraux, bois, plâtre, métaux, emballages et déchets mélangés. Estimez ensuite l’espace qu’ils occuperaient une fois déposés sans être excessivement tassés.",
          "Pour un tas régulier, multipliez longueur × largeur × hauteur. Un tas de 2 m × 2 m × 1,5 m représente environ 6 m³. Ajoutez ensuite 15 à 20 % pour les vides, les formes irrégulières et les déchets qui seront produits en fin de chantier.",
          "Pour une démolition, le volume en place n’est pas le volume après dépose : cloisons, meubles, charpentes et emballages prennent davantage de place lorsqu’ils sont démontés. À l’inverse, les gravats peuvent se compacter mais deviennent rapidement très lourds.",
        ],
        bullets: [
          "Photographiez les zones avant travaux pour aider le conseiller à évaluer.",
          "Listez les matériaux plutôt que d’écrire simplement « déchets de chantier ».",
          "Distinguez ce qui peut être réemployé, donné ou déposé gratuitement en point de reprise.",
          "Prévoyez la marge pour les déchets imprévus, pas pour mélanger des flux incompatibles.",
        ],
      },
      {
        id: "exemples",
        title: "Exemples concrets par type de chantier",
        paragraphs: [
          "Pour la rénovation d’une salle de bain avec dépose du carrelage, d’une cloison et des sanitaires, une benne de 8 m³ est souvent le premier format étudié. La présence de béton ou de carrelage impose surtout de vérifier le poids.",
          "Pour vider une maison de meubles, cartons et objets non dangereux, une benne de 15 à 20 m³ peut être pertinente. Démonter les meubles augmente le taux de remplissage et évite de payer du transport pour de l’air.",
          "Pour un chantier de toiture, les tuiles sont denses : un petit volume peut déjà représenter plusieurs tonnes. Les liteaux, emballages et isolants doivent idéalement être séparés afin de ne pas dégrader la filière des matériaux minéraux.",
        ],
      },
      {
        id: "acces",
        title: "Vérifier l’accès avant de confirmer la benne",
        paragraphs: [
          "Le volume choisi doit être compatible avec le camion et l’emplacement. Le chauffeur a besoin d’une largeur suffisante, d’une hauteur libre sans branche ni câble, d’un sol stable et d’un espace de manœuvre. La longueur au sol de la benne n’est qu’une partie de l’emprise nécessaire : la phase de dépose demande davantage de recul.",
          "Signalez les portails, pentes, sols fragiles, parkings souterrains, virages serrés et réseaux aériens dès le devis. Des plaques de protection peuvent être nécessaires, mais elles ne garantissent pas qu’un revêtement léger supportera le poids du camion chargé.",
        ],
        callout: { title: "Bon réflexe", text: "Envoyez une photo prise depuis la rue et une photo de l’emplacement prévu. C’est souvent plus utile qu’une mesure isolée.", tone: "tip" },
      },
      {
        id: "erreurs",
        title: "Les 6 erreurs qui coûtent le plus cher",
        paragraphs: ["Une estimation fiable évite un second transport, un refus d’enlèvement ou un tri complémentaire. Les erreurs les plus fréquentes sont prévisibles."],
        bullets: [
          "Choisir uniquement selon le prix du volume, sans considérer le poids.",
          "Mélanger gravats propres, plâtre, bois et déchets dangereux.",
          "Dépasser les ridelles : rien ne doit dépasser ou tomber pendant le transport.",
          "Sous-estimer les déchets de fin de chantier et les emballages.",
          "Oublier l’autorisation lorsque la benne doit occuper la voie publique.",
          "Réserver une grande benne alors que le camion ne peut pas accéder à l’emplacement.",
        ],
      },
    ],
    faq: [
      ["Quelle est la taille de benne la plus demandée ?", "Les formats 8 à 10 m³ sont courants pour les gravats et les petits travaux ; 15 m³ est fréquent pour une rénovation avec déchets non dangereux plus volumineux. Il n’existe toutefois pas de format universel."],
      ["Combien de brouettes entrent dans une benne de 8 m³ ?", "Le nombre dépend fortement de la capacité de la brouette et du niveau de remplissage. Avec une brouette de 80 litres remplie réellement à environ 60 litres, 8 m³ théoriques représentent autour de 130 chargements. Ce calcul ne tient pas compte du poids maximal."],
      ["Peut-on remplir une benne de 20 m³ avec du béton ?", "Pas sans validation. Le béton est très dense et la charge autorisée serait généralement atteinte bien avant le remplissage visuel de la benne."],
      ["Vaut-il mieux prendre une benne trop grande ?", "Une marge raisonnable est utile, mais une benne surdimensionnée peut coûter plus cher et occuper davantage d’espace. Une estimation par type de déchets est préférable."],
      ["Que faire si je ne connais pas le volume ?", "Décrivez les travaux, les surfaces, les matériaux et envoyez des photos. Le conseiller peut proposer un volume et préciser les limites de poids."],
    ],
    sources: [
      { label: "ADEME — Que faire de mes déchets : déchets inertes du bâtiment", url: "https://quefairedemesdechets.ademe.fr/dechet/inertes-batiment-btp/" },
      { label: "Ministère de la Transition écologique — Déchets du bâtiment", url: "https://www.ecologie.gouv.fr/politiques-publiques/dechets-du-batiment" },
    ],
  },
  {
    slug: "prix-location-benne-2026",
    title: "Prix d’une location de benne en 2026 : le guide complet",
    seoTitle: "Prix location de benne 2026 : tarifs, exemples et coûts cachés",
    excerpt: "Tarifs par volume, éléments inclus, suppléments possibles et méthode pour comparer deux devis de location de benne sans mauvaise surprise.",
    category: "Prix & budget",
    read: "10 min",
    wordCount: 1233,
    image: "/guides/prix-location-benne-2026.jpg",
    imageAlt: "Livraison d’une benne orange devant une maison en rénovation avec contrôle du chantier",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    quickAnswer: "En 2026, nos prix indicatifs démarrent à 319 € HT pour une benne de déchets verts de 8 m³, 349 € HT pour des gravats de 8 m³ et 449 € HT pour du DIB de 8 m³. Le prix exact dépend de la ville, du volume, du déchet, du tonnage inclus, de la durée et de l’accès. Un devis sérieux chiffre la livraison, l’enlèvement et le traitement.",
    takeaways: [
      "Le type de déchet et son poids influencent souvent davantage le prix que le seul volume.",
      "Comparez toujours le tonnage inclus et le prix de la tonne supplémentaire.",
      "Vérifiez la durée de location, les frais d’attente et les conditions d’annulation.",
      "Un prix anormalement bas peut exclure le traitement ou reposer sur un tonnage très limité.",
    ],
    sections: [
      {
        id: "tarifs-2026",
        title: "Tarifs indicatifs de location de benne en 2026",
        paragraphs: ["Ces montants sont des prix de départ hors taxes. Ils servent à cadrer le budget ; seul un devis lié à une adresse, un déchet et une date confirme le prix final."],
        table: {
          headers: ["Volume", "Gravats", "DIB / tout-venant", "Déchets verts", "Bois"],
          rows: [
            ["8 m³", "à partir de 349 €", "à partir de 449 €", "à partir de 319 €", "à partir de 349 €"],
            ["10 m³", "à partir de 389 €", "à partir de 499 €", "à partir de 369 €", "à partir de 389 €"],
            ["15 m³", "à partir de 519 €", "à partir de 679 €", "à partir de 479 €", "à partir de 519 €"],
            ["20 m³", "à partir de 629 €", "à partir de 779 €", "à partir de 599 €", "à partir de 629 €"],
            ["30 m³", "à partir de 799 €", "à partir de 1 099 €", "sur étude", "à partir de 799 €"],
          ],
        },
      },
      {
        id: "composition-prix",
        title: "Ce qui compose réellement le prix",
        paragraphs: [
          "Une location de benne n’est pas la simple mise à disposition d’un contenant. Le tarif couvre deux trajets de camion, le temps du chauffeur, l’immobilisation de la benne, la pesée, le tri et le traitement des déchets. Les coûts locaux du centre de traitement et la distance parcourue expliquent une part importante des écarts entre deux villes.",
          "Le prix dépend également du flux. Des gravats propres peuvent rejoindre une filière minérale ; des déchets mélangés nécessitent davantage de tri et produisent plus de refus. Un chargement contaminé par du plâtre, du bois traité ou un déchet dangereux peut changer de catégorie et entraîner un surcoût important.",
        ],
        bullets: [
          "Transport aller et dépose de la benne.",
          "Durée de mise à disposition prévue au devis.",
          "Reprise et transport vers l’exutoire.",
          "Tonnage de base et frais de traitement.",
          "Coordination, suivi et traçabilité de la prestation.",
        ],
      },
      {
        id: "facteurs",
        title: "Les 7 facteurs qui font varier le devis",
        paragraphs: ["Deux demandes pour une benne de 10 m³ peuvent recevoir des prix différents sans qu’il y ait incohérence. Le service logistique n’est pas identique."],
        table: {
          headers: ["Facteur", "Pourquoi il compte", "Comment maîtriser le coût"],
          rows: [
            ["Type de déchet", "Les filières et coûts de traitement diffèrent", "Trier à la source et décrire précisément"],
            ["Poids", "Le traitement est souvent facturé à la tonne", "Ne pas mélanger les flux lourds et légers"],
            ["Distance", "Deux transports sont nécessaires", "Choisir un opérateur proche du chantier"],
            ["Volume", "Il mobilise un contenant et un véhicule adaptés", "Estimer avec 15 à 20 % de marge"],
            ["Durée", "La benne reste indisponible pour d’autres clients", "Planifier le remplissage avant la livraison"],
            ["Accès", "Une manœuvre complexe augmente temps et risque", "Transmettre photos et contraintes en amont"],
            ["Zone publique", "Autorisation, stationnement ou balisage possibles", "Anticiper la demande auprès de la commune"],
          ],
        },
      },
      {
        id: "inclus",
        title: "Ce qu’un devis tout compris doit préciser",
        paragraphs: [
          "La formule « tout compris » doit rester vérifiable. Un document professionnel indique le type et le volume de benne, l’adresse, les dates, le déchet déclaré, le tonnage compris, le traitement, le prix hors taxes et toutes taxes comprises ainsi que les suppléments possibles.",
          "Demandez aussi qui organise l’enlèvement, sous quel délai et comment est traité un changement de date. Ces détails évitent qu’une benne pleine immobilise le chantier ou qu’un enlèvement urgent soit facturé sans que vous l’ayez anticipé.",
        ],
        callout: { title: "Comparaison honnête", text: "Ne comparez jamais uniquement les totaux. Ramenez les offres au même volume, même durée, même tonnage inclus et même flux de déchets.", tone: "tip" },
      },
      {
        id: "supplements",
        title: "Quels suppléments peuvent s’ajouter ?",
        paragraphs: [
          "Les principaux suppléments concernent la tonne au-delà du forfait, les jours supplémentaires, un déplacement improductif, une attente prolongée, un changement de déchet ou une nouvelle présentation du camion lorsque l’accès est impossible.",
          "L’autorisation de voirie n’est généralement pas incluse dans un tarif standard, car son coût dépend de la commune et de la durée d’occupation. Certains territoires facturent également le stationnement neutralisé ou imposent un dispositif de signalisation spécifique.",
        ],
        bullets: [
          "Jour supplémentaire : souvent facturé selon le contrat et la zone.",
          "Tonne supplémentaire : tarif différent selon le flux et l’exutoire.",
          "Déchet non conforme : reclassement, tri ou refus de chargement.",
          "Accès impossible : déplacement du camion ou seconde présentation.",
          "Surcharge ou dépassement des ridelles : enlèvement impossible jusqu’à remise en conformité.",
        ],
      },
      {
        id: "exemples-budget",
        title: "Trois exemples de budget",
        paragraphs: [
          "Petit chantier de maçonnerie : une benne de 8 m³ pour gravats propres démarre autour de 349 € HT dans les zones les plus compétitives. Le poids et la distance au centre restent déterminants.",
          "Rénovation d’un appartement : une benne DIB de 10 à 15 m³ se situe dans notre grille à partir de 499 à 679 € HT. Séparer les gravats et le plâtre peut éviter un traitement plus coûteux du mélange.",
          "Grand débarras : une benne de 20 m³ pour encombrants non dangereux démarre à 779 € HT. Démonter les meubles et retirer les équipements électriques améliore le remplissage et la conformité.",
        ],
        callout: { title: "À retenir", text: "Ces exemples ne sont pas des devis. La localisation, la date, l’accès, le tonnage et le contenu réel peuvent modifier le montant.", tone: "info" },
      },
      {
        id: "reduire-cout",
        title: "Comment réduire le coût sans prendre de risque",
        paragraphs: ["La meilleure économie vient d’un chantier préparé et d’un tri correct, pas d’une sous-déclaration du contenu."],
        bullets: [
          "Réemployer ou donner les éléments encore utilisables.",
          "Démonter les meubles et aplatir les emballages.",
          "Séparer les gravats, le bois, le métal et le plâtre lorsque les volumes le justifient.",
          "Regrouper la production sur la période de location prévue.",
          "Réserver suffisamment tôt pour éviter une logistique en urgence.",
          "Envoyer des photos et une liste précise avant l’établissement du devis.",
        ],
      },
    ],
    faq: [
      ["Quel est le prix moyen d’une benne de 10 m³ ?", "Dans notre grille 2026, les prix de départ vont de 369 € HT pour des déchets verts à 499 € HT pour du DIB. Le prix exact dépend de la ville, du poids, de la durée et du traitement."],
      ["Le traitement des déchets est-il toujours inclus ?", "Il doit être indiqué au devis. Vérifiez le tonnage compris, car la part au-delà du forfait est généralement facturée séparément."],
      ["Pourquoi le DIB coûte-t-il plus cher que les gravats propres ?", "Un mélange non dangereux demande davantage de tri et peut avoir moins de débouchés de valorisation qu’un flux minéral propre et homogène."],
      ["La TVA est-elle comprise dans les prix affichés ?", "Nos tableaux affichent des prix de départ hors taxes. Le devis présente le montant HT, le taux applicable et le total TTC."],
      ["Peut-on payer moins cher en déposant soi-même ?", "Pour de petits volumes triés, une déchèterie ou un point de reprise peut être plus économique. Une benne devient pertinente lorsque le volume, le temps de manutention ou la fréquence des trajets augmente."],
    ],
    sources: [
      { label: "ADEME — Déchets : optimisez votre gestion", url: "https://agirpourlatransition.ademe.fr/entreprises/conseils/transverse/gestion-dechets" },
      { label: "ADEME — Filière des produits et matériaux de construction du bâtiment", url: "https://filieres-rep.ademe.fr/filieres-REP/filiere-PMCB" },
    ],
  },
  {
    slug: "autorisation-voirie-benne",
    title: "Autorisation de voirie pour une benne : démarches, délais et règles",
    seoTitle: "Autorisation de voirie pour une benne : demande, délai et prix",
    excerpt: "Faut-il une autorisation pour poser une benne dans la rue ? Découvrez l’interlocuteur, les documents, les délais et les règles de sécurité.",
    category: "Réglementation",
    read: "9 min",
    wordCount: 1059,
    image: "/guides/autorisation-voirie-benne.jpg",
    imageAlt: "Benne orange balisée sur une place de stationnement dans une rue française",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    quickAnswer: "Une benne posée entièrement sur une propriété privée ne nécessite généralement pas d’autorisation d’occupation du domaine public. Dès qu’elle occupe la chaussée, une place de stationnement, un trottoir ou un autre espace public, vous devez obtenir l’autorisation du gestionnaire de la voie, souvent la mairie. La forme, le délai et le coût varient selon la commune.",
    takeaways: [
      "Sur terrain privé : pas d’autorisation de voirie, mais l’accès et la portance doivent être validés.",
      "Sur domaine public : demande obligatoire avant la pose, souvent sous forme de permis de stationnement.",
      "Anticipez au moins 8 à 15 jours par prudence, davantage dans certaines grandes villes.",
      "L’autorisation ne remplace pas le balisage, la protection des usagers et le respect des dates accordées.",
    ],
    sections: [
      { id: "obligatoire", title: "Dans quels cas l’autorisation est-elle obligatoire ?", paragraphs: ["L’occupation temporaire du domaine public routier doit être autorisée. Une benne installée sur une place de stationnement, une chaussée, un trottoir, un accotement ou une voie communale entre dans ce cadre, même si les travaux sont réalisés dans un logement privé.", "Pour une benne qui ne modifie pas le sol, la démarche prend souvent la forme d’un permis de stationnement ou d’une autorisation d’occupation temporaire. Le nom exact et la procédure dépendent du gestionnaire : commune, intercommunalité, département ou État selon la voie."], callout:{title:"Attention aux limites de propriété",text:"Un emplacement qui semble appartenir à la maison peut être intégré au domaine public ou grevé d’un droit de passage. En cas de doute, demandez confirmation à la mairie.",tone:"warning"}},
      { id: "qui-demande", title: "Qui doit effectuer la demande ?", paragraphs:["Le responsable de la demande peut être le particulier, l’entreprise de travaux ou le loueur de benne, selon la commune et le contrat. Ne supposez pas que le transporteur s’en charge automatiquement : vérifiez ce point avant de réserver.","La personne désignée reste responsable de la conformité de l’occupation. Elle doit conserver l’arrêté ou l’autorisation, respecter l’emplacement, les horaires, le balisage et la durée accordée."], bullets:["Demandez au loueur si la démarche est incluse ou seulement conseillée.","Identifiez le gestionnaire de la voie auprès du service voirie.","Conservez l’autorisation accessible pendant toute l’occupation.","Prévenez le transporteur de toutes les contraintes mentionnées dans l’arrêté."]},
      { id: "documents", title: "Quels documents préparer ?", paragraphs:["Les exigences locales varient, mais un dossier exploitable doit permettre au service voirie de comprendre l’emprise, la durée et l’impact sur la circulation."], table:{headers:["Élément","Ce qu’il faut indiquer"],rows:[["Coordonnées","Demandeur, entreprise éventuelle et contact joignable"],["Adresse","Numéro, voie et repère précis de l’emplacement"],["Dates","Jour de pose, durée et date d’enlèvement"],["Emprise","Dimensions de la benne et nombre de places neutralisées"],["Plan ou photo","Vue de l’emplacement, trottoir, accès et circulation"],["Sécurité","Balisage, signalisation et maintien du passage piéton"],["Prestation","Coordonnées du loueur ou transporteur si demandées"]]}, callout:{title:"Formulaire national",text:"Le Cerfa 14023 concerne les demandes d’autorisation d’occupation du domaine public routier. Certaines communes utilisent toutefois leur propre téléservice ou formulaire.",tone:"info"}},
      { id: "delai", title: "Quel délai prévoir avant la pose ?", paragraphs:["Il n’existe pas un délai unique valable partout en France. La complexité de la rue, un événement, une zone protégée ou la neutralisation de circulation peuvent allonger l’instruction.","Prévoir 8 à 15 jours est une marge pratique pour une demande simple, mais certaines grandes villes demandent davantage. Ne planifiez pas la livraison tant que l’autorisation n’est pas acquise : une benne déposée sans accord peut devoir être retirée immédiatement."], bullets:["Déposez le dossier dès que les dates de chantier sont stabilisées.","Ajoutez du temps si une place doit être réservée ou signalée à l’avance.","Vérifiez si l’arrêté doit être affiché plusieurs jours avant l’occupation.","Informez le loueur dès réception des dates et conditions définitives."]},
      { id: "prix", title: "Combien coûte une autorisation de benne ?", paragraphs:["La demande peut être gratuite, mais l’occupation du domaine public est souvent soumise à une redevance. Son montant dépend de la commune, de la surface, du nombre de places, de la durée et parfois de la zone tarifaire.","À titre de budget, le cahier des charges du site retient une enveloppe indicative de 50 à 150 €, sans valeur universelle. Seul le tarif municipal en vigueur confirme le montant. Des frais distincts peuvent s’ajouter pour le stationnement, la signalisation ou une prolongation."], callout:{title:"Pas de prix national",text:"Méfiez-vous d’un montant présenté comme forfaitaire pour toute la France. Chaque collectivité fixe ses règles et sa redevance.",tone:"warning"}},
      { id: "securite", title: "Balisage, circulation et responsabilité", paragraphs:["L’autorisation précise les obligations de sécurité. La benne doit rester visible, stable, correctement balisée et ne pas masquer un passage piéton, un accès de secours, une borne incendie ou un panneau. Les déchets ne doivent ni dépasser ni tomber sur la chaussée.","Le maintien d’un cheminement piéton sûr est essentiel. Lorsque le trottoir est affecté, la commune peut imposer une déviation protégée. La benne doit également être couverte si son contenu risque de s’envoler ou si l’arrêté le prévoit."], bullets:["Utiliser les dispositifs rétro-réfléchissants et barrières demandés.","Protéger le revêtement lorsque l’autorité ou le site l’exige.","Nettoyer immédiatement les abords si des matériaux sont tombés.","Demander une prolongation avant l’échéance, jamais après."]},
      { id: "refus", title: "Que faire si la demande est refusée ?", paragraphs:["Un refus ne signifie pas nécessairement qu’aucune benne n’est possible. Le service peut proposer un autre emplacement, une durée plus courte, un créneau de livraison spécifique ou un format plus compact.","Si la voie est trop étroite ou sensible, étudiez une pose sur terrain privé, des rotations plus courtes avec une petite benne, des big bags ou une évacuation fractionnée. Ne choisissez pas une solution alternative avant de vérifier son coût total et ses contraintes de manutention."]},
    ],
    faq:[["Peut-on poser une benne devant chez soi sans autorisation ?","Seulement si l’emplacement est entièrement privé et accessible. Sur une place, un trottoir ou une chaussée publics, une autorisation préalable est nécessaire."],["Qui paie l’autorisation de voirie ?","Le demandeur ou le client la paie généralement, sauf si le devis du loueur indique explicitement qu’elle est incluse."],["Peut-on livrer avant d’avoir reçu l’arrêté ?","Non. Une demande déposée ne vaut pas autorisation. Attendez l’accord et vérifiez les dates accordées."],["La benne peut-elle rester sur le trottoir ?","Uniquement si la collectivité l’autorise et si un cheminement sécurisé est maintenu. Dans de nombreux cas, l’occupation du trottoir est limitée ou refusée."],["Faut-il réserver les places de stationnement ?","Souvent oui. La mairie indique les panneaux, délais d’affichage et modalités de neutralisation applicables."]],
    sources:[{label:"Service-Public — Notice du Cerfa 14023, occupation du domaine public routier",url:"https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaFormulaire=14023&cerfaNotice=51406"}],
  },
  {
    slug: "tri-dechets-chantier",
    title: "Tri des déchets de chantier : règles, méthode et plan d’action",
    seoTitle: "Tri des déchets de chantier : obligations et méthode 2026",
    excerpt: "Flux à séparer, organisation sur chantier, traçabilité et erreurs à éviter : le guide opérationnel pour particuliers et professionnels.",
    category: "Tri & valorisation",
    read: "11 min",
    wordCount: 1175,
    image: "/guides/tri-dechets-chantier.jpg",
    imageAlt: "Déchets de chantier triés dans plusieurs bennes orange et bleu marine",
    datePublished:"2026-07-21",dateModified:"2026-07-21",
    quickAnswer:"Un bon tri de chantier commence avant les travaux : inventoriez les matériaux, prévoyez une zone et un contenant par flux, affichez les consignes et contrôlez les apports. Dans le bâtiment, bois, métal, plastique, verre, papier-carton, fractions minérales et plâtre font partie des flux à collecter séparément lorsqu’ils sont concernés. Les déchets dangereux suivent toujours une filière distincte.",
    takeaways:["Prévenir et réemployer avant de jeter.","Séparer au minimum les flux valorisables et isoler systématiquement les déchets dangereux.","Le plâtre et les gravats propres perdent leur valeur lorsqu’ils sont contaminés par d’autres matériaux.","Conserver devis, tickets de pesée et justificatifs de traitement pour la traçabilité."],
    sections:[
      {id:"hierarchie",title:"La bonne logique : éviter, réemployer, trier, valoriser",paragraphs:["La gestion des déchets ne commence pas à la benne. Avant la dépose, identifiez les équipements et matériaux qui peuvent rester en place, être réutilisés sur le chantier, donnés ou orientés vers une filière de réemploi.","Ce qui devient réellement un déchet doit être trié le plus tôt possible. Plus un flux reste propre et homogène, plus sa valorisation est techniquement simple. À l’inverse, un mélange souillé peut être reclassé et coûter davantage à traiter."],bullets:["Conserver ce qui peut rester en place.","Déposer soigneusement ce qui peut être réemployé.","Trier les matières recyclables à la source.","Valoriser lorsque le réemploi n’est pas possible.","Éliminer uniquement les résidus sans autre solution."],callout:{title:"Sur les grands chantiers",text:"Un diagnostic PEMD est obligatoire pour certaines démolitions ou rénovations significatives, notamment au-delà de 1 000 m² ou pour certains bâtiments ayant accueilli des substances dangereuses.",tone:"info"}},
      {id:"flux",title:"Quels flux séparer sur un chantier ?",paragraphs:["Pour le secteur du bâtiment, les consignes portent notamment sur le papier-carton, le métal, le plastique, le verre, le bois, les fractions minérales et le plâtre. D’autres obligations peuvent s’ajouter selon l’activité, la quantité et la nature des déchets.","Le vocabulaire commercial d’une benne ne remplace pas la caractérisation des déchets. Demandez au prestataire la liste précise des matériaux acceptés dans chaque contenant."],table:{headers:["Flux","Exemples","Pourquoi le séparer"],rows:[["Fractions minérales","Béton, briques, tuiles, céramiques","Recyclage en granulats ou valorisation en travaux publics"],["Bois","Palettes, charpentes, menuiseries non contaminées","Réemploi, panneaux ou valorisation énergétique selon qualité"],["Métaux","Rails, profilés, câbles sans composants dangereux","Forte recyclabilité matière"],["Plâtre","Plaques et chutes propres","Filière spécifique sensible aux contaminants"],["Papier-carton","Emballages secs et propres","Recyclage matière"],["Plastiques","Films, gaines et emballages triés","Filières variables selon résine et propreté"],["Verre","Vitrage déposé selon consigne locale","Recyclage lorsque correctement séparé"],["Déchets dangereux","Amiante, solvants, peintures, huiles, batteries","Filières spécialisées et traçabilité renforcée"]]}},
      {id:"organisation",title:"Construire un plan de tri qui fonctionne",paragraphs:["Un plan de tri efficace doit être compatible avec la réalité du chantier. Trop de contenants mal placés seront contournés ; trop peu de flux créeront un mélange coûteux. Positionnez les bennes près des zones de production sans gêner la circulation et prévoyez de petits contenants de proximité si nécessaire."],bullets:["Nommer un responsable du suivi, même sur un petit chantier.","Définir les flux avant la première démolition.","Utiliser des photos de matériaux autorisés et interdits.","Protéger les flux secs de la pluie lorsque nécessaire.","Prévoir l’évacuation avant saturation.","Contrôler quotidiennement les erreurs de bac."],callout:{title:"Conseil terrain",text:"Une erreur retirée le jour même prend quelques minutes. Une benne entière contaminée découverte au centre peut générer tri, refus ou surcoût.",tone:"tip"}},
      {id:"particulier-pro",title:"Particulier ou professionnel : qui est responsable ?",paragraphs:["Le producteur et le détenteur des déchets doivent s’assurer de leur bonne gestion. Pour un particulier qui confie les travaux à une entreprise, le contrat doit préciser qui organise l’évacuation et fournit les justificatifs. Si vous réalisez vous-même les travaux, vous devez utiliser les solutions de collecte acceptant vos déchets.","Pour les professionnels, les obligations de tri, de registre et de traçabilité dépendent de l’activité et des déchets. Les maîtres d’ouvrage doivent intégrer la gestion des déchets aux pièces de marché et vérifier que les prestataires utilisent des installations autorisées."],bullets:["Écrire dans le devis qui fournit les contenants.","Préciser les flux et le niveau de tri attendu.","Identifier l’installation ou la filière de destination.","Conserver les preuves de collecte et de traitement." ]},
      {id:"pemd",title:"Diagnostic PEMD : quand faut-il l’anticiper ?",paragraphs:["Le diagnostic Produits, Équipements, Matériaux et Déchets vise certaines démolitions et rénovations significatives. Il intervient avant l’acceptation des devis ou la passation des marchés afin d’identifier les gisements, prioriser le réemploi et prévoir les filières.","Il concerne notamment les opérations portant sur plus de 1 000 m² de surface de plancher, ainsi que certains bâtiments ayant accueilli une activité impliquant des substances dangereuses. Un récolement est ensuite transmis après les travaux dans les conditions prévues par les textes."],callout:{title:"Ce guide ne remplace pas l’étude réglementaire",text:"Pour une opération entrant dans le champ du diagnostic PEMD, faites intervenir un professionnel compétent et consultez la plateforme officielle.",tone:"warning"}},
      {id:"tracabilite",title:"Quels justificatifs conserver ?",paragraphs:["La traçabilité prouve que les déchets ont été remis à un opérateur et à une installation adaptés. Selon le flux, elle peut reposer sur un bon d’enlèvement, un ticket de pesée, une attestation de valorisation, un registre ou un bordereau réglementaire.","Pour les déchets dangereux et l’amiante, des bordereaux et outils dédiés s’appliquent aux professionnels. N’inventez pas un document générique : demandez à la filière quel justificatif correspond au déchet et à votre statut."],bullets:["Devis et bon de commande indiquant le flux.","Bon d’enlèvement avec date et adresse.","Poids mesuré ou quantité estimée.","Installation de destination.","Justificatif de valorisation ou bordereau lorsque requis."]},
      {id:"erreurs-tri",title:"Les erreurs de tri les plus fréquentes",paragraphs:["Les erreurs proviennent rarement d’un manque de bonne volonté. Elles apparaissent lorsque la consigne est ambiguë, la benne trop loin ou le flux produit en faible quantité. Corrigez l’organisation plutôt que de compter uniquement sur un rappel oral."],bullets:["Jeter du plâtre dans les gravats propres.","Déposer les sacs fermés sans vérifier leur contenu.","Mélanger bois traité et bois propre sans accord.","Laisser peintures, aérosols ou batteries dans une benne DIB.","Remplir au-dessus des ridelles.","Oublier les emballages et déchets de fin de chantier dans le plan initial."]},
    ],
    faq:[["Qu’est-ce que le tri 7 flux dans le bâtiment ?","Il concerne notamment la collecte séparée du papier-carton, métal, plastique, verre, bois, fractions minérales et plâtre, sous réserve du champ d’application réglementaire."],["Peut-on mélanger le bois et les gravats ?","Non dans une benne de gravats propres. Le bois contamine le flux minéral et doit être séparé ou orienté vers une benne explicitement acceptée comme mélange."],["Le plâtre peut-il aller avec le DIB ?","Cela dépend du prestataire et de la filière. Le plâtre dispose d’une collecte séparée et peut perturber d’autres traitements ; demandez toujours la consigne locale."],["Quels documents demander au loueur ?","Au minimum le bon d’enlèvement et les informations de destination ; selon le flux et votre statut, demandez tickets de pesée, attestation ou bordereau réglementaire."],["Que faire pour un petit volume ?","Les points de reprise et déchèteries peuvent être adaptés si les déchets sont triés et acceptés. Vérifiez les conditions d’accès et les limites avant le déplacement."]],
    sources:[{label:"ADEME — Tri des déchets d’activités professionnels",url:"https://economie-circulaire.ademe.fr/tri-dechets-professionnels"},{label:"Ministère de la Transition écologique — Diagnostic PEMD",url:"https://www.ecologie.gouv.fr/politiques-publiques/diagnostic-produits-equipements-materiaux-dechets-pemd"},{label:"ADEME — Filière PMCB",url:"https://filieres-rep.ademe.fr/filieres-REP/filiere-PMCB"}],
  },
  {
    slug:"dib-vs-gravats",title:"DIB ou gravats : quelle benne choisir ?",seoTitle:"DIB ou gravats : différences, déchets acceptés et prix",excerpt:"La différence entre déchets inertes et DIB, les matériaux autorisés dans chaque benne et la décision à prendre en cas de mélange.",category:"Types de déchets",read:"8 min",wordCount:959,image:"/guides/dib-vs-gravats.jpg",imageAlt:"Deux bennes orange comparant gravats minéraux et déchets de rénovation non dangereux",datePublished:"2026-07-21",dateModified:"2026-07-21",
    quickAnswer:"Choisissez une benne gravats si le chargement contient uniquement des matériaux minéraux inertes et propres : béton, briques, tuiles, pierres ou céramiques selon la filière. Choisissez une benne DIB — terme commercial pour des déchets non dangereux non inertes — pour les matériaux mélangés de rénovation acceptés par le prestataire. N’ajoutez jamais plâtre, bois, plastique ou déchets dangereux dans des gravats propres sans validation.",
    takeaways:["Gravats = flux minéral dense, homogène et non contaminé.","DIB = déchets non dangereux non inertes acceptés en mélange selon une liste précise.","Le plâtre, l’amiante, les peintures, batteries et appareils électriques nécessitent une consigne distincte.","Un mélange coûte généralement plus cher à trier qu’un flux propre."],
    sections:[
      {id:"definitions",title:"Définition : gravats, déchets inertes et DIB",paragraphs:["Les déchets inertes ne subissent pas de transformation physique, chimique ou biologique importante. Sur un chantier courant, on parle principalement de béton, briques, tuiles, céramiques et pierres non contaminées.","DIB signifie historiquement déchets industriels banals. Dans le vocabulaire réglementaire, on parle plutôt de déchets non dangereux non inertes. Le terme reste utilisé commercialement pour une benne recevant plusieurs matériaux de rénovation non dangereux, selon les conditions du centre de tri."],callout:{title:"Le mot DIB ne signifie pas « tout est autorisé »",text:"Chaque opérateur définit une liste d’acceptation. Les déchets dangereux, liquides, amiantés ou soumis à une filière spécifique ne deviennent jamais acceptables parce que la benne est appelée tout-venant.",tone:"warning"}},
      {id:"comparatif",title:"Tableau comparatif DIB vs gravats",paragraphs:["Utilisez ce tableau comme première orientation, puis confirmez la liste locale avec le loueur."],table:{headers:["Critère","Benne gravats","Benne DIB / tout-venant"],rows:[["Nature","Minérale, inerte et propre","Non dangereuse, non inerte, souvent mélangée"],["Exemples","Béton, briques, tuiles, pierres","Bois, plastiques, isolants, mobilier, emballages selon acceptation"],["Densité","Élevée","Variable, souvent plus légère"],["Volume courant","8 à 10 m³ pour maîtriser la charge","10 à 30 m³ selon le chantier"],["Traitement","Concassage, recyclage ou stockage inerte","Tri mécanique et manuel, valorisation par matière"],["Prix","Souvent inférieur si le flux reste propre","Souvent supérieur en raison du tri"],["Risque principal","Contamination par plâtre, bois ou déchets dangereux","Présence d’un flux interdit ou surcharge ponctuelle"]]}},
      {id:"acceptes-gravats",title:"Que peut-on mettre dans une benne à gravats ?",paragraphs:["Les matériaux acceptés varient légèrement selon l’installation. Une benne de gravats propres reçoit généralement les fractions minérales non dangereuses issues de maçonnerie ou de démolition."],bullets:["Béton non contaminé.","Briques et parpaings.","Tuiles et céramiques.","Pierres naturelles.","Mortier et matériaux minéraux acceptés par la filière.","Terres non polluées uniquement après validation."],callout:{title:"À sortir des gravats",text:"Plâtre, plaques de plâtre, bois, isolants, plastiques, câbles, cartons, déchets verts et sacs fermés doivent être séparés sauf consigne écrite contraire.",tone:"warning"}},
      {id:"acceptes-dib",title:"Que peut-on mettre dans une benne DIB ?",paragraphs:["Une benne DIB peut recevoir des déchets non dangereux de rénovation plus variés. Elle est utile lorsque le tri en plusieurs grands contenants n’est pas réaliste, mais elle ne dispense pas d’isoler les déchets qui disposent d’une filière ou d’une contrainte particulière."],bullets:["Bois et éléments de menuiserie selon leur traitement.","Plastiques, gaines et emballages secs acceptés.","Mobilier et encombrants non électriques.","Isolants non dangereux selon consigne.","Métaux en petite quantité, même si une séparation est souvent plus pertinente.","Revêtements et matériaux composites expressément acceptés."],callout:{title:"Le cas du plâtre",text:"Le plâtre est un flux à séparer dans le bâtiment et perturbe certaines filières. Ne le déposez pas dans une benne DIB sans accord du prestataire.",tone:"info"}},
      {id:"melange",title:"Que faire quand le chantier produit les deux ?",paragraphs:["La solution la plus robuste est de prévoir une benne gravats et un contenant distinct pour les déchets non dangereux non inertes. Sur un petit chantier, une rotation successive peut remplacer deux bennes simultanées : d’abord les gravats de démolition, puis les déchets plus légers.","Comparez le coût total. Deux flux propres peuvent coûter moins cher à traiter qu’une seule benne mélangée, mais deux transports peuvent annuler l’économie. La bonne décision dépend des quantités, de la place et des tarifs locaux."],bullets:["Estimez séparément le volume minéral et le volume léger.","Demandez le coût d’une rotation plutôt que deux bennes en même temps.","Réservez les zones de stockage temporaire avant la démolition.","Affichez une consigne simple à proximité de chaque contenant."]},
      {id:"refus",title:"Pourquoi une benne peut-elle être refusée ?",paragraphs:["Le transporteur doit pouvoir déplacer la benne en sécurité et l’installation doit accepter son contenu. Un chargement dépassant les ridelles, trop lourd, contenant un liquide, un matériau dangereux ou un déchet non déclaré peut être refusé.","Le refus protège les équipes, le véhicule et la filière. Corriger le chargement sur place est généralement moins coûteux que de découvrir la non-conformité après transport."],bullets:["Retirez les déchets interdits avant l’enlèvement.","Ramenez le niveau sous les bords de la benne.","Ne tassez pas avec un engin sans accord.","Prévenez immédiatement si le contenu prévu a changé."]},
    ],
    faq:[["Le plâtre est-il un gravat ?","Non. Même s’il est issu du bâtiment, le plâtre n’est pas accepté dans une benne de gravats propres et dispose d’une filière séparée."],["Peut-on mettre de la terre dans une benne gravats ?","Uniquement après validation. La terre doit être non polluée et la filière, le volume et le poids doivent être compatibles."],["Une benne DIB accepte-t-elle les appareils électriques ?","En principe, les équipements électriques et électroniques relèvent d’une filière dédiée. Ne les mettez pas dans la benne sans accord explicite."],["Pourquoi les gravats propres sont-ils souvent moins chers ?","Ils peuvent être orientés plus directement vers une valorisation minérale, alors qu’un mélange DIB nécessite un tri plus important."],["Que choisir pour une rénovation de maison ?","Souvent une petite benne gravats pour la phase de démolition minérale, puis une benne DIB ou des contenants séparés pour le bois, le plâtre et les autres matériaux." ]],
    sources:[{label:"ADEME — Déchets inertes du bâtiment",url:"https://quefairedemesdechets.ademe.fr/dechet/inertes-batiment-btp/"},{label:"Ministère de la Transition écologique — Déchets du bâtiment",url:"https://www.ecologie.gouv.fr/politiques-publiques/dechets-du-batiment"}],
  },
  {
    slug:"location-benne-particulier",title:"Location de benne pour particulier : le guide de A à Z",seoTitle:"Location de benne pour particulier : prix, taille et démarches",excerpt:"Quand louer une benne, comment choisir le volume, préparer l’accès, obtenir l’autorisation et éviter les frais imprévus.",category:"Guide particulier",read:"10 min",wordCount:1133,image:"/guides/location-benne-particulier.jpg",imageAlt:"Une particulière échange avec un chauffeur près d’une benne orange devant une maison",datePublished:"2026-07-21",dateModified:"2026-07-21",
    quickAnswer:"Pour louer une benne en tant que particulier, listez d’abord les déchets, estimez leur volume et leur poids, vérifiez l’accès du camion puis demandez un devis tout compris. Si la benne reste sur votre terrain, aucune autorisation de voirie n’est généralement nécessaire. Sur la rue ou une place publique, obtenez l’accord de la mairie avant la livraison.",
    takeaways:["Pour moins de quelques mètres cubes triés, la déchèterie peut rester plus adaptée.","Le bon devis précise volume, déchet, durée, tonnage, transport et traitement.","Préparez un sol stable, un accès dégagé et des photos de l’emplacement.","Ne mettez jamais de déchets dangereux ou non déclarés dans la benne."],
    sections:[
      {id:"quand",title:"Quand une benne est-elle utile pour un particulier ?",paragraphs:["Une benne devient intéressante lorsque les déchets dépassent la capacité d’une voiture, lorsque les trajets en déchèterie prendraient plusieurs jours ou lorsque le chantier doit rester dégagé. Elle simplifie aussi la manutention : les déchets sont déposés une fois puis pris en charge par le transporteur.","Pour quelques sacs de gravats ou des objets acceptés gratuitement en point de collecte, la déchèterie peut être plus économique. Comparez le volume, la distance, le véhicule nécessaire, le temps et les règles d’accès de votre collectivité."],table:{headers:["Situation","Solution souvent pertinente"],rows:[["Quelques sacs ou petits objets triés","Déchèterie ou point de reprise"],["Salle de bain, petite terrasse, mur maçonné","Benne 8 m³ à étudier"],["Rénovation de plusieurs pièces","Benne 10 à 15 m³ ou rotations séparées"],["Débarras de maison","Benne 15 à 20 m³ selon encombrement"],["Déchets dangereux ou amiante","Filière spécialisée, pas de benne standard"]]}},
      {id:"etapes",title:"Les 8 étapes d’une location réussie",paragraphs:["La prestation est simple lorsque les décisions sont prises dans le bon ordre."],bullets:["Lister les travaux et les matériaux à évacuer.","Séparer ce qui peut être donné, réemployé ou repris gratuitement.","Estimer volume et poids par famille de déchets.","Photographier l’accès et l’emplacement.","Demander un devis détaillé avec tonnage inclus.","Obtenir l’autorisation si le domaine public est occupé.","Préparer le site avant l’arrivée du camion.","Contrôler le remplissage puis programmer l’enlèvement."],callout:{title:"Le meilleur renseignement à donner",text:"Une description précise — « tuiles et briques d’une toiture de 60 m² » — est plus utile que « déchets de travaux ».",tone:"tip"}},
      {id:"choisir",title:"Choisir le volume et le type de benne",paragraphs:["Le volume dépend de l’encombrement, mais les déchets lourds atteignent la charge maximale avant de remplir une grande benne. Pour les gravats, les formats 8 à 10 m³ sont souvent privilégiés. Pour les meubles et matériaux légers, 15 à 20 m³ peuvent être adaptés.","Ne mélangez pas automatiquement tout ce qui sort de la maison. Les gravats propres, le bois, le plâtre, les déchets électriques et les déchets dangereux suivent des consignes différentes. Un tri préparé peut réduire le coût et améliorer la valorisation."],bullets:["Gravats : béton, briques, tuiles et pierres propres selon acceptation.","DIB : déchets non dangereux non inertes autorisés par le prestataire.","Bois et déchets verts : bennes dédiées lorsque le volume le justifie.","Amiante, peintures, solvants, batteries : filières spécialisées."]},
      {id:"acces-particulier",title:"Préparer l’accès et protéger votre propriété",paragraphs:["Un camion ampliroll est lourd et long. L’accès doit être suffisamment large, haut et résistant. Les portails étroits, arbres, câbles, avant-toits, pentes et virages doivent être signalés avant la livraison.","La benne chargée exerce une forte pression sur ses points d’appui. Des planches ou plaques répartissent partiellement la charge mais ne rendent pas un sol fragile porteur. Demandez l’avis du transporteur pour les pavés, enrobés récents, dalles, réseaux enterrés ou fosses."],bullets:["Dégager les véhicules et matériaux avant l’arrivée.","Prévoir une zone de manœuvre, pas seulement l’empreinte de la benne.","Identifier les regards, canalisations et sols creux.","Éloigner enfants et animaux pendant la manœuvre.","Ne jamais guider le camion depuis un angle mort."],callout:{title:"Photos recommandées",text:"Envoyez une vue depuis la rue, une vue du portail et une vue de l’emplacement. Mentionnez la largeur utile et la hauteur sous obstacle.",tone:"info"}},
      {id:"voirie-particulier",title:"Terrain privé ou rue : quelles démarches ?",paragraphs:["Une pose entièrement sur votre terrain ne nécessite généralement pas d’autorisation d’occupation du domaine public. Vérifiez toutefois le règlement de copropriété, de lotissement ou les règles d’accès si elles s’appliquent.","Pour une pose sur chaussée, trottoir ou place publique, contactez le service voirie. La commune peut demander un permis de stationnement, un plan, les dimensions, les dates et un balisage. Attendez l’accord avant de confirmer la livraison." ]},
      {id:"remplissage",title:"Comment remplir la benne correctement",paragraphs:["Répartissez la charge et gardez les matériaux sous le niveau des ridelles. Placez les éléments stables au fond sans créer de point de surcharge et démontez les objets volumineux lorsque cela est autorisé.","Ne montez pas sur le bord de la benne, ne brûlez rien et n’utilisez pas un engin pour compacter sans accord. Une surcharge visuelle ou pondérale peut empêcher l’enlèvement."],bullets:["Contrôler les apports de voisins ou de passants.","Couvrir la benne si le site est accessible ou si des matériaux peuvent s’envoler.","Garder les déchets dangereux dans une zone sécurisée distincte.","Prévenir le loueur si le contenu change pendant les travaux." ]},
      {id:"devis-particulier",title:"Lire le devis avant de payer",paragraphs:["Vérifiez l’adresse, les dates, le volume, le déchet déclaré, la durée, le tonnage compris et les suppléments. Le devis doit aussi préciser la TVA, les modalités de report et les conditions d’accès.","Demandez qui appeler pour l’enlèvement et sous quel délai le camion peut revenir. Si vos travaux dépendent de la libération de l’emplacement, ce point est aussi important que la date de livraison."],table:{headers:["À vérifier","Pourquoi"],rows:[["Tonnage inclus","Évite une surprise après la pesée"],["Durée","Cadre les jours supplémentaires"],["Déchets acceptés","Évite refus et reclassement"],["Transport et traitement","Permet une comparaison complète"],["Accès impossible","Précise les frais de déplacement"],["Enlèvement","Fixe la procédure et le délai de reprise"]]}},
    ],
    faq:[["Un particulier peut-il louer une benne ?","Oui. Le loueur doit simplement connaître l’adresse, l’accès, le type de déchets, le volume et les dates souhaitées."],["Combien de jours peut-on garder la benne ?","Notre offre standard prévoit généralement 7 jours. La durée exacte et le prix d’un jour supplémentaire figurent au devis."],["La mairie peut-elle refuser la benne ?","Oui, sur le domaine public, pour des raisons de circulation, sécurité ou disponibilité. Une autre zone ou un format plus compact peut parfois être proposé."],["Peut-on mettre les meubles et gravats ensemble ?","Pas dans une benne de gravats propres. Une benne DIB peut accepter certains meubles, mais la liste doit être confirmée."],["Dois-je être présent à la livraison ?","C’est fortement recommandé, surtout si le positionnement est précis. Si vous êtes absent, les consignes doivent avoir été validées et l’emplacement clairement identifié."],["Que faire si la benne est pleine plus tôt ?","Contactez le loueur. Il peut organiser l’enlèvement ou une rotation ; n’ajoutez rien au-dessus des ridelles." ]],
    sources:[{label:"ADEME — Que faire de mes déchets",url:"https://quefairedemesdechets.ademe.fr/"},{label:"Service-Public — Notice d’occupation du domaine public routier",url:"https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaFormulaire=14023&cerfaNotice=51406"}],
  },
  {
    slug:"dechets-interdits-benne",title:"Déchets interdits dans une benne : liste et solutions",seoTitle:"Déchets interdits dans une benne : amiante, peinture, batterie…",excerpt:"La liste des déchets dangereux ou spécifiques à ne jamais déposer dans une benne standard, avec la bonne filière pour chacun.",category:"Sécurité",read:"10 min",wordCount:1088,image:"/guides/dechets-interdits-benne.jpg",imageAlt:"Expert équipé inspectant des déchets dangereux isolés d’une benne orange",datePublished:"2026-07-21",dateModified:"2026-07-21",
    quickAnswer:"Sont interdits dans une benne standard : amiante, peintures et solvants liquides, huiles, produits chimiques, batteries, bouteilles de gaz, extincteurs, déchets médicaux, explosifs et tout déchet inconnu ou réactif. Pneus, appareils électriques, réfrigérateurs et certains matériaux disposent aussi de filières dédiées. Isolez-les et demandez une solution spécialisée avant l’enlèvement.",
    takeaways:["« Non dangereux » ne signifie pas « tous déchets acceptés ».","Ne manipulez ni ne cassez un matériau suspecté d’amiante.","Gardez les liquides dans leur contenant d’origine, fermés et à l’abri.","Si un déchet interdit est déjà dans la benne, arrêtez le chargement et prévenez le loueur."],
    sections:[
      {id:"pourquoi",title:"Pourquoi certains déchets sont-ils interdits ?",paragraphs:["Une benne standard, son camion et le centre de tri sont conçus pour des déchets identifiés. Un produit corrosif, inflammable, toxique, sous pression ou contenant des fibres dangereuses expose le client, le chauffeur, les opérateurs et l’environnement.","D’autres déchets ne sont pas nécessairement dangereux mais relèvent d’une filière organisée : équipements électriques, pneus, bouteilles de gaz ou déchets contenant des fluides. Leur présence peut provoquer un refus, une immobilisation et un traitement spécifique."],callout:{title:"Principe de précaution",text:"Si vous ne savez pas identifier un produit, ne le déposez pas dans la benne. Photographiez l’étiquette sans ouvrir le contenant et demandez conseil.",tone:"warning"}},
      {id:"liste",title:"Liste des principaux déchets interdits",paragraphs:["La liste contractuelle du prestataire reste la référence. Les familles ci-dessous sont généralement exclues des bennes classiques."],table:{headers:["Déchet","Risque ou particularité","Orientation"],rows:[["Amiante et matériaux suspects","Fibres cancérogènes, réglementation stricte","Opérateur qualifié et filière amiante"],["Peintures, solvants, colles liquides","Inflammables ou toxiques","Déchèterie acceptant les déchets chimiques ou prestataire spécialisé"],["Huiles et carburants","Pollution, incendie","Collecteur agréé ou point de collecte"],["Batteries et piles","Acides, métaux et risque électrique","Point de reprise ou filière batteries"],["Bouteilles de gaz et extincteurs","Récipient sous pression","Retour fournisseur ou filière dédiée"],["Produits phytosanitaires et chimiques","Toxicité et réactions","Collecte spécialisée, contenant fermé"],["Déchets médicaux perforants","Risque infectieux et coupure","Filière DASRI"],["Pneus","Filière dédiée","Garagiste ou collecteur"],["Équipements électriques","Composants et fluides spécifiques","Distributeur, déchèterie ou filière DEEE"],["Terres suspectes ou polluées","Pollution non caractérisée","Analyse et exutoire autorisé"]]}},
      {id:"amiante",title:"Amiante : ne pas manipuler, ne pas casser, ne pas mélanger",paragraphs:["L’amiante peut être présent dans des plaques de toiture, conduits, dalles, colles, calorifugeages et autres produits anciens. Son apparence ne permet pas toujours de l’identifier avec certitude.","Si un matériau est suspect, stoppez les travaux dans la zone et faites établir le diagnostic approprié. Une évacuation amiante utilise des emballages, opérateurs, bordereaux et installations spécifiques. Une benne standard n’est jamais une solution de secours."],bullets:["Ne pas percer, scier, casser ou brosser.","Ne pas balayer ni utiliser un aspirateur domestique.","Éloigner les personnes de la zone.","Contacter un diagnostiqueur ou une entreprise compétente.","Informer le loueur si un matériau suspect a touché le chargement."],callout:{title:"Urgence de conformité",text:"Si de l’amiante suspecté est découvert dans une benne, ne tentez pas de le retirer sans consigne professionnelle. Sécurisez l’accès et appelez immédiatement le prestataire.",tone:"warning"}},
      {id:"liquides",title:"Peintures, solvants et produits chimiques",paragraphs:["Les restes liquides, boues, diluants, aérosols, résines et produits d’entretien ne doivent pas être versés, mélangés ou laissés dans une benne. Même un petit contenant peut fuir pendant le transport ou réagir avec un autre produit.","Conservez l’emballage d’origine et l’étiquette. Fermez le bouchon, placez le contenant debout dans une rétention adaptée et consultez les consignes de votre déchèterie ou de la filière professionnelle."],bullets:["Ne jamais transvaser dans une bouteille alimentaire.","Ne jamais mélanger deux produits pour gagner de la place.","Ne pas jeter un pot qui contient encore du liquide.","Signaler tout contenant gonflé, rouillé ou fuyant au professionnel." ]},
      {id:"deee",title:"Appareils électriques, batteries et équipements avec fluide",paragraphs:["Réfrigérateurs, climatiseurs, écrans, outils électriques, batteries et autres équipements ne doivent pas être dissimulés dans les encombrants. Ils contiennent des composants valorisables et parfois des substances ou fluides qui nécessitent une dépollution.","Utilisez la reprise du distributeur, les points de collecte et les déchèteries qui acceptent la catégorie concernée. Pour un chantier professionnel, organisez une collecte dédiée et conservez les justificatifs." ]},
      {id:"trouver-filiere",title:"Comment trouver la bonne filière ?",paragraphs:["Commencez par l’outil « Que faire de mes déchets » de l’ADEME et par le règlement de votre déchèterie. Les quantités, le statut particulier ou professionnel et le conditionnement influencent l’accès.","Pour des déchets dangereux professionnels, l’opérateur doit préciser le conditionnement, le transport, le bordereau et l’installation destinataire. La plateforme Trackdéchets dématérialise plusieurs bordereaux réglementaires."],bullets:["Identifier précisément le produit et conserver son emballage.","Estimer la quantité sans ouvrir ni manipuler inutilement.","Indiquer votre statut : particulier, artisan ou entreprise.","Demander les conditions de transport et de dépôt.","Conserver la preuve de remise à la filière." ]},
      {id:"contamination",title:"Que faire si un déchet interdit est déjà dans la benne ?",paragraphs:["Arrêtez immédiatement le remplissage et interdisez l’accès. N’essayez pas de masquer le déchet ou de le recouvrir. Prenez une photo à distance si cela ne vous expose pas et contactez le loueur en décrivant précisément la situation.","Le prestataire décidera si le déchet peut être retiré par une personne équipée, si la benne doit être isolée ou si un opérateur spécialisé doit intervenir. Cette décision dépend de la nature du produit ; il n’existe pas de procédure unique."],callout:{title:"Transparence obligatoire",text:"Prévenir tôt limite le risque humain et le coût. Un déchet dangereux découvert au centre de tri peut immobiliser le chargement et déclencher une procédure bien plus complexe.",tone:"tip"}},
    ],
    faq:[["Peut-on mettre des pots de peinture vides dans une benne ?","Uniquement s’ils sont réellement vides, secs et acceptés par la filière indiquée par le prestataire. Un fond liquide suffit à rendre le contenant problématique."],["Les pneus sont-ils dangereux ?","Ils ne sont pas nécessairement classés dangereux, mais ils relèvent d’une filière dédiée et sont généralement refusés dans une benne standard."],["Peut-on jeter un réfrigérateur avec des meubles ?","Non. Les équipements frigorifiques contiennent des composants et fluides spécifiques ; utilisez la reprise distributeur ou une collecte DEEE."],["Comment reconnaître l’amiante ?","L’apparence ne suffit pas. L’âge du bâtiment et le type de matériau donnent des indices, mais seul un diagnostic adapté permet de conclure."],["Où déposer des solvants pour un particulier ?","Consultez votre déchèterie et l’outil ADEME pour connaître les points acceptant les déchets chimiques, leurs horaires et limites."],["Que risque-t-on si un déchet interdit est découvert ?","Le chargement peut être refusé, reclassé ou immobilisé. Des frais de tri, de transport et de traitement spécialisé peuvent s’ajouter, sans compter la responsabilité liée au danger créé." ]],
    sources:[{label:"ADEME — Que faire de mes déchets",url:"https://quefairedemesdechets.ademe.fr/"},{label:"Trackdéchets — Plateforme officielle de traçabilité",url:"https://trackdechets.beta.gouv.fr/"},{label:"Service-Public — Bordereau de suivi des déchets dangereux contenant de l’amiante",url:"https://www.formulaires.service-public.fr/gf/cerfa_11861.do"}],
  },
];
