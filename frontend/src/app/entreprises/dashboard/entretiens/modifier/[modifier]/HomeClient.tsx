"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import Link from "next/link";
import { countryNumberCode, treatment_msg_to_send, reverse_treatment_msg, country, countryCode, CATEGORIE_LABELS } from "@/utils/types";

import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'


// Page / composant Next.js en TypeScript
// Nom du fichier suggéré: pages/dashboard/creer-offre.tsx

const FILE_BASE_URL = `${process.env.SERVER_HOST}/uploads/pdf`;

const entretienTypes = [
    "Téléphonique",
    "Présentiel",
    "Visio (Zoom/Teams)",
    "Asynchrone (enregistrement)"
];

export default function CreerOffre() {

    const [form, setForm] = useState({
        candidat: "",
        offre: "",
        type: "",
        date: "",
        duree: "",
        heure: "",
        responsable: "",
        lien: "",
        lieu: "",
        message: "",
        pieceJointe: "",
    });

    const fileRef = useRef<HTMLInputElement>(null);
    const { modifier } = useParams<{ modifier: string }>();
    const [existingFile, setExistingFile] = useState<string | null>(null);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    useEffect(() => {
        if (!modifier) return;
        getOffres()
    }, []);

    async function getOffres() {
        try {
            const response = await api.get(
                `entreprise_get/get_entretiens_by_post_id/${modifier}`
            );

            const offre = response.data.data; // 👈 objet simple

            if (!offre) return;

            setForm({
                candidat: offre.candidat ?? "",
                offre: offre.offre ?? "",
                type: offre.type ?? "",
                date: offre.date,
                heure: offre.heure,
                duree: offre.duree ?? "",
                responsable: offre.responsable ?? "",
                lien: offre.lien ?? "",
                lieu: offre.lieu ?? "",
                message: reverse_treatment_msg(offre.message) ?? "",
                pieceJointe: offre.filenameBase ?? ""
            });

            setExistingFile(offre.filenameBase ?? null);



        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }

    const toDateTimeLocal = (date: string, heure: string) => {
        if (!date || !heure) return "";
        return `${date}T${heure.slice(0, 5)}`;
    };


    function isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    function decodeHTML(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }


    function validateForm(form: any): string | null {
        if (!form.candidat.trim()) return "L’email du candidat est obligatoire.";
        if (!isValidEmail(form.candidat)) return "Adresse email du candidat invalide.";

        if (!form.offre.trim()) return "L’offre associée est obligatoire.";
        if (!form.type) return "Veuillez sélectionner un type d’entretien.";
        if (!form.date) return "La date de l’entretien est obligatoire.";
        if (!form.heure) return "L’heure de l’entretien est obligatoire.";
        if (!form.responsable.trim()) return "Le responsable est obligatoire.";
        if (!form.message.trim()) return "Le message d’invitation est obligatoire.";

        if (form.type.includes("Visio") && !form.lien.trim()) {
            return "Le lien de visio est obligatoire pour un entretien en visio.";
        }

        if (form.type === "Présentiel" && !form.lieu.trim()) {
            return "Le lieu est obligatoire pour un entretien présentiel.";
        }

        return null; // ✅ Tout est OK
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();


        const error = validateForm(form);
        if (error) {
            setErrorMsg(error);
            setShowError(true);
            return;
        }


        // Ajouter tous les champs classiques
        Object.entries(form).forEach(([key, value]) => {
            // Ignore le champ fichier car on va l'ajouter à part
            if (key !== "fichier" && value !== null) {
                formData.append(key, value);
            }
            if (key === "message" && typeof value === "string") {
                formData.append(key, treatment_msg_to_send(value));
            }
        });



        formData.append("countryCode", countryCode);
        formData.append("post_id", modifier);
        // Ajouter le fichier si présent
        const fichier = fileRef.current?.files?.[0] || null;
        if (fichier) {
            formData.append("fichier", fichier);
        }

        // 🔥 Log pour vérifier le contenu
        console.log("✅ FormData prête à envoyer :");
        for (let pair of formData.entries()) {
            console.log(pair[0], "➡", pair[1]);
        }

        try {
            const response = await submitOffre(formData);

            if (response.status == 201) {
                const { data } = response
                if (data.status == "updated" || data.status == "no_change") {
                    setSuccessMsg("L’entretien a été mise à jour avec succès.");
                    setShowSuccess(true)
                }

            }
            console.log("✅ Réponse serveur :", response);
        } catch (err: any) {
            console.error("❌ Erreur lors de l'envoi :", err);
        }
    };

    // Fonction d'envoi
    async function submitOffre(payload: FormData) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/update_entretien", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    }



    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        {showError && (
                            <PopupError
                                isOpen={showError}
                                title="Erreur"
                                message={errorMsg}
                                onClose={() => setShowError(false)}
                            />
                        )}

                        {showSuccess && (
                            <PopupSuccess
                                isOpen={showSuccess}
                                title="Success"
                                message={successMsg}
                                onClose={() => setShowSuccess(false)}
                            />
                        )}

                        <div className="header">
                            <h2>Programmer un entretien</h2>
                        </div>



                        <div>
                            <form onSubmit={handleSubmit}>
                                <label>Candidat concerné</label>
                                <input name="candidat" value={form.candidat} onChange={handleChange} required />

                                <label>Offre associée</label>
                                <input name="offre" value={form.offre} onChange={handleChange} required />

                                <label>Type d'entretien</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={form.type}         // form = state { type: '' }
                                    onChange={handleChange}   // ton handleChange existant
                                    required
                                >
                                    <option value="">-- Sélectionner un type --</option>
                                    {entretienTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>

                                <div className="row">
                                    <div className="col">
                                        <label>Date & Heure</label>
                                        <input type="date" name="date" value={form.date} onChange={handleChange} required />
                                    </div>
                                    <div className="col">
                                        <label>Heure</label>
                                        <input
                                            type="time"
                                            name="heure"
                                            value={form.heure}
                                            onChange={handleChange}
                                            required />
                                    </div>
                                </div>

                                <label>Recruteur / Responsable</label>
                                <input name="responsable" value={form.responsable} onChange={handleChange} required />

                                <label>Lien de visio (si type = visio)</label>
                                <input name="lien" value={form.lien} onChange={handleChange} />

                                <label>Lieu (si présentiel)</label>
                                <input name="lieu" value={form.lieu} onChange={handleChange} />

                                <label>Message d'invitation</label>
                                <textarea name="message" value={reverse_treatment_msg(form.message)} onChange={handleChange} rows={4} required />

                                <label>Pièce jointe (optionnelle)</label>

                                {existingFile && (
                                    <div className="existing-file">
                                        <p>📄 Fichier actuel :</p>

                                        <div className="file-actions">
                                            <Link
                                                href={`${FILE_BASE_URL}/${existingFile}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn small"
                                            >
                                                Consulter
                                            </Link>

                                            <Link
                                                href={`${FILE_BASE_URL}/${existingFile}`}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn small secondary"
                                            >
                                                Télécharger
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    name="fichier"
                                    ref={fileRef}
                                    accept="application/pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && file.type !== "application/pdf") {
                                            setErrorMsg("Seuls les fichiers PDF sont acceptés !");
                                            setShowError(true);
                                            e.target.value = "";
                                        }
                                    }}
                                />



                                <button type="submit" className="submit-btn">
                                    ✅ Programmer et notifier le candidat
                                </button>
                            </form>
                        </div>





                    </div>
                </div>
            </main >
        </div >
    );
};

