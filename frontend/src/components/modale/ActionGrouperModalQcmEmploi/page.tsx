import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newDate?: string, newStatus?: "hors_ligne" | "en_ligne" | "delete") => void;
    confirmLabel?: string;
};

const ActionGrouperModal: React.FC<ModalProps> = ({
    title,
    isOpen,
    onClose,
    onConfirm,
    confirmLabel = "Confirmer",
}) => {
    const [visible, setVisible] = useState(false);
    const [expirationDate, setExpirationDate] = useState("");
    const [horLigneStatus, setHorLigneStatus] = useState<"hors_ligne" | "en_ligne">("hors_ligne");

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setExpirationDate(""); // reset date quand on ouvre un nouveau modal
        setHorLigneStatus("hors_ligne"); // reset status
    }, [title]);

    const isExtendAction = title === "Prolonger la date d’expiration";
    const isHorLigneAction = title === "Mettre hors ligne";
    const isDeleteAction = title === "Supprimer";

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">{title}</h2>

                <div className="popup-body">
                    {isExtendAction && (
                        <div>
                            <label>Nouvelle date d’expiration :</label>
                            <input
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    )}

                    {isHorLigneAction && (
                        <div>
                            <label>Changer le statut :</label>
                            <select
                                value={horLigneStatus}
                                onChange={(e) => setHorLigneStatus(e.target.value as "hors_ligne" | "en_ligne")}
                                className="date-input"
                            >
                                <option value="hors_ligne">Mettre hors ligne</option>
                                <option value="en_ligne">Remettre en ligne</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>

                    <button
                        className="btn confirm"
                        onClick={() => {
                            if (isExtendAction) {
                                onConfirm(expirationDate);
                            }
                            else if (isHorLigneAction) {
                                onConfirm(undefined, horLigneStatus);
                            }
                            else if (isDeleteAction) {
                                onConfirm(undefined, 'delete'); // 👈 suppression : aucun paramètre
                            }
                            else {
                                onConfirm(); // fallback sécurité
                            }
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionGrouperModal;
