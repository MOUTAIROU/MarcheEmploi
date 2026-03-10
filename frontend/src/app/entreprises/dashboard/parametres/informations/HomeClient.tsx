"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import FuseauHoraireForm, { FuseauHoraireRef } from "@/components/FuseauHoraireForm/page"
import api from "@/lib/axiosInstance";

import { TIMEZONE_LABELS, CITY_BY_COUNTRY, countryCode, CATEGORIE_DOMAINES, COUNTRY_LABELS } from "@/utils/types";

import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'


const REQUIRED_FIELDS_STEP1 = [
    "nom_legal",
    "ifu",
    "type_entreprise",
    "taille",
    "domaine",
    "pays",
    "ville",
    "adresse",
    "telephone",
    "email",
];

interface FormDataType {
    nom_legal: string;
    ifu: string;
    type_entreprise: string;
    taille: string;
    domaine: string;
    pays: string;
    ville: string;
    adresse: string;
    telephone: string;
    email: string;
    logo: File | null;
    couverture: File | null;
    rccm: File | null;
    [key: string]: any; // pour les champs dynamiques si besoin
}

export default function KYCForm() {
    const [step, setStep] = useState<1 | 2>(1); // 1 = admin, 2 = fichiers

    const [formData, setFormData] = useState<FormDataType>({
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
        logo: null,
        couverture: null,
        rccm: null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [rccmPreview, setRccmPreview] = useState<string | null>(null);

    const [ifuPreview, setIfuPreview] = useState<string | null>(null);

    const [kycStatus, setKycStatus] = useState<string>("pending");

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


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

            // ✅ Préremplissage
            setFormData({
                nom_legal: entreprise.nom_legal || "",
                ifu: entreprise.ifu || "",
                type_entreprise: entreprise.type_entreprise || "",
                taille: entreprise.taille || "",
                domaine: entreprise.domaine || "",
                pays: entreprise.pays || "",
                ville: entreprise.ville || "",
                adresse: entreprise.adresse || "",
                telephone: entreprise.telephone || "",
                email: entreprise.email || "",
                logo: null,
                couverture: null,
                rccm: null,
            });

            // ✅ Sauvegarder statut KYC dans un state
            setKycStatus(entreprise.kyc_status);

        } catch (error) {
            console.error("❌ Erreur récupération entreprise :", error);
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (files) {
            setFormData((prev: FormDataType) => ({ ...prev, [name]: files[0] }));
            if (name === "logo") setLogoPreview(URL.createObjectURL(files[0]));
            if (name === "rccm") setRccmPreview(URL.createObjectURL(files[0]));
            if (name === "ifu_doc") setIfuPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData((prev: FormDataType) => ({ ...prev, [name]: value }));
        }
    };


    const isStep1Valid = () => {
        for (const field of REQUIRED_FIELDS_STEP1) {
            if (!formData[field] || String(formData[field]).trim() === "") {
                alert(`Le champ ${field} est obligatoire`);
                return false;
            }
            if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                alert("Email invalide");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (isStep1Valid()) setStep(2);
    };

    const handleSubmit = async () => {
        // Ici tu peux envoyer formData à ton backend (incluant les fichiers)
        console.log("Envoi des données :", formData);

        const response = await api.post("/entreprise/create_information", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(response)

        if (response.status == 201) {


            const { data } = response

            if (data.status == "created" || data.status == "no_change") {

                setSuccessMsg("Données KYC soumises !");
                setShowSuccess(true)

            }


        }

    };

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
                        <div className="kyc-container">

                            {kycStatus && (
                                <div className={`kyc-box kyc-${kycStatus}`}>
                                    {kycStatus === "not_submitted" && (
                                        <p>⚠️ Vous n’avez pas encore soumis vos documents KYC.</p>
                                    )}

                                    {kycStatus === "pending" && (
                                        <p>⏳ Votre KYC est en attente de validation.</p>
                                    )}

                                    {kycStatus === "submitted" && (
                                        <p>📨 Vos documents ont été soumis et sont en cours de vérification.</p>
                                    )}

                                    {kycStatus === "approved" && (
                                        <p>✅ Votre entreprise est vérifiée. Vous pouvez publier des offres.</p>
                                    )}

                                    {kycStatus === "rejected" && (
                                        <p>❌ Votre KYC a été refusé. Veuillez vérifier vos documents et soumettre à nouveau.</p>
                                    )}
                                </div>
                            )}


                            <h1>KYC Entreprise</h1>

                            {step === 1 && (
                                <div className="step step1">
                                    <h2>Étape 1 — Informations administratives</h2>

                                    <input name="nom_legal" placeholder="Nom légal" value={formData.nom_legal} onChange={handleChange} />
                                    <input name="ifu" placeholder="Numéro RCCM" value={formData.ifu} onChange={handleChange} />


                                    <select name="type_entreprise" value={formData.type_entreprise} onChange={handleChange}>
                                        <option value="">-- Type d’entreprise --</option>
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

                                    <select name="taille" value={formData.taille} onChange={handleChange}>
                                        <option value="">-- Sélectionner --</option>
                                        <option value="1-10">1-10 employés</option>
                                        <option value="10-50">10-50 employés</option>
                                        <option value="50+">50+ employés</option>
                                    </select>

                                    <select
                                        name="domaine"
                                        value={formData.domaine}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Domaine --</option>
                                        {Object.entries(CATEGORIE_DOMAINES).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>

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
                                    <input name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} />
                                    <input name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} />
                                    <input name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} />
                                    <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

                                    <button onClick={handleNext}>✅ Passer à l’étape 2</button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="step step2">
                                    <h2>Étape 2 — Documents légaux</h2>

                                    {/* RCCM */}
                                    <div className="fileField">
                                        <label>RCCM (registre de commerce)</label>
                                        <input
                                            type="file"
                                            name="rccm"
                                            accept="application/pdf,image/*"
                                            onChange={handleChange}
                                        />
                                        {rccmPreview && (
                                            <div className="filePreview">
                                                📄 {formData.rccm?.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* IFU */}
                                    <div className="fileField">
                                        <label>Attestation IFU</label>
                                        <input
                                            type="file"
                                            name="ifu_doc"
                                            accept="application/pdf,image/*"
                                            onChange={handleChange}
                                        />
                                        {ifuPreview && (
                                            <div className="filePreview">
                                                📄 {formData.ifu_doc?.name}
                                            </div>
                                        )}
                                    </div>

                                    <button className="btn-submit" onClick={handleSubmit}>
                                        💾 Soumettre le KYC
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}
