'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
interface Candidature {
    offre: string;
    entreprise: string;
    lieu: string;
    date: string;
    lien:string;
}

const candidatures: Candidature[] = [
    { offre: "Développeur Web", entreprise: "TechCorp", lieu: "Cotonou", date: "12 Oct 2025",lien:"http://192.168.79.101:3500/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1"  },
    { offre: "Assistant RH", entreprise: "Humania", lieu: "Cotonou", date: "12 Oct 2025",lien:"http://192.168.79.101:3500/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1" },
    { offre: "Directeur", entreprise: "WebLink", lieu: "Externe", date: "10 Oct 2025",lien:"http://192.168.79.101:3500/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1" },
    { offre: "Community Manager", entreprise: "AgriDagba", lieu: "Cotonou", date: "12 Oct 2025",lien:"http://192.168.79.101:3500/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1" },
    { offre: "Secrétaire", entreprise: "DTS Com", lieu: "Cotonou", date: "09 Oct 2025",lien:"http://192.168.79.101:3500/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1" },
    { offre: "Comptable", entreprise: "FastPharn", lieu: "Cotonou", date: "05 Oct 2025",lien:"http://192.168.79.101:3500/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1" },
];
export default function Home() {


    const getStatutColor = (statut: string) => {
        switch (statut) {
            case "En cours": return "gold";
            case "En attente d’examen": return "orange";
            case "Examen terminé": return "green";
            case "Sélectionné pour entretien": return "dodgerblue";
            case "Accepté / Recruté": return "limegreen";
            case "Refusé": return "red";
            default: return "gray";
        }
    };


    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">


                       <div className="titre-content"> <h3>Offres sauvegardées</h3></div>

                       <div className='offre-alertes-btn'>
                              <Link className='offre-btn' href={`${process.env.LOCAL_HOST}/emploi/dashboard/offres-sauvegarder`}>Offres sauvegardées</Link> 
                              <Link className='alertes-btn'href={`${process.env.LOCAL_HOST}/emploi/dashboard/alertes`}>Alertes</Link> 
                       </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Offre</th>
                                    <th>Entreprise</th>
                                    <th>Lieu</th>
                                    <th>Date d'ajout</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidatures.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.offre}</td>
                                        <td>{item.entreprise}</td>
                                        <td>{item.lieu} </td>
                                        <td>{item.date}</td>
                                        <td>
                                            <span>
                                                <Link href={item.lien} className="link">🔗 Voir</Link> / <a href="#" className="link">❌ Supprimer</a></span>
                                        </td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>



                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




