"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Image from "next/image";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";
import QuillEditor from "@/components/QuillEditor/page";
import { countryNumberCode, country, countryCode, CATEGORIE_DOMAINES } from "@/utils/types";
import Link from 'next/link';

import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

const REQUIRED_FIELDS = {
    secteur: "Le domaine d’activité est obligatoire",
    adresse: "L’adresse est obligatoire",
    nom: "Le numéro de téléphone est obligatoire",
};


// Page / composant Next.js en TypeScript
// Nom du fichier suggéré: pages/dashboard/creer-offre.tsx

export default function CreerOffre() {

    const [form, setForm] = useState({
        logo: "",
        nom: "",
        secteur: "",
        site: "",
        adresse: "",
        presentation: "",
        mission: "",
        valeurs: "",
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);


    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        getOffres();
    }, []);

    async function getOffres() {
        try {
            const response = await api.get("entreprise_get/get_presentation_public");
            const entreprise = response.data?.data;
            if (!entreprise) return;

            console.log("📦 Données entreprise :", entreprise);

            // Préremplir les champs simples
            setForm({
                nom: entreprise.nom || "",
                secteur: entreprise.secteur || "",
                site: entreprise.site || "",
                adresse: entreprise.adresse || "",
                presentation: entreprise.presentation || "",
                mission: entreprise.mission || "",
                valeurs: entreprise.valeurs || "",
                logo: "", // Le logo sera affiché via preview si présent
            });

            setUserId(entreprise.user_id)
            setName(entreprise.entreprise_nom)




            // Préremplir le logo si existant
            if (entreprise.filenameBase?.photo_profil) {
                setLogoPreview(`${process.env.SERVER_HOST}/uploads/${entreprise.filenameBase.photo_profil}`);
            }

            // Préremplir Quill
            if (presentationRef.current) {
                presentationRef.current.root.innerHTML = entreprise.presentation || "";
            }
            if (missionRef.current) {
                missionRef.current.root.innerHTML = entreprise.mission || "";
            }
            if (valeursRef.current) {
                valeursRef.current.root.innerHTML = entreprise.valeurs || "";
            }

        } catch (error) {
            console.error("❌ Erreur récupération entreprise :", error);
        }
    }



    // refs pour chaque Quill
    const presentationRef = useRef<any>(null);
    const missionRef = useRef<any>(null);
    const valeursRef = useRef<any>(null);


    // Vérifie si Quill est vide
    const isQuillEmpty = (html: string) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent?.trim() === "";
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateRequiredFields = () => {
        const keys = Object.keys(REQUIRED_FIELDS) as Array<keyof typeof REQUIRED_FIELDS>;

        for (const field of keys) {
            const value = form[field];

            if (!value || value.trim() === "") {
                alert(REQUIRED_FIELDS[field]);
                return false;
            }
        }

        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateRequiredFields()) return;

        // 🔥 1. Récupérer le contenu des éditeurs Quill
        const presentationHtml = presentationRef.current?.root.innerHTML || "";
        const missionHtml = missionRef.current?.root.innerHTML || "";
        const valeursHtml = valeursRef.current?.root.innerHTML || "";


        // Vérification vide
        if (isQuillEmpty(presentationHtml)) return alert("La présentation est vide !");
        if (isQuillEmpty(missionHtml)) return alert("La mission & vision est vide !");
        if (isQuillEmpty(valeursHtml)) return alert("Les valeurs sont vides !");

        // 🔥 2. Création du FormData pour envoi avec un fichier
        const formData = new FormData();

        // Ajouter les champs simples
        formData.append("nom", form.nom);
        formData.append("secteur", form.secteur);
        formData.append("site", form.site);
        formData.append("adresse", form.adresse);

        // Ajouter les champs Quill
        formData.append("presentation", presentationHtml);
        formData.append("mission", missionHtml);
        formData.append("valeurs", valeursHtml);
        formData.append("countryCode", countryCode);


        // 🔥 3. Si un logo a été uploadé, on l’ajoute
        const fileInput = document.querySelector("input[name='logo']") as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            formData.append("photo_profil", fileInput.files[0]);
        }

        // 🔥 4. Envoi au serveur

        // Envoi vers le serveur
        try {
            const response = await submitOffre(formData);
            console.log("✅ Réponse serveur :", response);

            if (response.status == 201) {


                const { data } = response

                if (data.status == "created" || data.status == "no_change") {

                    setSuccessMsg("Les informations de présentation de votre entreprise ont été enregistrées avec succès.");
                    setShowSuccess(true)

                }


            }
        } catch (err: any) {

            setErrorMsg("Une erreur est survenue");
            setShowError(true);
            console.error("❌ Erreur lors de l'envoi :", err);
        }

    };

    // Fonction d'envoi
    async function submitOffre(payload: FormData) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/presentation_public", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };


    function getEntrepriseProfileUrl(userId?: string, name?: string) {
        if (!userId) return null;

        // Fonction simple pour transformer un nom en slug
        const slugify = (text: string) =>
            text
                .toLowerCase()
                .normalize('NFD') // supprime les accents
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-') // remplace tout caractère non alphanumérique par "-"
                .replace(/(^-|-$)/g, ''); // supprime les "-" en début/fin

        const entrepriseName =
            name && name !== 'indisponible' ? name : 'entreprise';

        const entrepriseSlug = slugify(entrepriseName);

        return `/entreprise/${entrepriseSlug}-${userId}`;
    }


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

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
                    <div className="mainContent">

                        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Présentation Public</h2>

                            {/* 🔹 Bouton visite public */}
                            <Link

                                href={getEntrepriseProfileUrl(userId || "", name || "") || "#"} // ou la route correspondant à la présentation publique
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '6px', textDecoration: 'none' }}
                            >
                                🌐 Voir ma présentation
                            </Link>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit} className="form">


                                <div className="logoBox">
                                    {logoPreview ? (
                                        <Image
                                            src={logoPreview}
                                            alt="Logo"
                                            width={400}
                                            height={500}
                                            className="logoPreview"
                                        />
                                    ) : (
                                        <div className="logoPlaceholder">Aucun logo sélectionné</div>
                                    )}
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="fileInput"
                                    />
                                </div>


                                <div className="field">
                                    <label>Domaine d’activité</label>
                                    <select
                                        name="secteur"
                                        value={form.secteur}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Sélectionnez une catégorie --</option>
                                        {Object.entries(CATEGORIE_DOMAINES).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Site web (optionnel)</label>
                                    <input type="text" name="site" value={form.site} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Adresse / localisation</label>
                                    <input type="text" name="adresse" value={form.adresse} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Numero de Telephone</label>
                                    <input type="text" name="nom" value={form.nom} onChange={handleChange} />
                                </div>


                                <div className="presentationBox">
                                    <h3>Présentation</h3>

                                    <div className="subField">
                                        <label>Présentation générale</label>

                                        <QuillEditor
                                            placeholder="Exemple : 'MarcheEmploi est une entreprise innovante spécialisée dans les solutions RH numériques en Afrique.'"
                                            editorRef={presentationRef}
                                        />


                                    </div>

                                    <div className="subField">
                                        <label className="labelMission">Mission & Vision</label>


                                        <QuillEditor
                                            placeholder="Exemple : 'Notre mission est d’aider les entreprises africaines à identifier, tester et recruter les meilleurs talents.'"
                                            editorRef={missionRef}
                                        />

                                    </div>

                                    <div className="subField">
                                        <label className="labelValeurs">Nos valeurs</label>

                                        <QuillEditor
                                            placeholder="Exemple : 'Innovation, transparence, inclusion et performance.'"
                                            editorRef={valeursRef}
                                        />


                                    </div>
                                </div>

                                <button type="submit" className="button">💾 Enregistrer</button>
                            </form>
                        </div>





                    </div>
                </div>
            </main >
        </div >
    );
};

