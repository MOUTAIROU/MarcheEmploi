'use client';
import React, { ForwardRefExoticComponent, RefAttributes, useRef, useState, useEffect } from "react";
import './style.css';
import Image from "next/image";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import CVUploader from "@/components/CVUploader/page";
import api from "@/lib/axiosInstance";
import { refreshAndRetry } from "@/utils/refreshAndRetry";
import { useSession } from "@/lib/sessionStore";


/**
 * Importation des module du Cv
*/
import InformationPersonnelle, { InfoPersonnelleRef } from "@/components/Cv/InformationPersonnelle/page";
import DescriptionProfile, { DescriptionEditorRef } from "@/components/Cv/DescriptionProfile/page";
import FormationSection, { FormationSectionRef, Formation } from "@/components/Cv/FormationSection/page";
import ExperienceSection, { ExperienceSectionRef, Experience } from "@/components/Cv/ExperienceSection/page";
import CompetenceForm, { CompetenceFormRef } from "@/components/Cv/CompetenceForm/page";
import LangueForm, { LangueFormRef } from "@/components/Cv/LangueForm/page";
import CentreInteret, { CentreInteretRef } from "@/components/Cv/CentreInteret/page";
import CoursForm, { CoursRef, CoursItem } from "@/components/Cv/CoursForm/page";
import StageSection, { StageSectionRef, Stage } from "@/components/Cv/StageSection/page";
import ActivitesExtraScolairesSection, { ActivitesExtraScolairesSectionRef, ActivitesExtraScolaires } from "@/components/Cv/ActivitesExtraScolaires/page";
import ReferenceForm, { ReferenceFormRef, Reference } from "@/components/Cv/ReferenceForm/page";
import QualiteForm, { QualiteFormRef } from "@/components/Cv/QualiteForm/page";
import CertificatsForm, { CertificatsRef, CertificatsItem } from "@/components/Cv/CertificatsForm/page";
import RealisationForm, { RealisationFormRef } from "@/components/Cv/RealisationForm/page";
import SignatureSection, { SignatureRef } from "@/components/Cv/SignatureForm/page";
import RubriquesPersonnalisees, { RubriquesPersonnaliseesRef, RubriquePersonnalisee } from "@/components/Cv/RubriquePersonnalisee/page";


const moisMap: Record<number, string> = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
};



// Mapping pour la section "formations"
const mapKeysFormations = {
    "titre": "titre",
    "etablissement": "etablissement",
    "ville": "ville",
    "debutMois": "debutMois",
    "debutAnnee": "debutAnnee",
    "finMois": "finMois",
    "finAnnee": "finAnnee",
    "enCours": "enCours",
    "description": "description",
};


// Mapping pour la section "formations"
const mapKeysInformationPersonnelleaa = {
    "Prénom": "prenom",
    "Nom de famille": "nom_de_famille",
    "Emploi recherché": "emploi_recherche",
    "Adresse e-mail": "adresse_email",
    "Numéro de téléphone": "numero_telephone",
    "Adresse": "adresse",
    "Code postal": "code_postal",
    "Ville": "ville",
    "Date de naissance": "date_de_naissance",
    "Lieu de naissance": "lieu_naissance",
    "Permis de conduire": "permis_conduire",
    "Sexe": "sexe",
    "Nationalité": "nationalite",
    "État civil": "etat_civil",
    "Site internet": "site_internet",
    "LinkedIn": "linkedin",
    "Autre": "autre",
    "Champs Personnel": "champs_personnel"
};


