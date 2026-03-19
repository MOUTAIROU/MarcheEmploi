'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import api from "@/lib/axiosInstance";

type NotificationChannel = "email" | "whatsapp" | "internal";
type NotificationFrequency = "immediate" | "daily" | "silent";

type CandidateNotificationType =
    | "emploi"
    | "actualites"
    | "entretien"
    | "whatsapp"

const LABELS: Record<CandidateNotificationType, string> = {
    emploi: "Alertes d'emploi",
    actualites: "Actualités du site",
    entretien: "Entretiens (programmation & rappels)",
    whatsapp: "Notifications WhatsApp",
};

type CandidateNotificationConfig = {
    enabled: boolean;
    channels: NotificationChannel[];
    frequency: NotificationFrequency;
};

type CandidateNotificationSettings = Record<
    CandidateNotificationType,
    CandidateNotificationConfig
>;

const initialSettings: CandidateNotificationSettings = {
    emploi: {
        enabled: true,
        channels: ["email"],
        frequency: "immediate",
    },
    actualites: {
        enabled: true,
        channels: ["email"],
        frequency: "daily",
    },
    entretien: {
        enabled: true,
        channels: ["email"],
        frequency: "immediate",
    },
    whatsapp: {
        enabled: false,
        channels: ["whatsapp"],
        frequency: "immediate",
    },

};




export default function Home() {


    const [settings, setSettings] =
        useState<CandidateNotificationSettings>(initialSettings);


    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchPreferences();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        try {
            await api.post("/users/cand_preferences", {
                settings,
            });

            setMessage("✅ Préférences sauvegardées");
        } catch (e) {
            setMessage("❌ Erreur lors de la sauvegarde");
        } finally {
            setLoading(false);
        }
    };


    const toggleEnabled = (type: CandidateNotificationType) => {
        setSettings(prev => ({
            ...prev,
            [type]: { ...prev[type], enabled: !prev[type].enabled }
        }));
    };

    const changeFrequency = (
        type: CandidateNotificationType,
        frequency: NotificationFrequency
    ) => {
        setSettings(prev => ({
            ...prev,
            [type]: { ...prev[type], frequency }
        }));
    };

    const toggleChannel = (
        type: CandidateNotificationType,
        channel: NotificationChannel
    ) => {
        setSettings(prev => {
            const current = prev[type];
            const exists = current.channels.includes(channel);

            return {
                ...prev,
                [type]: {
                    ...current,
                    channels: exists
                        ? current.channels.filter(c => c !== channel)
                        : [...current.channels, channel],
                },
            };
        });
    };



    async function fetchPreferences() {
        try {
            const res = await api.get("/users/get_cand_preferences");
            if (!res.data?.data) return;

        
            setSettings({
                ...initialSettings,
                ...res.data.data.settings, // backend retourne la même structure
            });
        } catch (e) {
            console.error("Erreur récupération préférences", e);
        }
    }




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


                            {Object.entries(settings).map(([type, config]) => (
                                <div key={type} className="notification-item">
                                    <h3>{LABELS[type as CandidateNotificationType]}</h3>

                                    {/* Activation */}
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.enabled}
                                            onChange={() => toggleEnabled(type as CandidateNotificationType)}
                                        />
                                        Activer
                                    </label>

                                    {/* Channels */}
                                    
                                   

                                    {/* Frequency */}
                                    <label>Fréquence : </label>
                                    <select
                                        value={config.frequency}
                                        disabled={!config.enabled}
                                        onChange={(e) =>
                                            changeFrequency(
                                                type as CandidateNotificationType,
                                                e.target.value as NotificationFrequency
                                            )
                                        }
                                    >
                                        <option value="immediate">Immédiate</option>
                                        <option value="daily">Quotidienne</option>
                                        <option value="silent">Silencieuse</option>
                                    </select>

                                    <hr />
                                </div>
                            ))}


                            <button className="save" onClick={handleSave}>Enregistrer les préférences</button>

                        </div>







                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




