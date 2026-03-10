'use client';
import './style.css';
import Sidebar from "@/components/Sidebar/page";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { refreshAndRetry } from "@/utils/refreshAndRetry";
import QuillEditor from "@/components/QuillEditor/page";

import { useSession } from "@/lib/sessionStore";
import api from "@/lib/axiosInstance";

import { TIMEZONE_LABELS, CITY_BY_COUNTRY, countryCode, CATEGORIE_DOMAINES, COUNTRY_LABELS } from "@/utils/types";

const FILE_BASE_URL = `${process.env.SERVER_HOST}/uploads`;

export default function Home() {
    const [activeTab, setActiveTab] = useState("parametre");

    const { session } = useSession();
    const { accessToken, refreshToken, newAccessToken } = useSession(); // <- récupère depuis le contexte
    const potofioPresentationRef = useRef<any>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


    const [specialisations, setSpecialisations] = useState<string[]>([]);
    const [specialisationInput, setSpecialisationInput] = useState("");

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
            const response = await api.get(`/users/get_cand_profile`);
            const offre = response.data.data;

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
                    setSpecialisations(JSON.parse(offre.specialisation));
                } catch (e) {
                    console.error("Erreur parsing specialisation", e);
                }
            }

            // 🔹 Préremplir Quill
            setTimeout(() => {
                if (potofioPresentationRef.current && offre.infos) {
                    potofioPresentationRef.current.root.innerHTML = offre.infos;
                }
            }, 0);

            // 🔹 Stocker l’avatar serveur pour l’affichage
            if (offre.filenameBase) {
                setAvatarPreview(
                    `${FILE_BASE_URL}/${offre.filenameBase}`
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
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est requis";
        if (!formData.nom?.trim()) newErrors.nom = "Le nom est requis";
        if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
        if (!formData.email?.trim()) newErrors.email = "L’e-mail est requis";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "E-mail invalide";
        if (!formData.tel.trim()) newErrors.tel = "Le téléphone est requis";
        if (!formData.avatar) newErrors.avatar = "Veuillez sélectionner un avatar";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 🔹 Soumission via Axios
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = new FormData();


            console.log(potofioPresentationRef.current?.root.innerHTML)

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
            console.log("✅ Réponse serveur :", response);

            // 🔹 Si on arrive ici, tout a fonctionné
            setMessage("✅ Profil mis à jour avec succès !");
            alert("Profil mis à jour avec succès !"); // optionnel
            console.log("Réponse serveur :", response?.data);



        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.message || "Erreur lors de la mise à jour");
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
        alert('// ⚠️ on utilise api ici')
        // ⚠️ on utilise api ici
        const response = await api.post(
            '/users/cand_profile'
            , payload);
        return response.data;
    }

    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />
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

                                        <Image
                                            src={URL.createObjectURL(formData.avatar)}
                                            alt="Logo de l'entreprise"
                                            width={150}
                                            height={150}
                                            className="preview"
                                        />

                                    ) : avatarPreview ? (

                                        <Image
                                            src={avatarPreview}
                                            alt="Logo de l'entreprise"
                                            width={150}
                                            height={150}
                                            className="preview"
                                        />
                                    ) : (
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
                                {errors.avatar && <p className="error">{errors.avatar}</p>}

                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Nom d'utilisateur"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                {errors.username && <p className="error">{errors.username}</p>}

                                <label>Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    placeholder="Nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                />
                                {errors.nom && <p className="error">{errors.nom}</p>}

                                <label>Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    placeholder="Prénom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                />
                                {errors.prenom && <p className="error">{errors.prenom}</p>}

                                <label>Adresse e-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Adresse e-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={true} />
                                {errors.email && <p className="error">{errors.email}</p>}



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

                                <label>infos</label>
                                <QuillEditor
                                    placeholder="Exemple : 'MarcheEmploi est une entreprise innovante spécialisée dans les solutions RH numériques en Afrique.'"
                                    editorRef={potofioPresentationRef}
                                />
                                {errors.infos && <p className="error">{errors.infos}</p>}



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
