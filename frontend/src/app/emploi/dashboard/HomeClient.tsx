'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import { useSession } from "@/lib/sessionStore";

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

    const { session } = useSession();
    const { accessToken } = useSession(); // <- récupère depuis le contexte

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

    console.log(session,accessToken)

    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">
                        <div className="header-main-dashbord">
                            <div className="userInfo">
                                <div className="avatar"></div>
                                <span className="userName">Balogoun Fahrane</span>
                            </div>

                            <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/mon-cv`} className="updateBtn">Mettre à jour CV</Link>
                        </div>

                        <section className="stats section-dashboard">
                            <h3>Statistique</h3>
                            <div className="cards">
                                <div className="card">
                                    <h2>5</h2>
                                    <p>Candidatures envoyées</p>
                                </div>
                                <div className="card">
                                    <h2>15</h2>
                                    <p>Offres sauvegardées</p>
                                </div>
                                <div className="card">
                                    <h2>5</h2>
                                    <p>Alertes actives</p>
                                </div>
                            </div>
                        </section>

                        <div className="buttons">
                            <Link href={`${process.env.LOCAL_HOST}/emploi/recherche`} className="primaryBtn">Postuler à une nouvelle offre</Link>
                            <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/mes-candidatures`} className="secondaryBtn">Voir mes candidatures</Link>
                        </div>

                        <div className='annonce-list-ctn-dashbord-titre'>
                            <h3>Dernières annonces</h3>
                        </div>
                        <div className='annonce-list-ctn'>
                            <AnnonceList annonces={annonces} />
                        </div>

                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




