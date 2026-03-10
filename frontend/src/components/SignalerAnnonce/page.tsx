"use client";

import { useState } from "react";
import axios from "axios";
import "./styles.css";
import apiWithSession from "@/lib/axiosInstance";

interface PostulerModalProps {
  onClose: () => void;
  annonce: {
    id: string;
    titre: string;
    type: string;
    user_info: string;
  };
  display_login: () => void;
}

export default function PostulerModal({ onClose, annonce, display_login }: PostulerModalProps) {

  const [lettre, setLettre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!lettre.trim()) {
      setError("Veuillez indiquer le motif du signalement.");
      return;
    }

    try {

      setLoading(true);

      //  const res = await apiWithSession.get("/frontend/check_postulant");

      const resp = await apiWithSession.post(
        `/frontend/signaler_annonce`,
        {
          annonce_id: annonce.id,
          lettre_motivation: lettre,
        }
      );


      if (resp.status === 201) {

        if (resp.data.status == "info") {

          if (resp.data.message === "Vous avez déjà signalé cette annonce") {
            setSuccess("")
            setError("Vous avez déjà signalé cette annonce")
          }
        }

      
        if (resp.data.status == "success") {

          if (resp.data.message == "Signalement envoyé avec succès") {
            setError("")
            setSuccess("Merci, votre signalement a bien été pris en compte ✅")
          }
        }

        setLettre("");
      }
    } catch (error: any) {


      if (error.response?.data?.code === "AUTH_REQUIRED") {
        // redirection login
        display_login()
        return;
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal_content">
        <button className="close" onClick={onClose}>×</button>

        <div className="modal_body">

          <h2>🚨 Signaler cette annonce</h2>
          <p className="subtitle">Vous signalez l’annonce : <strong>{annonce.titre}</strong></p>

          {/* Lettre de motivation */}
          <label>
            Motif du signalement <span className="required">*</span>
          </label>
          <textarea
            name="lettre"
            placeholder="Expliquez brièvement le problème rencontré (contenu frauduleux, informations trompeuses, spam, etc.)"
            value={lettre}
            maxLength={1000}
            onChange={(e) => setLettre(e.target.value)}
          />

        </div>




        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le signalement"}
          </button>
          <button className="cancel" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
