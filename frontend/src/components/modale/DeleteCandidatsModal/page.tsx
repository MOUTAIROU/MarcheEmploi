import React from "react";
import "./style.css";

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    offreId
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: string) => void;
    offreId: string | null;
}) {
    if (!isOpen || !offreId) return null;

    return (
        <div className="popup-overlay fade-in">
            <div className="popup-content zoom-in">
                <h2 className="popup-title">Supprimer l’offre</h2>

                <p className="popup-body">
                    Voulez-vous vraiment supprimer l’offre <b>{offreId}</b> ?
                </p>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="btn confirm"
                        onClick={() => onConfirm(offreId)}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}
