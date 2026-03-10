"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/Sidebar/page";
import ActionCandidatModal from "@/components/modale/ActionCandidatModal/page";
import ActionCandidatGrouperModal from "@/components/modale/ActionCandidatGrouperModal/page";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
interface Props {
    annonce_id: string
}

interface Annonce {
    id: string;
    titre: string;
    contenu: string;
    localisation: string;
    montant: string;
    datePublication: string;
    statut: string;
    reste: string;
    pdfUrl?: string;
}


export default function OffresPage() {

  
    const { annonce_id } = useParams<{ annonce_id: string }>();

    const [annonce, setAnnonce] = useState<Annonce | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnnonce() {
            try {
                // ⚠️ remplace ceci par ton vrai endpoint API :
                // const res = await fetch(`/api/annonces/${annonce_id}`);
                // const data = await res.json();

                // Simulation (à remplacer)
                const data: Annonce = {
                    id: annonce_id,
                    titre:
                        "Termes de Référence relatif au Mandat pour l’évaluation externe du projet Droits et Devoirs des Ouvriers Agricoles dans les exploitations de Production d’Ananas dans les Communes productrices d’Ananas",
                    contenu:
                        "Le secteur de la production d’ananas constitue l’un des piliers de l’économie agricole dans plusieurs communes du pays. Toutefois, malgré sa contribution significative à la création d’emplois et aux revenus des ménages ruraux, les conditions de travail des ouvriers agricoles demeurent souvent précaires.\n\nC’est dans ce contexte que le projet « Droits et Devoirs des Ouvriers Agricoles » a été mis en œuvre. Son objectif global est de promouvoir un environnement de travail plus équitable et conforme aux normes sociales et professionnelles..\n\nC’est dans ce contexte que le projet « Droits et Devoirs des Ouvriers Agricoles » a été mis en œuvre. Son objectif global est de promouvoir un environnement de travail plus équitable et conforme aux normes sociales et professionnelles.",
                    localisation: "Benin",
                    montant: "60 000 000 000 F CFA",
                    datePublication: "Le 2 Oct 2025",
                    statut: "En cours",
                    reste: "Reste 1 mois",
                    pdfUrl: "/docs/annonce-BJ-2444.pdf",
                };

                setAnnonce(data);
            } catch (error) {
                console.error("Erreur lors du chargement :", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnnonce();
    }, [annonce_id]);

    if (loading) return <div className="loading">Chargement...</div>;
    if (!annonce) return <div className="error">Annonce introuvable.</div>;




    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="mainContent">

                        <div className="">
                            <div className="">
                                <div className="card-header">
                                    <div className="left">
                                        <span className="badge">{annonce.statut}</span>
                                        <a className="share-link" href="#">
                                            Partager
                                        </a>
                                    </div>
                                    <div className="right">
                                        <span className="reste">{annonce.reste}</span>
                                    </div>
                                </div>

                                <h1 className="titre">{annonce.titre}</h1>

                                <div className="ctas">
                                    {annonce.pdfUrl && (
                                        <a className="btn btn-secondary" href={annonce.pdfUrl} download>
                                            Télécharger doc PDF
                                        </a>
                                    )}
                                    <button className="btn btn-primary">Postuler maintenant</button>
                                </div>

                                <div className="content">
                                    {annonce.contenu.split("\n\n").map((p, i) => (
                                        <p key={i} className="para">
                                            {p}
                                        </p>
                                    ))}
                                </div>

                                <div className="infos">
                                    <div className="info-item">
                                        <label>Localisation</label>
                                        <p className="info-val nowrap">{annonce.localisation}</p>
                                    </div>

                                    <div className="info-item">
                                        <label>Montant</label>
                                        <p className="info-val nowrap">{annonce.montant}</p>
                                    </div>

                                    <div className="info-item">
                                        <label>Publié le</label>
                                        <p className="info-val nowrap">{annonce.datePublication}</p>
                                    </div>
                                </div>

                                <div className="actions">
                                    <button className="action btn-ghost">Enregistrer</button>
                                    <button className="action btn-outline">Voir profil</button>
                                    <button className="action btn-danger">Signaler</button>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </main >
        </div >


    );
}
