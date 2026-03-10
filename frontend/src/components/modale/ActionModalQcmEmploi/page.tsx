"use client";
import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    action: string;                 // ← NOM de l'action Rowactions
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payload?: any) => void;
};

const OFFRE_REGEX = /^(OFF|AOF)-[A-Z]{2}-\d{4}-\d{8}-\d+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ActionModal: React.FC<ModalProps> = ({
    action,
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [visible, setVisible] = useState(false);

    // Champs selon l'action
    const [offreAssociee, setOffreAssociee] = useState("");
    const [candidats, setCandidats] = useState("");
    const [sendToAll, setSendToAll] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setOffreAssociee("");
        setCandidats("");
        setSendToAll(false);
    }, [action]);

    if (!visible) return null;

    const renderContent = () => {
        switch (action) {
            case "📌 Offres associées":
                return (
                    <>
                        <p>Ajouter une ou plusieurs offres à associer :</p>
                        <textarea
                            placeholder="Ex : OFF-2025-01, OFF-2025-02"
                            value={offreAssociee}
                            onChange={(e) => {
                                setOffreAssociee(e.target.value);
                                setError(null);
                            }}
                            className="popup-input"
                        />
                        {error && <p className="error-text">{error}</p>}
                    </>
                );

            case "📨 Envoyer à des candidats":
                return (
                    <>
                        <p>Choisissez les destinataires :</p>

                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={sendToAll}
                                onChange={(e) => setSendToAll(e.target.checked)}
                            />
                            <span>Envoyer à tous les candidats ayant postulé aux offres associées</span>
                        </label>

                        {!sendToAll && (
                            <>
                                <textarea
                                    placeholder="Emails des candidats séparés par des virgules"
                                    value={candidats}
                                    onChange={(e) => {
                                        setCandidats(e.target.value);
                                        setError(null);
                                    }}
                                    className="popup-textarea"
                                />
                                {error && <p className="error-text">{error}</p>}
                            </>
                        )}
                    </>
                );


            case "❌ Supprimer":
                return <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>;

            default:
                return <p>Action non configurée.</p>;
        }
    };

    const validateOffres = (input: string) => {
        if (!input.trim()) return { valid: false, error: "Veuillez saisir au moins une offre." };

        const offres = input
            .split(",")
            .map(o => o.trim())
            .filter(Boolean);

        const invalides = offres.filter(offre => !OFFRE_REGEX.test(offre));

        if (invalides.length > 0) {
            return {
                valid: false,
                error: `Format invalide pour : ${invalides.join(", ")}`
            };
        }

        return { valid: true, data: offres };
    };

    const validateCandidats = (input: string) => {
        if (!input.trim()) {
            return { valid: false, error: "Veuillez saisir au moins un email de candidat." };
        }

        const emails = input
            .split(",")
            .map(e => e.trim().toLowerCase())
            .filter(Boolean);

        const invalides = emails.filter(email => !EMAIL_REGEX.test(email));

        if (invalides.length > 0) {
            return {
                valid: false,
                error: `Emails invalides : ${invalides.join(", ")}`
            };
        }

        return { valid: true, data: emails };
    };



    const handleConfirm = () => {
        let payload = null;

        if (action === "📌 Offres associées") {

            const result = validateOffres(offreAssociee);

            if (!result.valid) {
                setError(result.error || " ");
                return;
            }

            payload = result.data;;
        }

        if (action === "📨 Envoyer à des candidats" && !sendToAll) {
            const result = validateCandidats(candidats);

            if (!result.valid) {
                setError(result.error || " ");
                return;
            }

            payload = {
                target: "SELECTED",
                emails: result.data
            };
        }

        if (action === "📨 Envoyer à des candidats" && sendToAll) {
            payload = { target: "ALL" };
        }

        onConfirm(payload);
    };


    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">{action}</h2>

                <div className="popup-body">{renderContent()}</div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn confirm" onClick={handleConfirm}>
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
