import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value?: string) => void;
    confirmLabel?: string;

    actionType?: "delete" | "suspend" ;
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

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    // Reset textarea à chaque ouverture
    useEffect(() => {
        setMessage("");
    }, [title]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                
                <h2 className="popup-title">{title}</h2>

                <div className="popup-body">

                    

                    {/* 2 — SUPPRIMER */}
                    {actionType === "delete" && (
                        <p>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            {selectedCandidatsCount > 1
                                ? `${selectedCandidatsCount} candidats`
                                : "ce candidat"}
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
                    )}candidats
                </div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>

                    <button
                        className="btn confirm"
                        onClick={() => onConfirm()}
                    >
                        {confirmLabel}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ActionCandidatModal;
