"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import FuseauHoraireForm, { FuseauHoraireRef } from "@/components/FuseauHoraireForm/page"
import api from "@/lib/axiosInstance";
import { TIMEZONE_LABELS, CITY_BY_COUNTRY, countryCode, CATEGORIE_DOMAINES, COUNTRY_LABELS } from "@/utils/types";
// Page / composant Next.js en TypeScript
// Nom du fichier suggéré: pages/dashboard/creer-offre.tsx

const FILE_BASE_URL = `${process.env.SERVER_HOST}/uploads`;


const REQUIRED_FIELDS: Record<string, string> = {
    nom_legal: "Le nom légal est obligatoire",
    ifu: "Le numéro IFU est obligatoire",
    type_entreprise: "Le type d’entreprise est obligatoire",
    taille: "La taille est obligatoire",
    domaine: "Le domaine est obligatoire",
    pays: "Le pays est obligatoire",
    ville: "La ville est obligatoire",
    adresse: "L’adresse est obligatoire",
    telephone: "Le téléphone est obligatoire",
    email: "L’email est obligatoire",
};


export default function CreerOffre() {

    const [formData, setFormData] = useState({
        nom_legal: "",
        ifu: "",
        type_entreprise: "",
        taille: "",
        domaine: "",
        pays: "",
        ville: "",
        adresse: "",
        telephone: "",
        email: "",
        rh_nom: "",
        rh_email: "",
        rh_tel: "",
        fuseau: "",
        langue: "",
        enable2FA: false,
        ip_autorisees: "",
        logo: null as File | null,
        couverture: null as File | null,
    });

    const fuseauRef = useRef<FuseauHoraireRef>(null);

    const handleSave = () => {
        if (fuseauRef.current) {
            const planning = fuseauRef.current.getSchedule();
            console.log("Planning récupéré :", planning);
            // ici tu peux envoyer planning à ton backend
        }
    };

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [couverturePreview, setCouverturePreview] = useState<string | null>(null);

    useEffect(() => {

        getOffres();
        // return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function getOffres() {
        try {
            const response = await api.get("entreprise_get/information_offres");

            const entreprise = response.data?.data;
            if (!entreprise) return;

            console.log("📦 Données entreprise :", entreprise);

            // 🔹 Préremplir les champs simples
            setFormData(prev => ({
                ...prev,
                nom_legal: entreprise.nom_legal ?? "",
                ifu: entreprise.ifu ?? "",
                type_entreprise: entreprise.type_entreprise ?? "",
                taille: entreprise.taille ?? "",
                domaine: entreprise.domaine ?? "",
                pays: entreprise.pays ?? "",
                ville: entreprise.ville ?? "",
                adresse: entreprise.adresse ?? "",
                telephone: entreprise.telephone ?? "",
                email: entreprise.email ?? "",
                rh_nom: entreprise.rh_nom ?? "",
                rh_email: entreprise.rh_email ?? "",
                rh_tel: entreprise.rh_tel ?? "",
                fuseau: entreprise.fuseau ?? "",
                langue: entreprise.langue ?? "",
                enable2FA: Boolean(entreprise.enable2FA),
                ip_autorisees: entreprise.ip_autorisees ?? "",
            }));



            // 🔹 Prévisualisation logo si existant
            if (entreprise.filenameBase?.photo_profil) {
                setLogoPreview(
                    `${FILE_BASE_URL}/${entreprise.filenameBase.photo_profil}`
                );
            }

            // 🔹 Prévisualisation couverture si existante
            if (entreprise.filenameBase?.photo_couverture) {
                setCouverturePreview(
                    `${FILE_BASE_URL}/${entreprise.filenameBase.photo_couverture}`
                );
            }



            // 🔹 Préremplir le planning (FuseauHoraireForm)
            if (entreprise.planning && fuseauRef.current) {
                try {
                    const planningParsed = JSON.parse(entreprise.planning);
                    fuseauRef.current.setSchedule(planningParsed);
                } catch (e) {
                    console.error("❌ Erreur parsing planning :", e);
                }
            }

        } catch (error) {
            console.error("❌ Erreur récupération entreprise :", error);
        }
    }


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;
        const name = target.name;

        let value: string | boolean;

        // Checkbox
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        } else {
            value = target.value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async () => {


        const data = new FormData();

        // ✅ VALIDATION
        for (const field in REQUIRED_FIELDS) {
            const value = (formData as any)[field];

            if (!value || String(value).trim() === "") {
                alert(REQUIRED_FIELDS[field]);
                return;
            }

            // ✅ validation email
            if (field === "email" && !isValidEmail(value)) {
                alert("Email invalide");
                return;
            }
        }

        // Ajouter tous les champs textes
        data.append("nom_legal", formData.nom_legal);
        data.append("ifu", formData.ifu);
        data.append("type_entreprise", formData.type_entreprise);
        data.append("taille", formData.taille);
        data.append("domaine", formData.domaine);
        data.append("pays", formData.pays);
        data.append("ville", formData.ville);
        data.append("adresse", formData.adresse);
        data.append("telephone", formData.telephone);
        data.append("email", formData.email);
        data.append("rh_nom", formData.rh_nom);
        data.append("countryCode", countryCode);

        data.append("rh_email", formData.rh_email);
        data.append("rh_tel", formData.rh_tel);
        data.append("fuseau", formData.fuseau);
        data.append("langue", formData.langue);
        data.append("enable2FA", String(formData.enable2FA)); // convertir en string
        data.append("ip_autorisees", formData.ip_autorisees);

        // Fichiers
        if (formData.logo) data.append("photo_profil", formData.logo);
        if (formData.couverture) data.append("photo_couverture", formData.couverture);

        // Récupérer le planning depuis le ref du fuseau horaire
        if (fuseauRef.current) {
            const planning = fuseauRef.current.getSchedule();
            data.append("planning", JSON.stringify(planning)); // envoyer en JSON
        }

        // Envoi vers le serveur
        try {
            const response = await submitOffre(data);
            console.log("✅ Réponse serveur :", response);
        } catch (err: any) {
            console.error("❌ Erreur lors de l'envoi :", err);
        }
    };




    // Fonction d'envoi
    async function submitOffre(payload: FormData) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/create_information", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "logo" | "couverture"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            [field]: file,
        }));

        const previewURL = URL.createObjectURL(file);

        if (field === "logo") setLogoPreview(previewURL);
        if (field === "couverture") setCouverturePreview(previewURL);
    };

    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <h1 className="title">Informations de l’entreprise ( KYC )</h1>

                        {/* SECTION A */}
                        <div className="section">
                            <h2 className="section-title">Informations administratives</h2>

                            <div className="grid">

                                {/*
                                <div className="field">
                                    <label>Logo de l’entreprise</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, "logo")}
                                    />
                                    {logoPreview && (
                                        <Image
                                            src={logoPreview}
                                            alt="Logo de l'entreprise"
                                            width={150}
                                            height={150}
                                            className="preview"
                                        />
                                    )}
                                </div>
                                 */}

                                <div className="field">
                                    <label>Nom légal de l’entreprise</label>
                                    <input name="nom_legal" value={formData.nom_legal} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Numéro IFU / RCCM</label>
                                    <input name="ifu" value={formData.ifu} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Type d’entreprise</label>
                                    <select name="type_entreprise" value={formData.type_entreprise} onChange={handleChange}>
                                        <option value="">-- Sélectionner --</option>
                                        <optgroup label="Entreprises classiques">
                                            <option value="SARL">SARL</option>
                                            <option value="SA">SA</option>
                                            <option value="SAS">SAS</option>
                                            <option value="SNC">SNC</option>
                                        </optgroup>

                                        <optgroup label="Secteur public & social">
                                            <option value="ONG">ONG</option>
                                            <option value="Association">Association</option>
                                            <option value="Cooperative">Coopérative</option>
                                            <option value="EtablissementPublic">Établissement public</option>
                                        </optgroup>

                                        <optgroup label="Indépendants & petites structures">
                                            <option value="AutoEntrepreneur">Auto-entrepreneur / Freelance</option>
                                            <option value="Independant">Indépendant</option>
                                            <option value="MicroEntreprise">Micro-entreprise</option>
                                            <option value="Startup">Startup</option>
                                        </optgroup>

                                        <optgroup label="Autres">
                                            <option value="EntrepriseIndividuelle">Entreprise individuelle</option>
                                            <option value="Autre">Autre</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Taille de l’entreprise</label>
                                    <select name="taille" value={formData.taille} onChange={handleChange}>
                                        <option value="">-- Sélectionner --</option>
                                        <option value="1-10">1-10 employés</option>
                                        <option value="10-50">10-50 employés</option>
                                        <option value="50+">50+ employés</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Domaine d’activité</label>
                                    <select
                                        name="domaine"
                                        value={formData.domaine}
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
                                    <label>Pays</label>
                                    <select
                                        name="pays"
                                        value={formData.pays}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Sélectionnez un pays --</option>
                                        {Object.entries(COUNTRY_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="field">
                                    <label>Ville</label>
                                    <select
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        disabled={!formData.pays}
                                        required
                                    >
                                        <option value="">-- Sélectionnez une ville --</option>

                                        {formData.pays &&
                                            CITY_BY_COUNTRY[formData.pays]?.map((ville) => (
                                                <option key={ville} value={ville}>
                                                    {ville}
                                                </option>
                                            ))}
                                    </select>
                                </div>


                                <div className="field full">
                                    <label>Adresse complète</label>
                                    <input name="adresse" value={formData.adresse} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Téléphone professionnel</label>
                                    <input name="telephone" value={formData.telephone} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Email professionnel</label>
                                    <input name="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION B */}
                        <div className="section">
                            {/*  <h2 className="section-title">Configuration du compte</h2> */}

                            <div className="grid">

                                {/*
                                <div className="field">
                                    <label>Image de couverture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, "couverture")}
                                    />
                                    {couverturePreview && (
                                        <Image
                                            src={couverturePreview}
                                            alt="Image de couverture"
                                            width={300}
                                            height={150}
                                            className="preview"
                                        />
                                    )}


                                </div>

                              
                                 <div className="field">
                                    <label>Contact RH - Nom</label>
                                    <input name="rh_nom" value={formData.rh_nom} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Contact RH - Email</label>
                                    <input name="rh_email" value={formData.rh_email} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>Contact RH - Téléphone</label>
                                    <input name="rh_tel" value={formData.rh_tel} onChange={handleChange} />
                                </div>

                                 */}

                                {/*
                                <FuseauHoraireForm ref={fuseauRef} />

                                
                                
                                <div className="field">
                                    <label>Fuseau horaire</label>
                                    <select
                                        name="fuseau"
                                        value={formData.fuseau}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Sélectionnez un fuseau horaire --</option>
                                        {Object.entries(TIMEZONE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="field">
                                    <label>Langue principale</label>
                                    <select name="langue" value={formData.langue} onChange={handleChange}>
                                        <option value="">-- Sélectionner --</option>
                                        <option value="fr">Français</option>
                                        <option value="en">Anglais</option>
                                    </select>
                                </div>
                                
                                */}

                            </div>
                        </div>

                        {/* SECTION C */}
                        {/*<div className="section">
                            <h2 className="section-title">Paramètres de sécurité</h2>

                            <div className="grid">
                                <div className="field">
                                    <label>Activer la double authentification (2FA)</label>
                                    <input
                                        type="checkbox"
                                        name="enable2FA"
                                        checked={formData.enable2FA}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="field full">
                                    <label>IP autorisées (séparées par des virgules)</label>
                                    <textarea
                                        name="ip_autorisees"
                                        value={formData.ip_autorisees}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>


                            </div>
                        </div>*/}

                        <button className="btn-save" onClick={handleSubmit}>Enregistrer</button>


                    </div>
                </div>
            </main >
        </div >
    );
};

