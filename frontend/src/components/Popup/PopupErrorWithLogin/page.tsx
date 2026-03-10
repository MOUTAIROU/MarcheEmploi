import React, { useEffect, useState } from "react";
import "./styles.css"

type PopupProps = {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
};

const Popup: React.FC<PopupProps> = ({ title, message, isOpen, onClose, onLogin }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 300); // animation duration
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
      <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>

        <div className="popup-actions">
          {onLogin && (
            <button className="popup-button popup-login" onClick={onLogin}>
              Connexion
            </button>
          )}

          <button className="popup-button" onClick={onClose}>
            OK
          </button>
        </div>

      </div>
    </div>
  );
};

export default Popup;
