"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import LettreMotivation from "@/components/LettreMotivationPage/page";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";

interface Lettre {
    id: string;
    nom: string;
    telephone: string;
    candidat: any;
    lettre_motivation: string;
    statut: string;
}







export default function LettreMotivationPage() {
    const [candidatId, setCandidatId] = useState("");
    const [pdf, setpdf] = useState("");

    const params = useParams();

    useEffect(() => {

        console.log(params)
        const rawParam = params["pdf"];
        const value = Array.isArray(rawParam) ? rawParam[0] : rawParam;

        if (!value) return;

        // 1️⃣ Décoder l’URL
        const decoded = decodeURIComponent(value);

        setpdf(decoded)

        console.log(decoded)

    }, [params]);




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

    console.log(`${process.env.SERVER_HOST}/uploads/pdf/${pdf}`)

    return (
        <div>
            <main>
                <div className="container-dashbord">


                    {pdf && (
                        <iframe
                            src={`/api/pdf/${pdf}`}
                            width="100%"
                            height="700"
                            style={{ border: "none" }}
                        />
                    )}



                </div>
            </main>
        </div>
    );
}
