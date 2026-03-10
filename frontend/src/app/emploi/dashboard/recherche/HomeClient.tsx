"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import apiWithSession from "@/lib/axiosInstance";
import api from "@/lib/axios";
import { TIMEZONE_LABELS, CITY_BY_COUNTRY, countryCode, CATEGORIE_DOMAINES, COUNTRY_LABELS, country, tab_niveauEtude } from "@/utils/types";
import AnnonceList from "@/components/AnnonceListDashbordEmploi/page";
import Popup from "@/components/Popup/PopupErrorWithLogin/page";
import PopupSucess from "@/components/Popup/PopupSuccess/page";

import "./style.css";

interface Offre {
    id: string;
    titre: string;
    type: string;
    dateExp: string;
    nbreCandidatures: number;
    statut: "Active" | "En attente" | "Expirée";
}

const actionsGroupe = [
    "Supprimer",
    "Associer un QCM"
];

const offres: Offre[] = [{
    id: "AOF-2025-1209-001",
    titre: "Développeur React",
    type: "Emploi",
    dateExp: "12 Oct 2025",
    nbreCandidatures: 8,
    statut: "Active",
},
{
    id: "AOF-2025-1209-002",
    titre: "Chef de Projet",
    type: "Emploi",
    dateExp: "12 Oct 2025",
    nbreCandidatures: 8,
    statut: "En attente"
},
{
    id: "AOF-2025-1209-003",
    titre: "Fourniture IT",
    type: "Appel d’offres",
    dateExp: "12 Oct 2025",
    nbreCandidatures: 8,
    statut: "Expirée",
},];



const tab_disponibiliter = [
    "Toutes", "Immédiate", "Sous 1 semaine", "Sous 1 mois"
]

