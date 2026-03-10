"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ActionCandidatModal from "@/components/modale/ActionCandidatModal/page";
import ActionCandidatGrouperModal from "@/components/modale/ActionCandidatGrouperModal/page";
import { useRouter } from "next/navigation";


import PopupError from '@/components/modale/Popup/PopupError/page'

interface CandidatureAppelOffre {
    id: string;
    entreprise: string;
    email: string;
    statut: string;
    devis: string; // URL ou lien vers PDF
    technique: string; // URL ou lien vers proposition technique
    docsLegaux: string;
    scoreQCM?: string;
}


const candidatures: CandidatureAppelOffre[] = [
    {
        id: "AOF-2025-1209-001",
        entreprise: "TechPlus SARL",
        email: "contact@techplus.com",
        statut: "Soumis",
        devis: "Voir",
        technique: "Voir",
        docsLegaux: "OK",
        scoreQCM: "—"
    },
    {
        id: "AOF-2025-1209-002",
        entreprise: "Belleck Group",
        email: "info@belleck.com",
        statut: "En révision",
        devis: "Voir",
        technique: "Voir",
        docsLegaux: "Manque IFU",
        scoreQCM: "—"
    },
    {
        id: "AOF-2025-1209-003",
        entreprise: "WebDigital SA",
        email: "admin@webdigital.com",
        statut: "Accepté",
        devis: "Voir",
        technique: "Voir",
        docsLegaux: "OK",
        scoreQCM: "—"
    }
];

const confirmLabels: Record<RowActionType, string> = {
    delete: "Supprimer",
    changer: "Modifier",
    notification: "Envoyer",
    note: "Enregistrer",
    tel: "Télécharger",
};

const actionsRow = [
    "Visualiser le profil",
    "Envoyer notification",
    "Changer le statut",
    "Tél. devis",
    "Tél. prop. technique",
    "Tél. docs légaux",
    "Supprimer",
];

const actions = [
    "Supprimer",
    "Changer le statut",
    "Envoyer notification",
];

type ActionGroupeOption = (typeof actions)[number];
type GroupeActionType = "notification" | "delete" | "note" | "changer";

const groupe_action_type: Record<ActionGroupeOption, GroupeActionType | null> = {
    "Supprimer": "delete",
    "Changer le statut": "changer",
    "Envoyer notification": "notification",
};

const route_groupe_action: Record<ActionGroupeOption, string | null> = {
    "Supprimer": null,
    "Changer le statut": null,
    "Envoyer notificationt": null,
};

type ActionOption = (typeof actionsRow)[number];
type RowActionType = "notification" | "delete" | "note" | "tel" | "changer";

const row_action_type: Record<ActionOption, RowActionType | null> = {
    "Visualiser le profil": null,
    "Envoyer notification": "notification",
    "Changer le statut": "changer",
    "Tél. devis": "tel",   // pas de modal → redirection
    "Tél. prop. technique": "tel",
    "Tél. docs légaux": "tel",
    "Supprimer": "delete",
};

const modalTitles: Record<RowActionType, string> = {
    notification: "Envoyer une notification",
    delete: "Supprimer le candidat",
    note: "Ajouter une note",
    tel: "Télécharger le document",
    changer: "Changer le statut",
};


const routes_action: Record<ActionOption, string | null> = {
    "Visualiser le profil": `${process.env.LOCAL_HOST}/entreprises/profile/entreprise/`,
    "Envoyer notification": null,
    "Changer le statut": null,
    "Tél. devis": null,
    "Tél. prop. technique": null,
    "Tél. docs légaux": null,
    "Supprimer": null,
};


