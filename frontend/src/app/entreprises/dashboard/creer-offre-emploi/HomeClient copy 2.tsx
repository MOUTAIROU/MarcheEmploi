"use client";
import React, { useRef, useState } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import QuillEditor from "@/components/QuillEditor/page";
import { useRouter } from "next/navigation";

export default function CreerOffre() {
    const router = useRouter();

    const [showEditor, setShowEditor] = useState(true);
    const [editorKey, setEditorKey] = useState(Date.now()); // clé unique

    // refs pour chaque Quill
    const descriptionRef = useRef<any>(null);
    const conditionsRef = useRef<any>(null);




    const fileRef = useRef<HTMLInputElement>(null);

    // Fonction utilitaire pour vérifier si Quill est vide
    const isQuillEmpty = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent?.trim() === "";
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        // Récupérer les valeurs des inputs classiques
        const titre = (form.elements.namedItem("titre") as HTMLInputElement).value.trim();
        const lieu = (form.elements.namedItem("lieu") as HTMLInputElement).value.trim();
        const expiration = (form.elements.namedItem("expiration") as HTMLInputElement).value.trim();
        const visibilite = (form.elements.namedItem("visibilite") as HTMLSelectElement).value.trim();
        const experience = (form.elements.namedItem("niveau_experience") as HTMLSelectElement).value.trim();
        const typeContrat = (form.elements.namedItem("type_contrat") as HTMLSelectElement).value.trim();
        const niveauEtudes = (form.elements.namedItem("niveau_etude") as HTMLSelectElement).value.trim();
        const salaire = (form.elements.namedItem("salaire") as HTMLInputElement)?.value.trim() || "";

        // Récupérer les valeurs Quill
        const description = descriptionRef.current?.root.innerHTML.trim() || "";
        const conditions = conditionsRef.current?.root.innerHTML.trim() || "";

        // Récupérer le fichier PDF
        const fichier = fileRef.current?.files?.[0] || null;

        // ✅ Validation des champs obligatoires
        const champsObligatoires = [
            { nom: "Titre de l'offre", valeur: titre },
            { nom: "Description", valeur: description },
            { nom: "Lieu", valeur: lieu },
            { nom: "Date d'expiration", valeur: expiration },
            { nom: "Visibilité", valeur: visibilite },
            { nom: "Niveau d'expérience", valeur: experience },
            { nom: "Type de contrat", valeur: typeContrat },
            { nom: "Niveau d'études minimum", valeur: niveauEtudes },
        ];


        const champsVides = champsObligatoires.filter(c => {
            if (c.nom === "Description" || c.nom === "Conditions") {
                return isQuillEmpty(c.valeur);
            }
            return !c.valeur;
        });

        if (champsVides.length > 0) {
            alert(
                `❌ Merci de remplir les champs obligatoires :\n${champsVides
                    .map(c => `- ${c.nom}`)
                    .join("\n")}`
            );
            return;
        }

        // Construire l'objet final
        const offreData = {
            titre,
            description,
            lieu,
            expiration,
            visibilite,
            experience,
            typeContrat,
            niveauEtudes,
            salaire,
            conditions,
            fichier,
        };

        console.log("✅ Données prêtes à envoyer :", offreData);

        // Post vers le serveur
        // fetch("/api/offres", { method: "POST", body: formData }) ...
    };


    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />
                    <div className="mainContent">
                        <div className="header">
                            <h2>Créer une offre — Emploi</h2>
                        </div>

                        <div>
                            <form className="form" onSubmit={handleSubmit}>
                                <label>
                                    <span>Titre de l'offre</span>
                                    <input type="text" name="titre" />
                                </label>

                                <label className="full">
                                    <span>Description</span>
                                    <QuillEditor placeholder="Décrivez le poste..." editorRef={descriptionRef} />


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
                                        <span>Pièces jointes (optionnel)</span>
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

                                <div className="row">
                                    <label>
                                        <span>Niveau d’expérience</span>
                                        <select name="niveau_experience">
                                            <option value="">-- Sélectionnez --</option>
                                            <option value="debutant">Débutant</option>
                                            <option value="intermediaire">Intermédiaire (2 ans)</option>
                                            <option value="avance">Avancé (5 ans)</option>
                                            <option value="expert">Expert (8 ans)</option>
                                        </select>
                                    </label>

                                    <label>
                                        <span>Type de contrat</span>
                                        <select name="type_contrat">
                                            <option value="">-- Sélectionnez --</option>
                                            <option value="cdi">CDI</option>
                                            <option value="cdd">CDD</option>
                                            <option value="freelance">Freelance</option>
                                            <option value="stage">Stage</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="row">
                                    <label>
                                        <span>Niveau d’études minimum</span>
                                        <select name="niveau_etude">
                                            <option value="">-- Sélectionnez --</option>
                                            <option value="bac">Baccalauréat</option>
                                            <option value="licence">Licence</option>
                                            <option value="master">Master</option>
                                            <option value="doctorat">Doctorat</option>
                                        </select>
                                    </label>

                                    <label>
                                        <span>Salaire en FCFA (optionnel)</span>
                                        <input
                                            type="text"
                                            name="salaire"
                                            pattern="^[0-9\s\.kK]+$"
                                            placeholder="Ex : 150000"
                                        />
                                    </label>
                                </div>

                                <label>
                                    <span>Compétences requises (optionnel)</span>
                                    <QuillEditor
                                        placeholder="Conditions / profil recherché..."
                                        editorRef={conditionsRef}
                                    />
                                </label>

                                <div className="actions">
                                    <button type="button" className="btn ghost">
                                        Enregistrer comme brouillon
                                    </button>
                                    <button type="submit" className="btn primary">Publier l'offre</button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => {

                                            // Démontage manuel des Quill
                                            if (descriptionRef.current) {
                                                //descriptionRef.current.disable();
                                                //descriptionRef.current.root.innerHTML = "";
                                                //descriptionRef.current.container.remove();
                                                //descriptionRef.current = null;
                                            }
                                            if (conditionsRef.current) {
                                                //conditionsRef.current.disable();
                                                //conditionsRef.current.root.innerHTML = "";
                                                //conditionsRef.current.container.remove();
                                                // conditionsRef.current = null;
                                            }
                                            // Puis retourne à la page précédente
                                            router.back();
                                        }}
                                    >
                                        Retour à la liste
                                    </button>

                                </div>
                            </form>


                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
