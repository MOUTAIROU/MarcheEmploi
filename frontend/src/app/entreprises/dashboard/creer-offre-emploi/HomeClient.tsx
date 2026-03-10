"use client";
import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import QuillEditor from "@/components/QuillEditor/page";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { countryNumberCode, country, countryCode, CATEGORIE_LABELS, tab_niveauEtude, tab_typeContrat } from "@/utils/types";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'





export default function CreerOffre() {
    const router = useRouter();


    const [showEditor, setShowEditor] = useState(true);
    const [editorKey, setEditorKey] = useState(Date.now()); // clé unique

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // refs pour chaque Quill
    const descriptionRef = useRef<any>(null);
    const conditionsRef = useRef<any>(null);




    const fileRef = useRef<HTMLInputElement>(null);

    // Affichage automatique du champ "Autre"
    useEffect(() => {
        const select = document.querySelector("select[name='type_contrat']") as HTMLSelectElement | null;
        const container = document.getElementById("autre_contrat_container");

        if (!select || !container) return;

        const handleChange = () => {
            if (select.value === "autre") {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        };

        select.addEventListener("change", handleChange);

        return () => select.removeEventListener("change", handleChange);
    }, []);


    // Fonction utilitaire pour vérifier si Quill est vide
    const isQuillEmpty = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent?.trim() === "";
    };


    // Fonction pour formater la date actuelle
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        // Récupérer les valeurs classiques
        const titre = (form.elements.namedItem("titre") as HTMLInputElement).value.trim();
        const lieu = (form.elements.namedItem("lieu") as HTMLInputElement).value.trim();
        const expiration = (form.elements.namedItem("expiration") as HTMLInputElement).value.trim();
        /* const visibilite = (form.elements.namedItem("visibilite") as HTMLSelectElement).value.trim();*/
        const experience = (form.elements.namedItem("niveau_experience") as HTMLSelectElement).value.trim();
        const typeContrat = (form.elements.namedItem("type_contrat") as HTMLSelectElement).value.trim();
        const typeContratAutre = (form.elements.namedItem("type_contrat_autre") as HTMLInputElement)?.value.trim() || "";
        const niveauEtudes = (form.elements.namedItem("niveau_etude") as HTMLSelectElement).value.trim();
        const salaire = (form.elements.namedItem("salaire") as HTMLInputElement)?.value.trim() || "";
        const categorie = (form.elements.namedItem("categorie") as HTMLSelectElement)?.value.trim() || "";


        // Récupérer les valeurs Quill
        const description = descriptionRef.current?.root.innerHTML.trim() || "";
        const conditions = conditionsRef.current?.root.innerHTML.trim() || "";

        // Récupérer le fichier PDF
        const fichier = fileRef.current?.files?.[0] || null;

        // Validation des champs obligatoires
        const champsObligatoires = [
            { nom: "Titre de l'offre", valeur: titre },
            { nom: "Description", valeur: description },
            { nom: "Catégorie", valeur: categorie },
            { nom: "Lieu", valeur: lieu },
            { nom: "Date d'expiration", valeur: expiration },
            /*  { nom: "Visibilité", valeur: visibilite }, */
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
            setErrorMsg(`❌ Merci de remplir les champs obligatoires :\n${champsVides
                .map(c => `- ${c.nom}`)
                .join("\n")}`);
            setShowError(true);

            return;
        }

        // ✅ Construire FormData pour inclure le PDF
        const formData = new FormData();
        formData.append("objet", titre);
        formData.append("description", description);
        formData.append("date_publication", getCurrentDateTime());
        formData.append("lieu", lieu);
        formData.append("expiration", expiration);
        /* formData.append("visibilite", visibilite);*/
        formData.append("categorie", categorie);
        formData.append("experience", experience);
        formData.append("typeContrat", typeContrat);
        formData.append("typeContratAutre", typeContratAutre);
        formData.append("niveauEtudes", niveauEtudes);
        formData.append("salaire", salaire);
        formData.append("conditions", conditions);
        formData.append("countryCode", countryCode);



        if (fichier) {
            formData.append("fichier", fichier);
        }

        console.log("✅ FormData prête à envoyer :", formData);

        // Envoi vers le serveur
        try {
            const response = await submitOffre(formData);
            console.log("✅ Réponse serveur :", response);

            if (response.status == 201) {
                const { data } = response
                if (data.status == "created") {

                    setSuccessMsg("L’offre a été créée avec succès.");
                    setShowSuccess(true)
                }


            }
        } catch (err: any) {
            console.error("❌ Erreur lors de l'envoi :", err);
        }
    };

    // Fonction d'envoi
    async function submitOffre(payload: FormData) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/create_offre_emploi", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    }



    return (
        <div>
            <main>
                <div className="container-dashbord">

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
                                router.back();
                            }}
                        />
                    )}

                    <Sidebar />
                    <div className="mainContent">
                        <div className="header">
                            <h2>Créer une offre — Emploi</h2>
                        </div>

                        <div>
                            <form className="form" onSubmit={handleSubmit}>
                                <label>
                                    <span>Titre / Objet de l'offre</span>
                                    <textarea name="titre" />
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
                                    {/*
                                    <label>
                                        <span>Visibilité / Statut initial</span>
                                        <select name="visibilite">
                                            <option value="">-- Sélectionnez --</option>
                                            <option value="publique">Publique</option>
                                            <option value="privee">Privée</option>
                                            <option value="restreinte">Restreinte</option>
                                        </select>
                                    </label>
                                     */}

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

                                                    setErrorMsg("Seuls les fichiers PDF sont acceptés !");
                                                    setShowError(true);

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
                                            {tab_typeContrat.map((v, i) => (
                                                <option key={i} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="row">

                                    <label id="autre_contrat_container" style={{ display: "none" }}>
                                        <span>Précisez le type de contrat (optionnel)</span>
                                        <input type="text" name="type_contrat_autre" placeholder="Ex : Mission 3 mois → CDI" />

                                    </label>

                                </div>



                                <div className="row">
                                    <label>
                                        <span>Niveau d’études minimum</span>
                                        <select name="niveau_etude">
                                            {tab_niveauEtude.map((p, i) => (
                                                <option key={i} value={p}>
                                                    {p}
                                                </option>
                                            ))}
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

                                {/*
                                <label>
                                    <span>Compétences requises (optionnel)</span>
                                    <QuillEditor
                                        placeholder="Conditions / profil recherché..."
                                        editorRef={conditionsRef}
                                    />
                                </label>
                                 */}

                                <div className="actions">

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
