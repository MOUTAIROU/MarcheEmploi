"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/QuillEditor/page";
import api from "@/lib/axiosInstance";
import { countryCode, CATEGORIE_LABELS } from "@/utils/types";
import { useParams } from "next/navigation";
import Link from "next/link";
const FILE_BASE_URL = `${process.env.SERVER_HOST}/uploads/pdf`;

import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'



export default function CreerOffre() {
    const router = useRouter();

    const fileRef = useRef<HTMLInputElement>(null);

    const objetRef = useRef<HTMLTextAreaElement | null>(null);
    const cahier_de_chargeRef = useRef<any>(null);
    const conditions_de_participationRef = useRef<any>(null);
    const documentRequisRef = useRef<any>(null);
    const [existingFile, setExistingFile] = React.useState<string | null>(null);


    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { post_id } = useParams<{ post_id: string }>();
    useEffect(() => {
        if (!post_id) return;
        getOffres()

    }, []);

    async function getOffres() {
        try {
            const response = await api.get(
                `entreprise_get/appel_offres_by_post_id/${post_id}`
            );

            const offre = response.data.data;

            if (!offre) return;

            // 🧠 OBJET
            if (objetRef.current) {
                objetRef.current.value = offre.objet || "";
            }

            if (offre.filenameBase) {
                setExistingFile(offre.filenameBase);
            }


            // 🧠 SELECT CATEGORIE
            const categorieSelect = document.querySelector(
                'select[name="categorie"]'
            ) as HTMLSelectElement;

            if (categorieSelect) {
                categorieSelect.value = offre.categorie || "";
            }

            // 🧠 SELECT LIEU
            const lieuSelect = document.querySelector(
                'select[name="lieu"]'
            ) as HTMLSelectElement;

            if (lieuSelect) {
                lieuSelect.value = offre.lieu || "";
            }

            // 🧠 SELECT VISIBILITE
            const visibiliteSelect = document.querySelector(
                'select[name="visibilite"]'
            ) as HTMLSelectElement;

            if (visibiliteSelect) {
                visibiliteSelect.value = offre.visibilite || "";
            }

            // 🧠 DATES
            const setDate = (name: string, value: string) => {
                const input = document.querySelector(
                    `input[name="${name}"]`
                ) as HTMLInputElement;

                if (input && value) {
                    input.value = value.slice(0, 16);
                }
            };

            setDate("date_publication", offre.date_publication);
            setDate("date_limite", offre.date_limite);
            setDate("date_ouverture", offre.date_ouverture);

            // 🧠 QUILL (sans ?. à gauche)
            if (cahier_de_chargeRef.current?.root) {
                cahier_de_chargeRef.current.root.innerHTML =
                    offre.description || "";
            }

            if (conditions_de_participationRef.current?.root) {
                conditions_de_participationRef.current.root.innerHTML =
                    offre.conditions_de_participation || "";
            }

            if (documentRequisRef.current?.root) {
                documentRequisRef.current.root.innerHTML =
                    offre.documents_requis || "";
            }

        } catch (error) {
            console.error("Erreur récupération appel d'offres :", error);
        }
    }


    const isQuillEmpty = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent?.trim() === "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        // Champs simples sécurisés
        const reference = (form.elements.namedItem("reference") as HTMLInputElement)?.value.trim() || "";
        const objet = (form.elements.namedItem("objet") as HTMLTextAreaElement)?.value.trim() || "";
        const lieu = (form.elements.namedItem("lieu") as HTMLSelectElement)?.value.trim() || "";
        const categorie = (form.elements.namedItem("categorie") as HTMLSelectElement)?.value.trim() || "";

        const date_limite = (form.elements.namedItem("date_limite") as HTMLInputElement)?.value.trim() || "";
        const date_ouverture = (form.elements.namedItem("date_ouverture") as HTMLInputElement)?.value.trim() || "";

        const visibilite =  "";
        const budget = (form.elements.namedItem("budget") as HTMLInputElement)?.value.trim() || "";

        // Quill
        const cahier_de_charge = cahier_de_chargeRef.current?.root.innerHTML.trim() || "";
        const conditions_de_participation = conditions_de_participationRef.current?.root.innerHTML.trim() || "";
        const documents_requis = documentRequisRef.current?.root.innerHTML.trim() || "";

        const fichier = fileRef.current?.files?.[0] || null;

        // Champs obligatoires
        const required = [
            { nom: "Objet de l'offre", valeur: objet },
            { nom: "Catégorie", valeur: categorie },
            { nom: "Cahier des charges", valeur: cahier_de_charge, quill: true },
            { nom: "Lieu", valeur: lieu },
            { nom: "Date limite de soumission", valeur: date_limite },
        ];

        const empty = required.filter(f => f.quill ? isQuillEmpty(f.valeur) : !f.valeur);


        if (empty.length > 0) {

            setErrorMsg("Merci de remplir les champs obligatoires :\n" + empty.map(f => "- " + f.nom).join("\n"));
            setShowError(true);
            return;
        }

        // Vérifications date
        const d_lim = new Date(date_limite);
        const d_ouv = date_ouverture ? new Date(date_ouverture) : null;

       

        if (d_ouv && d_ouv <= d_lim) {

            setErrorMsg("❌ La date d'ouverture des offres doit être strictement après la date limite de soumission.");
            setShowError(true);

            return;
        }
        // Ajoute categorie
        // FormData
        const formData = new FormData();
        formData.append("post_id", post_id);
        formData.append("objet", objet);
        formData.append("categorie", categorie);
        formData.append("lieu", lieu);
        formData.append("date_limite", date_limite);
        formData.append("date_ouverture", date_ouverture);
        formData.append("visibilite", visibilite);
        formData.append("budget", budget);
        formData.append("description", cahier_de_charge);
        formData.append("conditions", conditions_de_participation);
        formData.append("documents_requis", documents_requis);
        formData.append("countryCode", countryCode);

        if (fichier) formData.append("fichier", fichier);

        try {
            const response = await api.post("/entreprise/update_appel_offre", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Réponse serveur :", response);


            if (response.status == 201) {
                const { data } = response
                if (data.status == "updated" || data.status == "no_change") {

                    setSuccessMsg("L’offre a été mise à jour avec succès.");
                    setShowSuccess(true)
                }


            }
        } catch (err) {
            console.error("Erreur envoi :", err);
        }
    };


    return (
        <main>
            <div className="container-dashbord">
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
                        <h2>Créer un appel d'offres</h2>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>



                        {/* 
                        <label>
                            <span>Référence</span>
                            <input type="text" name="reference" placeholder="Ex: AO-2025-001" />
                        </label>
                        <label>
                            <span>Titre de l'offre</span>
                            <input type="text" name="titre" />
                        </label>*/}

                        <label>
                            <span>Objet</span>
                            <textarea name="objet" ref={objetRef} />
                        </label>

                        <label>
                            <span>Catégorie</span>
                            <select name="categorie" required>
                                <option value="">-- Sélectionnez une catégorie --</option>
                                {Object.entries(CATEGORIE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="full">
                            <span>Description / Cahier des charges</span>
                            <QuillEditor placeholder="Description..." editorRef={cahier_de_chargeRef} />
                        </label>

                        <div className="row">
                            <label>
                                <span>Lieu / Zone</span>
                                <select name="lieu">
                                    <option value="">-- Sélectionnez --</option>
                                    <option value="Cotonou">Cotonou</option>
                                    <option value="Porto-Novo">Porto-Novo</option>
                                    <option value="Parakou">Parakou</option>
                                </select>
                            </label>

                            
                        </div>

                        <div className="row">
                            <label>
                                <span>Date limite de soumission</span>
                                <input type="datetime-local" name="date_limite" />
                            </label>

                            <label>
                                <span>Date d'ouverture des offres</span>
                                <input type="datetime-local" name="date_ouverture" />
                            </label>
                        </div>

                        <div className="row">
                            

                            <label>
                                <span>Pièce jointe PDF (optionnel)</span>

                                {/* ✅ Fichier existant */}
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

                                {/* ⬆️ Upload nouveau fichier */}
                                <input type="file" accept="application/pdf" ref={fileRef} />
                            </label>
                        </div>



                        <label>
                            <span>Budget (optionnel)</span>
                            <input type="text" name="budget" placeholder="Ex : 150000" />
                        </label>

                        {/*
                        <label>
                            <span>Conditions de participation</span>
                            <QuillEditor placeholder="Conditions..." editorRef={conditions_de_participationRef} />
                        </label>

                        <label>
                            <span>Documents requis</span>
                            <QuillEditor placeholder="Documents requis..." editorRef={documentRequisRef} />
                        </label>
                         */}

                        <div className="actions">
                            
                            <button type="submit" className="btn primary">
                                Publier l'offre
                            </button>
                            <button type="button" className="btn" onClick={() => router.back()}>
                                Retour
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}
