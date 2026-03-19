'use client';
import './style.css';
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page";
import api from "@/lib/axiosInstance";
import Link from "next/link";

interface Parametre {
    icon: string;
    label: string;
    lien: string;
}

const parametres: Parametre[] = [
    { icon: "👤", label: "Profil", lien: `${process.env.LOCAL_HOST}/emploi/dashboard/parametres/parametres-profile` },
    { icon: "🔒", label: "Mots de passe", lien: `${process.env.LOCAL_HOST}/emploi/dashboard/parametres/mots-de-passe` },
    { icon: "🔔", label: "Notifications", lien: `${process.env.LOCAL_HOST}/emploi/dashboard/parametres/preferences-notification` },
    { icon: "🕵️‍♂️", label: "Supprimer-compte", lien: `${process.env.LOCAL_HOST}/emploi/dashboard/parametres/supprimer-compte` },
    { icon: "🕵️‍♂️", label: "Confidentialité", lien: `${process.env.LOCAL_HOST}/emploi/dashboard/parametres/confidentialite` },
];




export default function Home() {




    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">


                        <div className="titre-content"> <h3>Parametre</h3></div>

                        <div className='container-btn'>
                            {parametres.map((item, i) => (
                                <Link href={item.lien} key={i} className="card">
                                    <div className='icon'>{item.icon}</div>
                                    <div className="label">{item.label}</div>
                                </Link>
                            ))}

                        </div>







                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




