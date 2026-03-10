"use client";
import { useState, useEffect } from "react";
import "./DeleteAccountModal.css";
import axios from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  identifiant: string;
};



export default function DeleteAccountModal({ isOpen, onClose, onDelete, identifiant }: Props) {
  const [confirmationText, setConfirmationText] = useState("");



  



if (!isOpen) return null;

  const expected = `Moi ${identifiant} je supprime mon compte sur jegbalo.com`;

  const isValid = confirmationText.trim() === expected;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Suppression du compte <span className="ident">{identifiant}</span></h2>
        <p>
          Pour confirmer la suppression de votre compte, veuillez saisir la phrase exacte suivante :
        </p>
        <p className="confirmation-example" onContextMenu={(e) => e.preventDefault()}>
          <i>{expected}</i>
        </p>

        <textarea
          placeholder="Saisissez ici..."
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="confirmation-input"
        />

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>Annuler</button>
          <button className="delete" onClick={onDelete} disabled={!isValid}>
            Supprimer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
