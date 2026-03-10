export const countryNumberCode: string = "+229";
export const country: string = "Benin";
export const countryCode: string = "BJ";
export const currency = {
    DEFAULT: 'XOF',
    XOF: 'XOF',
    EUR: '€',
    USD: '$'
};


export const tab_niveauEtude = [
    "Sans diplôme",
    "CEP",
    "BEP / CAP",
    "Baccalauréat",
    "Bac +2 (BTS, DUT)",
    "Licence (Bac +3)",
    "Master 1 (Bac +4)",
    "Master 2 (Bac +5)",
    "Doctorat / PhD"
];

export const tab_typeContrat = [
    "CDI", "CDD", "Freelance", "Stage", "Autre"
]
export const SEARCH_SESSION_KEY = "appels_offres_search_criteres";

export const allPays = ["Bénin", "Togo", "Côte d’Ivoire", "Sénégal", "Cameroun"];
export const allVilles = ["Cotonou", "Parakou", "Abomey-Calavi"];
export const allSecteurs = ["BTP", "Informatique", "Santé", "Éducation"];
export const typeAnnonce = ["Offre d'emploi", "Appel d'offre", "Appel à manifestation d'intérêt (AMI)", "Consultation", "Recrutement consultant"]

export function treatment_msg_to_send(msg: string): string {
    if (!msg.trim()) return "";

    return msg
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "''")
        .replace(/\n/g, "<br>")
        .replace(/ /g, "&nbsp;");
}

