'use client';
import './style.css';
import Sidebar from "@/components/Sidebar/page";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/sessionStore";
import api from "@/lib/axiosInstance";

import { TIMEZONE_LABELS, CITY_BY_COUNTRY, countryCode, CATEGORIE_DOMAINES, COUNTRY_LABELS } from "@/utils/types";


import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

const FILE_BASE_URL = `${process.env.SERVER_HOST}/uploads`;

export default function Home() {
    const [activeTab, setActiveTab] = useState("parametre");

    const { session } = useSession();
    const potofioPresentationRef = useRef<any>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


    const [specialisations, setSpecialisations] = useState<string[]>([]);
    const [specialisationInput, setSpecialisationInput] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // ✅ Form state
    const [formData, setFormData] = useState({
        username: "",
        nom: session?.nom,
        prenom: "",
        email: session?.email,
        tel: "",
        avatar: null as File | null,
        activite: "",
        infos: "",
        specialisation: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getOffres()
    }, []);

    async function getOffres() {
        try {
            const response = await api.get(`/users/get_cand_parametre_info`);
            const offre = response.data.data;

            console.log(response)

            if (!offre) return;



            // 🔹 Préremplir les champs texte
            setFormData(prev => ({
                ...prev,
                username: offre.username || "",
                nom: offre.nom || "",
                prenom: offre.prenom || "",
                email: offre.email || "",
                tel: offre.tel || "",
                activite: offre.activite || "",
                infos: offre.infos || "",
                avatar: null // ⚠️ avatar serveur ≠ File
            }));

            // 🔹 Préremplir les spécialisations
            if (offre.specialisation) {
                try {
                    setSpecialisations(offre.specialisation);
                } catch (e) {
                    console.error("Erreur parsing specialisation", e);
                }
            }


            // 🔹 Stocker l’avatar serveur pour l’affichage
            if (offre.photo_profil) {

                console.log(`${process.env.SERVER_HOST}/uploads/${offre.photo_profil}`)

                setAvatarPreview(
                    `${process.env.SERVER_HOST}/uploads/${offre.photo_profil}`
                );
            }

        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }


    // 🔹 Gérer les champs texte
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // 🔹 Gérer l’upload de l’avatar
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Veuillez sélectionner uniquement une image");
            return;
        }

        setFormData({ ...formData, avatar: file });
    };

    // 🔹 Validation simple
    // 🔹 Validation simple (1 message à la fois)
    const validateForm = () => {
        // Liste des champs obligatoires et leurs libellés
        const requiredFields: { field: keyof typeof formData; label: string }[] = [
            { field: "username", label: "nom d'utilisateur" },
            { field: "nom", label: "nom" },
            { field: "email", label: "e-mail" }
        ];

        for (let { field, label } of requiredFields) {
            const value = formData[field];


            // --- Champs string ---
            if (!value || (typeof value === "string" && !value.trim())) {
                setSuccessMsg(`Le champ ${label} est obligatoire`);
                setShowSuccess(true);
                return false;
            }

        }

        // Si tout est OK
        setSuccessMsg("");
        setShowSuccess(false);
        return true;
    };

    // 🔹 Soumission via Axios
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = new FormData();


            payload.append("username", formData.username || "");
            payload.append("nom", formData.nom || "");
            payload.append("prenom", formData.prenom);
            payload.append("email", formData.email || "");
            payload.append("tel", formData.tel);
            // On nettoie juste pour éviter caractères interdits

            payload.append("activite", formData.activite || "");
            payload.append("infos", potofioPresentationRef.current?.root.innerHTML || "");
            payload.append("specialisation", JSON.stringify(specialisations));

            payload.append("filmanme", formData.tel);
            if (formData.avatar) payload.append("photo_profil", formData.avatar);

            // 🔹 Afficher le contenu du FormData
            for (let pair of payload.entries()) {
                console.log(pair[0], pair[1]);
            }





            const response = await submitProfile(payload);

            if (response.status == 201) {


                const { data } = response

                if (data.status == "success" || data.status == "no_change") {

                    setSuccessMsg("Vos informations personnelles ont été correctement enregistrées.");
                    setShowSuccess(true)

                }


            }





        } catch (error: any) {
            console.error(error);
            setSuccessMsg("Erreur aux niveaux du serveur.");
            setShowError(true)

        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        const value = specialisationInput.trim();
        if (value && !specialisations.includes(value)) {
            setSpecialisations([...specialisations, value]);
        }
        setSpecialisationInput("");
    };

    const removeTag = (index: number) => {
        setSpecialisations(prev => prev.filter((_, i) => i !== index));
    };


    async function submitProfile(payload: FormData) {

        // ⚠️ on utilise api ici
        const response = await api.post(
            '/users/cand_parametre_info'
            , payload);
        return response;
    }

    return (
        <div>
            <main>
                <div className="container-dashbord">
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
                        <div className="container-ctn">
                            <div className="tabs">
                                <Link
                                    href={`${process.env.LOCAL_HOST}/emploi/dashboard/parametres`}
                                    className={`tab ${activeTab === "parametre" ? "active" : "active"}`}
                                >
                                    Parametre
                                </Link>
                                <button
                                    className={`tab ${activeTab === "profile" ? "" : ""}`}

                                >
                                    Profile
                                </button>
                            </div>

                            <form className='form' onSubmit={handleSubmit} encType="multipart/form-data">
                                <label>Avatar</label>
                                <div
                                    className="avatar-circle"
                                    onClick={() => document.getElementById("avatarInput")?.click()}
                                >

                                    {formData.avatar ? (
                                        // Affiche l'avatar uploadé localement
                                        <Image
                                            src={URL.createObjectURL(formData.avatar)}
                                            alt={`${formData.username} avatar 1`}
                                            width={150}
                                            height={150}
                                            className="preview"
                                        />
                                    ) : avatarPreview ? (
                                        // Affiche l'avatar serveur
                                        <Image
                                            src={avatarPreview}
                                            alt={`${formData.username} avatar 2`}
                                            width={150}
                                            height={150}
                                            className="preview"
                                        />
                                    ) : (
                                        // Aucun avatar
                                        <div className="empty-avatar">+</div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="avatarInput"
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />

                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Nom d'utilisateur"
                                    value={formData.username}
                                    onChange={handleChange}
                                />

                                <label>Nom complet</label>
                                <input
                                    type="text"
                                    name="nom"
                                    placeholder="Nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                />


                                <label>Adresse e-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Adresse e-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={true} />



                                <label>Spécialisations</label>

                                <div className="tags-container">
                                    {/* Liste des tags */}
                                    {specialisations.map((tag, index) => (
                                        <div key={index} className="tag">
                                            {tag}
                                            <span className="remove-tag" onClick={() => removeTag(index)}>×</span>
                                        </div>
                                    ))}

                                    {/* Champ pour entrer un tag */}
                                    <input
                                        type="text"
                                        className="tag-input"
                                        placeholder="Ajouter une spécialisation"
                                        value={specialisationInput}
                                        onChange={(e) => setSpecialisationInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                    />

                                    {/* Bouton Ajouter */}
                                    <button
                                        type="button"
                                        className="add-tag-button"
                                        onClick={addTag}
                                    >
                                        Ajouter +
                                    </button>
                                </div>
                                <label>Secteur d'activité</label>

                                <select
                                    name="activite"
                                    value={formData.activite}
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


                                {errors.activite && <p className="error">{errors.activite}</p>}





                                <label>Téléphone / WhatsApp</label>
                                <input
                                    type="text"
                                    name="tel"
                                    placeholder="Téléphone / WhatsApp"
                                    value={formData.tel}
                                    onChange={handleChange}
                                />
                                {errors.tel && <p className="error">{errors.tel}</p>}

                                <button type="submit" className="button" disabled={loading}>
                                    {loading ? "Enregistrement..." : "Enregistrer"}
                                </button>

                                {message && <p className="message">{message}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
