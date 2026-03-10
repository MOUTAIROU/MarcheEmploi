"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import QuestionBlocSequentiel from "@/components/QuestionBlocSequentiel/page";
import QuestionBlocLibre from "@/components/QuestionBlocLibre/page";
import QcmResultatModal from '@/components/modale/QcmResultatModal/page'
import { countryNumberCode, treatment_msg_to_send, reverse_treatment_msg, country, countryCode, CATEGORIE_LABELS } from "@/utils/types";

import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const questionCourante = questions[currentIndex];
    const INACTIVITE_MAX = 60; // secondes (modifiable)
    const DEFAULT_TIME = 30;

    const [tempsQuestionRestant, setTempsQuestionRestant] = useState<number>(0);
    const timerRef = useRef<number | null>(null);





    useEffect(() => {
        if (!qcmId) return;
        getOffres()

    }, [qcmId]);


    const [tempsQuestion, setTempsQuestion] = useState<number>(DEFAULT_TIME);

    useEffect(() => {
        if (!questionCourante || examTermine) return;

        // ⏱️ temps défini pour la question
        const tempsDefini =
            (questionCourante.tempsMin ?? 0) * 60 +
            (questionCourante.tempsSec ?? 0);

        const tempsFinal = tempsDefini > 0 ? tempsDefini : DEFAULT_TIME;

        setTempsQuestionRestant(tempsFinal);

        // 🔴 stop ancien timer
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }

        let tempsLocal = tempsFinal;

        timerRef.current = window.setInterval(() => {
            tempsLocal -= 1;
            setTempsQuestionRestant(tempsLocal);

            if (tempsLocal <= 0) {
                clearInterval(timerRef.current!);
                passerQuestionSuivante();
            }
        }, 1000);

        return () => {
            clearInterval(timerRef.current!);
        };
    }, [questionCourante, examTermine]);

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

        const dernierMouvementRef = { current: dernierMouvement }; // ref locale

        const resetDernierMouvement = () => {
            dernierMouvementRef.current = Date.now();
            setDernierMouvement(Date.now()); // garde la valeur dans le state si besoin
        };

        window.addEventListener("mousemove", resetDernierMouvement);
        window.addEventListener("keydown", resetDernierMouvement);
        window.addEventListener("click", resetDernierMouvement);

        let inactiviteDeclenche = false;

        const interval = setInterval(() => {
            const diff = (Date.now() - dernierMouvementRef.current) / 1000;
            if (diff >= INACTIVITE_MAX && !inactiviteDeclenche) {
                logAntiFraude("inactivite");
                inactiviteDeclenche = true; // ne déclenche qu’une fois
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            window.removeEventListener("mousemove", resetDernierMouvement);
            window.removeEventListener("keydown", resetDernierMouvement);
            window.removeEventListener("click", resetDernierMouvement);
        };
    }, [params?.inactivite, examTermine]); // <-- plus de dernierMouvement ici



    useEffect(() => {
        if (!params?.retour || examTermine) return;

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

        return pourcentage
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


        const payload = {
            qcmId,
            reponses,
            scoreFinal: calculerScore(),
            antiFraudeLogs, // 🔥 CRUCIAL
            raisonFinale: raison,
        };

        setIsModalOpen(true)

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

            setTitre(offre.titre);
            setDescription(offre.description);

            setParams({
                difficulte: !!offre.params?.difficulte,
                inactivite: !!offre.params?.inactivite,
                retour: !!offre.params?.retour,
                chrono: !!offre.params?.chrono,
                mail: !!offre.params?.mail,
                modePassage: offre.mode as "libre" | "sequentiel" | "adaptatif",
            });

            if (offre.params?.difficulte) {
                setAfficherDifficulte(Boolean(offre.params?.difficulte));
            }



            setAfficherResultat(offre.afficherResultat === 0 ? false : true);

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


    function decodeHTML(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }




    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">


                        <QcmResultatModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            questions={questions}
                            scoreFinal={scoreFinal}

                        />

                        <div className="qcm-header">
                            <div className="qcm-titles">
                                <h2 className="qcm-title">{reverse_treatment_msg(titre)}</h2>
                                <p className="qcm-subtitle">{reverse_treatment_msg(description)}</p>
                            </div>


                        </div>

                        {tempsRestant !== null && (
                            <div className="chrono-global-fixed">
                                <span className="chrono-icon">⏱</span>
                                <span className="chrono-time">
                                    {Math.floor(tempsRestant / 60)}:
                                    {(tempsRestant % 60).toString().padStart(2, "0")}
                                </span>
                            </div>
                        )}

                        <div className="exam-container">

                            {params?.modePassage === "libre" && (
                                <>
                                    {questions.map((q, index) => (
                                        <QuestionBlocLibre
                                            key={q.id}
                                            q={q}
                                            index={index}
                                            reponse={reponses[q.id]}
                                            examTermine={examTermine}
                                            afficherResultat={afficherResultat}
                                            afficherDifficulte={afficherDifficulte}
                                            handleReponseChange={handleReponseChange}
                                        />
                                    ))}

                                    <div className="submit-btn-container">
                                        <button
                                            disabled={examTermine}
                                            onClick={() => terminerExamen("submit")}
                                            className="publish-btn"
                                        >
                                            Soumettre l’examen
                                        </button>
                                    </div>
                                </>
                            )}


                            {params?.modePassage !== "libre" && questionCourante && (
                                <div>




                                    <QuestionBlocSequentiel
                                        question={questionCourante}
                                        temps={tempsQuestion}
                                        tempsRestant={tempsQuestionRestant}
                                        index={currentIndex}
                                        reponse={reponses[questionCourante.id]}
                                        examTermine={examTermine}
                                        //afficherResultat={afficherResultat}
                                        afficherDifficulte={afficherDifficulte}
                                        handleReponseChange={handleReponseChange}
                                        passerQuestionSuivante={passerQuestionSuivante} // <-- ajouté ici
                                    />
                                    <button
                                                className={`next-btn ${currentIndex + 1 === questions.length ? "finish" : ""
                                                    }`}
                                                onClick={passerQuestionSuivante}
                                            >
                                                <span className="btn-text">
                                                    {currentIndex + 1 === questions.length
                                                        ? "Terminer l’examen"
                                                        : "Question suivante"}
                                                </span>

                                                <span className="btn-icon">
                                                    {currentIndex + 1 === questions.length ? "🏁" : "➡️"}
                                                </span>
                                            </button>
                                </div>
                            )}

                        </div>






                    </div>
                </div>
            </main >

        </div >


    );
}
