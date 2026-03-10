'use client';
import './style.css';
import axios from "axios";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";

import { refreshAndRetry } from "@/utils/refreshAndRetry";
import { useSession } from "@/lib/sessionStore";
import api from "@/lib/axiosInstance";


export default function Home() {


    const [visibleProfil, setVisibleProfil] = useState(true);
    const [contactDirect, setContactDirect] = useState(false);
    const [publicProfil, setPublicProfil] = useState(false);

    const [displayBio, setDisplayBio] = useState(true);
    const [displaySkills, setDisplaySkills] = useState(true);
    const [displayExperience, setDisplayExperience] = useState(true);
    const [showCV, setShowCV] = useState(false);
    const [openToWork, setOpenToWork] = useState(true);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const { accessToken, refreshToken, newAccessToken } = useSession(); // <- récupère depuis le contexte

    // 🔹 Fonction pour envoyer les préférences au serveur
    const handleSavePreferences = async () => {
        try {
            const payload = {
                visibleProfil,
                contactDirect,
                publicProfil,
                displayBio,
                displaySkills,
                displayExperience,
                showCV,
                openToWork,
            };

            console.log("Payload envoyé :", payload);

            let response;
            alert('tototoo')
            response = await submitUserPreferences(payload);
            

            // 🔹 Si on arrive ici, tout a fonctionné
            setMessage("✅ Profil mis à jour avec succès !");
            alert("Profil mis à jour avec succès !"); // optionnel
            console.log("Réponse serveur :", response?.data);


            console.log("Réponse serveur :", response.data);
            alert("Préférences enregistrées !");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement des préférences :", err);
            alert("Impossible d'enregistrer les préférences. Réessayez.");
        }
    };

    async function submitUserPreferences(payload: any) {
        alert('// ⚠️ on utilise api ici')
        // ⚠️ on utilise api ici
        const response = await api.post('/users/cand_profile_settings', payload);
        return response.data;
    }

    

    /*
   async function submitUserPreferences(payload: any, accessToken?: string) {

       console.log('--------------submitUserPreferences------------')
       console.log(payload)
       console.log(accessToken)
       console.log('--------------submitUserPreferences------------')
       const config: any = {
           withCredentials: true,
           headers: {}
       };

       // S'il y a un token, on l'ajoute dans les headers
       if (accessToken) {
           config.headers["Authorization"] = `Bearer ${accessToken}`;
       }

       return axios.post(
           `${process.env.SERVER_HOST}/users/cand_profile_settings`,
           payload,
           config
       );
   }*/




    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">


                        <div className="container-ctn">


                            <div className="tabs">
                                <Link
                                    href={`${process.env.LOCAL_HOST}/emploi/dashboard/parametres`}
                                    className={`tab active"`}
                                >
                                    Parametre
                                </Link>
                                <button className='tab'>Préférences de notification</button>
                            </div>


                            <div className="preferences">
                                <h3>Visibilité du Profil</h3>

                                <label className="checkbox">
                                    <input type="checkbox" checked={visibleProfil}
                                        onChange={() => setVisibleProfil(!visibleProfil)} />
                                    Rendre mon profil visible aux recruteurs (professionnel)
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" checked={publicProfil}
                                        onChange={() => setPublicProfil(!publicProfil)} />
                                    Rendre mon profil visible à tout le monde (public)
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" checked={displayBio}
                                        onChange={() => setDisplayBio(!displayBio)} />
                                    Afficher ma description (bio)
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" checked={displaySkills}
                                        onChange={() => setDisplaySkills(!displaySkills)} />
                                    Afficher mes compétences
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" checked={displayExperience}
                                        onChange={() => setDisplayExperience(!displayExperience)} />
                                    Afficher mon expérience professionnelle
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" checked={showCV}
                                        onChange={() => setShowCV(!showCV)} />
                                    Autoriser les entreprises à télécharger mon CV
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" checked={openToWork}
                                        onChange={() => setOpenToWork(!openToWork)} />
                                    Afficher que je suis ouvert(e) aux opportunités
                                </label>

                                <h3>Préférences de Contact</h3>

                                <label className="checkbox">
                                    <input type="checkbox" checked={contactDirect}
                                        onChange={() => setContactDirect(!contactDirect)} />
                                    Autoriser les recruteurs à me contacter directement
                                </label>
                            </div>

                            <button className="save" onClick={handleSavePreferences}>Enregistrer les préférences</button>

                        </div>







                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




