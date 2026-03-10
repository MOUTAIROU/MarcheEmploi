"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/QuillEditor/page";
import api from "@/lib/axiosInstance";
import { countryNumberCode, country, countryCode } from "@/utils/types";


export default function CreerOffre() {
    const router = useRouter();

    const fileRef = useRef<HTMLInputElement>(null);

    // refs Quill
    const cahier_de_chargeRef = useRef<any>(null);
    const conditions_de_participationRef = useRef<any>(null);
    const documentRequisRef = useRef<any>(null);

    // Vérifie si Quill est vide
    const isQuillEmpty = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent?.trim() === "";
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        // Champs classiques
        const titre = (form.elements.namedItem("titre") as HTMLInputElement).value.trim();
        const lieu = (form.elements.namedItem("lieu") as HTMLInputElement).value.trim();
        const expiration = (form.elements.namedItem("expiration") as HTMLInputElement).value.trim();
        const visibilite = (form.elements.namedItem("visibilite") as HTMLSelectElement).value.trim();
        const objet = (form.elements.namedItem("objet") as HTMLInputElement).value.trim();
        const date_limite = (form.elements.namedItem("date_limite") as HTMLInputElement).value.trim();
        const budget = (form.elements.namedItem("budget") as HTMLInputElement).value.trim();

        // Champs Quill
        const cahier_de_charge = cahier_de_chargeRef.current?.root.innerHTML.trim() || "";
        const conditions_de_participation = conditions_de_participationRef.current?.root.innerHTML.trim() || "";
        const documents_requis = documentRequisRef.current?.root.innerHTML.trim() || "";

        // Fichier PDF
        const fichier = fileRef.current?.files?.[0] || null;

        // Validation obligatoire
        const requiredFields = [
            { nom: "Titre de l'offre", valeur: titre },
            { nom: "Cahier des charges", valeur: cahier_de_charge, quill: true },
            { nom: "Lieu", valeur: lieu },
            { nom: "Visibilité", valeur: visibilite },
            { nom: "Date d'expiration", valeur: expiration },
            { nom: "Objet de l'appel d'offres", valeur: objet },
            { nom: "Date limite de soumission", valeur: date_limite },
        ];

        const emptyFields = requiredFields.filter(f => f.quill ? isQuillEmpty(f.valeur) : !f.valeur);
        if (emptyFields.length > 0) {
            alert(`❌ Merci de remplir les champs obligatoires :\n${emptyFields.map(f => "- " + f.nom).join("\n")}`);
            return;
        }

        // ✅ Vérification que date_limite ≤ expiration
        if (new Date(date_limite) > new Date(expiration)) {
            alert("❌ La date limite de soumission ne peut pas être postérieure à la date d'expiration !");
            return;
        }

        // Construire FormData pour inclure le PDF
        const formData = new FormData();
        formData.append("titre", titre);
        formData.append("objet", objet);
        formData.append("lieu", lieu);
        formData.append("expiration", expiration);
        formData.append("visibilite", visibilite);
        formData.append("date_limite", date_limite);
        formData.append("budget", budget);
        formData.append("cahier_de_charge", cahier_de_charge);
        formData.append("conditions_de_participation", conditions_de_participation);
        formData.append("documents_requis", documents_requis);
        formData.append("countryCode", countryCode);

        if (fichier) {
            formData.append("fichier", fichier);
        }

        console.log("✅ FormData prête à envoyer :", formData);

        

        // Envoi vers le serveur
        try {
            const response = await submitOffre(formData);
            console.log("✅ Réponse serveur :", response);
        } catch (err: any) {
            console.error("❌ Erreur lors de l'envoi :", err);
        }
    };

    // Fonction d'envoi
    async function submitOffre(payload: FormData) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/create_appel_offre", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }

    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />
                    <div className="mainContent">

                        <div className="header">
                            <h2>Créer une offre — Appel d'offres</h2>
                        </div>

                        <form className="form" onSubmit={handleSubmit}>

                            <label>
                                <span>Titre de l'offre</span>
                                <input type="text" name="titre" />
                            </label>

                            <label className="full">
                                <span>Description / Cahier des charges</span>
                                <QuillEditor
                                    placeholder="Description..."
                                    editorRef={cahier_de_chargeRef}
                                />
                            </label>

                            <div className="row">
                                <label>
                                    <span>Lieu / Zone géographique</span>
                                    <select name="lieu">
                                        <option value="">-- Sélectionnez --</option>
                                        <option value="Cotonou">Cotonou</option>
                                        <option value="Porto-Novo">Porto-Novo</option>
                                        <option value="Parakou">Parakou</option>
                                    </select>
                                </label>

                                <label>
                                    <span>Date d'expiration</span>
                                    <input type="date" name="expiration" />
                                </label>
                            </div>

                            <div className="row">
                                <label>
                                    <span>Visibilité / Statut initial</span>
                                    <select name="visibilite">
                                        <option value="">-- Sélectionnez --</option>
                                        <option value="publique">Publique</option>
                                        <option value="privee">Privée</option>
                                        <option value="restreinte">Restreinte</option>
                                    </select>
                                </label>

                                <label>
                                    <span>Pièces jointes PDF (optionnel)</span>
                                    <input
                                        type="file"
                                        name="pieces"
                                        accept="application/pdf"
                                        ref={fileRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file && file.type !== "application/pdf") {
                                                alert("Seuls les fichiers PDF sont acceptés !");
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <label>
                                <span>Objet de l'appel d'offres</span>
                                <input type="text" name="objet" />
                            </label>

                            <div className="row">
                                <label>
                                    <span>Date limite de soumission</span>
                                    <input type="date" name="date_limite" />
                                </label>

                                <label>
                                    <span>Budget prévisionnel (optionnel)</span>
                                    <input
                                        type="text"
                                        name="budget"
                                        pattern="^[0-9\s\.kK]+$"
                                        placeholder="Ex : 150000"
                                    />
                                </label>
                            </div>

                            <label>
                                <span>Conditions de participation (optionnel)</span>
                                <QuillEditor
                                    placeholder="Conditions..."
                                    editorRef={conditions_de_participationRef}
                                />
                            </label>

                            <label>
                                <span>Documents requis (optionnel)</span>
                                <QuillEditor
                                    placeholder="Documents requis..."
                                    editorRef={documentRequisRef}
                                />
                            </label>

                            <div className="actions">
                                <button type="button" className="btn ghost">
                                    Enregistrer comme brouillon
                                </button>
                                <button type="submit" className="btn primary">
                                    Publier l'offre
                                </button>
                                <button type="button" className="btn" onClick={() => router.back()}>
                                    Retour à la liste
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
