"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";

interface QuestionDetail {
    questionId: number;
    intitule: string;
    type: "qcm-unique" | "choix-multiple" | "vrai-faux" | "reponse-texte";
    niveau: string;
    points: number;
    points_obtenue: number;
    options?: any;
    optionTexte?: string;
    bonnesReponses?: any;
    reponseCandidat?: any;
    justification?: string;
}

export default function OffresPage() {
    const params = useParams();

    const [userId, setUserId] = useState<string>("");
    const [qcmId, setQcmId] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const [manualNotes, setManualNotes] = useState<{ [key: number]: number }>({});
    const [validatedQuestions, setValidatedQuestions] = useState<number[]>([]);


    // 🔹 Extraire params
    useEffect(() => {
        if (!params?.qcmId) return;

        const rawParam = Array.isArray(params.qcmId)
            ? params.qcmId[0]
            : params.qcmId;

        const firstDashIndex = rawParam.indexOf("-");
        if (firstDashIndex === -1) return;

        const extractedUserId = rawParam.substring(0, firstDashIndex);
        const extractedQcmId = rawParam.substring(firstDashIndex + 1);

        setUserId(extractedUserId);
        setQcmId(extractedQcmId);
        getDetails(extractedUserId, extractedQcmId);
    }, [params]);

    async function getDetails(userId: string, qcmId: string) {
        try {
            const response = await api.get(
                `entreprise_get/qcm_candidats_exame_detail/${userId}/${qcmId}`
            );

            console.log(response.data.data)

            setData(response.data.data);
        } catch (error) {
            console.error("Erreur récupération :", error);
        }
    }

    function formatTimestamp(timestamp: number): string {
        if (!timestamp) return "-";

        const date = new Date(timestamp);

        return date.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    // 🔹 Vérifier si bonne réponse
    const isCorrect = (question: QuestionDetail) => {
        if (!question.bonnesReponses || !question.reponseCandidat) {
            return false;
        }

        const bonnes = Array.isArray(question.bonnesReponses)
            ? question.bonnesReponses
            : [question.bonnesReponses];

        const reponses = Array.isArray(question.reponseCandidat)
            ? question.reponseCandidat
            : [question.reponseCandidat];

        return (
            JSON.stringify([...bonnes].sort()) ===
            JSON.stringify([...reponses].sort())
        );
    };


    const formatReponse = (
        type: string,
        reponse: string | string[] | null
    ) => {
        if (!reponse) return "Aucune réponse";

        // 🔹 Si tableau (choix multiple)
        if (Array.isArray(reponse)) {
            return (
                <ul className="response-list">
                    {reponse.map((rep, index) => (
                        <li key={index}>{rep}</li>
                    ))}
                </ul>
            );
        }

        // 🔹 Si réponse simple
        return <span>{reponse}</span>;
    };

    function formatFraudeType(type: string): string {
        const mapping: Record<string, string> = {
            perte_focus_fenetre: "Le candidat a quitté la fenêtre de l'examen",
            changement_onglet: "Le candidat a changé d’onglet",
            inactivite: "Inactivité prolongée détectée",
            fermeture_page: "Tentative de fermeture de la page d’examen",
        };

        return mapping[type] || "Comportement suspect détecté";
    }



    function formatTime(seconds: number): string {
        if (!seconds || seconds <= 0) return "0 min";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes} min ${remainingSeconds} sec`;
    }



    const handleValidateNote = async (questionNumero: number) => {
        try {
            const note = manualNotes[questionNumero];

            console.log(manualNotes)

            if (note === undefined) {
                alert("Veuillez attribuer une note avant de valider.");
                return;
            }

            console.log({
                question_id: questionNumero,
                qcm_id: qcmId,
                user_id: userId,
                note: note,
            })



            const resp = await api.post("/entreprise_get/valider_note_question", {
                question_id: questionNumero,
                qcm_id: qcmId,
                user_id: userId,
                note: note,
            });


            console.log(resp)

            if (resp.status == 201) {
                getDetails(userId, qcmId)
            }

            // Marquer comme validée
            // setValidatedQuestions((prev) => [...prev, questionNumero]);

            // alert("Note validée avec succès ✅");

        } catch (error) {
            // console.error("Erreur validation note :", error);
            alert("Erreur lors de la validation.");
        }
    };

    // 🔹 Total dynamique
    const totalPoints =
        data?.questions_detail.reduce(
            (sum: number, q: QuestionDetail) => sum + q.points,
            0
        ) || 0;



    if (!data) return <div>Chargement...</div>;

    return (
        <main>
            <div className="container-dashbord">
                <Sidebar />

                <div className="mainContent">
                    <div className="header">
                        <div>
                            <h2>Détail du Résultat</h2>
                            <p>Correction complète du QCM candidat</p>
                        </div>

                        <Link href="#">
                            <button className="createButton">Retour</button>
                        </Link>
                    </div>

                    {/* 🔹 Infos candidat */}
                    <div className="result-header">
                        <h3>Informations candidat</h3>
                        <p><strong>Nom :</strong> {data.candidat.nom}</p>
                        <p><strong>Email :</strong> {data.candidat.email}</p>
                        <p><strong>Temps :</strong> {formatTime(data.resultat.temps_total)}</p>
                        <p><strong>Score :</strong> {data.resultat.score} / {totalPoints}</p>
                    </div>


                    {/* 🔹 Questions */}
                    {/* 🔹 Questions */}
                    <div className="questions-result">
                        {data.questions_detail.map((q: QuestionDetail) => {

                            const earned = q.points_obtenue || 0;
                            const correct = earned === q.points;

                            return (
                                <div
                                    key={q.questionId}
                                    className={`question-card ${correct ? "correct" : "wrong"}`}
                                >
                                    <h4>
                                        {q.questionId}. {q.intitule}
                                    </h4>

                                    <p><strong>Type :</strong> {q.type}</p>
                                    <p><strong>Points :</strong> {q.points}</p>

                                    {/* 🔹 Options */}
                                    {q.options && q.options.length > 0 && (
                                        <div className="options">
                                            <strong>Options :</strong>
                                            <ul>
                                                {q.options.map((opt: any, index: any) => (
                                                    <li key={index}>{opt}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 🔹 Réponse candidat */}
                                    <p>
                                        <strong>Réponse candidat :</strong>{" "}
                                        {formatReponse(q.type, q.reponseCandidat) || "Aucune réponse"}
                                    </p>

                                    {/* 🔹 Bonne réponse */}
                                    {q.bonnesReponses && (
                                        <p>
                                            <strong>Bonne réponse :</strong>{" "}
                                            {formatReponse(q.type, q.bonnesReponses)}
                                        </p>
                                    )}

                                    {/* 🔹 Justification */}
                                    {q.justification && (
                                        <p>
                                            <strong>Justification :</strong> {q.justification}
                                        </p>
                                    )}

                                    {/* 🔹 Notation manuelle si réponse texte */}
                                    {q.type === "reponse-texte" && (
                                        <div className="manual-grading">
                                            <label>Noter sur {q.points} :</label>

                                            <input
                                                type="number"
                                                min={0}
                                                max={q.points}
                                                value={
                                                    manualNotes[q.questionId] !== undefined
                                                        ? manualNotes[q.questionId]
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    let value = Number(e.target.value);

                                                    // 🔹 S'assurer que la note ne dépasse pas le max
                                                    if (value > q.points) value = q.points;
                                                    if (value < 0) value = 0;

                                                    setManualNotes({
                                                        ...manualNotes,
                                                        [q.questionId]: value,
                                                    });
                                                }}
                                            />

                                            <button
                                                className="validate-btn"
                                                onClick={() => handleValidateNote(q.questionId)}
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    )}

                                    {/* 🔹 Score affiché */}
                                    <div className="score">
                                        Note obtenue : <strong>{earned} / {q.points}</strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>




                    {/* 🔹 Logs Anti-Fraude */}
                    {data.resultat.antiFraudeLogs &&
                        data.resultat.antiFraudeLogs.length > 0 && (
                            <div className="antifraude-section">
                                <h3>⚠️ Activité suspecte détectée</h3>

                                {data.resultat.antiFraudeLogs.map(
                                    (log: any, index: number) => (
                                        <div key={index} className="antifraude-card">
                                            <p>
                                                <strong>Incident :</strong> {formatFraudeType(log.type)}

                                            </p>

                                            <p>
                                                <strong>Question concernée :</strong> {log.question}
                                            </p>

                                            <p>
                                                <strong>Date :</strong>{" "}
                                                {formatTimestamp(log.timestamp)}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}



                </div>
            </div>

        </main>
    );
}
