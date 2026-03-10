'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import apiWithSession from "@/lib/axiosInstance";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import { countryCode, allPays, allVilles, allSecteurs, typeAnnonce, SEARCH_SESSION_KEY, CATEGORIE_LABELS } from "@/utils/types";
import { NumberValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import Popup from "@/components/Popup/PopupErrorWithLogin/page";
import PopupSucess from "@/components/Popup/PopupSuccess/page";
import { useRouter } from "next/navigation";


export default function Home() {

    const [motsCles, setMotsCles] = useState<string[]>([]);
    const [motCleInput, setMotCleInput] = useState("");
    const [showMore, setShowMore] = useState(false);

    const [popupMessage, setPopupMessage] = useState("👉 Connectez-vous ou créez un compte pour enregistrer votre recherche.");
    const [isOpenpopup, setIsOpenpopup] = useState(false);


    const [popupMessageSucces, setPopupMessageSucces] = useState("✔️ Votre recherche a été enregistrée.");
    const [isOpenpopupSucces, setIsOpenpopupSucces] = useState(false);

    const [pays, setPays] = useState<string[]>([]);
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

    useEffect(() => {

        const params = buildSearchParams();

        // 🔹 Sauvegarde en session
        sessionStorage.setItem(
            SEARCH_SESSION_KEY,
            JSON.stringify(params)
        );

        const fetchDefaultAnnonces = async () => {
            try {
                setLoading(true);

                const res = await api.get(`/frontend/appels_offres/${countryCode}`);


                if (res.status == 201) {

                    console.log(res)
                    setTotal(res.data.total)
                    setAnnonces(res.data.data)
                }


            } catch (error) {
                console.error("Erreur chargement annonces", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultAnnonces();
    }, []);

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
            motsCles,
            types: selectedTypes,
            pays,
            villes: ville,
            secteurs,
            periode,
            dateDebut: dateDebut,
            dateFin: dateFin,
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

            const res = await api.post("/frontend/appels_offres_recherche", params);

            console.log(res)
            setTotal(res.data.total)
            setAnnonces(res.data.data)

            //  setAnnonces(res.data.data);
        } catch (error) {
            console.error("Erreur recherche", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecherche = async () => {
        try {
            const params = buildSearchParams();

            // 🔹 Sauvegarde en session
            sessionStorage.setItem(
                SEARCH_SESSION_KEY,
                JSON.stringify(params)
            );

            const res = await apiWithSession.post("/frontend/appels_offres_enregistrer", {
                criteres: params,
                nom: "Ma recherche personnalisée",
            });

            if (res.status == 201) {
                setIsOpenpopupSucces(true)
            }

        } catch (error: any) {

            if (error.response?.data?.code === "AUTH_REQUIRED") {
                // redirection login
                setIsOpenpopup(true)
                return;
            }

        }
    };

    const gotoLogin = async () => {
        router.push(`${process.env.LOCAL_HOST}/connexion`);
        setIsOpenpopup(false)
    }


    return (
        <div>
            <Header />
            <main >

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


                        {/* Types d'annonces */}
                        <div className="field ">
                            <label>Types d'annonces</label>
                            <div className='field-data type-chips field-data-1 field-data-1-top' >

                                {typeAnnonce.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`chip ${selectedTypes.includes(t) ? "active" : ""}`}
                                        onClick={() => toggleType(t)}
                                        aria-pressed={selectedTypes.includes(t)}
                                    >
                                        {t}
                                    </button>
                                ))}

                            </div>
                        </div>


                        {/* Mots-clés */}
                        <div className="field">
                            <label>Mots-clés</label>
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
                                        placeholder="Tapez un mot-clé et appuyez sur Entrée"
                                        value={motCleInput}
                                        onChange={(e) => setMotCleInput(e.target.value)}
                                        onKeyDown={addMotCle}
                                    />
                                </div>

                            </div>
                        </div>

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

                        {/* Secteur / Catégorie */}
                        <div className="field">
                            <label>Secteur / Catégorie</label>

                            <div className='field-data'>

                                <div className="tags">
                                    {secteurs.map((s, i) => (
                                        <span key={i} className="tag" onClick={() => toggleSelect(s, secteurs, setSecteurs)}>
                                            {CATEGORIE_LABELS[s]} ✕
                                        </span>
                                    ))}
                                </div>

                                <div className="action-ctn">
                                    <select
                                        onChange={(e) => toggleSelect(e.target.value, secteurs, setSecteurs)}
                                        defaultValue=""
                                    >
                                        <option value="">Sélectionner un secteur</option>
                                        {Object.entries(CATEGORIE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}

                                    </select>
                                </div>

                            </div>

                        </div>

                        <div className='more-option-ctn' onClick={() => setShowMore(!showMore)}>
                            <div className='more-option-label'>
                                Plus de critères {showMore ? "▲" : "▼"}
                            </div>
                            <div className='more-option-sepa'></div>
                        </div>


                        {/* Période et dates */}

                        {/* Secteur / Catégorie */}

                        {showMore && (<div>
                            <div className="field field-margin">
                                <label> Période rapide</label>

                                <div className='field-data field-data-ctn field-data-1-top'>

                                    <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
                                        <option value="">Choisir une période</option>
                                        {periodeOptions.map((p) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>



                                </div>

                            </div>

                            <div className="field">
                                <label>Plage de dates personnalisée</label>

                                <div className='field-data field-data-ctn field-data-1-top'>

                                    <div className='ctn-periode'>
                                        <span>Du</span>
                                        <input type="date" value={dateDebut || ""} onChange={(e) => setDateDebut(e.target.value)} />
                                    </div>

                                    <div className='ctn-periode'>
                                        <span>Au</span>
                                        <input type="date" value={dateFin || ""} onChange={(e) => setDateFin(e.target.value)} />
                                    </div>



                                </div>

                            </div>
                        </div>)}



                        {/* Boutons */}

                        <div className="field">
                            <label></label>

                            <div className='field-data field-data-ctn field-data-1-top field-data-2'>

                                <button className="btn-primary btn2" onClick={() => handleRecherche()}>Recherche</button>
                                <button className="btn-secondary btn2" onClick={() => handleSaveRecherche()}>Enregistrer la recherche</button>


                            </div>

                        </div>


                    </div>
                </div>

                <h2 className="recherche-ctn-txt">{`Resultat de recherche ( ${total} )`}</h2>
                <div className='annonce-list-ctn'>
                    <AnnonceList
                        annonces={annonces}
                        total={total}
                        currentpage={1} />
                </div>



            </main>
            <footer >

            </footer>
        </div>
    );
}




