"use client";
import React, { useState } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance"; // ton axios configuré
import { countryNumberCode, country, countryCode } from "@/utils/types";

import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

export default function CreerOffre() {

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const [form, setForm] = useState({
        nom: "",
        role: "",
        email: "",
        password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // 🔍 Validation email
        if (!validateEmail(form.email)) {
            setErrorMsg("Veuillez entrer une adresse email valide.");
            setShowError(true);
            return; // ⛔ stop ici
        }

        const dataToSend = {
            nom: form.nom,
            role: form.role,
            email: form.email,
            countryCode: countryCode
        };

        console.log("📤 Envoi JSON :", dataToSend);

        // Envoi vers le serveur
        try {
            const response = await submitOffre(dataToSend);
            console.log("✅ Réponse serveur :", response);

            if (response.status == 201) {


                const { data } = response

                if (data.status == "created" || data.status == "no_change") {

                    setSuccessMsg("Le collaborateur a été ajouté et recevra un email d’activation.");
                    setShowSuccess(true)

                }


            }

        } catch (err: any) {

            setErrorMsg("Une erreur est survenue lors de l'ajout");
            setShowError(true);
            console.error("❌ Erreur lors de l'envoi :", err);
        }
    };


    // Fonction d'envoi
    async function submitOffre(payload: any) {
        // ⚠️ Exemple avec axios
        const response = await api.post("/entreprise/ajouter_colloborateur", payload, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    }

    return (
        <div>
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
                            <h2>Ajouter un collaborateur</h2>
                        </div>

                        <div>
                            <form onSubmit={handleSubmit}>

                                <label>Nom complet</label>
                                <input
                                    name="nom"
                                    value={form.nom}
                                    onChange={handleChange}
                                    placeholder="Ex: Jean Dupont"
                                    required
                                />

                                <label>Rôle</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Sélectionnez un rôle</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Recruteur">Recruteur</option>
                                    {/* <option value="RH">RH</option>
                                    <option value="Lecture seule">Lecture seule</option> */}
                                </select>

                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Ex: jean.dupont@email.com"
                                    required
                                />



                                <button type="submit" className="save-btn">
                                    💾 Enregistrer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
