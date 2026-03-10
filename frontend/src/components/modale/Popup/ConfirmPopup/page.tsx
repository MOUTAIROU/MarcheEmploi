import React, { useState } from "react";

type ConfirmPopupProps = {
  title: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ title, message, isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button className="popup-button confirm" onClick={onConfirm}>Confirmer</button>
          <button className="popup-button cancel" onClick={onCancel}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;