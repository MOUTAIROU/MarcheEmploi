import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newStatus?: string) => void;
    confirmLabel?: string;
    actionType?: "notification" | "delete" | "note" | "tel" | "changer";
};



const ActionCandidatModal: React.FC<ModalProps> = ({
    title,
    isOpen,
    onClose,
    onConfirm,
    confirmLabel = "Confirmer",
    actionType = "notification",
}) => {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setStatus(""); // reset status à chaque ouverture
    }, [title]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">{title}</h2>

                <div className="popup-body">
                    {actionType == "changer" && (
                        <div>
                            <label>Choisir le nouveau statut :</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="">-- Sélectionner --</option>
                                <option value="Accepter">Accepter</option>
                                <option value="Refuser">Refuser</option>
                                <option value="En attente">En attente</option>
                            </select>
                        </div>
                    )}

                    {actionType === "notification" && (
                        <div>
                            <label>Message de notification :</label>
                            <textarea
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                placeholder="Écris ici le message à envoyer au candidat..."
                                className="notification-textarea"
                                rows={4}
                            />
                        </div>
                    )}

                    {actionType == "delete" && (
                        <div>
                            <p>Êtes-vous sûr de vouloir supprimer ce(s) candidat(s) ?</p>
                        </div>
                    )}


                </div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="btn confirm"
                        onClick={() =>
                            actionType ? onConfirm(status) : onConfirm()
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