const mapKeysInformationPersonnelle = {
    prenom: "Prénom",
    nom_de_famille: "Nom de famille",
    emploi_recherche: "Emploi recherché",
    adresse_email: "Adresse e-mail",
    numero_telephone: "Numéro de téléphone",
    adresse: "Adresse",
    code_postal: "Code postal",
    ville: "Ville",
    date_de_naissance: "Date de naissance",
    lieu_naissance: "Lieu de naissance",
    permis_conduire: "Permis de conduire",
    sexe: "Sexe",
    nationalite: "Nationalité",
    etat_civil: "État civil",
    site_internet: "Site internet",
    linkedin: "LinkedIn",
    autre: "Autre",
    champs_personnel: "Champs Personnel"
};
// Mapping pour la section "Experiences"
const mapKeysExperiences = {
    "titre": "titre",
    "etablissement": "etablissement",
    "ville": "ville",
    "debutMois": "debutMois",
    "debutAnnee": "debutAnnee",
    "finMois": "finMois",
    "finAnnee": "finAnnee",
    "enCours": "enCours",
    "description": "description",
};

// Mapping pour la section "Langue"
const mapKeysLangue = {
    "nom": "nom",
    "niveau": "niveau",
};

// Mapping pour la section "Competences"
const mapKeysCompetences = {
    "nom": "nom",
    "niveau": "niveau",
};



// Mapping pour la section "mapKeysCours"
const mapKeysCours = {
    "titre": "titre",
    "mois": "mois",
    "annee": "annee",
    "description": "description",
    "enCours": "enCours",
};


// Mapping pour la section "Stages"
const mapKeysStages = {
    "titre": "titre",
    "etablissement": "etablissement",
    "ville": "ville",
    "debutMois": "debutMois",
    "debutAnnee": "debutAnnee",
    "finMois": "finMois",
    "finAnnee": "finAnnee",
    "enCours": "enCours",
    "description": "description",
};


// Mapping pour la section "Activite"
const mapKeysActivite = {
    "titre": "titre",
    "etablissement": "etablissement",
    "ville": "ville",
    "debutMois": "debutMois",
    "debutAnnee": "debutAnnee",
    "finMois": "finMois",
    "finAnnee": "finAnnee",
    "enCours": "enCours",
    "description": "description",
};



// Mapping pour la section "References"
const mapKeysReferences = {
    "nom": "nom",
    "entreprise": "entreprise",
    "ville": "ville",
    "telephone": "telephone",
    "email": "email",
};




// Mapping pour la section "Certificats"
const mapKeysCertificats = {
    "titre": "titre",
    "mois": "mois",
    "annee": "annee",
    "description": "description",
    "enCours": "enCours",
};


// Mapping pour la section "Signature"
const mapKeysSignature = {
    "nom": "nom",
    "ville": "ville",
    "date": "date",
    "consentement": "consentement",
};


// Mapping pour la section "RubriquePersonnalisee"
const mapKeysRubriquesPersonnalisees = {
    "titre": "titre",
    "tidescriptiontre": "description",
    "daliente": "lien",
    "date": "date",
};






/**
 * Associe le nom de la section (champ) à son composant réel
*/

interface SectionComponent {
    component: React.FC | ForwardRefExoticComponent<RefAttributes<any>>;
    withRef?: boolean;
}

interface Section {
    champ: string;
    display: boolean;
}


type CVBackend = any; // JSON renvoyé par ton API
type CVFrontend = any; // Objet formaté pour ton frontend


// 🔹 Typage : toutes les refs exposent potentiellement un composant enfant avec des méthodes
// comme getData(), fillWithSuggestion(), etc.
type GenericRef = React.RefObject<any>;


// Définir les sections extras
const extras = [
    "Cours",
    "Stages",
    "Activités extra-scolaires",
    "Références",
    "Qualités",
    "Certificats",
    "Réalisations",
    "Signature",
    "Rubrique personnalisée",
];


