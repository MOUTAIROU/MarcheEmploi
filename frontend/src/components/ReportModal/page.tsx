"use client";
// components/ReportModal.tsx
import { useState } from "react";
import axios from "axios";
import "./styles.css";

interface ReportModalProps {
  onClose: () => void;
  custom_id: string;
  annonce_id: string;
}



export default function ReportModal({ onClose,custom_id,annonce_id }: ReportModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation manuelle
    if (!name || !phone || !message) {
      setError("Tous les champs sont obligatoires.");
      setSuccess("");
      return;
    }


    
    try {
      // Remplace l'URL par ton endpoint réel
      const response = await axios.post(`${process.env.SERVER_HOST}/report/reportannonce/`, {
        name,
        phone,
        message,
        custom_id,
        annonce_id
      });

      if (response.status === 200) {
        setSuccess("🚀 Signalement envoyé avec succès !");
        setError("");
        // Optionnel : reset le formulaire
        setName("");
        setPhone("");
        setMessage("");
        // Fermer après 2s
        setTimeout(() => {
         onClose();
        }, 2000);
      } else {
        setError("Erreur lors de l'envoi. Veuillez réessayer.");
        setSuccess("");
      }
    } catch (err) {
      setError("Une erreur s’est produite. Vérifiez votre connexion.");
      setSuccess("");
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>
        <h2>🚩 Dénoncer l'annonce</h2>
        <div className="warning">
          Si cette annonce vous paraît frauduleuse ou contient des contenus
          illicites, illégaux, inappropriés, racistes, spams ou abusifs, signalez-le ici.
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Votre nom*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Téléphone*</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Message Signaler un problème: *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez le problème ici..."
            required
          ></textarea>

          <button type="submit">📩 Dénoncer l'annonce</button>
        </form>
      </div>
    </div>
  );
}
