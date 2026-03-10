"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SidebarEntreprises/page";
import DeleteCandidatsModal from "@/components/modale/DeleteCandidatsModal/page";
import ActionGrouperModal from "@/components/modale/ActionGrouperCandidatsModal/page";
import PopupError from '@/components/modale/Popup/PopupError/page'
import AnnonceList from "@/components/AnnonceListDashbord/page";

import { TIMEZONE_LABELS, CITY_BY_COUNTRY, countryCode, CATEGORIE_DOMAINES, COUNTRY_LABELS } from "@/utils/types";

const annonces = [
    {
        id: 1,
        statut: "En cours",
        titre:
            "Termes de Référence relatif au Mandat pour l’évaluation externe du projet Droits et Devoirs des Ouvriers Agricoles dans les exploitations de Production d’Ananas dans les Communes productrices d’Ananas",
        localisation: "Benin",
        montant: "60 000 000 000 F CFA",
        datePublication: "Le 2 Oct 2025",
        reste: "Reste 1 mois",
        drapeau: "/images/benin-flag.png",
    },
    {
        id: 2,
        statut: "En cours",
        titre:
            "Termes de Référence relatif au Mandat pour l’évaluation externe du projet Droits et Devoirs des Ouvriers Agricoles dans les exploitations de Production d’Ananas dans les Communes productrices d’Ananas",
        localisation: "Benin",
        montant: "60 000 000 000 F CFA",
        datePublication: "Le 2 Oct 2025",
        reste: "Reste 1 mois",
        drapeau: "/images/benin-flag.png",
    },
    {
        id: 3,
        statut: "En cours",
        titre:
            "Termes de Référence relatif au Mandat pour l’évaluation externe du projet Droits et Devoirs des Ouvriers Agricoles dans les exploitations de Production d’Ananas dans les Communes productrices d’Ananas",
        localisation: "Benin",
        montant: "60 000 000 000 F CFA",
        datePublication: "Le 2 Oct 2025",
        reste: "Reste 1 mois",
        drapeau: "/images/benin-flag.png",
    },
    {
        id: 4,
        statut: "En cours",
        titre:
            "Termes de Référence relatif au Mandat pour l’évaluation externe du projet Droits et Devoirs des Ouvriers Agricoles dans les exploitations de Production d’Ananas dans les Communes productrices d’Ananas",
        localisation: "Benin",
        montant: "60 000 000 000 F CFA",
        datePublication: "Le 2 Oct 2025",
        reste: "Reste 1 mois",
        drapeau: "/images/benin-flag.png",
    },
];

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

    const [selectedPays, setSelectedPays] = useState<string>(""); // <- nouveau
    const [villesOptions, setVillesOptions] = useState<string[]>([]); // options selon le pays
    const [villeTags, setVilleTags] = useState<string[]>([]); // villes choisies par l'utilisateur


    const [periode, setPeriode] = useState<string>("");

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

    const toggleType = (item: string) => {
        if (selectedTypes.includes(item)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== item));
        } else {
            setSelectedTypes([...selectedTypes, item]);
        }
    };


    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />

                    <div className="mainContent">

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


                                    {/* Types d'annonces */}
                                    <div className="field ">
                                        <label>Types d'annonces</label>
                                        <div className='field-data type-chips field-data-1 field-data-1-top' >

                                            {typeAnnonce.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    className={`chip ${selectedTypes.includes(t) ? "active" : ""}`}
                                                    onClick={() => toggleType(t)}
                                                    aria-pressed={selectedTypes.includes(t)}
                                                >
                                                    {t}
                                                </button>
                                            ))}

                                        </div>
                                    </div>


                                    {/* Mots-clés */}
                                    <div className="field">
                                        <label>Mots-clés</label>
                                        <div className='field-data '>
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
                                                    placeholder="Tapez un mot-clé et appuyez sur Entrée"
                                                    value={motCleInput}
                                                    onChange={(e) => setMotCleInput(e.target.value)}
                                                    onKeyDown={addMotCle}
                                                />
                                            </div>


                                        </div>
                                    </div>

                                    {/* Pays */}
                                    <div className="field">
                                        <label>Pays</label>
                                        <div className='field-data'>
                                            <div className="action-ctn">
                                                <select
                                                    value={selectedPays}
                                                    onChange={(e) => handleSelectPays(e.target.value)}
                                                >
                                                    <option value="">Sélectionner un pays</option>
                                                    {Object.entries(COUNTRY_LABELS).map(([code, label]) => (
                                                        <option key={code} value={code}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Ville */}
                                    {/* Ville / Région */}
                                    <div className="field">
                                        <label>Ville / Région</label>
                                        <div className='field-data'>

                                            {/* Tags des villes choisies */}
                                            <div className="tags">
                                                {villeTags.map((v, i) => (
                                                    <span key={i} className="tag" onClick={() => toggleSelect(v, villeTags, setVilleTags)}>
                                                        {v} ✕
                                                    </span>
                                                ))}

                                                {/* Select Ville */}




                                            </div>
                                            <div className="action-ctn">
                                                <select
                                                    value=""
                                                    onChange={(e) => addVilleTag(e.target.value)}
                                                    disabled={!selectedPays} // désactivé si aucun pays sélectionné
                                                >
                                                    <option value="">Sélectionner une ville</option>
                                                    {villesOptions.map((v) => (
                                                        <option key={v} value={v}>{v}</option>
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
                                                    <span
                                                        key={i}
                                                        className="tag"
                                                        onClick={() => toggleSelect(s, secteurs, setSecteurs)}
                                                    >
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
                                                        <option key={value} value={value}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                    <div className='more-option-ctn' onClick={() => setShowMore(!showMore)}>
                                        <div className='more-option-label'>
                                            Plus de critères {showMore ? "▲" : "▼"}
                                        </div>
                                        <div className='more-option-sepa'></div>
                                    </div>


                                    {/* Période et dates */}

                                    {/* Secteur / Catégorie */}

                                    {showMore && (<div>
                                        <div className="field field-margin">
                                            <label> Période rapide</label>

                                            <div className='field-data field-data-ctn field-data-1-top'>

                                                <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
                                                    <option value="">Choisir une période</option>
                                                    {periodeOptions.map((p) => (
                                                        <option key={p} value={p}>
                                                            {p}
                                                        </option>
                                                    ))}
                                                </select>



                                            </div>

                                        </div>

                                        <div className="field">
                                            <label>Plage de dates personnalisée</label>

                                            <div className='field-data field-data-ctn field-data-1-top'>

                                                <div className='ctn-periode'>
                                                    <span>Du</span>
                                                    <input type="date" />
                                                </div>

                                                <div className='ctn-periode'>
                                                    <span>Au</span>
                                                    <input type="date" />
                                                </div>



                                            </div>

                                        </div>
                                    </div>)}



                                    {/* Boutons */}

                                    <div className="field">
                                        <label></label>

                                        <div className='field-data field-data-ctn field-data-1-top field-data-2'>

                                            <button className="btn-primary btn2">Recherche</button>
                                            <button className="btn-secondary btn2">Enregistrer la recherche</button>


                                        </div>

                                    </div>


                                </div>
                            </div>
                        )}



                        <h3 className="recherche-ctn-txt">Resultat de recherche</h3>
                        <div className='annonce-list-ctn'>
                            <AnnonceList annonces={annonces} />
                        </div>



                    </div>
                </div>


            </main>
        </div>
    );
}