const sectionComponents: Record<string, SectionComponent> = {
    "Informations personnelles": { component: InformationPersonnelle as ForwardRefExoticComponent<RefAttributes<InfoPersonnelleRef>>, withRef: true },
    "Profil": { component: DescriptionProfile as ForwardRefExoticComponent<RefAttributes<DescriptionEditorRef>>, withRef: true },
    "Formation": { component: FormationSection as ForwardRefExoticComponent<RefAttributes<FormationSectionRef>>, withRef: true },
    "Expérience professionnelle": { component: ExperienceSection as ForwardRefExoticComponent<RefAttributes<ExperienceSectionRef>>, withRef: true },
    "Compétences": { component: CompetenceForm as ForwardRefExoticComponent<RefAttributes<CompetenceFormRef>>, withRef: true },
    "Langue": { component: LangueForm as ForwardRefExoticComponent<RefAttributes<LangueFormRef>>, withRef: true },
    "Centre d’intérêt": { component: CentreInteret as ForwardRefExoticComponent<RefAttributes<CentreInteretRef>>, withRef: true },
    "Cours": { component: CoursForm as ForwardRefExoticComponent<RefAttributes<CoursRef>>, withRef: true },
    "Stages": { component: StageSection as ForwardRefExoticComponent<RefAttributes<StageSectionRef>>, withRef: true },
    "Activités extra-scolaires": { component: ActivitesExtraScolairesSection as ForwardRefExoticComponent<RefAttributes<ActivitesExtraScolairesSectionRef>>, withRef: true },
    "Références": { component: ReferenceForm as ForwardRefExoticComponent<RefAttributes<ReferenceFormRef>>, withRef: true },
    "Qualités": { component: QualiteForm as ForwardRefExoticComponent<RefAttributes<QualiteFormRef>>, withRef: true },
    "Certificats": { component: CertificatsForm as ForwardRefExoticComponent<RefAttributes<CertificatsRef>>, withRef: true },
    "Réalisations": { component: RealisationForm as ForwardRefExoticComponent<RefAttributes<RealisationFormRef>>, withRef: true },
    "Signature": { component: SignatureSection as ForwardRefExoticComponent<RefAttributes<SignatureRef>>, withRef: true },
    "Rubrique personnalisée": { component: RubriquesPersonnalisees as ForwardRefExoticComponent<RefAttributes<RubriquesPersonnaliseesRef>>, withRef: true },


    // etc.
};


