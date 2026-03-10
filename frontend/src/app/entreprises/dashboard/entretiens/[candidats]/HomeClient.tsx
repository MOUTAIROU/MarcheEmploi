"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axiosInstance"; // ton axios configuré
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'
import { countryNumberCode, treatment_msg_to_send, reverse_treatment_msg, country, countryCode, CATEGORIE_LABELS } from "@/utils/types";

// Page / composant Next.js en TypeScript
// Nom du fichier suggéré: pages/dashboard/creer-offre.tsx
export default function CreerOffre() {

    const parametre = useParams(); // pour récupérer l'ID depuis l'URL
    const [commentaire, setCommentaire] = useState("");
    const [note, setNote] = useState("");
    const [entretienId, setEntretienId] = useState("");
    const { candidats } = useParams<{ candidats: string }>();

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [decision, setDecision] = useState("NEUTRE");

    useEffect(() => {
        const raw = parametre?.["candidats"]; // string | string[]
        if (!raw) return;

        // s'assurer que c'est une string
        const rawStr = Array.isArray(raw) ? raw.join(",") : raw;

        const decoded = decodeURIComponent(rawStr);


        // découper par virgule pour avoir un tableau d'IDs
        const ids = decoded.split(",");


        console.log("IDs entretien récupérés :", ids);

        // si tu veux stocker comme string unique séparée par virgule
        setEntretienId(ids.join(","));
    }, [parametre]);




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            entretienId,
            commentaire: treatment_msg_to_send(commentaire),
            note,
            decision,
        };

        console.log("Données prêtes à l'envoi :", payload);

        try {

            const response = await submitOffre(payload);


            if (response.status == 201) {

                const { data } = response

                

                if (data.status == "created" || data.status == "updated") {

                    setSuccessMsg("La décision finale du candidat a été enregistrée avec succès.");
                    setShowSuccess(true)
                }


            }
        } catch (err) {
            console.error("❌ Erreur lors de l'envoi :", err);
        }
    };


    // Fonction d'envoi
    async function submitOffre(payload: any) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/create_note_entretien", payload, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    }


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {showError && (
                        <PopupError
                            isOpen={showError}
                            title="Erreur"
                            message={errorMsg}
                            onClose={() => setShowError(false)}
                        />
                    )}

                    {showSuccess && (
                        <PopupSuccess
                            isOpen={showSuccess}
                            title="Success"
                            message={successMsg}
                            onClose={() => setShowSuccess(false)}
                        />
                    )}
                    <div className="mainContent">

                        <div className="header">
                            <h2>Clôturer l’entretien</h2>
                        </div>


                        <p className="info">
                            Cet entretien est maintenant terminé.
                            Merci de renseigner votre évaluation finale.
                            Ces informations sont internes et ne sont pas visibles par le candidat.
                        </p>


                        <div>
                            <form onSubmit={handleSubmit} className="notesBox">
                                <h3>Évaluation de fin d’entretien</h3>

                                <div className="field">
                                    <label>Appréciation globale du recruteur</label>
                                    <textarea
                                        placeholder="Commentaire du recruteur"
                                        value={reverse_treatment_msg(commentaire)}
                                        onChange={(e) => setCommentaire(e.target.value)}
                                        required />
                                </div>

                                <div className="field">
                                    <label>Note finale (sur 5)</label>
                                    <input
                                        type="number"
                                        placeholder="Note / Score sur 5"
                                        min="0"
                                        max="5"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        required />
                                </div>

                                <div className="field">
                                    <label>Décision finale</label>
                                    <select
                                        value={decision}
                                        onChange={(e) => setDecision(e.target.value)}
                                        required
                                    >
                                        <option value="PENDING">En attente de décision</option>
                                        <option value="ACCEPTE">Candidat retenu</option>
                                        <option value="REJETE">Candidat non retenu</option>
                                    </select>
                                </div>

                                <button type="submit" className="button">
                                    Terminer l’entretien et enregistrer l’évaluation
                                </button>
                            </form>
                        </div>





                    </div>
                </div>
            </main >
        </div >
    );
};

