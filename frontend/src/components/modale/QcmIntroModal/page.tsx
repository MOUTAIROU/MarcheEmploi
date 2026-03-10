type Props = {
    isOpen: boolean;
    titre: string;
    description: string;
    duree?: number; // en minutes
    mode?: string;
    onStart: () => void;
};

export default function QcmIntroModal({
    isOpen,
    titre,
    description,
    duree,
    mode,
    onStart,
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay fade-in">
            <div className="popup-content zoom-in intro-modal">
                <h2 className="popup-title">📝 {titre}</h2>

                <p className="popup-description">{description}</p>

                <div className="intro-info">
                    {duree && (
                        <div>
                            ⏱️ <strong>Durée :</strong> {duree} minutes
                        </div>
                    )}
                    {mode && (
                        <div>
                            📊 <strong>Mode :</strong> {mode}
                        </div>
                    )}
                </div>

                <div className="intro-warning">
                    ⚠️ Une fois l’examen démarré :
                    <ul>
                        <li>⛔ Aucun retour en arrière</li>
                        <li>👁️ L’inactivité est surveillée</li>
                        <li>⏱️ Le temps est strictement limité</li>
                    </ul>
                </div>

                <button className="start-exam-btn" onClick={onStart}>
                    🚀 Commencer l’examen
                </button>
            </div>
        </div>
    );
}
