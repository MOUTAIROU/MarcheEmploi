"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ProfilCandidat from "@/components/ProfilCandidat/page";

import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";



export default function OffresPage() {


    const [candidatId, setCandidatId] = useState("");
    const [annonceID, setAnnonceID] = useState("");
    // CV du candidat (contenu texte ou base64)
    const [offreTab, setOffreTab] = useState<any | null>(null);

    // Nom du fichier CV
    const [annonceInfo, setAnnonceInfo] = useState<string>("");

    const params = useParams();

    useEffect(() => {


        console.log(params)

        const rawParam = params["cv"];

        const value = Array.isArray(rawParam) ? rawParam[0] : rawParam;

        if (!value) return;

       
    
            setCandidatId(value);
             getOffres(value)
      

    }, [params]);


    async function getOffres(post_id: string) {


        try {
            const response = await api.get(
                `entreprise_get/get_cv_candidat_user_id/${post_id}`
            );

            const offre = response.data.data; // 👈 objet simple

            if (!offre) return;

            console.log(offre.cv)
            console.log(offre.cv.filenameBase)
            setOffreTab(offre.cv.cv);
            setAnnonceInfo(offre.cv.filenameBase)



        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="mainContent">

                        {offreTab && (
                            <ProfilCandidat
                                data={offreTab}
                                imgProfile={annonceInfo}

                            />

                        )}



                    </div>
                </div>
            </main >
        </div >


    );
}
