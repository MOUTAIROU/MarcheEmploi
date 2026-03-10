"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ActionCandidatModal from "@/components/modale/ActionCandidatModal/page";
import ActionCandidatGrouperModal from "@/components/modale/ActionCandidatGrouperModal/page";

import PopupError from '@/components/modale/Popup/PopupError/page'

interface Offre {
    id: string;
    titre: string;
    email: string;
    scoreqcm: number;
    statut: string;
    cv: string;
    lettremotivation: string;
}

const offres: Offre[] = [
    {
        id: "AOF-2025-1209-001",
        titre: "Développeur React",
        email: "Développeur React",
        scoreqcm: 66.66,
        cv: "lien de cv",
        statut: "Accepter",
        lettremotivation: "Active",
    },
    {
        id: "AOF-2025-1209-002",
        titre: "Développeur React",
        email: "Développeur React",
        scoreqcm: 66.66,
        cv: "lien de cv",
        statut: "Accepter",
        lettremotivation: "Active",
    },
    {
        id: "AOF-2025-1209-003",
        titre: "Développeur React",
        email: "Développeur React",
        scoreqcm: 66.66,
        cv: "lien de cv",
        statut: "Refuser",
        lettremotivation: "Active",
    },
];

export default function OffresPage() {



    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="mainContent">

                        

                        <div className="header">
                            <h2>CV</h2>
                        </div>

                       



                    </div>
                </div>
            </main >
        </div >


    );
}