export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"notification" | "delete" | "note" | "tel" | "changer">("notification");
    const [actionGroupeType, setActionGroupeType] = useState<"notification" | "delete" | "note" | "changer">("notification");
    const [currentAction, setCurrentAction] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);


    const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");

    const router = useRouter();


    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Si clic dans FILTRE → ne pas fermer
            if (filterRef.current?.contains(target)) return;

            // Si clic dans GROUP ACTION → ne pas fermer
            if (groupRef.current?.contains(target)) return;


            // Si clic dans le menu d’action d’une ligne → ne pas fermer
            if (rowMenuRef.current?.contains(target)) return;

            // Sinon → FERMER TOUT
            setFilterOpen(false);
            setGroupOpen(false);
            setOpenRowMenu(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelectedFilter(value);
        setFilterOpen(false);
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




    const handleGroupAction = (action: ActionGroupeOption) => {

        if (selectedOffres.length === 0) {
            setError(true);
            setErrorMsg("Veuillez sélectionner au moins une offre.");
            return;
        }

        setSelectedCandidats(selectedOffres);

        const ids = selectedOffres.join(",");


        // 1️⃣ Vérifier si l'action possède une route
        const route = route_groupe_action[action];
        if (route) {
            router.push(`${route}/${ids}`);
            return;
        }

        // 2️⃣ Sinon → ouvrir un modal adapté
        setCurrentAction(action);

        // Déterminer dynamiquement le type de modal
        const type = groupe_action_type[action];

        console.log(type,action)
        setActionGroupeType(type!);   // <<— nouvelle state utilisée par ton modal

        setIsModalOpenGroupe(true);
    };


    const handleRowAction = (action: ActionOption, id: string) => {
        setOpenRowMenu(null);

        const route = routes_action[action];
        const type = row_action_type[action];

        // Si route → redirection
        if (route) {
            router.push(`${route}${id}`);
            return;
        }

        // Sinon → modal

        setCurrentAction(action);

        setActionType(type!);
        setSelectedCandidatId(id);
        setIsModalOpen(true);
    };



    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOffres([]);
        } else {
            setSelectedOffres(candidatures.map((o) => o.id));
        }
        setSelectAll(!selectAll);
    };


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="mainContent">

                        <ActionCandidatGrouperModal
                            title={actionGroupeType ? modalTitles[actionGroupeType] : ""}
                            isOpen={isModalOpenGroupe}
                            actionType={actionGroupeType}
                            selectedCandidatsCount={selectedCandidats.length} // nombre de candidats sélectionnés
                            onClose={() => setIsModalOpenGroupe(false)}
                            onConfirm={(newStatus) => {
                                if (!actionGroupeType) return;

                                switch (actionGroupeType) {

                                    case "delete":
                                        console.log("Suppression confirmée pour :", selectedCandidats);
                                        // API - supprimer
                                        break;

                                    case "changer":
                                        console.log("Nouveau statut :", newStatus, "pour :", selectedCandidats);
                                        // API - changer statut
                                        break;

                                    case "notification":
                                        console.log("Notification envoyée à :", "message :", newStatus, selectedCandidats);
                                        // API - envoyer notif
                                        break;

                                    
                                }

                                setIsModalOpenGroupe(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />

                        <ActionCandidatModal
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

                                    case "note":
                                        console.log("Note enregistrée pour :", selectedCandidatId);
                                        // API - enregistrer note
                                        break;

                                    case "tel":
                                        console.log("Téléchargement document pour :", selectedCandidatId);
                                        // Pas vraiment un modal normalement → mais selon ton UI
                                        break;
                                }

                                setIsModalOpen(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />

                        {isError && (
                            <PopupError
                                isOpen={isError}
                                title="Erreur"
                                message={isErrorMsg}
                                onClose={() => setError(false)}
                            />
                        )}


                        <div className="header">
                            <h2>Candidats . Développeur React . Liste des candidats</h2>
                        </div>

                        <div className="actions">
                            <input
                                type="text"
                                placeholder="Rechercher par titre / référence"
                                className="search"
                            />
                            {/* === FILTRE === */}
                            <div className="filterWrapper" ref={filterRef}>
                                <button
                                    className="filter"
                                    onClick={() => setFilterOpen(!isFilterOpen)}
                                >
                                    {selectedFilter}
                                </button>

                                {isFilterOpen && (
                                    <div className="dropdown">
                                        {["Filtre", "Toutes", "Actives", "Expirées", "Brouillons", "Publier", "Remettre en ligne"].map(
                                            (option) => (
                                                <div
                                                    key={option}
                                                    className="dropdownItem"
                                                    onClick={() => handleSelect(option)}
                                                >
                                                    {option}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>


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
                                    <div className="dropdown">
                                        {actions.map((action) => (
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
                                            onChange={handleSelectAll}
                                        /></th>
                                    <th>ID</th>
                                    <th>Entreprise</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Devis</th>
                                    <th>Proposition technique</th>
                                    <th>Docs légaux</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidatures.map((c, index) => (
                                    <tr key={index}>
                                        <input
                                            type="checkbox"
                                            checked={selectedOffres.includes(c.id)}
                                            onChange={() => handleSelectOne(c.id)} />
                                        <td>{c.id}</td>
                                        <td>{c.entreprise}</td>
                                        <td>{c.email}</td>
                                        <td>{c.statut}</td>

                                        <td className="clickable">📄 {c.devis}</td>
                                        <td className="clickable">📄 {c.technique}</td>

                                        <td>
                                            {c.docsLegaux === "OK"
                                                ? "📁 OK"
                                                : `❌ ${c.docsLegaux}`
                                            }
                                        </td>


                                        <td className="clickable">
                                            <div className="actionWrapper" style={{ position: "relative" }}>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // IMPORTANT : ne ferme pas immédiatement !
                                                        setOpenRowMenu(openRowMenu === c.id ? null : c.id);
                                                    }}
                                                >
                                                    ⚙️
                                                </span>

                                                {openRowMenu === c.id && (
                                                    <div className="dropdownRow" ref={rowMenuRef}>
                                                        {actionsRow.map((action) => (
                                                            <div
                                                                key={action}
                                                                className="dropdownItem"
                                                                onClick={() => handleRowAction(action, c.id)}
                                                            >
                                                                {action}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
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
