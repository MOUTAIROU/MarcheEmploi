'use client';
import './style.css';
import Header from '@/components/header/page';
import Sidebar from "@/components/Sidebar/page";
import { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { refreshAndRetry } from "@/utils/refreshAndRetry";
import QuillEditor from "@/components/QuillEditor/page";

import { useSession } from "@/lib/sessionStore";


export default function Home() {
    const [activeTab, setActiveTab] = useState("parametre");

    const { session } = useSession();
    const { accessToken, refreshToken, newAccessToken } = useSession(); // <- récupère depuis le contexte
    const potofioPresentationRef = useRef<any>(null);

    console.log(session)
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

    // 🔹 Gérer les champs texte
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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



            payload.append("activite", formData.activite || "");
            payload.append("infos", formData.infos || "");
            payload.append("specialisation", formData.specialisation || "");
            payload.append("username", formData.username || "");
            payload.append("nom", formData.nom || "");
            payload.append("prenom", formData.prenom);
            payload.append("email", formData.email || "");
            payload.append("tel", formData.tel);
            // On nettoie juste pour éviter caractères interdits

            payload.append("filmanme", formData.tel);
            if (formData.avatar) payload.append("photo_profil", formData.avatar);

            // 🔹 Afficher le contenu du FormData
            for (let pair of payload.entries()) {
                console.log(pair[0], pair[1]);
            }



            let response;
            try {

                response = await submitProfile(payload, accessToken || " ");


            } catch (err: any) {

                if (err.response?.status === 401) {
                    // 🔹 Appel automatique du refresh et retry

                    console.log("accessToken: ", accessToken)
                    console.log("refreshToken: ", refreshToken)
                    response = await refreshAndRetry(submitProfile, refreshToken || "", newAccessToken, formData);
                }
                throw err; // autre erreur
            }

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



    async function submitProfile(payload: FormData, accessToken: string) {
        return axios.post(
            `${process.env.SERVER_HOST}/users/cand_profile`,
            payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${accessToken}`
                },
                withCredentials: true
            }
        );
    }



    return (
        <div>
            <Header />
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
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        border: "2px solid #ccc",
                                        marginBottom: "10px",
                                    }}
                                    onClick={() => document.getElementById("avatarInput")?.click()}
                                >
                                    {formData.avatar ? (
                                        <img
                                            src={URL.createObjectURL(formData.avatar)}
                                            alt="avatar"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#aaa"
                                        }}>+</div>
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



                                <label>Secteur d'activité</label>
                                <input
                                    name="activite"
                                    placeholder="Ex: Assistante Commerciale"
                                    value={formData.activite}
                                    onChange={handleChange}/>
                                {errors.activite && <p className="error">{errors.activite}</p>}

                                <label>infos</label>
                                <QuillEditor
                                    placeholder="Exemple : 'MarcheEmploi est une entreprise innovante spécialisée dans les solutions RH numériques en Afrique.'"
                                    editorRef={potofioPresentationRef}
                                />
                                {errors.infos && <p className="error">{errors.infos}</p>}

                                <label>Spécialisation</label>
                                <input
                                    name="specialisation"
                                    placeholder="Adresse e-mail"
                                    value={formData.specialisation}
                                    onChange={handleChange}
                                    disabled={true} />
                                {errors.specialisation && <p className="error">{errors.specialisation}</p>}



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
