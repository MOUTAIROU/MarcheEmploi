"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/Sidebar/page";
import LettreMotivation from "@/components/LettreMotivationPage/page";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";

interface Lettre {
    id: string;
    nom: string;
    telephone:string;
    candidat: any;
    lettre_motivation: string;
    statut: string;
}



export default function LettreMotivationPage() {
    const [candidatId, setCandidatId] = useState("");
    const [annonceID, setAnnonceID] = useState("");
    const [offreTab, setOffreTab] = useState<Lettre | null>(null);

    const params = useParams();

    useEffect(() => {
        const rawParam = params["lettre-motivation"];
        const value = Array.isArray(rawParam) ? rawParam[0] : rawParam;

        if (!value) return;

        // 1️⃣ Décoder l’URL
        const decoded = decodeURIComponent(value);

        // 2️⃣ Transformer en URLSearchParams
        const searchParams = new URLSearchParams(decoded);

        // 3️⃣ Récupérer les valeurs
        const candidatId = searchParams.get("candidats");
        const offreId = searchParams.get("offres");

        console.log("Candidat ID:", candidatId);
        console.log("Offre ID:", offreId);

        // Exemple
        if (candidatId && offreId) {
            setCandidatId(candidatId);
            setAnnonceID(offreId);
            getOffres(candidatId, offreId)
        }

    }, [params]);


    async function getOffres(post_id: string, offreId: string) {


        try {
            const response = await api.get(
                `entreprise_get/get_lettre_motivation/${post_id}/${offreId}`
            );

            const offre = response.data.data; // 👈 objet simple

            console.log(offre)
            if (!offre) return;


            setOffreTab(offre);
            // setAnnonceInfo(offre.candidats)



        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }

    function decodeHTML(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function reverse_treatment_msg(msg: string): string {
        if (!msg) return "";

        let result = msg
            .replace(/&nbsp;/g, " ")
            .replace(/<br\s*\/?>/gi, "\n") // gère les retours à la ligne
            .replace(/''/g, "'");

        // Décodage profond via DOM
        result = decodeHTML(result);
        result = decodeHTML(result); // une seconde passe si nécessaire
        result = decodeHTML(result); // une seconde passe si nécessaire
        result = decodeHTML(result); // une seconde passe si nécessaire
        result = decodeHTML(result); // une seconde passe si nécessaire

        return result;
    }


    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />

                    <div className="mainContent">


                        {offreTab && (
                            <LettreMotivation
                                data={{

                                    nomCandidat: offreTab.candidat.nom,
                                    telephone: offreTab.telephone,
                                    email: offreTab.candidat.email,
                                    lettre: reverse_treatment_msg(offreTab.lettre_motivation),
                                    statut: offreTab.statut ?? ""
                                }}
                            />
                        )}


                    </div>
                </div>
            </main>
        </div>
    );
}
