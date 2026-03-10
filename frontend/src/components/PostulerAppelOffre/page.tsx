"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import apiWithSession from "@/lib/axiosInstance";

interface PostulerAppelOffreModalProps {
  onClose: () => void;
  annonce: {
    id: string;
    titre: string;
    type: string;
    user_info: string;
  };
  display_login: () => void;
}

export default function PostulerAppelOffreModal({
  onClose,
  annonce,
  display_login
}: PostulerAppelOffreModalProps) {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    pdf: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const MAX_LETTRE = 1200;

  useEffect(() => {


    // 🔹 Recherche par défaut (aucun filtre actif)
    const fetchDefaultAnnonces = async () => {
      try {
        setLoading(true);

        const res = await apiWithSession.get(
          `/frontend/entreprise_info_data/`
        );

        if (res.status === 201) {
          const userData = res.data.data;

          setForm((prev) => ({
            ...prev,
            nom: userData.nom || "",
            email: userData.email || "",
          }));

        }
      } catch (error) {
        console.error("Erreur chargement annonces", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultAnnonces()


  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "pdf" && files) {
      setForm({ ...form, pdf: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");



    if (!form.nom || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.message.length > MAX_LETTRE) {
      setError(`La lettre / proposition ne doit pas dépasser ${MAX_LETTRE} caractères.`);
      return;
    }


    try {
      setLoading(true);

      const formData = new FormData();


      formData.append("annonce_id", annonce.id);
      formData.append("nom", form.nom);
      formData.append("email", form.email);
      formData.append("telephone", form.telephone);
      formData.append("message", treatment_msg_to_send(form.message));
      if (form.pdf) formData.append("fichier", form.pdf);

      const resp = await apiWithSession.post(
        `/frontend/postuler_annonce_appel_offre`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
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

        setForm({
          nom: "",
          email: "",
          telephone: "",
          message: "",
          pdf: null,
        });

      }

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };


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
  
  return (
    <div className="overlay">
      <div className="modal_content">
        <button className="close" onClick={onClose}>
          ×
        </button>

        <div className="modal_body">
          <h2>📑 Répondre à l’appel d’offre</h2>

          <p className="subtitle">
            <strong>{annonce.titre}</strong>
            <br />
            Présentez votre profil et votre proposition professionnelle.
          </p>


          {/* Nom */}
          <label>
            Nom ou raison sociale <span className="required">*</span>
          </label>
          <input
            type="text"
            name="nom"
            placeholder="Nom du consultant ou de l’entreprise"
            value={form.nom}
            onChange={handleChange}
            disabled
          />

          {/* Email */}
          <label>
            Email professionnel <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="contact@entreprise.com"
            value={form.email}
            onChange={handleChange}
            disabled
          />

          {/* Téléphone */}
          <label>Téléphone</label>
          <input
            type="tel"
            name="telephone"
            placeholder="Numero de téléphone"
            value={form.telephone}
            onChange={handleChange}
          />

          {/* Lettre / Proposition */}
          <label>
            Lettre de motivation / Proposition <span className="required">*</span>


            <p
              className={`char-count ${form.message.length >= MAX_LETTRE
                ? "danger"
                : form.message.length > MAX_LETTRE - 100
                  ? "warning"
                  : ""
                }`}
            >
              {form.message.length} / {MAX_LETTRE} caractères maximum
            </p>

          </label>
          <textarea
            name="message"
            maxLength={MAX_LETTRE}
            placeholder="Expliquez votre compréhension du besoin, votre expérience pertinente et votre proposition de valeur..."
            value={form.message}
            onChange={handleChange}
          />

          {/* PDF */}
          <label>Ajouter un PDF (optionnel)</label>
          <input
            type="file"
            name="pdf"
            accept=".pdf"
            onChange={handleChange}
          />


        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer ma proposition"}
          </button>
          <button className="cancel" onClick={onClose}>




            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
