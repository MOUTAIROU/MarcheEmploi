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
    const [showMore, setShowMore] = useState(false);

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
                <h3 className="recherche-ctn-txt">Recherche</h3>
                
                <div className='ctn-opp'>
                    <div className="recherche-ctn">
                    <div>
                        <button>Recherche avancer</button>
                    </div>
                </div>


                <div className='annonce-list-ctn'>
                    <AnnonceList annonces={annonces} />
                </div>


                </div>


            </main>
            <footer >

            </footer>
        </div>
    );
}




