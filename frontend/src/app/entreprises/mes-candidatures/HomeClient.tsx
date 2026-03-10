"use client";
import React, { useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import QuillEditor from "@/components/QuillEditor/page";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { countryCode, CATEGORIE_LABELS } from "@/utils/types";

export default function CreerRecrutementConsultant() {
    const router = useRouter();

    const objetRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<any>(null);
    const conditionsRef = useRef<any>(null);
    const documentsRef = useRef<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const isQuillEmpty = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent?.trim() === "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const objet = (form.elements.namedItem("objet") as HTMLInputElement).value.trim();
        const lieu = (form.elements.namedItem("lieu") as HTMLInputElement).value.trim();
        const date_publication = (form.elements.namedItem("date_publication") as HTMLInputElement).value.trim();
        const date_limite = (form.elements.namedItem("date_limite") as HTMLInputElement).value.trim();
        const date_ouverture = (form.elements.namedItem("date_ouverture") as HTMLInputElement)?.value.trim() || "";
        const visibilite = (form.elements.namedItem("visibilite") as HTMLSelectElement).value.trim();
        const categorie = (form.elements.namedItem("categorie") as HTMLSelectElement)?.value.trim() || "";

        const description = descriptionRef.current?.root.innerHTML.trim() || "";
        const conditions = conditionsRef.current?.root.innerHTML.trim() || "";
        const documents_requis = documentsRef.current?.root.innerHTML.trim() || "";
        const fichier = fileRef.current?.files?.[0] || null;

        // Champs obligatoires
        const required = [
            { nom: "Objet", valeur: objet },
            { nom: "Lieu", valeur: lieu },
            { nom: "Catégorie", valeur: categorie },
            { nom: "Description", valeur: description, quill: true },
            { nom: "Date de publication", valeur: date_publication },
            { nom: "Date limite de soumission", valeur: date_limite },
        ];

        const empty = required.filter(f => f.quill ? isQuillEmpty(f.valeur) : !f.valeur);
        if (empty.length > 0) {
            alert("Merci de remplir les champs obligatoires :\n" + empty.map(f => "- " + f.nom).join("\n"));
            return;
        }

        const d_pub = new Date(date_publication);
        const d_lim = new Date(date_limite);
        const d_ouv = date_ouverture ? new Date(date_ouverture) : null;

        if (d_lim <= d_pub) {
            alert("❌ La date limite de soumission doit être postérieure à la date de publication.");
            return;
        }

        if (d_ouv && d_ouv <= d_lim) {
            alert("❌ La date d'ouverture doit être strictement après la date limite de soumission.");
            return;
        }

        // FormData
        const formData = new FormData();
        formData.append("objet", objet);
        formData.append("lieu", lieu);

        formData.append("date_publication", date_publication);
        formData.append("categorie", categorie);
        formData.append("date_limite", date_limite);
        formData.append("date_ouverture", date_ouverture);
        formData.append("visibilite", visibilite);
        formData.append("description", description);
        formData.append("conditions", conditions);
        formData.append("documents_requis", documents_requis);
        formData.append("countryCode", countryCode);

        if (fichier) formData.append("fichier", fichier);

        try {
            const response = await api.post("/entreprise/create_recrutement_consultant", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Réponse serveur :", response.data);
        } catch (err) {
            console.error("Erreur envoi :", err);
        }
    };

    return (
        <main>
            <div className="container-dashbord">
                <Sidebar />
                <div className="mainContent">
                    <div className="header">
                        <h2>Créer un Recrutement Consultant</h2>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        <label>
                            <span>Objet de la mission / recrutement</span>
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
                            <QuillEditor placeholder="Description de la mission..." editorRef={descriptionRef} />
                        </label>

                        <label className="full">
                            <span>Conditions de participation (optionnel)</span>
                            <QuillEditor placeholder="Conditions / profil requis..." editorRef={conditionsRef} />
                        </label>

                        <label className="full">
                            <span>Documents requis (optionnel)</span>
                            <QuillEditor placeholder="Documents à fournir..." editorRef={documentsRef} />
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
                                <span>Date de publication</span>
                                <input type="datetime-local" name="date_publication" />
                            </label>
                        </div>

                        <div className="row">
                            <label>
                                <span>Date limite de soumission</span>
                                <input type="datetime-local" name="date_limite" />
                            </label>

                            <label>
                                <span>Date d'ouverture (optionnel)</span>
                                <input type="datetime-local" name="date_ouverture" />
                            </label>
                        </div>

                        <div className="row">
                            <label>
                                <span>Visibilité</span>
                                <select name="visibilite">
                                    <option value="">-- Sélectionnez --</option>
                                    <option value="publique">Publique</option>
                                    <option value="privee">Privée</option>
                                    <option value="restreinte">Restreinte</option>
                                </select>
                            </label>

                            <label>
                                <span>Pièce jointe PDF (optionnel)</span>
                                <input type="file" accept="application/pdf" ref={fileRef} />
                            </label>
                        </div>

                        <div className="actions">
                            <button type="submit" className="btn primary">Publier le recrutement</button>
                            <button type="button" className="btn" onClick={() => router.back()}>Retour</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
