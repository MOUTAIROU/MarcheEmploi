"use client";
import React, { useEffect, useState } from "react";
import "./styles.css";

type Question = {
    id: number;
    intitule: string;
    bonnesReponses: string[];
    justification?: string;
    points: number;
};

type QcmResultatModalProps = {
    isOpen: boolean;
    onClose: () => void;
    questions: Question[];
    scoreFinal: number;
    modeExaminateur?: boolean; // 👈 mode test examinateur
};

const QcmResultatModal: React.FC<QcmResultatModalProps> = ({
    isOpen,
    onClose,
    questions,
    scoreFinal,
    modeExaminateur = false,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content large ${isOpen ? "zoom-in" : "zoom-out"}`}>
                
                <h2 className="popup-title">📊 Résultat du QCM</h2>

                {/* SCORE GLOBAL */}
                <div className="score-box">
                    <p>Score final</p>
                    <strong>{scoreFinal}%</strong>
                </div>

                {/* MESSAGE MODE EXAMINATEUR */}
                {modeExaminateur && (
                    <div className="examinateur-info">
                        ⚠️ Ceci est un test examinateur.  
                        Le résultat n’est pas enregistré et ne sera pas envoyé au candidat.
                    </div>
                )}

                <div className="popup-actions">
                    <button className="btn confirm" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QcmResultatModal;