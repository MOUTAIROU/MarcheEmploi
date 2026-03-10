"use client";

import { useState } from "react";
import axios from "axios";
import "./styles.css";

interface PostulerModalProps {
  onClose: () => void;
  annonce: {
    id: string;
    titre: string;
    type: string;
    user_info: string;
  };
}

export default function PostulerModal({ onClose, annonce }: PostulerModalProps) {

  alert('toto')
  const [lettre, setLettre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!lettre.trim()) {
      setError("Veuillez rédiger une lettre de motivation.");
      return;
    }

    try {
      setLoading(true);

      const resp = await axios.post(
        `${process.env.SERVER_HOST}/annonce/postuler`,
        {
          annonce_id: annonce.id,
          lettre_motivation: lettre,
        }
      );

      if (resp.status === 200) {
        setSuccess("Votre candidature a été envoyée avec succès ✅");
        setLettre("");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l’envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>

        <h2>📩 Postuler à l’offre</h2>
        <p className="subtitle">{annonce.titre}</p>

        {/* Lettre de motivation */}
        <label>
          Lettre de motivation <span className="required">*</span>
        </label>
        <textarea
          name="lettre"
          placeholder="Expliquez brièvement pourquoi vous êtes le bon profil pour cette offre…"
          value={lettre}
          maxLength={1000}
          onChange={(e) => setLettre(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer ma candidature"}
          </button>
          <button className="cancel" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