function decodeHTML(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export function reverse_treatment_msg(msg: string): string {
    if (!msg) return "";

    let result = msg
        .replace(/&nbsp;/g, " ")
        .replace(/<br\s*\/?>/gi, "\n") // gère les retours à la ligne
        .replace(/''/g, "'");

    // Décodage profond via DOM
    result = decodeHTML(result);
    result = decodeHTML(result); // une seconde passe si nécessaire
    result = decodeHTML(result); // une seconde passe si nécessaire
    result = decodeHTML(result); // une seconde passe si nécessaire
    result = decodeHTML(result); // une seconde passe si nécessaire

    return result;
}

export const EXPERIENCE_MAP: Record<string, string> = {
    debutant: "Débutant",
    intermediaire: "Intermédiaire",
    senior: "Senior",
};

export const NIVEAU_ETUDE_MAP: Record<string, string> = {
    bac: "Baccalauréat",
    licence: "Licence",
    master: "Master",
    doctorat: "Doctorat",
};

export const TYPE_CONTRAT_MAP: Record<string, string> = {
    cdi: "CDI",
    cdd: "CDD",
    freelance: "Freelance",
    stage: "Stage",
    autre: "Autre",
};

export const PAYS_CODE_MAP: Record<string, string> = {
    "Bénin": "BJ",
    "Togo": "TG",
    "Côte d’Ivoisre": "CI",
    "Sénégal": "SN",
    "Cameroun": "CM",
};


export const TYPE_DISPLAY_MAP: Record<string, string> = {
    "offre_emploi": "Offre d'emploi",
    "appel_offre": "Appel d'offre",
    "ami": "Appel à manifestation d'intérêt (AMI)",
    "consultation": "Consultation",
    "recrutement_consultant": "Recrutement consultant",
};


export const TYPE_INTERNAL_MAP: Record<string, string> = {
    "Offre d'emploi": "offre_emploi",
    "Appel d'offre": "appel_offre",
    "Appel à manifestation d'intérêt (AMI)": "ami",
    "Consultation": "consultation",
    "Recrutement consultant": "recrutement_consultant",
};


export const CATEGORIE_LABELS: Record<string, string> = {

    agronomie: "Agronomie",
    agriculture: "Agriculture",
    elevage: "Élevage",
    production_vegetale: "Production végétale",
    agro_ecologie: "Agroécologie",
    agro_business: "Agro-business",
    irrigation: "Irrigation agricole",


    // IT & Digital
    informatique: "Informatique / IT",
    developpement_web: "Développement Web",
    developpement_mobile: "Développement Mobile",
    reseaux_systemes: "Réseaux & Systèmes",
    data_ia: "Data / IA",
    cybersécurité: "Cybersécurité",
    design_graphique: "Design & Graphisme",
    seo_marketing_digital: "SEO / Marketing Digital",

    // Business & Commercial
    business: "Business / Commercial",
    marketing: "Marketing",
    vente_commercial: "Vente / Commercial",
    gestion_projet: "Gestion de projet",
    relation_client: "Relation Client",
    strategie: "Stratégie & Management",

    // Finance & Administration
    finance_admin: "Finance & Administration",
    comptabilite: "Comptabilité",
    finance: "Finance",
    administration: "Administration",
    audit: "Audit",
    juridique: "Juridique",
    ressources_humaines: "Ressources humaines",
    paie: "Paie & Social",

    // BTP & Immobilier
    btp_immobilier: "BTP & Immobilier",
    btp: "Bâtiment & Travaux Publics",
    architecture: "Architecture",
    immobilier: "Immobilier",
    genie_civil: "Génie Civil",


    // Santé & Education
    sante_education: "Santé & Éducation",
    sante: "Santé",
    education: "Éducation",
    formation: "Formation",

    // Transport & Logistique
    transport_logistique: "Transport & Logistique",
    supply_chain: "Supply Chain",
    maintenance: "Maintenance",

    // Energie & Environnement
    energie_environnement: "Énergie & Environnement",
    energie: "Énergie",
    environnement: "Environnement",
    eau_assainissement: "Eau & Assainissement",

    // Appels d’offres
    appel_offre_btp: "Appel d’offres – BTP",
    appel_offre_services: "Appel d’offres – Services",
    appel_offre_fournitures: "Appel d’offres – Fournitures",

    // electricite
    electricite: "Électricité générale",
    electricite_batiment: "Électricité bâtiment",
    electricite_industrielle: "Électricité industrielle",


    // Services & Autres
    services: "Services",
    restauration: "Restauration / Hôtellerie",
    tourisme: "Tourisme",
    consulting: "Consultance",
    fournitures: "Fournitures",
    autre: "Autre"
};

export const CATEGORIE_DOMAINES: Record<string, string> = {

    // Agriculture & Agronomie
    agronomie: "Agronomie",
    agriculture: "Agriculture",
    elevage: "Élevage",
    production_vegetale: "Production végétale",
    agro_ecologie: "Agroécologie",
    agro_business: "Agro-business",
    irrigation: "Irrigation agricole",

    // IT & Digital
    informatique: "Informatique / IT",
    developpement_web: "Développement Web",
    developpement_mobile: "Développement Mobile",
    reseaux_systemes: "Réseaux & Systèmes",
    data_ia: "Data / IA",
    cybersécurité: "Cybersécurité",
    design_graphique: "Design & Graphisme",
    seo_marketing_digital: "SEO / Marketing Digital",

    // Business & Commercial
    business: "Business / Commercial",
    marketing: "Marketing",
    vente_commercial: "Vente / Commercial",
    gestion_projet: "Gestion de projet",
    relation_client: "Relation Client",
    strategie: "Stratégie & Management",

    // Finance & Administration
    finance_admin: "Finance & Administration",
    comptabilite: "Comptabilité",
    finance: "Finance",
    administration: "Administration",
    audit: "Audit",
    juridique: "Juridique",
    ressources_humaines: "Ressources humaines",
    paie: "Paie & Social",

    // BTP & Immobilier
    btp_immobilier: "BTP & Immobilier",
    btp: "Bâtiment & Travaux Publics",
    architecture: "Architecture",
    immobilier: "Immobilier",
    genie_civil: "Génie Civil",

    // Santé & Education
    sante_education: "Santé & Éducation",
    sante: "Santé",
    education: "Éducation",
    formation: "Formation",

    // Transport & Logistique
    transport_logistique: "Transport & Logistique",
    supply_chain: "Supply Chain",
    maintenance: "Maintenance",

    // Energie & Environnement
    energie_environnement: "Énergie & Environnement",
    energie: "Énergie",
    environnement: "Environnement",
    eau_assainissement: "Eau & Assainissement",

    // electricite
    electricite: "Électricité générale",
    electricite_batiment: "Électricité bâtiment",
    electricite_industrielle: "Électricité industrielle",

    // Appels d’offres
    appel_offre_btp: "Appel d’offres – BTP",
    appel_offre_services: "Appel d’offres – Services",
    appel_offre_fournitures: "Appel d’offres – Fournitures",



    // Services & Autres
    services: "Services",
    restauration: "Restauration / Hôtellerie",
    tourisme: "Tourisme",
    consulting: "Consultance",
    fournitures: "Fournitures",
    autre: "Autre"
};

export function getCategorieLabel(categorie?: string | null): string {
    if (!categorie) return "—";
    return CATEGORIE_LABELS[categorie] || categorie;
}

export function truncateWords(text: string, maxWords = 5) {
    if (!text) return "";

    const words = text.trim().split(/\s+/);

    if (words.length <= maxWords) return text;

    return words.slice(0, maxWords).join(" ") + " ...";
}

export const COUNTRY_LABELS: Record<string, string> = {
    benin: "Bénin",
    senegal: "Sénégal",
    cote_ivoire: "Côte d’Ivoire",
    togo: "Togo",
    cameroun: "Cameroun",
};

export const CITY_BY_COUNTRY: Record<string, string[]> = {
    benin: [
        "Cotonou",
        "Porto-Novo",
        "Parakou",
        "Abomey-Calavi",
        "Ouidah",
        "Lokossa",
        "Natitingou"
    ],

    senegal: [
        "Dakar",
        "Pikine",
        "Guédiawaye",
        "Thiès",
        "Saint-Louis",
        "Kaolack",
        "Ziguinchor"
    ],

    cote_ivoire: [
        "Abidjan",
        "Bouaké",
        "Yamoussoukro",
        "San-Pédro",
        "Daloa",
        "Korhogo"
    ],

    togo: [
        "Lomé",
        "Kara",
        "Sokodé",
        "Atakpamé",
        "Dapaong",
        "Tsévié"
    ],

    cameroun: [
        "Douala",
        "Yaoundé",
        "Bafoussam",
        "Garoua",
        "Bamenda",
        "Maroua"
    ]
};

export const TIMEZONE_LABELS: Record<string, string> = {
    "UTC+1": "WAT (UTC+1) — Afrique de l’Ouest & Centrale",
    "UTC+0": "GMT (UTC+0) — Afrique de l’Ouest",
};

