"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";

interface Offre {
    id: string;
    plan: string;
    prix: string;
    debut: string;
    fin: string;
    facture: string;
}

const offres: Offre[] = [
    {
        id: "AOF-2025-1209-001",
        plan: "1 mois",
        prix: "10 000",
        debut: "11-04-25",
        fin: "11-05-25",
        facture: "line"
    },
    {
        id: "AOF-2025-1209-002",
        prix: "10 000",
        plan: "1 mois",
        debut: "11-04-25",
        fin: "11-05-25",
        facture: "line"
    },
    {
        id: "AOF-2025-1209-003",
        plan: "1 mois",
        debut: "11-04-25",
        prix: "10 000",
        fin: "11-05-25",
        facture: "line"
    },
    {
        id: "AOF-2025-1209-004",
        plan: "1 mois",
        prix: "10 000",
        debut: "11-04-25",
        fin: "11-05-25",
        facture: "line"
    },
];

export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);


    // Fermer les menus si clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node) &&
                groupRef.current &&
                !groupRef.current.contains(event.target as Node)
            ) {
                setFilterOpen(false);
                setGroupOpen(false);
                setOpenRowMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelectedFilter(value);
        setFilterOpen(false);
    };

    const handleGroupAction = (action: string) => {
        alert(`Action sélectionnée : ${action}`);
        setGroupOpen(false);
    };

    const handleRowAction = (action: string, id: string) => {
        alert(`Action “${action}” sur l’offre ${id}`);
        setOpenRowMenu(null);
    };

    const actions = [
        "❌ Supprimer",
        "📴 Suspendre"
    ];

    const actionsRow = [
        "✏️ Modifier rôle",
        "📴 Suspendre",
        "❌ Supprimer"
    ];


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">


                        <div className="header">
                            <h2>Parametre . Facturation </h2>
                        </div>

                        <div className="actions">
                            <input
                                type="text"
                                placeholder="Rechercher par titre / référence"
                                className="search"
                            />
                            


                            

                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Plan</th>
                                    <th>Prix</th>
                                    <th>Debut</th>
                                    <th>Fin</th>
                                    <th>Facture</th>
                                </tr>
                            </thead>
                            <tbody>

     
                                {offres.map((offre) => (
                                    <tr key={offre.id}>

                                        <td><input type="checkbox" /></td>
                                        <td>{offre.plan}</td>
                                        <td>{offre.prix}</td>
                                        <td>{offre.debut}</td>
                                        <td>{offre.fin}</td>
                                        <td>📄 Facture</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>



                    </div>
                </div>
            </main >
        </div >


    );
}