export default function Home() {

    const { accessToken, refreshToken, newAccessToken } = useSession(); // <- récupère depuis le contexte
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchPreferences();
    }, []);
    async function fetchPreferences() {
        try {
            const res = await api.get("/candidats_cv/get_cand_envoie_cv");

            console.log("Réponse :", res.data);

            if (!res.data?.data?.cv) {
                console.warn("Aucun CV trouvé");
                return;
            }

            const serverCV = res.data.data.cv;

            // 🔁 Normalisation backend -> frontend
            const normalizedCV = {
                informations: serverCV.Informations || {},
                formations: serverCV.Formation || [],
                experiences: serverCV.Experience || [],
                competences: serverCV.Competence || [],
                langues: serverCV.Langue || [],
                cours: serverCV.Cours || [],
                stages: serverCV.Stages || [],
                activites: serverCV.Activites || [],
                references: serverCV.References || [],
                certificats: serverCV.Certificats || [],
                qualites: serverCV.Qualites || [],
                centres: serverCV.Centres || [],
                realisations: serverCV.Realisations || [],
                signature: serverCV.Signature || {},
                rubriquesPersonnalisees: serverCV.RubriquesPersonnalisees || [],
                profile: serverCV.Profil || "",
            };

            // 🔥 Mapping final avec TA fonction
            const mappedCV = mapCVData(normalizedCV);

            // 🔒 Stockage temporaire (comme ton import JSON)
            pendingCVData.current = mappedCV;

            console.log("✅ CV prérempli depuis le serveur", mappedCV);


            // 🔓 Afficher les sections existantes
        
        // 📂 Ouvrir automatiquement infos perso
        setOpened("Informations personnelles");

        alert("✅ CV chargé depuis le serveur avec succès");


        } catch (e) {
            console.error("Erreur récupération préférences", e);
        }
    }

    const [opened, setOpened] = useState<string | null>(null);
    const [sections, setSections] = useState<Section[]>([
        // sections principales (affichées par défaut)
        { champ: "Informations personnelles", display: true },
        { champ: "Profil", display: true },
        { champ: "Formation", display: true },
        { champ: "Expérience professionnelle", display: true },
        { champ: "Compétences", display: true },
        { champ: "Langue", display: true },
        { champ: "Centre d’intérêt", display: true },

        // extras (masquées au départ)
        { champ: "Cours", display: false },
        { champ: "Stages", display: false },
        { champ: "Activités extra-scolaires", display: false },
        { champ: "Références", display: false },
        { champ: "Qualités", display: false },
        { champ: "Certificats", display: false },
        { champ: "Réalisations", display: false },
        { champ: "Signature", display: false },
        { champ: "Rubrique personnalisée", display: false },
    ]);



    const pendingCVData = useRef<any | null>(null);
    const infoRef = useRef<InfoPersonnelleRef>(null);
    const desProfRef = useRef<DescriptionEditorRef>(null);
    const formationRef = useRef<FormationSectionRef>(null);
    const experienceRef = useRef<ExperienceSectionRef>(null);
    const competenceRef = useRef<CompetenceFormRef>(null);
    const langueFormRef = useRef<LangueFormRef>(null);
    const centreInteretRef = useRef<CentreInteretRef>(null);
    const coursRef = useRef<CoursRef>(null);
    const stagesRef = useRef<StageSectionRef>(null);
    const activitesExtraScolairesSectionRef = useRef<ActivitesExtraScolairesSectionRef>(null);
    const referenceFormRef = useRef<ReferenceFormRef>(null);
    const qualiteFormRef = useRef<QualiteFormRef>(null);
    const certificatsRef = useRef<CertificatsRef>(null);
    const realisationFormRef = useRef<RealisationFormRef>(null);
    const signatureRef = useRef<SignatureRef>(null);
    const rubriquesPersonnaliseesRef = useRef<RubriquesPersonnaliseesRef>(null);


    const refMap: Record<string, GenericRef | undefined> = {
        "Informations personnelles": infoRef,
        "Profil": desProfRef,
        "Formation": formationRef,
        "Expérience professionnelle": experienceRef,
        "Compétences": competenceRef,
        "Langue": langueFormRef,
        "Centre d’intérêt": centreInteretRef,
        "Cours": coursRef,
        "Stages": stagesRef,
        "Activités extra-scolaires": activitesExtraScolairesSectionRef,
        "Références": referenceFormRef,
        "Qualités": qualiteFormRef,
        "Certificats": certificatsRef,
        "Réalisations": realisationFormRef,
        "Signature": signatureRef,
        "Rubrique personnalisée": rubriquesPersonnaliseesRef

    };



    useEffect(() => {
        // Vérifie si toutes les refs nécessaires sont montées
        const allRefsReady = Object.values(refMap).some((r) => r?.current);

        // Vérifie aussi qu’on a des données à injecter
        if (allRefsReady && pendingCVData.current) {
            const data = pendingCVData.current;
            pendingCVData.current = null; // Nettoyage

            // console.log("🔹 Remplissage du CV détecté après montage…");

            for (const section of Object.keys(refMap)) {
                const ref = refMap[section]?.current;
                if (!ref) continue;

                switch (section) {
                    case "Profil":
                        ref.fillWithSuggestion?.(data.profile);
                        break;
                    case "Informations personnelles":
                        ref.fillInformationsFromParent?.(data.informations);
                        break;
                    case "Formation":
                        Array.isArray(data.formations) && ref.fillFormationFromParent?.(data.formations);
                        break;
                    case "Expérience professionnelle":
                        Array.isArray(data.experiences) && ref.fillExperienceFromParent?.(data.experiences);
                        break;
                    case "Compétences":
                        Array.isArray(data.competences) && ref.fillCompetencesFromParent?.(data.competences);
                        break;
                    case "Langue":
                        Array.isArray(data.langues) && ref.fillLanguesFromParent?.(data.langues);
                        break;
                    case "Centre d’intérêt":
                        Array.isArray(data.centres) && ref.fillCentresFromParent?.(data.centres);
                        break;
                    case "Cours":
                        Array.isArray(data.cours) && ref.fillCoursFromParent?.(data.cours);
                        break;
                    case "Stages":
                        Array.isArray(data.stages) && ref.fillStagesFromParent?.(data.stages);
                        break;
                    case "Activités extra-scolaires":
                        Array.isArray(data.activités) && ref.fillActivitesFromParent?.(data.activités);
                        break;
                    case "Références":
                        Array.isArray(data.References) && ref.fillReferencesFromParent?.(data.References);
                        break;
                    case "Qualités":
                        Array.isArray(data.qualites) && ref.fillQualitesFromParent?.(data.qualites);
                        break;
                    case "Certificats":
                        Array.isArray(data.certificats) && ref.fillCertificatsFromParent?.(data.certificats);
                        break;
                    case "Réalisations":
                        Array.isArray(data.realisations) && ref.fillRealisationsFromParent?.(data.realisations);
                        break;
                    case "Signature":
                        data.signature && ref.fillSignatureFromParent?.(data.signature);
                        break;
                    case "Rubrique personnalisée":
                        Array.isArray(data.rubriquesPersonnalisees) && ref.fillRubriquesPersonnaliseesFromParent?.(data.rubriquesPersonnalisees);
                        break;
                }
            }
        }
    }, [sections]); // <== on observe les changements de sections



    // 👉 Activer une section extra (passer display à true)
    const handleAddExtra = (champ: string) => {
        setSections(
            sections.map((s) =>
                s.champ === champ ? { ...s, display: true } : s
            )
        );
    };

    // 👉 Supprimer une section affichée (optionnel)
    const handleRemoveSection = (champ: string) => {
        setSections(
            sections.map((s) =>
                s.champ === champ ? { ...s, display: false } : s
            )
        );
    };



    const tryGetFromRef = async (r: any) => {
        if (!r?.current) return null;

        // liste de getters possibles (ajoute/retire selon ce que tes enfants exposent)
        const getters = [
            "getInfo",
            "getProfile",
            "getInformations",
            "getData",
            "getAll",
            "getFormations",
            "getFormationsList",
            "getExperience",
            "getExperiences",
            "getCompetences",
            "getLangues",
            "getCentres",
            "getCours",
            "getStages",
            "getActivites",
            "getReferences",
            "getQualites",
            "getCertificats",
            "getRealisations",
            "getSignature",
            "getRubriques",
        ];

        for (const g of getters) {
            if (typeof r.current[g] === "function") {
                try {
                    const data = await r.current[g](); // support sync/async
                    // console.log(data)
                    return data ?? null;
                } catch (err) {
                    console.warn(`Erreur lors de l'appel ${g}():`, err);
                    return null;
                }
            }
        }

        // fallback: si le composant expose directement des champs publics (rare)
        if (r.current?.data) return r.current.data;
        return null;
    };



    const normalizeMois = (mois: string | number | null | undefined) => {
        if (!mois) return "";
        if (typeof mois === "number") return moisMap[mois] || "";
        if (!isNaN(Number(mois))) return moisMap[Number(mois)] || mois;
        return mois; // si c’est déjà une string comme "Janvier"
    };


    // Fonction utilitaire pour mapper les objets simples
    const mapObject = (data: any, mapping: Record<string, string>) => {
        const result: any = {};
        for (const key in mapping) {
            if (data[key] !== undefined && data[key] !== null) {
                result[mapping[key]] = data[key];
            } else {
                result[mapping[key]] = ""; // Valeur par défaut si absent
            }
        }
        return result;
    };

    // Mappe les clés d’un objet selon un mapping donné
    const mapObjectInformation = (obj: Record<string, any>, mapping: Record<string, string>) => {
        const mapped: Record<string, any> = {};
        Object.keys(obj).forEach((key) => {
            const mappedKey = mapping[key];
            if (mappedKey && obj[key] !== null) {
                mapped[mappedKey] = obj[key];
            }
        });
        return mapped;
    };

    // Fonction utilitaire pour mapper des tableaux d'objets
    // Fonction utilitaire pour mapper des tableaux d'objets
    const mapArray = (arr: any[], mapping: Record<string, string>) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => {
            const mapped = mapObject(item, mapping);

            // Normaliser les mois si le champ existe
            if (mapped.debutMois) mapped.debutMois = normalizeMois(mapped.debutMois);
            if (mapped.finMois) mapped.finMois = normalizeMois(mapped.finMois);

            return mapped;
        });
    };

    // Fonction principale pour mapper tout le CV
    const mapCVData = (cvData: CVBackend): CVFrontend => {
        return {
            informations: mapObjectInformation(cvData.informations, mapKeysInformationPersonnelle),
            formations: mapArray(cvData.formations || [], mapKeysFormations),
            experiences: mapArray(cvData.experiences || [], mapKeysExperiences),
            langues: mapArray(cvData.langues || [], mapKeysLangue),
            cours: mapArray(cvData.cours || [], mapKeysCours),
            stages: mapArray(cvData.stages || [], mapKeysStages),
            activites: mapArray(cvData.activites || [], mapKeysActivite),
            competences: mapArray(cvData.competences || [], mapKeysCompetences),
            references: mapArray(cvData.references || [], mapKeysReferences),
            certificats: mapArray(cvData.certificats || [], mapKeysCertificats),
            rubriquesPersonnalisees: mapArray(cvData.rubriquesPersonnalisees || [], mapKeysRubriquesPersonnalisees),
            signature: mapObject(cvData.signature || {}, mapKeysSignature),
            centres: cvData.centres || [],
            qualites: cvData.qualites || [],
            realisations: cvData.realisations || [],
            profile: cvData.profile || "",
        };
    };

    /**
     * Construit l'arbre du CV en interrogeant chaque ref
     */
    const buildCvTree = async () => {
        const cvTree: Record<string, any> = {};

        // sections principales (utilise les refs que tu as définies)
        cvTree["Informations personnelles"] = await tryGetFromRef(infoRef);
        cvTree["Profil"] = await tryGetFromRef(desProfRef);
        cvTree["Formation"] = await tryGetFromRef(formationRef);
        cvTree["Expérience professionnelle"] = await tryGetFromRef(experienceRef);
        cvTree["Compétences"] = await tryGetFromRef(competenceRef);
        cvTree["Langue"] = await tryGetFromRef(langueFormRef);
        cvTree["Centre d’intérêt"] = await tryGetFromRef(centreInteretRef);

        // sections optionnelles / extras
        cvTree["Cours"] = await tryGetFromRef(coursRef);
        cvTree["Stages"] = await tryGetFromRef(stagesRef);
        cvTree["Activités extra-scolaires"] = await tryGetFromRef(activitesExtraScolairesSectionRef);
        cvTree["Références"] = await tryGetFromRef(referenceFormRef);
        cvTree["Qualités"] = await tryGetFromRef(qualiteFormRef);
        cvTree["Certificats"] = await tryGetFromRef(certificatsRef);
        cvTree["Réalisations"] = await tryGetFromRef(realisationFormRef);
        cvTree["Signature"] = await tryGetFromRef(signatureRef);
        cvTree["Rubrique personnalisée"] = await tryGetFromRef(rubriquesPersonnaliseesRef);

        return cvTree;
    };


    const handleImportCV = async (cvResponse: any) => {
        try {


            // Ici cvResponse n’est pas une string, c’est un objet
            const data = cvResponse.json; // ⬅️ Le JSON structuré


            const mappedData = mapCVData(data);

            pendingCVData.current = mappedData;

            console.log("-------handleImportCV--------")
            console.log(mappedData)
            console.log("-------handleImportCV--------")

            setSections((prev) =>
                prev.map((section) => ({
                    ...section,
                    display: section.display || extras.includes(section.champ),
                }))
            );

            alert("✅ CV importé et toutes les sections remplies !");

            /* Déplier la section “Informations personnelles” automatiquement.*/
            setOpened("Informations personnelles")

        } catch (error) {
            console.error("❌ Erreur d’importation du CV :", error);
            alert("Erreur : format JSON invalide ou incomplet.");
        }
    };


    /**
     * Envoie l'arbre CV au serveur. Si des fichiers sont détectés (ex: avatar),
     * on utilise FormData, sinon on envoie du JSON.
     */
    const handleExportAndSend = async () => {
        try {
            // 1) Construire l'arbre
            const cvTree = await buildCvTree();
            console.log("cvTree (structure) :", cvTree);

            // 2) Vérifier s'il y a des fichiers (ex: avatar) dans cvTree
            // Ajuste ici la clé si ton composant infos perso retourne l'avatar sous une clé différente.
            const personal = cvTree["Informations personnelles"];
            const possibleFiles: File[] = [];

            if (personal) {
                console.log("Informations personnelles");

                // Si c'est un File existant
                if (personal.avatarFile && personal.avatarFile instanceof File) possibleFiles.push(personal.avatarFile);
                if (personal.avatar && personal.avatar instanceof File) possibleFiles.push(personal.avatar);

                // Si c'est un base64, convertit en File
                if (personal.Photo && typeof personal.Photo === "string" && personal.Photo.startsWith("data:image")) {
                    const base64Data = personal.Photo.split(",")[1];
                    const contentType = personal.Photo.split(";")[0].split(":")[1]; // "image/jpeg"
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const file = new File([byteArray], "avatar.jpg", { type: contentType });
                    possibleFiles.push(file);
                }
            }

            console.log("Files à envoyer :", possibleFiles);

            // ✅ Créer toujours FormData
            const payload = new FormData();
            payload.append("cv", JSON.stringify(cvTree)); // tree en JSON

            // S'il n'y a pas de fichier, on ajoute un placeholder vide pour que le serveur reçoive toujours le champ
            if (possibleFiles.length === 0) {
                // Optionnel : créer un fichier vide
                const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
                payload.append("photo_profil", emptyFile, emptyFile.name);
            } else {
                possibleFiles.forEach((f) => payload.append("photo_profil", f, f.name));
            }

            // Afficher le contenu FormData pour debug
            for (const pair of payload.entries()) {
                console.log("FormData", pair[0], pair[1]);
            }

            try {
                const response = await submitCV(payload);
                setMessage("✅ Profil mis à jour avec succès !");
                alert("CV envoyé (multipart) avec succès.");
                console.log("Réponse serveur :", response?.data);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    console.log("accessToken: ", accessToken);
                    console.log("refreshToken: ", refreshToken);
                    await refreshAndRetry(submitCV, refreshToken || "", newAccessToken, payload);
                } else {
                    throw err;
                }
            }



        } catch (err: any) {
            console.error("Erreur lors de l'export CV :", err);
            alert("Erreur lors de l'envoi du CV : " + (err?.message ?? err));
        }
    };


    async function submitCV(payload: FormData) {
        alert('// ⚠️ on utilise api ici')
        // ⚠️ on utilise api ici
        const response = await api.post(
            '/candidats_cv/cand_envoie_cv'
            , payload);
        return response.data;
    }

    const handleCopyCV = async (cvTree: any) => {
        try {
            const cvTree: any = {};

            // 🔹 Exemple de récupération des sections avec tryGetFromRef (ton helper)
            cvTree.profile = await tryGetFromRef(refMap["Profil"]);
            cvTree.informations = await tryGetFromRef(refMap["Informations personnelles"]);
            cvTree.formations = await tryGetFromRef(refMap["Formation"]);
            cvTree.experiences = await tryGetFromRef(refMap["Expérience professionnelle"]);
            cvTree.competences = await tryGetFromRef(refMap["Compétences"]);
            cvTree.langues = await tryGetFromRef(refMap["Langue"]);
            cvTree.centres = await tryGetFromRef(refMap["Centre d’intérêt"]);


            cvTree.cours = await tryGetFromRef(refMap["Cours"]);
            cvTree.stages = await tryGetFromRef(refMap["Stages"]);
            cvTree.activités = await tryGetFromRef(refMap["Activités extra-scolaires"]);
            cvTree.References = await tryGetFromRef(refMap["Références"]);
            cvTree.qualites = await tryGetFromRef(refMap["Qualités"]);
            cvTree.certificats = await tryGetFromRef(refMap["Certificats"]);
            cvTree.realisations = await tryGetFromRef(refMap["Réalisations"]);
            cvTree.signature = await tryGetFromRef(refMap["Signature"]);
            cvTree.rubriquesPersonnalisees = await tryGetFromRef(refMap["Rubrique personnalisée"]);






            // 🔹 Supprime les champs vides (optionnel)
            Object.keys(cvTree).forEach(
                (key) => (cvTree[key] == null || cvTree[key]?.length === 0) && delete cvTree[key]
            );

            const jsonData = JSON.stringify(cvTree, null, 2);

            // 🔹 Copie dans le presse-papiers (méthode principale)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(jsonData);
                alert("✅ CV copié dans le presse-papiers !");
            } else {
                // 🔸 fallback
                const textarea = document.createElement("textarea");
                textarea.value = jsonData;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                alert("✅ Copié via fallback !");
            }

            // console.log("📄 CV Tree :", cvTree);
        } catch (err) {
            console.error("❌ Erreur lors de la copie :", err);
        }
    };

    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">




                        <div className="container-ctn">


                            <div className="cv-container">
                                {/*<div className="cv-top-options">
                                    <div className="cv-option">
                                        <input type="checkbox" />
                                        <label>Télécharger un CV existant</label>
                                    </div>
                                    <div className="cv-option">
                                        <input type="checkbox" />
                                        <label>Importer depuis LinkedIn</label>
                                    </div>
                                </div>*/}
                                <CVUploader onExtract={handleImportCV} />



                                <div className="cv-sections">
                                    {sections
                                        .filter((s) => s.display)
                                        .map((section) => {
                                            const SectionComp = sectionComponents[section.champ];
                                            const sectionRef = refMap[section.champ];
                                            const isOpen = opened === section.champ;


                                            return (
                                                <div key={section.champ} className="cv-section">
                                                    <button
                                                        className="cv-section-btn"
                                                        onClick={() =>
                                                            setOpened(isOpen ? null : section.champ)
                                                        }
                                                    >
                                                        {section.champ}
                                                        <span className="plus">{isOpen ? "−" : "+"}</span>
                                                    </button>

                                                    <div
                                                        className={`cv-section-content ${isOpen ? "open closed" : "closed"}`}
                                                    >
                                                        {(() => {
                                                            if (SectionComp) {
                                                                const { component: Component, withRef } = SectionComp;
                                                                return withRef ? <Component ref={sectionRef} /> : <Component />;
                                                            } else {
                                                                return <p>Contenu de la section {section.champ}</p>;
                                                            }
                                                        })()}

                                                        {/* Bouton supprimer pour les extras */}
                                                        {![
                                                            "Informations personnelles",
                                                            "Profil",
                                                            "Formation",
                                                            "Expérience professionnelle",
                                                            "Compétences",
                                                            "Langue",
                                                            "Centre d’intérêt",
                                                        ].includes(section.champ) && (
                                                                <button
                                                                    onClick={() => handleRemoveSection(section.champ)}
                                                                    className="remove-btn"
                                                                >
                                                                    Supprimer
                                                                </button>
                                                            )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                </div>

                                <div className="cv-extra-buttons">
                                    {sections
                                        .filter((s) => !s.display)
                                        .map((extra) => (
                                            <button
                                                key={extra.champ}
                                                className="extra-btn"
                                                onClick={() => handleAddExtra(extra.champ)}
                                            >
                                                + {extra.champ}
                                            </button>
                                        ))}
                                </div>

                                <div className="cv-actions">
                                    <button className="btn-view">Voir le CV</button>
                                    <button className="btn-download">Télécharger</button>
                                    {/* nouveau bouton */}
                                    <button className="btn-send" onClick={handleExportAndSend}>
                                        Exporter / Envoyer le CV
                                    </button>
                                </div>
                            </div>

                        </div>







                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




