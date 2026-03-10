"use client";
import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/Sidebar/page";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Entreprise {
    nom: string;
    email: string;
    role: string;
}

interface OffreDetails {
    entreprise_id: string;
    title: string;
    ville: string;
    source: string;
}

interface CandidatInfo {
    nom: string;
    email: string;
}

interface EntretienCandidat {
    id: number;
    post_id: string;
    candidat_id: string;
    user_id: string;
    offre: string;
    responsable: string;
    date: string;
    heure: string;
    filenameBase: string;
    duree: string;
    type: "Présentiel" | "Visioconférence" | "Téléphonique";
    lieu: string | null;
    lien: string | null;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    entreprise?: Entreprise;
    candidato_info?: CandidatInfo;
    offre_details?: OffreDetails;
}

export default function EntretienDetailPage() {
    const [entretien, setEntretien] = useState<EntretienCandidat | null>(null);
    const params = useParams();
    const entretienRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const post_id_param = params["entretienID"];
        const post_id = Array.isArray(post_id_param)
            ? post_id_param[0]
            : post_id_param;

        if (!post_id) return;
        getEntretien(post_id);
    }, [params]);

    async function getEntretien(post_id: string) {
        try {
            const response = await api.get(
                `candidats/entretien_detail/${post_id}`
            );

            if (response.data.status === "success") {
                setEntretien(response.data.data);
            }
        } catch (error) {
            console.error("Erreur récupération entretien :", error);
        }
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const generatePDF = async () => {
        if (!entretienRef.current || !entretien) return;

        const canvas = await html2canvas(entretienRef.current, {
            scale: 3,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const pageHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", margin, margin, pageWidth, pageHeight);

        const fileName = `Convocation_Entretien_${entretien.candidato_info?.nom || "Candidat"
            }_${entretien.offre_details?.title || ""}.pdf`;

        pdf.save(fileName);
    };

    if (!entretien) return null;

    return (
        <main>
            <div className="container-dashbord">
                <Sidebar />

                <div className="mainContent">

                    {/* ACTIONS */}
                    <div className="entretien-actions">
                        <button className="btn-download" onClick={generatePDF}>
                            Télécharger la convocation PDF
                        </button>
                    </div>

                    {/* PDF CONTENT */}
                    <div className="entretien-card pdf-area" ref={entretienRef}>
                        <h1 className="title-main">
                            Convocation à un entretien de recrutement
                        </h1>

                        <p className="subtitle">
                            Nous avons le plaisir de vous inviter à participer à un entretien
                            dans le cadre du processus de recrutement.
                        </p>

                        <div className="info-grid">
                            <div>
                                <label>Référence entretien</label>
                                <p>{entretien.post_id}</p>
                            </div>

                            <div>
                                <label>Candidat</label>
                                <p>{entretien.candidato_info?.nom}</p>
                            </div>

                            <div>
                                <label>Email du candidat</label>
                                <p>{entretien.candidato_info?.email}</p>
                            </div>

                            <div>
                                <label>Poste concerné</label>
                                <p>{entretien.offre_details?.title}</p>
                            </div>

                            <div>
                                <label>Entreprise</label>
                                <p>{entretien.entreprise?.nom}</p>
                            </div>

                            <div>
                                <label>Email entreprise</label>
                                <p>{entretien.entreprise?.email}</p>
                            </div>

                            <div>
                                <label>Responsable de l’entretien</label>
                                <p>{entretien.responsable}</p>
                            </div>

                            <div>
                                <label>Date de l’entretien</label>
                                <p>{formatDate(entretien.date)}</p>
                            </div>

                            <div>
                                <label>Heure</label>
                                <p>{entretien.heure}</p>
                            </div>

                            <div>
                                <label>Type d’entretien</label>
                                <p>{entretien.type}</p>
                            </div>

                            {entretien.type === "Présentiel" && (
                                <div>
                                    <label>Lieu</label>
                                    <p>{entretien.lieu}</p>
                                </div>
                            )}

                            {entretien.type === "Visioconférence" && (
                                <div>
                                    <label>Lien de connexion</label>
                                    <p>{entretien.lien}</p>
                                </div>
                            )}
                        </div>

                        <div className="message-section">
                            <h3>Message de l’entreprise</h3>
                            <p>{entretien.message}</p>
                        </div>

                        <div className="footer">
                            <p>
                                Merci de confirmer votre présence en vous connectant à votre
                                espace candidat.
                            </p>
                            <p className="signature">
                                Service Recrutement — {entretien.entreprise?.nom}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
