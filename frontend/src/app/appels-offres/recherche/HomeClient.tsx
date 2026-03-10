'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";

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

export default function Home() {

    const [motsCles, setMotsCles] = useState<string[]>([]);
    const [motCleInput, setMotCleInput] = useState("");

    const [pays, setPays] = useState<string[]>([]);
    const [ville, setVille] = useState<string[]>([]);
    const [secteurs, setSecteurs] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    
    const [periode, setPeriode] = useState<string>("");

    const allPays = ["Bénin", "Togo", "Côte d’Ivoire", "Sénégal"];
    const allVilles = ["Cotonou", "Parakou", "Abomey-Calavi"];
    const allSecteurs = ["BTP", "Informatique", "Santé", "Éducation"];
    const typeAnnonce = ["Marchés emplois", "Emplois", "Appels à projets", "Résultats de marchés"]

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
            <Header />
            <main >
                <h3  className="recherche-ctn-txt">Recherche</h3>
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

                                <div className="tags">
                                    {pays.map((p, i) => (
                                        <span key={i} className="tag" onClick={() => toggleSelect(p, pays, setPays)}>
                                            {p} ✕
                                        </span>
                                    ))}
                                </div>

                                <div className="action-ctn">
                                    <select
                                        onChange={(e) => toggleSelect(e.target.value, pays, setPays)}
                                        defaultValue=""
                                    >
                                        <option value="">Sélectionner un pays</option>
                                        {allPays.map((p, i) => (
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
                                            {s} ✕
                                        </span>
                                    ))}
                                </div>

                                <div className="action-ctn">
                                    <select
                                        onChange={(e) => toggleSelect(e.target.value, secteurs, setSecteurs)}
                                        defaultValue=""
                                    >
                                        <option value="">Sélectionner un secteur</option>
                                        {allSecteurs.map((s, i) => (
                                            <option key={i} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>




                            </div>

                        </div>

                        <div className='more-option-ctn'>
                            <div className='more-option-label'>Plus de critères</div>
                            <div className='more-option-sepa'></div>
                        </div>

                        {/* Période et dates */}

                        {/* Secteur / Catégorie */}
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

                <h3  className="recherche-ctn-txt">Recherche de recherche</h3>
                <div className='annonce-list-ctn'>
                    <AnnonceList annonces={annonces} />
                </div>



            </main>
            <footer >

            </footer>
        </div>
    );
}




