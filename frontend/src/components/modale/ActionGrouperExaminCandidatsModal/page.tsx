import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message?: string) => void; // bouton d’action principale
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
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setMessage(""); // reset message à chaque ouverture
    }, [title]);

    const isNotificationAction = title === "📨 Envoyer notification aux candidats";

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>

                {/* --- HEADER --- */}
                <h2 className="popup-title">{title}</h2>

                {/* --- BODY --- */}
                <div className="popup-body">

                    {isNotificationAction ? (
                        <div>
                            <label>Message à envoyer :</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Écrivez votre message ici..."
                                className="textarea-input"
                                rows={6}
                            />
                        </div>
                    ) : (
                        <p>Êtes-vous sûr de vouloir effectuer cette action sur les QCM sélectionnés ?</p>
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
                            isNotificationAction
                                ? onConfirm(message) // envoie le message
                                : onConfirm()        // simple confirmation
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
