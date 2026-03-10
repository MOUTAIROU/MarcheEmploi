"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SidebarEntreprises/page";
import DeleteCandidatsModal from "@/components/modale/DeleteCandidatsModal/page";
import ActionGrouperModal from "@/components/modale/ActionGrouperCandidatsModal/page";
import PopupError from '@/components/modale/Popup/PopupError/page'

import "./style.css";

interface Offre {
    id: string;
    titre: string;
    type: string;
    dateExp: string;
    nbreCandidatures: number;
    statut: "Active" | "En attente" | "Expirée";
}

const actionsGroupe = [
    "Supprimer",
    "Associer un QCM"
];

const offres: Offre[] = [{
    id: "AOF-2025-1209-001",
    titre: "Développeur React",
    type: "Emploi",
    dateExp: "12 Oct 2025",
    nbreCandidatures: 8,
    statut: "Active",
},
{
    id: "AOF-2025-1209-002",
    titre: "Chef de Projet",
    type: "Emploi",
    dateExp: "12 Oct 2025",
    nbreCandidatures: 8,
    statut: "En attente"
},
{
    id: "AOF-2025-1209-003",
    titre: "Fourniture IT",
    type: "Appel d’offres",
    dateExp: "12 Oct 2025",
    nbreCandidatures: 8,
    statut: "Expirée",
},];

export default function OffresPage() {
    const router = useRouter();

    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);

    const [selectAll, setSelectAll] = useState(false);

    // 🔥 états de la modale supprimer
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOffreId, setSelectedOffreId] = useState<string | null>(null);

    const rowMenuRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            // si clique DANS un des menus → ne rien fermer
            if (
                (filterRef.current && filterRef.current.contains(event.target as Node)) ||
                (groupRef.current && groupRef.current.contains(event.target as Node)) ||
                (rowMenuRef.current && rowMenuRef.current.contains(event.target as Node))
            ) {
                return;
            }

            // sinon on ferme tout
            setFilterOpen(false);
            setGroupOpen(false);
            setOpenRowMenu(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🔥 ACTIONS LIGNES
    const handleRowAction = (action: string, id: string) => {
        setOpenRowMenu(null); // ferme le menu



        const type_offre = offres.find((o) => o.id === id)?.type;



        if (action === "Supprimer") {
            setSelectedOffreId(id);
            setDeleteModalOpen(true);
            return;
        }


        if (action === "Liste") {

            if (type_offre == "Emploi") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/${id}`);
            }else{
                  router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/appel-offre/${id}`);
            }

            return;
        }

        if (action === "Associer un QCM") {

            router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/${id}`);
            return;
        }
    };

    // 🔥 CONFIRMATION SUPPRESSION
    const confirmDelete = (id: string) => {
        console.log("Vous avez supprimé :", id);

        // TODO: appel API DELETE ici

        setDeleteModalOpen(false);
        setSelectedOffreId(null);
    };

    const handleGroupAction = (action: string) => {

        if (selectedOffres.length === 0) {
            setError(true)
            setErrorMsg("Veuillez sélectionner au moins une offre.")
            return;
        }

        setCurrentAction(action);
        setGroupOpen(false);

        if (action === "Supprimer") {
            setIsModalOpen(true); // ouvre le modal
        } else if (action === "Associer un QCM") {
            const ids = selectedOffres.join(",");
            //router.push(`/entreprises/dashboard/qcm-examen/associer-qcm/group?ids=${ids}`);
            router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/${ids}`);


        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOffres([]);
        } else {
            setSelectedOffres(offres.map((o) => o.id));
        }
        setSelectAll(!selectAll);
    };



    // Gérer la sélection individuelle
    const handleSelectOne = (id: string) => {
        if (selectedOffres.includes(id)) {
            // Si déjà sélectionné → retirer
            setSelectedOffres(selectedOffres.filter((offreId) => offreId !== id));
        } else {
            // Sinon → ajouter
            setSelectedOffres([...selectedOffres, id]);
        }
    };

    const actions = ["Supprimer", "Liste", "Associer un QCM"];



    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />

                    <div className="mainContent">

                        {isError && (
                            <PopupError
                                isOpen={isError}
                                title="Erreur"
                                message={isErrorMsg}
                                onClose={() => setError(false)}
                            />
                        )}

                        <h2>Candidats</h2>

                        <div className="actions">
                            <input
                                type="text"
                                placeholder="Rechercher par titre / référence"
                                className="search"
                            />



                            {/* === ACTIONS GROUPEES === */}
                            <div className="filterWrapper" ref={groupRef}>
                                <button
                                    className="groupAction"
                                    onClick={() => {
                                        setGroupOpen(!isGroupOpen);
                                        setFilterOpen(false); // ferme l'autre menu
                                    }}
                                >
                                    Actions groupées
                                </button>
                                {isGroupOpen && (
                                    <div className="dropdown" >
                                        {actionsGroupe.map((action) => (
                                            <div
                                                key={action}
                                                className="dropdownItemRow"
                                                onClick={() => handleGroupAction(action)}
                                            >
                                                {action}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        /></th>
                                    <th>ID</th>
                                    <th>Titre</th>
                                    <th>Type</th>
                                    <th>Date Exp</th>
                                    <th>Candidatures</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {offres.map((offre) => (
                                    <tr key={offre.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.id)}
                                                onChange={() => handleSelectOne(offre.id)}
                                            /></td>
                                        <td>{offre.id}</td>
                                        <td>{offre.titre}</td>
                                        <td>{offre.type}</td>
                                        <td>{offre.dateExp}</td>
                                        <td>👤 {offre.nbreCandidatures}</td>

                                        <td className="param-btn">
                                            <button
                                                className="gearButton"
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === offre.id ? null : offre.id)
                                                }
                                            >
                                                ⚙️
                                            </button>

                                            {openRowMenu === offre.id && (
                                                <div className="dropdownRow" ref={rowMenuRef}>
                                                    {actions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className="dropdownItem"
                                                            onClick={() => handleRowAction(action, offre.id)}
                                                        >
                                                            {action}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🔥 MODALE SUPPRIMER */}
                <DeleteCandidatsModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    offreId={selectedOffreId}
                />

                <ActionGrouperModal
                    title="Supprimer les offres"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => {
                        // ici tu peux appeler ton API pour supprimer
                        console.log("Suppression confirmée pour :", selectedOffres);
                        setSelectedOffres([]); // reset la sélection
                        setIsModalOpen(false);
                    }}
                    confirmLabel="Supprimer"
                />
            </main>
        </div>
    );
}
