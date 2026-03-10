"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ProfilCandidat from "@/components/ProfilCandidat/page";



export default function OffresPage() {



    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="mainContent">

                        <ProfilCandidat
                            data={{
                                "profile": "<p>je suis super bon en programation</p>",
                                "informations": {
                                    "Prénom": "MOUTAIROU",
                                    "Nom de famille": "Bastou",
                                    "Emploi recherché": "Web developpeur",
                                    "Adresse e-mail": "mbastouabdele55@gmail.com",
                                    "Numéro de téléphone": "0196375061",
                                    "Adresse": "Cotonou apkapla",
                                    "Ville": "Cotonou",
                                    "Date de naissance": "2025-11-13",
                                    "Nationalité": "Beninoise",
                                    "Autre": "Travail a la mairie",
                                    "Champs Personnel": "J'aime les voiture"
                                },
                                "formations": [
                                    {
                                        "id": 1762961069595.4395,
                                        "titre": "License informatique",
                                        "etablissement": "Lokossa",
                                        "ville": "Lokossa",
                                        "debutMois": "Janvier",
                                        "debutAnnee": "2020",
                                        "finMois": "Janvier",
                                        "finAnnee": "2021",
                                        "enCours": false,
                                        "description": "<p>Je suis licence en informatique</p>"
                                    },
                                    {
                                        "id": 1762961069595.771,
                                        "titre": "ing Ai",
                                        "etablissement": "Infor dev",
                                        "ville": "Paris",
                                        "debutMois": "Janvier",
                                        "debutAnnee": "2025",
                                        "finMois": "",
                                        "finAnnee": "",
                                        "enCours": true,
                                        "description": "<p><br></p>"
                                    }
                                ],
                                "experiences": [
                                    {
                                        "id": 1762961069595.2834,
                                        "titre": "Promoteur de Fastpharma",
                                        "etablissement": "Fastphrame",
                                        "ville": "Cotnou",
                                        "debutMois": "Janvier",
                                        "debutAnnee": "2020",
                                        "finMois": "Janvier",
                                        "finAnnee": "2022",
                                        "enCours": false,
                                        "description": "<p>remplir</p>"
                                    },
                                    {
                                        "id": 1762961069595.5798,
                                        "titre": "Comptabiliter",
                                        "etablissement": "Cotonou",
                                        "ville": "Cotonou",
                                        "debutMois": "Juillet",
                                        "debutAnnee": "2020",
                                        "finMois": "Mai",
                                        "finAnnee": "2022",
                                        "enCours": false,
                                        "description": ""
                                    }
                                ],
                                "competences": [
                                    {
                                        "nom": "Developpeur web ",
                                        "niveau": "Intermédiaire"
                                    },
                                    {
                                        "nom": "Developpeur NextJS",
                                        "niveau": "Expert"
                                    },
                                    {
                                        "nom": "Adobe XD",
                                        "niveau": "Intermédiaire"
                                    }
                                ],
                                "langues": [
                                    {
                                        "nom": "Français",
                                        "niveau": "Avancé"
                                    },
                                    {
                                        "nom": "Goun",
                                        "niveau": "Intermédiaire"
                                    }
                                ],
                                "centres": [
                                    "Programmation",
                                    "Lecture",
                                    "1Xbet"
                                ],
                                "cours": [
                                    {
                                        "id": 1762938655543,
                                        "titre": "Certificat Matlab",
                                        "mois": "Février",
                                        "annee": "2023",
                                        "description": "<p>j'ai ce certificats pour le compte des xxx</p>",
                                        "enCours": false
                                    },
                                    {
                                        "id": 1762938702369,
                                        "titre": "ReactJS",
                                        "mois": "Janvier",
                                        "annee": "2025",
                                        "description": "<p>J'ai pris le certificats grace a la formation en ligne sur Openclassroom</p>",
                                        "enCours": false
                                    },
                                    {
                                        "id": 1762938754974,
                                        "titre": "Comptabilité",
                                        "mois": "",
                                        "annee": "2025",
                                        "description": "<p><br></p>",
                                        "enCours": true
                                    }
                                ],
                                "stages": [
                                    {
                                        "id": 1762961069596.2302,
                                        "titre": "Developpeure Web",
                                        "etablissement": "ORION",
                                        "ville": "Cotonou",
                                        "debutMois": "Janvier",
                                        "debutAnnee": "2000",
                                        "finMois": "Janvier",
                                        "finAnnee": "2006",
                                        "enCours": false,
                                        "description": ""
                                    },
                                    {
                                        "id": 1762961069596.8691,
                                        "titre": "Informaticien",
                                        "etablissement": "SOC",
                                        "ville": "Cotonou",
                                        "debutMois": "Janvier",
                                        "debutAnnee": "2010",
                                        "finMois": "",
                                        "finAnnee": "",
                                        "enCours": true,
                                        "description": ""
                                    }
                                ],
                                "activités": [
                                    {
                                        "id": 1762961069596.5464,
                                        "titre": "Benevole pour une ONG",
                                        "etablissement": "ONG ASANA",
                                        "ville": "Porto Novo",
                                        "debutMois": "Janvier",
                                        "debutAnnee": "2020",
                                        "finMois": "Mars",
                                        "finAnnee": "2021",
                                        "enCours": false,
                                        "description": "<p>ffeef</p>"
                                    },
                                    {
                                        "id": 1762961069596.8845,
                                        "titre": "Medecin sans frontier",
                                        "etablissement": "ONG santer plus",
                                        "ville": "Malanvile",
                                        "debutMois": "Juin",
                                        "debutAnnee": "2000",
                                        "finMois": "Mai",
                                        "finAnnee": "",
                                        "enCours": true,
                                        "description": ""
                                    }
                                ],
                                "References": [
                                    {
                                        "nom": "MOUTAIROU Bastou",
                                        "entreprise": "Marcheemploi",
                                        "ville": "Cotonou",
                                        "telephone": "0196969612",
                                        "email": "badarounayra@gmail.com",
                                        "id": 1762961069597.3545
                                    },
                                    {
                                        "nom": "MOUTAIROU",
                                        "entreprise": "ISKINE",
                                        "ville": "COTONOU",
                                        "telephone": "0196532496",
                                        "email": "yoa@gmaiL.com",
                                        "id": 1762961069597.613
                                    }
                                ],
                                "qualites": [
                                    "Programmation",
                                    "Lecture",
                                    "Jeux vidéo",
                                    "PS4"
                                ],
                                "certificats": [
                                    {
                                        "id": 1762940284775,
                                        "titre": "Certificat en finance et masterClase",
                                        "mois": "Janvier",
                                        "annee": "2025",
                                        "description": "<p>j'ai eu ce certificat aux cours de ma formation de </p>",
                                        "enCours": false
                                    },
                                    {
                                        "id": 1762940308209,
                                        "titre": "Maitre conferencier",
                                        "mois": "",
                                        "annee": "2025",
                                        "description": "<p><br></p>",
                                        "enCours": true
                                    }
                                ],
                                "realisations": [
                                    "Mise en place de solutions logicielles innovantes ayant amélioré la productivité de l'équipe de 25%.",
                                    "J'ai participer a la creation du site web officiel du site les pendjarie",
                                    "J'ai participer a l'elaboration du plan de comptabiliter de l'année 2025 pour le compte de la sociter de gestion Produit alimentaire aux benin",
                                    "Développement d’une application mobile utilisée par plus de 10 000 utilisateurs."
                                ],
                                "signature": {
                                    "nom": "MOUTAIROU Bastou",
                                    "ville": "Abidjan",
                                    "date": "12/11/2025",
                                    "consentement": "J’atteste sur l’honneur que les informations ci-dessus sont exactes et sincères."
                                },
                                "rubriquesPersonnalisees": [
                                    {
                                        "id": 1762959608588,
                                        "titre": "toto",
                                        "description": "<p>f</p>",
                                        "lien": "dd",
                                        "date": "dd"
                                    },
                                    {
                                        "id": 1762959624138,
                                        "titre": "",
                                        "description": "",
                                        "lien": "",
                                        "date": ""
                                    },
                                    {
                                        "id": 1762961193444,
                                        "titre": "",
                                        "description": "",
                                        "lien": "",
                                        "date": ""
                                    }
                                ]
                            }

                            }
                        />






                    </div>
                </div>
            </main >
        </div >


    );
}
