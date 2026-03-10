'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";

interface Parametre {
    icon: string;
    label: string;
    lien: string;
}

const parametres: Parametre[] = [
    { icon: "👤", label: "Profil", lien: "#" },
    { icon: "🔒", label: "Sécurité", lien: "#" },
    { icon: "🔔", label: "Notifications", lien: "#" },
    { icon: "🕵️‍♂️", label: "Confidentialité", lien: "#" },
];


const getTypeIcon = (type: string) => {
    switch (type) {
        case "Offre d’emploi":
            return "💼";
        case "QCM":
            return "📝";
        case "Entretien":
            return "📞";
        default:
            return "🔔";
    }
};

const getStatutColor = (statut: string) => {
    switch (statut) {
        case "Non lu": return "red";
        case "Lu": return "green";
        case "Expirée": return "gray";
        default: return "black";
    }
};

export default function Home() {


    const [visibleProfil, setVisibleProfil] = useState(false);
    const [contactDirect, setContactDirect] = useState(false);


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
                                <button className={`tab active`}>Parametre</button>
                                <button className='tab'>Préférences de notification</button>
                            </div>


                            <div className="preferences">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={visibleProfil}
                                        onChange={() => setVisibleProfil(!visibleProfil)}
                                    />
                                    Recevoir les alerts d'emploi par Email
                                </label>

                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={contactDirect}
                                        onChange={() => setContactDirect(!contactDirect)}
                                    />
                                    Recevoir les alerts par Whatsapp
                                </label>

                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={contactDirect}
                                        onChange={() => setContactDirect(!contactDirect)}
                                    />
                                    Recevoir les actualités du site
                                </label>
                            </div>

                            <button className="save">Enregistrer les préférences</button>

                        </div>







                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




