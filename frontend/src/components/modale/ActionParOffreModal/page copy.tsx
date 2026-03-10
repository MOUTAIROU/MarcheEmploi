import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newDate?: string) => void; // 👈 bouton d’action principale
    confirmLabel?: string; // texte du bouton
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

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setExpirationDate(""); // reset date quand on ouvre un nouveau modal
    }, [title]);

    const isExtendAction = title === "Prolonger la date d’expiration";

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>

                {/* --- HEADER --- */}
                <h2 className="popup-title">{title}</h2>

                {/* --- BODY --- */}
                <div className="popup-body">

                    {/* SI ACTION = PROLONGER → Afficher input date */}
                    {isExtendAction ? (
                        <div>
                            <label>Nouvelle date d’expiration :</label>
                            <input
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    ) : (
                        <p>Êtes-vous sûr de vouloir effectuer cette action ?</p>
                    )}

                </div>

                {/* --- BUTTONS --- */}
                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>

                    <button
                        className="btn confirm"
                        onClick={() =>
                            title === "Prolonger la date d’expiration"
                                ? onConfirm(expirationDate)  // on envoie la date
                                : onConfirm()                 // pas d’argument
                        }
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionGrouperModal;
