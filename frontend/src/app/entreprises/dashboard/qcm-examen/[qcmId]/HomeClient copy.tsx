"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import QuestionBloc from "@/components/QuestionBlocSequentiel/page";


import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";
import { countryNumberCode, country, countryCode } from "@/utils/types";

interface Question {
    id: number;
    intitule: string;
    type: string;
    niveau: string;
    optionTexte: string;
    points: number;
    temps?: number;
    tempsMin?: number; // minutes
    tempsSec?: number; // secondes:
    options: string[];
    bonnesReponses: string[];
    justification?: string;
    isOpen?: boolean;
}


interface Parametre {
    difficulte: boolean;
    inactivite: boolean;
    retour: boolean;
    chrono: boolean;
    mail: boolean;
    modePassage?: "libre" | "sequentiel" | "adaptatif";
}

interface AntiFraudeEvent {
    type:
    | "timeout"
    | "submit"
    | "inactivite"
    | "retour_navigateur"
    | "changement_onglet"
    | "perte_focus_fenetre";
    timestamp: number;
    questionId?: number;
}

const MAX_QUESTIONS = 20;

export default function OffresPage() {

    const { qcmId } = useParams<{ qcmId: string }>();
    const [params, setParams] = useState<Parametre | null>(null);
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [reponses, setReponses] = useState<Record<number, any>>({});
    const [tempsRestant, setTempsRestant] = useState<number | null>(null);
    const [examTermine, setExamTermine] = useState(false);
    const [afficherResultat, setAfficherResultat] = useState(false);
    const [afficherDifficulte, setAfficherDifficulte] = useState(false);
    const [scoreFinal, setScoreFinal] = useState(0);
    const [noteMini, setNoteMini] = useState(0);
    const [dernierMouvement, setDernierMouvement] = useState(Date.now());
    const [antiFraudeLogs, setAntiFraudeLogs] = useState<AntiFraudeEvent[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const questionCourante = questions[currentIndex];
    const INACTIVITE_MAX = 60; // secondes (modifiable)




    useEffect(() => {
        if (!qcmId) return;
        getOffres()

    }, [qcmId]);

    useEffect(() => {
        if (!params?.inactivite || examTermine) return;

        const resetTimer = () => {
            setDernierMouvement(Date.now());
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
        };
    }, [params?.inactivite, examTermine]);

    useEffect(() => {
        if (!params?.inactivite || examTermine) return;

        const check = setInterval(() => {
            const now = Date.now();
            const diff = (now - dernierMouvement) / 1000;

            if (diff >= INACTIVITE_MAX) {
                logAntiFraude("inactivite");
            }
        }, 1000);

        return () => clearInterval(check);
    }, [dernierMouvement, params?.inactivite, examTermine]);


    useEffect(() => {
        if (!params?.retour || examTermine) return;


        console.log(document.visibilityState)

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                logAntiFraude("changement_onglet");
            }
        };

        const handleBlur = () => {
            logAntiFraude("perte_focus_fenetre");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [params?.retour, examTermine]);



    useEffect(() => {
        if (!params?.retour || examTermine) return;

        history.pushState(null, "", location.href);

        const blockBack = () => {
            logAntiFraude("retour_navigateur");
            history.pushState(null, "", location.href);
        };

        window.addEventListener("popstate", blockBack);

        return () => {
            window.removeEventListener("popstate", blockBack);
        };
    }, [params?.retour, examTermine]);





    useEffect(() => {
        if (tempsRestant === null || examTermine) return;

        if (tempsRestant <= 0) {
            logAntiFraude("timeout");
            return;
        }

        const timer = setInterval(() => {
            setTempsRestant((prev) => (prev !== null ? prev - 1 : prev));
        }, 1000);

        return () => clearInterval(timer);
    }, [tempsRestant, examTermine]);


    const logAntiFraude = (
        type: AntiFraudeEvent["type"],
        questionId?: number
    ) => {
        setAntiFraudeLogs((prev) => [
            ...prev,
            {
                type,
                timestamp: Date.now(),
                questionId,
            },
        ]);

        console.warn("⚠️ Anti-fraude :", type);
    };


    const passerQuestionSuivante = () => {
        if (!questionCourante) return;

        // ❌ pas de réponse → bloqué
        if (!reponses[questionCourante.id]) {
            alert("Veuillez répondre à la question avant de continuer");
            return;
        }

        // 🔚 Fin de l’examen
        if (currentIndex + 1 >= questions.length) {
            terminerExamen("submit");
            return;
        }

        setCurrentIndex((prev) => prev + 1);
    };



    const calculerScore = () => {
        let score = 0;
        let totalPoints = 0;

        questions.forEach((q) => {

            console.log(q)
            totalPoints += q.points || 0;

            const reponseCandidat = reponses[q.id];

            if (!reponseCandidat) return;

            // Vrai / Faux ou QCM unique
            if (typeof reponseCandidat === "string") {
                if (q.bonnesReponses.includes(reponseCandidat)) {
                    score += q.points;
                }
            }

            // QCM multiple
            if (Array.isArray(reponseCandidat)) {
                const correct =
                    reponseCandidat.length === q.bonnesReponses.length &&
                    reponseCandidat.every((r: string) =>
                        q.bonnesReponses.includes(r)
                    );

                if (correct) {
                    score += q.points;
                }
            }
        });

        const pourcentage = Math.round((score / totalPoints) * 100);

        setScoreFinal(pourcentage);
    };


    const evaluerReponse = (question: Question) => {
        const reponse = reponses[question.id];

        if (!reponse) return "neutre";

        if (question.bonnesReponses.includes(reponse)) {
            return "correct";
        }

        return "incorrect";
    };



    const terminerExamen = (
        raison:
            | "timeout"
            | "submit"
            | "inactivite"
            | "retour_navigateur"
            | "changement_onglet"
            | "perte_focus_fenetre"
    ) => {
        if (examTermine) return;

        setExamTermine(true);
        calculerScore();

        console.warn("Examen terminé :", raison);

        const payload = {
            qcmId,
            reponses,
            scoreFinal,
            antiFraudeLogs, // 🔥 CRUCIAL
            raisonFinale: raison,
        };

        console.log("Soumission finale :", payload);

        // api.post("/examens/submit", payload);
    };




    async function getOffres() {
        try {
            const response = await api.get(
                `entreprise_get/get_qcm_by_post_id/${qcmId}`
            );

            const offre = response.data.data;


            if (!offre) return;

            console.log(offre)

            setTitre(offre.titre);
            setDescription(offre.description);
            setParams(offre.params);




            if (offre.params?.difficulte) {
                setAfficherDifficulte(Boolean(offre.params?.difficulte));
            }



            setAfficherResultat(offre.afficherResultat === 0);

            setNoteMini(offre.noteMin)


            if (offre.mode === "libre" && offre.params?.chrono) {


                setTempsRestant(Number(offre.duree) * 60); // minutes → secondes
            }

            setQuestions(
                (offre.questions || []).map((q: any, index: number) => ({
                    id: index + 1,
                    intitule: q.intitule,
                    bonnesReponses: q.bonnesReponses,
                    justification: q.justification,
                    points: q.points,
                    niveau: q.niveau,
                    type: q.type,
                    options: q.options || [],
                    optionTexte: q.optionTexte || "",
                    tempsMin: q.tempsMin,
                    tempsSec: q.tempsSec,
                }))
            );

        } catch (error) {
            console.error("Erreur récupération QCM :", error);
        }
    }

    const handleReponseChange = (questionId: number, value: any) => {
        setReponses((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };







    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        {tempsRestant !== null && (
                            <div className="chrono-global">
                                ⏱ Temps restant : {Math.floor(tempsRestant / 60)}:
                                {(tempsRestant % 60).toString().padStart(2, "0")}
                            </div>
                        )}

                        {examTermine && afficherResultat === true && (
                            <div className="resultat-final">
                                <h3>Résultat final</h3>

                                <p>
                                    Score : <strong>{scoreFinal}%</strong>
                                </p>

                                <p>
                                    Statut :{" "}
                                    {scoreFinal >= Number(noteMini) ? (
                                        <span className="success">Réussi</span>
                                    ) : (
                                        <span className="error">Échoué</span>
                                    )}
                                </p>
                            </div>
                        )}


                        <h2 className="qcm-title">{titre}</h2>
                        <p className="qcm-subtitle">{description}</p>

                        <div className="exam-container">

                            {params?.modePassage === "libre" && (
                                questions.map((q, index) => (
                                    <QuestionBloc
                                        key={q.id}
                                        q={q}
                                        index={index}
                                    />
                                ))
                            )}

                            {params?.modePassage !== "libre" && questionCourante && (
                                <div className="exam-question">
                                    <h4>
                                        Question {currentIndex + 1} / {questions.length}
                                    </h4>

                                    <p className="question-intitule">
                                        {questionCourante.intitule}
                                    </p>

                                    {afficherDifficulte && (
                                        <span className="badge-niveau">
                                            Niveau : {questionCourante.niveau}
                                        </span>
                                    )}

                                    {/* réponses */}
                                    {/* (tu réutilises exactement ton code existant ici) */}

                                    <button
                                        className="next-btn"
                                        onClick={passerQuestionSuivante}
                                    >
                                        {currentIndex + 1 === questions.length
                                            ? "Terminer l’examen"
                                            : "Question suivante"}
                                    </button>
                                </div>
                            )}

                            {questions.map((q, index) => (
                                <div key={q.id} className="exam-question">
                                    <h4>
                                        Question {index + 1}
                                    </h4>

                                    <p className="question-intitule">{q.intitule}</p>

                                    {examTermine && afficherResultat === true && (
                                        <div className="correction">
                                            <p>
                                                <strong>Bonne réponse :</strong>{" "}
                                                {q.bonnesReponses.join(", ")}
                                            </p>

                                            {q.justification && (
                                                <p className="justification">
                                                    <strong>Justification :</strong> {q.justification}
                                                </p>
                                            )}
                                        </div>
                                    )}


                                    {afficherDifficulte && (
                                        <span className="badge-niveau">
                                            Niveau : {q.niveau}
                                        </span>
                                    )}





                                    {/* 🔹 Choix multiple */}
                                    {(q.type === "choix-multiple" || q.type === "qcm-unique") && (
                                        <div className="options">
                                            {q.options.map((opt, i) => (
                                                <label key={i} className="option-item">
                                                    <input
                                                        type={q.type === "qcm-unique" ? "radio" : "checkbox"}
                                                        name={`question-${q.id}`}
                                                        value={opt}
                                                        onChange={(e) => {
                                                            if (q.type === "qcm-unique") {
                                                                handleReponseChange(q.id, opt);
                                                            } else {
                                                                const current = reponses[q.id] || [];
                                                                handleReponseChange(
                                                                    q.id,
                                                                    e.target.checked
                                                                        ? [...current, opt]
                                                                        : current.filter((v: string) => v !== opt)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* 🔹 Vrai / Faux */}
                                    {q.type === "vrai-faux" && (
                                        <div className="options">
                                            {["Vrai", "Faux"].map((opt) => (
                                                <label key={opt}>
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        value={opt}
                                                        onChange={() => handleReponseChange(q.id, opt)}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* 🔹 Réponse texte */}
                                    {q.type === "reponse-texte" && (
                                        <textarea
                                            placeholder="Votre réponse..."
                                            onChange={(e) =>
                                                handleReponseChange(q.id, e.target.value)
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            disabled={examTermine}
                            onClick={() => terminerExamen("submit")}
                            className="publish-btn"
                        >
                            Soumettre l’examen
                        </button>




                    </div>
                </div>
            </main >

        </div >


    );
}
