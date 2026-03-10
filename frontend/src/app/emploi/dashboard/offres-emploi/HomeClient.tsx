'use client';
import './style.css';
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from '@/components/header/page'
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import ActionEmploiModal from "@/components/modale/ActionEmploiModal/page";
import { useRouter } from "next/navigation";

interface Candidature {
    id: string;
    offre: string;
    entreprise: string;
    lieu: string;
    date: string;
    lien: string;
}
const actions = ["❌ Supprimer", "🔗 Voir"];
type ActionOption = (typeof actions)[number];

type GroupeType = "notification" | "delete" | "note" | "changer";

const action_type: Record<ActionOption, GroupeType | null> = {
    "❌ Supprimer": "delete",
    "🔗 Voir": "changer",
};

const route_action: Record<ActionOption, string | null> = {
    "❌ Supprimer": null,
    "🔗 Voir": "string",
};

const confirmLabels: Record<GroupeType, string> = {
    delete: "Supprimer",
    changer: "Modifier",
    notification: "Envoyer",
    note: "Enregistrer"
};

const modalTitles: Record<GroupeType, string> = {
    notification: "Envoyer une notification",
    delete: "Supprimer cette offre",
    note: "Ajouter une note",
    changer: "Changer le statut",
};



const candidatures: Candidature[] = [
    { id: "AOF-2025-1209-001", offre: "Développeur Web", entreprise: "TechCorp", lieu: "Cotonou", date: "12 Oct 2025", lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1` },
    { id: "AOF-2025-1209-002", offre: "Assistant RH", entreprise: "Humania", lieu: "Cotonou", date: "12 Oct 2025", lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1` },
    { id: "AOF-2025-1209-003", offre: "Directeur", entreprise: "WebLink", lieu: "Externe", date: "10 Oct 2025", lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1` },
    { id: "AOF-2025-1209-004", offre: "Community Manager", entreprise: "AgriDagba", lieu: "Cotonou", date: "12 Oct 2025", lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1` },
    { id: "AOF-2025-1209-005", offre: "Secrétaire", entreprise: "DTS Com", lieu: "Cotonou", date: "09 Oct 2025", lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1` },
    { id: "AOF-2025-1209-006", offre: "Comptable", entreprise: "FastPharn", lieu: "Cotonou", date: "05 Oct 2025", lien: `${process.env.LOCAL_HOST}/annonces/termes-de-reference-relatif-au-mandat-pour-levaluation-externe-du-1` },
];

export default function Home() {

    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState<string>("");
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);

    // 🔥 états de la modale supprimer
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOffreId, setSelectedOffreId] = useState<string | null>(null);

    const [actionType, setActionType] = useState<"notification" | "delete" | "note" | "changer">("notification");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectAll, setSelectAll] = useState(false);

    const rowMenuRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

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

    const handleRowAction = (action: ActionOption, id: string) => {
        setOpenRowMenu(null);


        const route = route_action[action];
        const type = action_type[action];

        // Si route → redirection
        if (route) {
            const candidature = candidatures.find(c => c.id === id);

            if (!candidature) {
                console.error("ID introuvable :", id);
                return;
            }

            router.push(candidature.lien);

            return;
        }

        // Sinon → modal

        setCurrentAction(action);

        setActionType(type!);
        setSelectedCandidatId(id);
        setIsModalOpen(true);
    };


    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">

                        <ActionEmploiModal
                            title={actionType ? modalTitles[actionType] : ""}
                            isOpen={isModalOpen}
                            actionType={actionType}
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={(newStatus) => {
                                if (!actionType) return;

                                switch (actionType) {

                                    case "delete":
                                        console.log("Suppression confirmée pour :", selectedCandidatId);
                                        // API - supprimer
                                        break;

                                    case "changer":
                                        console.log("Nouveau statut :", newStatus, "pour :", selectedCandidatId);
                                        // API - changer statut
                                        break;

                                    case "notification":
                                        console.log("Notification envoyée à :", "message :", newStatus, selectedCandidatId);
                                        // API - envoyer notif
                                        break;


                                }

                                setIsModalOpen(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />


                        <div className="titre-content"> <h3>Alertes / Offres sauvegardées</h3></div>

                        <div className='offre-alertes-btn'>
                            <Link className='offre-btn' href={`${process.env.LOCAL_HOST}/emploi/dashboard/offres-sauvegarder`}>Offres sauvegardées</Link>
                            <Link className='alertes-btn' href={`${process.env.LOCAL_HOST}/emploi/dashboard/alertes`}>Alertes</Link>
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
                                        
                                        <td className="param-btn">
                                            <button
                                                className="gearButton"
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === item.id ? null : item.id)
                                                }
                                            >
                                                ⚙️
                                            </button>

                                            {openRowMenu === item.id && (
                                                <div className="dropdownRow" ref={rowMenuRef}>
                                                    {actions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className="dropdownItem"
                                                            onClick={() => handleRowAction(action, item.id)}
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

            </main>
            <footer >

            </footer>
        </div>
    );
}




