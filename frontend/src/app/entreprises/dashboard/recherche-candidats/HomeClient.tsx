'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import apiWithSession from "@/lib/axiosInstance";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/CandidatListDashbord/page";
import { countryCode, allPays, allVilles, allSecteurs, typeAnnonce, SEARCH_SESSION_KEY, CATEGORIE_LABELS } from "@/utils/types";
import { NumberValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import Popup from "@/components/Popup/PopupErrorWithLogin/page";
import PopupSucess from "@/components/Popup/PopupSuccess/page";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SidebarEntreprises/page";

const tab_experience = [
    "Débutant", "Junior", "Confirmé", "Senior"
]

const tab_disponibiliter = [
    "Toutes", "Immédiate", "Sous 1 semaine", "Sous 1 mois"
]

const tab_status = [
    "Déjà postulé",
    "Déjà contacté",
    "En entretien",
    "Rejeté"
];




export default function Home() {



    const [motsCles, setMotsCles] = useState<string[]>([]);
    const [motCleInput, setMotCleInput] = useState("");
    const [showMore, setShowMore] = useState(false);





    const [popupMessage, setPopupMessage] = useState("👉 Connectez-vous ou créez un compte pour enregistrer votre recherche.");
    const [isOpenpopup, setIsOpenpopup] = useState(false);


    const [popupMessageSucces, setPopupMessageSucces] = useState("✔️ Votre recherche a été enregistrée.");
    const [isOpenpopupSucces, setIsOpenpopupSucces] = useState(false);

    const [pays, setPays] = useState<string[]>([]);
    const [experience, setExperience] = useState<string[]>([]);
    const [disponibilite, setDisponibilite] = useState<string[]>([]);
    const [statut, setStatut] = useState<string[]>([]);
    const [ville, setVille] = useState<string[]>([]);
    const [secteurs, setSecteurs] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [annonces, setAnnonces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [periode, setPeriode] = useState<string>("");
    const [total, setTotal] = useState<number>(0);

    const [dateDebut, setDateDebut] = useState<string | null>(null);
    const [dateFin, setDateFin] = useState<string | null>(null);

    const router = useRouter();

    const periodeOptions = [
        "Il y a 24h",
        "Il y a 7 jours",
        "Il y a 12 jours",
        "Il y a 30 jours",
    ];



    const addMotCle = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && motCleInput.trim() !== "") {
            e.preventDefault();
            setMotsCles([...motsCles, motCleInput.trim()]);
            setMotCleInput("");
        }
    };

    const removeMotCle = (index: number) => {
        setMotsCles(motsCles.filter((_, i) => i !== index));
    };

    const toggleSelect = (
        item: string,
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((i) => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    const toggleType = (item: string) => {
        if (selectedTypes.includes(item)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== item));
        } else {
            setSelectedTypes([...selectedTypes, item]);
        }
    };

    const buildSearchParams = () => {
        return {
            keywords: motsCles,              // Métier / compétences
            experience,                      // ["Junior", "Senior"]
            disponibilite,                   // ["Immédiate"]
            exclude_status: statut,          // ["Rejeté", "En entretien"]
            pays,
            villes: ville,
            secteurs,
            periode,
            dateDebut,
            dateFin
        };
    };


    const handleRecherche = async () => {
        try {
            setLoading(true);



            const params = buildSearchParams();

            // 🔹 Sauvegarde en session
            sessionStorage.setItem(
                SEARCH_SESSION_KEY,
                JSON.stringify(params)
            );


            const res = await apiWithSession.post("/frontend/entreprises_candidats_recherche", params);

            setTotal(res.data.results.length)
            setAnnonces(res.data.results)

            //  setAnnonces(res.data.data);
        } catch (error) {
            console.error("Erreur recherche", error);
        } finally {
            setLoading(false);
        }
    };



    const gotoLogin = async () => {
        router.push(`${process.env.LOCAL_HOST}/connexion`);
        setIsOpenpopup(false)
    }

    // 🔹 Visiter CV (dans le parent)
    const handleVisiterCV = (userId: string) => {
        console.log("Ouvrir le CV du candidat :", userId);
        // Par exemple, tu peux générer l'URL du CV depuis l'id


        router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/cv/${userId}`)

        //  window.open(cvUrl, "_blank");
    };

    // 🔹 Enregistrer le candidat (dans le parent)
    const handleEnregistrer = async (userId: string) => {
        console.log("Candidat enregistré :", userId);
        alert(`Candidat ${userId} enregistré !`);
        // Ici tu peux appeler ton API pour enregistrer ce candidat

        const res = await apiWithSession.post("/frontend/entreprise_save_candidats", {
            userId: userId,
        });
    };


    return (
        <div>
            <main >

                <div className="container-dashbord">

                    <Sidebar />

                    <div className="mainContent">


                        {isOpenpopup && (
                            <Popup
                                isOpen={isOpenpopup}
                                title="Erreur"
                                message={popupMessage}
                                onClose={() => setIsOpenpopup(false)}
                                onLogin={() => gotoLogin()}
                            />
                        )}




                        {isOpenpopupSucces && (
                            <PopupSucess
                                isOpen={isOpenpopupSucces}
                                title="Enregistré 💾"
                                message={popupMessageSucces}
                                onClose={() => setIsOpenpopupSucces(false)}
                            />
                        )}

                        <h1 className="page-title">
                            Appels d’offres et opportunités professionnelles
                        </h1>
                        <h2 className="recherche-ctn-txt">Recherche</h2>
                        <div className="recherche-ctn">
                            <div className="recherche-container">





                                {/* Mots-clés */}
                                <div className="field">
                                    <label>Métier / Compétences</label>
                                    <div className='field-data '>
                                        <div className="tags">
                                            {motsCles.map((mot, index) => (
                                                <span key={index} className="tag" onClick={() => removeMotCle(index)}>
                                                    {mot} ✕
                                                </span>
                                            ))}
                                        </div>
                                        <div className="action-ctn">
                                            <input
                                                type="text"
                                                placeholder="Ex: Développeur, React, Comptabilité..."
                                                value={motCleInput}
                                                onChange={(e) => setMotCleInput(e.target.value)}
                                                onKeyDown={addMotCle}
                                            />
                                        </div>

                                    </div>
                                </div>



                                {/* Niveau d’expérience */}

                                {/*

                                <div className="field">
                                    <label>Niveau d’expérience</label>
                                    <div className='field-data'>

                                        <div className="tags">
                                            {experience.map((p, i) => (
                                                <span key={i} className="tag" onClick={() => toggleSelect(p, experience, setExperience)}>
                                                    {p} ✕
                                                </span>
                                            ))}
                                        </div>

                                        <div className="action-ctn">
                                            <select
                                                onChange={(e) => toggleSelect(e.target.value, experience, setExperience)}
                                                defaultValue=""
                                            >
                                                <option value="">Choisir le niveau d’expérience recherché</option>
                                                {tab_experience.map((p, i) => (
                                                    <option key={i} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                    </div>

                                </div>
                                
                                 */}



                                {/* Disponibilité */}
                                <div className="field">
                                    <label>Disponibilité</label>
                                    <div className='field-data'>

                                        <div className="tags">
                                            {disponibilite.map((p, i) => (
                                                <span key={i} className="tag" onClick={() => toggleSelect(p, disponibilite, setDisponibilite)}>
                                                    {p} ✕
                                                </span>
                                            ))}
                                        </div>

                                        <div className="action-ctn">
                                            <select
                                                onChange={(e) => toggleSelect(e.target.value, disponibilite, setDisponibilite)}
                                                defaultValue=""
                                            >
                                                <option value="">Quand le candidat est-il disponible ?</option>
                                                {tab_disponibiliter.map((p, i) => (
                                                    <option key={i} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                    </div>

                                </div>

                                {/* Disponibilité */}

                                {/*
                                 <div className="field">
                                    <label>Exclure de la recherche</label>
                                    <div className='field-data'>

                                        <div className="tags">
                                            {statut.map((p, i) => (
                                                <span key={i} className="tag" onClick={() => toggleSelect(p, statut, setStatut)}>
                                                    {p} ✕
                                                </span>
                                            ))}
                                        </div>

                                        <div className="action-ctn">
                                            <select
                                                onChange={(e) => toggleSelect(e.target.value, statut, setStatut)}
                                                defaultValue=""
                                            >
                                                <option value="">Exclure certains profils de la recherche</option>
                                                {tab_status.map((p, i) => (
                                                    <option key={i} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                    </div>

                                </div>

                                
                                 */}







                                {/* Pays */}
                                <div className="field">
                                    <label>Pays</label>
                                    <div className='field-data'>

                                        <div className="tags">
                                            {pays.map((p, i) => (
                                                <span key={i} className="tag" onClick={() => toggleSelect(p, pays, setPays)}>
                                                    {p} ✕
                                                </span>
                                            ))}
                                        </div>

                                        <div className="action-ctn">
                                            <select
                                                onChange={(e) => toggleSelect(e.target.value, pays, setPays)}
                                                defaultValue=""
                                            >
                                                <option value="">Sélectionner un pays</option>
                                                {allPays.map((p, i) => (
                                                    <option key={i} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                    </div>

                                </div>

                                {/* Ville */}
                                <div className="field">
                                    <label>Ville / Région</label>
                                    <div className='field-data'>

                                        <div className="tags">
                                            {ville.map((v, i) => (
                                                <span key={i} className="tag" onClick={() => toggleSelect(v, ville, setVille)}>
                                                    {v} ✕
                                                </span>
                                            ))}
                                        </div>

                                        <div className="action-ctn">
                                            <select
                                                onChange={(e) => toggleSelect(e.target.value, ville, setVille)}
                                                defaultValue=""
                                            >
                                                <option value="">Sélectionner une ville</option>
                                                {allVilles.map((v, i) => (
                                                    <option key={i} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                    </div>

                                </div>



                                {/* Boutons */}

                                <div className="field">
                                    <label></label>

                                    <div className='field-data field-data-ctn field-data-1-top field-data-2'>

                                        <button className="btn-primary btn2" onClick={() => handleRecherche()}>Recherche</button>


                                    </div>

                                </div>


                            </div>
                        </div>

                        <h2 className="recherche-ctn-txt">{`Resultat de recherche ( ${total} )`}</h2>
                        <div className='annonce-list-ctn'>
                            <AnnonceList
                                candidates={annonces}
                                total={total}
                                currentpage={1}
                                onVisiterCV={(user_id) => handleVisiterCV(user_id)}
                                onEnregistrer={(user_id) => handleEnregistrer(user_id)}



                            />
                        </div>


                    </div>

                </div>




            </main>
            <footer >

            </footer>
        </div>
    );
}




