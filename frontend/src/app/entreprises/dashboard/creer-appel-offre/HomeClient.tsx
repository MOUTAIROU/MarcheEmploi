"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/QuillEditor/page";
import api from "@/lib/axiosInstance";
import { countryCode, CATEGORIE_LABELS } from "@/utils/types";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

export default function CreerOffre() {
    const router = useRouter();

    const fileRef = useRef<HTMLInputElement>(null);

    const cahier_de_chargeRef = useRef<any>(null);
    const conditions_de_participationRef = useRef<any>(null);
    const documentRequisRef = useRef<any>(null);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
        const date_publication = new Date().toISOString();
        const date_limite = (form.elements.namedItem("date_limite") as HTMLInputElement)?.value.trim() || "";
        const date_ouverture = (form.elements.namedItem("date_ouverture") as HTMLInputElement)?.value.trim() || "";

        const visibilite = "";
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
            /* { nom: "Visibilité", valeur: visibilite },*/
            { nom: "Date de publication", valeur: date_publication },
            { nom: "Date limite de soumission", valeur: date_limite },
        ];

        const empty = required.filter(f => f.quill ? isQuillEmpty(f.valeur) : !f.valeur);

        if (empty.length > 0) {

            setErrorMsg("Merci de remplir les champs obligatoires :\n" + empty.map(f => "- " + f.nom).join("\n"));
            setShowError(true);

            return;
        }

        // Vérifications date
        const d_pub = new Date(date_publication);
        const d_lim = new Date(date_limite);
        const d_ouv = date_ouverture ? new Date(date_ouverture) : null;

        if (d_lim <= d_pub) {

            setErrorMsg("❌ La date limite de soumission doit être postérieure à la date de publication.");
            setShowError(true);
            return;
        }

        if (d_ouv && d_ouv <= d_lim) {
            setErrorMsg("❌ La date d'ouverture des offres doit être strictement après la date limite de soumission.");
            setShowError(true);

            return;
        }
        // Ajoute categorie
        // FormData
        const formData = new FormData();
        formData.append("objet", objet);
        formData.append("categorie", categorie);
        formData.append("lieu", lieu);
        formData.append("date_limite", date_limite);
        formData.append("date_ouverture", date_ouverture)
        formData.append("date_publication", date_publication);
        formData.append("visibilite", visibilite);
        formData.append("budget", budget);
        formData.append("description", cahier_de_charge);
        formData.append("conditions", conditions_de_participation);
        formData.append("documents_requis", documents_requis);
        formData.append("countryCode", countryCode);

        if (fichier) formData.append("fichier", fichier);

        try {
            const response = await api.post("/entreprise/create_appel_offre", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Réponse serveur :", response.data);

            if (response.status == 201) {
                const { data } = response
                if (data.status == "created") {

                    setSuccessMsg("L’offre a été créée avec succès.");
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
                            onClose={() => {
                                setShowSuccess(false)
                                router.back()
                            }}
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
                            <textarea name="objet" />
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

                            {/*
                            <label>
                                <span>Date de publication</span>
                                <input type="datetime-local" name="date_publication" />
                            </label>
                             */}
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
                            {
                                /*
                                <label>
                                <span>Visibilité</span>
                                <select name="visibilite">
                                    <option value="">-- Sélectionnez --</option>
                                    <option value="publique">Publique</option>
                                    <option value="privee">Privée</option>
                                    <option value="restreinte">Restreinte</option>
                                </select>
                            </label>
                             */
                            }

                            <label>
                                <span>Pièce jointe PDF</span>
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
