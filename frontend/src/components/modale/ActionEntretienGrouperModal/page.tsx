import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value?: string) => void;
    confirmLabel?: string;
    actionType?: "delete" | "note" | "notification"; 
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
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    // Réinitialiser les valeurs selon le type d'action
    useEffect(() => {
        setStatus("");
        setMessage("");
    }, [title]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">{title}</h2>

                <div className="popup-body">
                    

                    {/* 2 — ACTION : notification (textarea) */}
                    {actionType === "notification" && (
                        <div>
                            <label>Message de notification :</label>
                            <textarea
                                className="message-textarea"
                                placeholder="Écrire le message à envoyer aux candidats…"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                            ></textarea>
                        </div>
                    )}

                    {/* 3 — ACTION : suppression */}
                    {actionType === "delete" && (
                        <p>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            {selectedCandidatsCount > 1
                                ? `${selectedCandidatsCount} candidats`
                                : "ce candidat"}
                            ?
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
                            if (actionType === "notification") onConfirm(message);
                            else onConfirm();
                        }}
                        disabled={
                            (actionType === "notification" && message.trim() === "")
                        }
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionCandidatModal;