const tab_typeContrat = [
    "CDI", "CDD", "Freelance", "Stage", "Autre"
]
export default function OffresPage() {
    const router = useRouter();


    const [motsCles, setMotsCles] = useState<string[]>([]);
    const [motCleInput, setMotCleInput] = useState("");
    const [showMore, setShowMore] = useState(false);
    const [showRecherche, setShowRecherche] = useState(true);

    const [pays, setPays] = useState<string[]>([]);
    const [ville, setVille] = useState<string[]>([]);
    const [secteurs, setSecteurs] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [emploiRecherche, setEmploiRecherche] = useState("");


    const [selectedPays, setSelectedPays] = useState<string>(""); // <- nouveau
    const [villesOptions, setVillesOptions] = useState<string[]>([]); // options selon le pays
    const [villeTags, setVilleTags] = useState<string[]>([]); // villes choisies par l'utilisateur


    const [disponibilite, setDisponibilite] = useState<string[]>([]);

    const [niveauEtude, setNiveauEtude] = useState<string[]>([]);

    const [typeContrat, setTypeContrat] = useState<string[]>([]);


    const [annonces, setAnnonces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [periode, setPeriode] = useState<string>("");
    const [total, setTotal] = useState<number>(0);

    const [popupMessage, setPopupMessage] = useState("👉 Connectez-vous ou créez un compte pour enregistrer votre recherche.");
    const [isOpenpopup, setIsOpenpopup] = useState(false);


    const [popupMessageSucces, setPopupMessageSucces] = useState("✔️ Votre recherche a été enregistrée.");
    const [isOpenpopupSucces, setIsOpenpopupSucces] = useState(false);



    const allPays = ["Bénin", "Togo", "Côte d’Ivoire", "Sénégal", "Cameroun"];
    const allVilles = ["Cotonou", "Parakou", "Abomey-Calavi"];
    const allSecteurs = ["BTP", "Informatique", "Santé", "Éducation"];
    const typeAnnonce = ["Marchés emplois", "Emplois", "Candidats", "Appels à projets", "Résultats de marchés"]

    const periodeOptions = [
        "Il y a 24h",
        "Il y a 7 jours",
        "Il y a 12 jours",
        "Il y a 30 jours",
    ];

    const addMotCle = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && motCleInput.trim() !== "") {
            e.preventDefault();
            setMotsCles([...motsCles, motCleInput.trim()]);
            setMotCleInput("");
        }
    };

    const removeMotCle = (index: number) => {
        setMotsCles(motsCles.filter((_, i) => i !== index));
    };

    const handleSelectPays = (pays: string) => {
        setSelectedPays(pays);
        setVillesOptions(CITY_BY_COUNTRY[pays] || []); // liste des villes disponibles
        setVilleTags([]); // réinitialiser les tags, pas les remplir automatiquement
    };

    const addVilleTag = (ville: string) => {
        if (ville && !villeTags.includes(ville)) {
            setVilleTags([...villeTags, ville]);
        }
    };

    const toggleSelect = (
        item: string,
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((i) => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    const toggleSelectSingle = (
        item: string,
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        // Remplace toujours l’existant par le nouvel élément

        if (selected.includes(item)) {
            setSelected(selected.filter((i) => i !== item));
        } else {
            setSelected([item]);
        }

    };
    const toggleType = (item: string) => {
        if (selectedTypes.includes(item)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== item));
        } else {
            setSelectedTypes([...selectedTypes, item]);
        }
    };


    const buildSearchParams = () => {
        return {
            niveauEtude,
            emploiRecherche: motsCles.join(", "),       // Emploi recherché ou mots-clés
            typeContrat,                               // ["CDI", "CDD", ...]
            disponibilite,                             // ["Immédiate", "Sous 1 semaine", ...]
            pays: `${country},${countryCode}`,  // tableau avec le pays sélectionné
            villes: ville,                             // tableau de villes sélectionnées
            secteurs,                                  // tableau de secteurs sélectionnés
            typesAnnonce: selectedTypes,               // Types d'annonces choisies
            periode,
            // période rapide choisie
        };
    };

    const handleRecherche = async () => {
        try {
            setLoading(true);

            const params = buildSearchParams();

            sessionStorage.setItem(
                "candiddatSearch",
                JSON.stringify(params)
            );

            const res = await apiWithSession.post("/frontend/candidat_recherche_emploi", params);

            setTotal(res.data.data.length)
            setAnnonces(res.data.data)

            //  setAnnonces(res.data.data);
        } catch (error) {
            console.error("Erreur recherche", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecherche = async () => {
        try {
            const params = buildSearchParams();



            sessionStorage.setItem(
                "candiddatSearch",
                JSON.stringify(params)
            );

            const res = await apiWithSession.post("/frontend/candidat_recherche_emploi_save", {
                criteres: params,
                nom: "Ma recherche personnalisée",
            });

            if (res.status == 201) {
                setIsOpenpopupSucces(true)
            }

        } catch (error: any) {

            if (error.response?.data?.code === "AUTH_REQUIRED") {
                // redirection login

                allPays
                setIsOpenpopup(true)
                return;
            }

        }
    };

    const gotoLogin = async () => {
        router.push(`${process.env.LOCAL_HOST}/connexion`);
        setIsOpenpopup(false)
    }


    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />

                    <div className="mainContent">

                        {isOpenpopup && (
                            <Popup
                                isOpen={isOpenpopup}
                                title="Erreur"
                                message={popupMessage}
                                onClose={() => setIsOpenpopup(false)}
                                onLogin={() => gotoLogin()}
                            />
                        )}




                        {isOpenpopupSucces && (
                            <PopupSucess
                                isOpen={isOpenpopupSucces}
                                title="Enregistré 💾"
                                message={popupMessageSucces}
                                onClose={() => setIsOpenpopupSucces(false)}
                            />
                        )}

                        <button
                            className="btn-toggle-recherche"
                            onClick={() => setShowRecherche(!showRecherche)}
                        >
                            {showRecherche ? "Cacher la recherche ▲" : "Afficher la recherche ▼"}
                        </button>



                        <h3 className="recherche-ctn-txt">Recherche</h3>

                        {showRecherche && (
                            <div className="recherche-ctn">
                                <div className="recherche-container">


                                    {/* je suis */}
                                    <div className="field">
                                        <label>je suis</label>
                                        <div className='field-data'>

                                            <div className="tags">
                                                {niveauEtude.map((p, i) => (
                                                    <span key={i} className="tag" onClick={() => toggleSelectSingle(p, niveauEtude, setNiveauEtude)}>
                                                        {p} ✕
                                                    </span>
                                                ))}
                                            </div>


                                            <div className="action-ctn">
                                                <select
                                                    onChange={(e) => toggleSelectSingle(e.target.value, niveauEtude, setNiveauEtude)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Quand pouvez-vous commencer à travailler ?</option>
                                                    {tab_niveauEtude.map((p, i) => (
                                                        <option key={i} value={p}>
                                                            {p}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                        </div>

                                    </div>


                                    {/* Mots-clés */}
                                    <div className="field">
                                        <label>Emploi recherché</label>
                                        <div className='field-data'>
                                            <div className="tags">
                                                {motsCles.map((mot, index) => (
                                                    <span key={index} className="tag" onClick={() => removeMotCle(index)}>
                                                        {mot} ✕
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="action-ctn">
                                                <input
                                                    type="text"
                                                    placeholder="Ex : Développeur web, Comptable, Chauffeur, Marketing digital"
                                                    value={motCleInput}
                                                    onChange={(e) => setMotCleInput(e.target.value)}
                                                    onKeyDown={addMotCle}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tyoe de contrat */}
                                    <div className="field">
                                        <label>Type de contrat</label>
                                        <div className='field-data'>



                                            <div className="tags">
                                                {typeContrat.map((v, i) => (
                                                    <span key={i} className="tag" onClick={() => toggleSelect(v, typeContrat, setTypeContrat)}>
                                                        {v} ✕
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="action-ctn">
                                                <select
                                                    onChange={(e) => toggleSelect(e.target.value, typeContrat, setTypeContrat)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Sélectionner un type de contrat</option>
                                                    {tab_typeContrat.map((v, i) => (
                                                        <option key={i} value={v}>
                                                            {v}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                        </div>

                                    </div>

                                    {/* Disponibilité */}
                                    <div className="field">
                                        <label>Disponibilité</label>
                                        <div className='field-data'>

                                            <div className="tags">
                                                {disponibilite.map((p, i) => (
                                                    <span key={i} className="tag" onClick={() => toggleSelect(p, disponibilite, setDisponibilite)}>
                                                        {p} ✕
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="action-ctn">
                                                <select
                                                    onChange={(e) => toggleSelect(e.target.value, disponibilite, setDisponibilite)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Quand pouvez-vous commencer à travailler ?</option>
                                                    {tab_disponibiliter.map((p, i) => (
                                                        <option key={i} value={p}>
                                                            {p}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                        </div>

                                    </div>

                                    {/* Ville */}
                                    <div className="field">
                                        <label>Ville / Région</label>
                                        <div className='field-data'>

                                            <div className="tags">
                                                {ville.map((v, i) => (
                                                    <span key={i} className="tag" onClick={() => toggleSelect(v, ville, setVille)}>
                                                        {v} ✕
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="action-ctn">
                                                <select
                                                    onChange={(e) => toggleSelect(e.target.value, ville, setVille)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Sélectionner une ville</option>
                                                    {allVilles.map((v, i) => (
                                                        <option key={i} value={v}>
                                                            {v}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                        </div>

                                    </div>

                                    {/* Secteur / Catégorie */}
                                    <div className="field">
                                        <label>Secteur / Catégorie</label>
                                        <div className='field-data'>
                                            <div className="tags">
                                                {secteurs.map((s, i) => (
                                                    <span key={i} className="tag" onClick={() => toggleSelect(s, secteurs, setSecteurs)}>
                                                        {CATEGORIE_DOMAINES[s] || s} ✕
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="action-ctn">
                                                <select
                                                    onChange={(e) => toggleSelect(e.target.value, secteurs, setSecteurs)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Sélectionner un secteur</option>
                                                    {Object.entries(CATEGORIE_DOMAINES).map(([value, label]) => (
                                                        <option key={value} value={value}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>




                                    {/* Boutons */}
                                    <div className="field">
                                        <label></label>
                                        <div className='field-data field-data-ctn field-data-1-top field-data-2'>
                                            <button className="btn-primary btn2" onClick={handleRecherche}>Recherche</button>
                                            <button className="btn-secondary btn2" onClick={handleSaveRecherche}>Enregistrer la recherche</button>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        )}




                        <h2 className="recherche-ctn-txt">{`Resultat de recherche ( ${total} )`}</h2>
                        <div className='annonce-list-ctn'>
                            <AnnonceList
                                annonces={annonces}
                                total={total}
                                currentpage={1} />
                        </div>

                    </div>
                </div>


            </main>
        </div>
    );
}
