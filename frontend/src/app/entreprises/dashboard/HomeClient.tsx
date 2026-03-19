'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AlertListe from "@/components/AlertListe/page";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";

interface DashboardStats {
    stats: {
        offres_total: number;
        candidatures_total: number;
        qcm_total: number;
        notifications_non_lues: number;
    };
    offres_detail: any; // ou typage précis si tu veux
    derniers_messages: any[];
    profile: {
        logo: string;
        nom: string;
    }


}




export default function Home() {

    const [start, setStart] = useState<DashboardStats | null>(null);

    const [offreTab, setOffreTab] = useState<any[]>([]);

    const [messagesList, setMessagesList] = useState<any[]>([]);





    useEffect(() => {
        getOffres();
        // return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

     const formatDashboardMessage = (notif: any) => {
        if (!notif) return null;


        const titre = notif.message?.title || "Notification";
        const texte = notif.message?.message || "";
        const dateIso = notif.date || notif.message?.meta?.created_at;

        const date = new Date(dateIso);

        const dateFormatee = date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short"
        });

        const heureFormatee = date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });

        return {
            titre,
            texte: `${texte} — ${dateFormatee} à ${heureFormatee}`,
            date: dateIso
        };
    };
    
    async function getOffres() {



        const response = await api.get("entreprise_get/dashbord_starts");

        const { data, status } = response

        if (status == 201) {

            setOffreTab(data.data)
            setStart(data.data)

            let derniers_messages = data.data.derniers_messages

            const messagesDashboard = derniers_messages.map(formatDashboardMessage);

            setMessagesList(messagesDashboard)


        }






        // return response.data;
    }


   

    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">
                        <div className="header-main-dashbord">
                            <div className="userInfo">




                                <div className="avatar">
                                    {start && (


                                        <Image
                                            src={`${process.env.SERVER_HOST}/uploads/${start.profile.logo}`}
                                            alt={`Logo de ${start.profile.nom}`}
                                            width={400}
                                            height={500}
                                            className="entreprise-logo-home"
                                        />

                                    )}

                                </div>
                                {start && (
                                    <span className="userName">{start.profile.nom || ""}</span>
                                )}

                            </div>
                        </div>


                        <section className="stats section-dashboard">
                            <h3>Statistique</h3>
                            <div className="cards">

                                {start && (
                                    <div className="card">
                                        <h2>{start.stats.offres_total || 0}</h2>
                                        <p>Offres publiées</p>
                                    </div>
                                )}


                                {start && (
                                    <div className="card">
                                        <h2>{start.stats.candidatures_total || 0}</h2>
                                        <p>Candidatures reçues</p>
                                    </div>
                                )}

                                {start && (
                                    <div className="card">
                                        <h2>{start.stats.qcm_total || 0}</h2>
                                        <p>QCM passés</p>
                                    </div>
                                )}
                                {start && (
                                    <div className="card">
                                        <h2>{start.stats.notifications_non_lues || 0}</h2>
                                        <p>Alertes récentes</p>
                                    </div>
                                )}



                            </div>
                        </section>



                        <div className='annonce-list-ctn-dashbord-titre'>
                            <h3>Alertes récentes</h3>
                        </div>
                        <div className='annonce-list-ctn'>
                            {messagesList.length > 0 && <AlertListe annonces={messagesList} />}

                        </div>

                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




