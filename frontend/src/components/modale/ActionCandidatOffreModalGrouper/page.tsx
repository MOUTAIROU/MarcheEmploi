import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newStatus?: string) => void;
    confirmLabel?: string;
    actionType?: "notification" | "delete" | "note" | "changer";
    selectedCandidatsCount?: number; // nombre de candidats sélectionnés
};

const ActionCandidatModal: React.FC<ModalProps> = ({
    title,
    isOpen,
    onClose,
    onConfirm,
    confirmLabel = "Confirmer",
    actionType = false,
    selectedCandidatsCount = 1,
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
                    {actionType === "changer" && (
                        <div>
                            <label>Choisir le nouveau statut :</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="">-- Sélectionner --</option>
                                <option value="HIRED">Accepter</option>
                                <option value="WAITING">En attente</option>
                                <option value="REJECTED">Refuser</option>
                            </select>
                        </div>
                    )}

                    {actionType === "delete" && (
                        <div>
                            <p>
                                Êtes-vous sûr de vouloir supprimer{" "}
                                {selectedCandidatsCount > 1
                                    ? `${selectedCandidatsCount} candidats`
                                    : "ce candidat"}
                                ?
                            </p>
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
                    // disabled={actionType && status === ""}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionCandidatModal;
