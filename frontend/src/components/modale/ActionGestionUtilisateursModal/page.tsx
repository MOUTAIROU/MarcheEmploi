import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value?: string) => void;
    confirmLabel?: string;

    actionType?: "delete" | "suspend" | "modifier";
    selectedCandidatsCount?: number;
};

const ActionCandidatModal: React.FC<ModalProps> = ({
    title,
    isOpen,
    onClose,
    onConfirm,
    confirmLabel = "Confirmer",
    actionType = "delete",
    selectedCandidatsCount = 1,
}) => {

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [modifierValue, setModifierValue] = useState("");   // 👈 NOUVEAU

    const modifierOptions = [
        { value: "Admin", label: "Admin" },
        { value: "Recruteur", label: "Recruteur" },
        { value: "Suspendre", label: "Suspendre" },
    ]; // 👈 Options du select

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    // Reset champs à chaque ouverture
    useEffect(() => {
        setMessage("");
        setModifierValue("");
    }, [title]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>

                <h2 className="popup-title">{title}</h2>

                <div className="popup-body">

                    {/* 1 — MODIFIER */}
                    {actionType === "modifier" && (
                        <div className="modifier-block">
                            <p>
                                Modifiez l’état de{" "}
                                {selectedCandidatsCount > 1
                                    ? `${selectedCandidatsCount} candidats`
                                    : "ce candidat"}
                                :
                            </p>

                            {/* >>> SELECT AFFICHÉ ICI <<< */}
                            <select
                                className="modifier-select"
                                value={modifierValue}
                                onChange={(e) => setModifierValue(e.target.value)}
                            >
                                <option value="">-- Sélectionner un statut --</option>
                                {modifierOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* 2 — SUPPRIMER */}
                    {actionType === "delete" && (
                        <p>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            {selectedCandidatsCount > 1
                                ? `${selectedCandidatsCount} recruteur`
                                : "ce recruteur"}
                            ?
                        </p>
                    )}

                    {/* 3 — SUSPENDRE */}
                    {actionType === "suspend" && (
                        <p>
                            Voulez-vous suspendre{" "}
                            {selectedCandidatsCount > 1
                                ? `${selectedCandidatsCount} candidats`
                                : "ce candidat"}
                            ?
                            <br />
                            <small>(Les candidats suspendus ne pourront plus postuler)</small>
                        </p>
                    )}
                </div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>

                    <button
                        className="btn confirm"
                        onClick={() => {
                            if (actionType === "modifier") {
                                onConfirm(modifierValue); // << ENVOIE LA VALEUR
                            } else {
                                onConfirm();
                            }
                        }}
                        disabled={actionType === "modifier" && modifierValue === ""}
                    >
                        {confirmLabel}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ActionCandidatModal;
