"use client";
import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    name: string;
    title: string;
    action: string;                 // NOM de l'action
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payload?: any) => void;
};

const ActionModal: React.FC<ModalProps> = ({
    name,
    action,
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [visible, setVisible] = useState(false);

    // Champ pour saisie du texte
    const [confirmationText, setConfirmationText] = useState("");

    // Texte exact à saisir
    const requiredText = `Moi ${name} je valide la suppression de mon compte sur marcheemploie.com`;

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    // Reset à l'ouverture
    useEffect(() => {
        setConfirmationText("");
    }, [action, isOpen]);

    if (!visible) return null;

    const renderContent = () => {
        switch (action) {
            case "delete-account":
                return (
                    <>
                        <p>
                            Pour confirmer la suppression de votre compte, veuillez saisir le texte exact suivant :
                        </p>
                        <blockquote style={{ background: "#f5f5f5", padding: "10px", borderLeft: "4px solid #f00" }}>
                            {requiredText}
                        </blockquote>
                        <input
                            type="text"
                            placeholder="Saisissez le texte exactement"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="popup-input"
                        />
                    </>
                );

            default:
                return <p>Action non configurable ou redirection automatique.</p>;
        }
    };

    const handleConfirm = () => {
        if (action === "delete-account") {
            if (confirmationText !== requiredText) {
                alert("⚠️ Le texte saisi doit commencer par 'Moi [votre nom]' et finir par 'je valide la suppression de mon compte sur marcheemploie.com'.");
                return;
            }
        }
        onConfirm(true);
    };

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">{action === "delete-account" ? "Suppression de compte" : action}</h2>

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
