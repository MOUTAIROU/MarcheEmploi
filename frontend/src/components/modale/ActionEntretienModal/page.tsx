import React, { useEffect, useState } from "react";
import "./styles.css";

type ActionType = "note" | "notification" | "delete";

type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data?: string) => void;
    confirmLabel?: string;
    actionType: ActionType;
};

const ActionEntretienModal: React.FC<ModalProps> = ({
    title,
    isOpen,
    onClose,
    onConfirm,
    confirmLabel = "Confirmer",
    actionType
}) => {

    const [visible, setVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // animation
    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 250);
    }, [isOpen]);

    // reset input quand on change d’action
    useEffect(() => {
        setInputValue("");
    }, [title]);

    if (!visible) return null;

    const renderBody = () => {
        switch (actionType) {
            case "note":
                return (
                    <>
                        <p>Ajouter une note interne pour cet entretien :</p>
                        <textarea
                            className="modal-textarea"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Écrire une note…"
                        />
                    </>
                );

            case "notification":
                return (
                    <>
                        <p>Envoyer une notification au candidat :</p>
                        <textarea
                            className="modal-textarea"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Message à envoyer…"
                        />
                    </>
                );

            case "delete":
                return (
                    <p style={{ color: "red" }}>
                        ⚠️ Voulez-vous vraiment supprimer cet entretien ? Cette action est irréversible.
                    </p>
                );

            default:
                return <p>Confirmer cette action ?</p>;
        }
    };

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>

                <h2 className="popup-title">{title}</h2>

                <div className="popup-body">{renderBody()}</div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>

                    <button
                        className="btn confirm"
                        onClick={() =>
                            actionType === "delete"
                                ? onConfirm()
                                : onConfirm(inputValue)
                        }
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionEntretienModal;
