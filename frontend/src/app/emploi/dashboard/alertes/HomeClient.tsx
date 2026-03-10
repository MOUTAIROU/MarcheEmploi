'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
interface Alerte {
    type: "Offre d’emploi" | "QCM" | "Entretien";
    message: string;
    date: string;
    statut: "Non lu" | "Lu" | "Expirée";
    lien: string;
}
 

const alertes: Alerte[] = [
    {
        type: "Offre d’emploi",
        message: "Nouvelle offre : Développeur Web chez TechCorp",
        date: "12 Oct 2025",
        statut: "Non lu",
        lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1`
    },
    {
        type: "QCM",
        message: "Votre QCM pour le poste d’Assistant RH est disponible",
        date: "11 Oct 2025",
        statut: "Lu",
        lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1`
    },
    {
        type: "Entretien",
        message: "Entretien prévu avec WebLink le 14 Oct 2025 à 10h00",
        date: "10 Oct 2025",
        statut: "Non lu",
        lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1`
    },
    {
        type: "Offre d’emploi",
        message: "Offre Directeur chez AgriDagba clôturée",
        date: "09 Oct 2025",
        statut: "Expirée",
        lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1`
    },
];


const getTypeIcon = (type: string) => {
    switch (type) {
        case "Offre d’emploi":
            return "💼";
        case "QCM":
            return "📝";
        case "Entretien":
            return "📞";
        default:
            return "🔔";
    }
};

const getStatutColor = (statut: string) => {
    switch (statut) {
        case "Non lu": return "red";
        case "Lu": return "green";
        case "Expirée": return "gray";
        default: return "black";
    }
};

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


                        <div className="titre-content"> <h3>Alertes</h3></div>
                       
                         
                        <div className='offre-alertes-btn'>
                            <Link className='offre-btn' href={`${process.env.LOCAL_HOST}/emploi/dashboard/offres-sauvegarder`}>Offres sauvegardées</Link>
                            <Link className='alertes-btn' href={`${process.env.LOCAL_HOST}/emploi/dashboard/alertes`}>Alertes</Link>

                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alertes.map((a, i) => (
                                    <tr key={i}>
                                        <td>
                                            <span className="type">
                                                {getTypeIcon(a.type)} {a.type}
                                            </span>
                                        </td>
                                        <td>{a.message}</td>
                                        <td>{a.date}</td>
                                        <td>
                                            <span
                                                className="statut"
                                                style={{ color: getStatutColor(a.statut) }}
                                            >
                                                {a.statut}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={a.lien} className="link">Voir</Link>
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




