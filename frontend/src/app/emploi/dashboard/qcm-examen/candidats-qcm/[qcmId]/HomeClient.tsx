"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import Link from "next/link";

interface QuestionResult {
    id: number;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    points: number;
    earnedPoints: number;
}

interface CandidatResult {
    nom: string;
    email: string;
    time: number; // minutes
    score: number; // %
    questions: QuestionResult[];
}

const candidatResult: CandidatResult = {
    nom: "Amed Boucarie",
    email: "amedbouca12@gmail.com",
    time: 10,
    score: 70,
    questions: [
        {
            id: 1,
            question: "Quel est l’objectif principal d’un diagnostic technique ?",
            selectedAnswer: "Identifier les problèmes",
            correctAnswer: "Identifier les problèmes",
            points: 10,
            earnedPoints: 10,
        },
        {
            id: 2,
            question: "Quel facteur influence le plus la fertilité du sol ?",
            selectedAnswer: "La couleur",
            correctAnswer: "La matière organique",
            points: 10,
            earnedPoints: 0,
        },
    ],
};



export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);


    // Fermer les menus si clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node) &&
                groupRef.current &&
                !groupRef.current.contains(event.target as Node)
            ) {
                setFilterOpen(false);
                setGroupOpen(false);
                setOpenRowMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelectedFilter(value);
        setFilterOpen(false);
    };

    const handleGroupAction = (action: string) => {
        alert(`Action sélectionnée : ${action}`);
        setGroupOpen(false);
    };

    const handleRowAction = (action: string, id: string) => {
        alert(`Action “${action}” sur l’offre ${id}`);
        setOpenRowMenu(null);
    };

    const actions = [
        "🗑️Supprimer les QCM "
    ];
    const Rowactions = [
        "👁️ Voir détails ",
    ];

    const Filtreactions = [
        "Filtre",
        "Catégorie / Domaine",
        "Durée",
        "Scores"
    ];


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <div className="header">
                            <div>
                                <h2>Mes QCM</h2>
                                <p>Gérez vos tests de présélection et associez-les à vos offres d’emploi.</p>
                            </div>


                            <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/creer-qcm`}>
                                <button className="createButton">Créer un nouveau QCM</button>
                            </Link>
                        </div>

                        <div> Afficher le resultat du candidats les reponses choisi et le resulat et sa note </div>

                        <div className="qcm-result">

                            {/* 🔹 Infos candidat */}
                            <div className="result-header">
                                <h3>Résultat du candidat</h3>
                                <div className="candidate-info">
                                    <p><strong>Nom :</strong> {candidatResult.nom}</p>
                                    <p><strong>Email :</strong> {candidatResult.email}</p>
                                    <p><strong>Temps passé :</strong> {candidatResult.time} min</p>
                                    <p><strong>Score :</strong> {candidatResult.score}%</p>
                                </div>
                            </div>

                            {/* 🔹 Détails des questions */}
                            <div className="questions-result">
                                <h4>Détail des réponses</h4>

                                {candidatResult.questions.map((q, index) => {
                                    const isCorrect = q.earnedPoints === q.points;

                                    return (
                                        <div
                                            key={q.id}
                                            className={`question-card ${isCorrect ? "correct" : "wrong"}`}
                                        >
                                            <div className="question-title">
                                                {index + 1}. {q.question}
                                            </div>

                                            <div className="answers">
                                                <p>
                                                    <strong>Réponse choisie :</strong>{" "}
                                                    <span className={isCorrect ? "good" : "bad"}>
                                                        {q.selectedAnswer}
                                                    </span>
                                                </p>

                                                <p>
                                                    <strong>Bonne réponse :</strong>{" "}
                                                    <span className="good">{q.correctAnswer}</span>
                                                </p>
                                            </div>

                                            <div className="score">
                                                Note :{" "}
                                                <strong>
                                                    {q.earnedPoints} / {q.points}
                                                </strong>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>




                    </div>
                </div>
            </main >
        </div >


    );
}
