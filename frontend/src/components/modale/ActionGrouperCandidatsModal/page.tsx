import React, { useEffect, useState } from "react";
import "./styles.css";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
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

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">{title}</h2>
                <p className="popup-body">
                    Êtes-vous sûr de vouloir supprimer les offres sélectionnées ?
                </p>
                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn confirm" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionGrouperModal;
