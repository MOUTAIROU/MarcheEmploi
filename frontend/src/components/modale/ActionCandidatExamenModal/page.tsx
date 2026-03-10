"use client";
import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    action: string;                 // ← NOM de l'action Rowactions
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payload?: any) => void;
};

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

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setOffreAssociee("");
        setCandidats("");
    }, [action]);

    if (!visible) return null;

    const renderContent = () => {
    switch (action) {
        case "📨 Envoyer notification":
            return (
                <>
                    <p>Écrivez le message de notification à envoyer :</p>
                    <textarea
                        placeholder="Message pour le candidat..."
                        value={candidats}
                        onChange={(e) => setCandidats(e.target.value)}
                        className="popup-textarea"
                        rows={6}
                    />
                </>
            );

        case "❌ Supprimer":
            return <p>Êtes-vous sûr de vouloir retirer les candidat du QCM ?</p>;

        default:
            return <p>Action non configurable ou redirection automatique.</p>;
    }
};

const handleConfirm = () => {
    const payload =
        action === "📨 Envoyer notification"
            ? candidats
            : null; // pour supprimer, tu peux envoyer true ou l'ID si nécessaire

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
