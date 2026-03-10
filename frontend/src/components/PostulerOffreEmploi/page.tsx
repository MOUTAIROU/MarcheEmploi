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
  const MAX_LETTRE = 1000;

  function treatment_msg_to_send(msg: string): string {
    if (!msg.trim()) return "";

    return msg
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "''")
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;");
  }

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!lettre.trim()) {
      setError("Veuillez rédiger une lettre de motivation.");
      return;
    }


    if (lettre.length >= MAX_LETTRE) {
      setError(`La lettre de motivation ne doit pas dépasser ${MAX_LETTRE} caractères.`);
      return;
    }
    try {

      setLoading(true);

      //  const res = await apiWithSession.get("/frontend/check_postulant");

      const resp = await apiWithSession.post(
        `/frontend/postuler_annonce`,
        {
          annonce_id: annonce.id,
          lettre_motivation: treatment_msg_to_send(lettre),
        }
      );


      if (resp.status === 201) {

        if (resp.data.status == "error") {

          if (resp.data.message === "Vous avez déjà postulé à cette annonce") {
            setSuccess("")
            setError("Vous avez déjà postulé à cette annonce")
          }
        }

        if (resp.data.status == "success") {

          if (resp.data.message == "Candidature envoyée avec succès") {
            setError("")
            setSuccess("Votre candidature a été envoyée avec succès ✅")
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

          <h2>📩 Postuler à l’offre</h2>
          <p className="subtitle">{annonce.titre}</p>

          <p className={`char-count ${lettre.length >= 1000 ? "danger" : lettre.length > 900 ? "warning" : ""}`}>
            {lettre.length} / {MAX_LETTRE} caractères maximum
          </p>


          {/* Lettre de motivation */}
          <label>
            Lettre de motivation <span className="required">*</span>
          </label>
          <textarea
            name="lettre"
            placeholder="Expliquez brièvement pourquoi vous êtes le bon profil pour cette offre…"
            value={lettre}
            maxLength={MAX_LETTRE}
            onChange={(e) => setLettre(e.target.value)}
          />

        </div>


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
