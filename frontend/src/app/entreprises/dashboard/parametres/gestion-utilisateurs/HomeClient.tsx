"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import Link from "next/link";
import PopupError from '@/components/modale/Popup/PopupError/page'
import ActionGestionCandidatsGrouperModal from '@/components/modale/ActionGestionUtilisateursGrouperModal/page'
import ActionGestionCandidatsModal from '@/components/modale//ActionGestionUtilisateursModal/page'
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";



interface Collaborateur {
    id: number;           // id dans la base (ex: 5)
    nom: string;          // nom du collaborateur (ex: "Jean Dupont")
    email: string;        // email (ex: "mbastouabdele55@gmail.com")
    role: string;         // rôle (ex: "Recruteur")
    accepted: boolean;    // si accepté ou non (0 -> false, 1 -> true)
}

interface CollaborateurTable extends Collaborateur {
    statut: "Active" | "Bloquer" | "En attente";
}

const actions = [
    "❌ Supprimer"
];



type ActionOptionGroup = (typeof actions)[number];

type GroupActionType = "delete";

const group_action_type: Record<ActionOptionGroup, GroupActionType | null> = {
    "❌ Supprimer": "delete",
};
type ActionGroupOption = (typeof actions)[number];

const routes_action: Record<ActionGroupOption, string | null> = {
    "❌ Supprimer": null,
    "📴 Suspendre": null
};


const actionsRow = [
    "✏️ Modifier rôle",
    "❌ Supprimer"
];


type ActionOption = (typeof actionsRow)[number];

type RowActionType = "delete" | "modifier";


const row_action_type: Record<ActionOption, RowActionType | null> = {
    "❌ Supprimer": "delete",
    "✏️ Modifier rôle": "modifier"
};


const row_routes_action: Record<ActionOption, string | null> = {
    "❌ Supprimer": null,
    "✏️ Modifier rôle": null,
};



export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"delete" | "suspend">("delete");
    const [currentActionType, setCurrentActionType] = useState<"delete" | "suspend" | "modifier">("delete");
    const [currentAction, setCurrentAction] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [usersTab, setUsersTab] = useState<CollaborateurTable[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");

    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowId, setRowId] = useState<string>("");


    const router = useRouter();


    const rowMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getOffres();
    }, []);

    async function getOffres() {
        try {
            const response = await api.get("entreprise_get/get_utilisateurs");
            const entreprise = response.data?.data;
            if (!entreprise) return;

            console.log("📦 Données entreprise :", entreprise);

            // 🔹 Transformer accepted → statut
            const usersMapped = entreprise.map(mapCollaborateurToOffre);
            setUsersTab(usersMapped);

        } catch (error) {
            console.error("❌ Erreur récupération entreprise :", error);
        }
    }



    // Fermer les menus si clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Si clic dans FILTRE → ne pas fermer
            if (filterRef.current?.contains(target)) return;

            // Si clic dans GROUP ACTION → ne pas fermer
            if (groupRef.current?.contains(target)) return;

            // Si clic dans "Créer une offre" → ne pas fermer
            // if (btnOffreAppelRef.current?.contains(target)) return;

            // Si clic dans le menu d’action d’une ligne → ne pas fermer
            if (rowMenuRef.current?.contains(target)) return;

            // Sinon → FERMER TOUT
            setFilterOpen(false);
            setGroupOpen(false);
            // setBtnOffreAppelOpen(false);
            setOpenRowMenu(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSelect = (value: string) => {
        setSelectedFilter(value);
        setFilterOpen(false);
    };

    const handleGroupAction = (action: string) => {
        if (selectedOffres.length === 0) {
            setError(true)
            setErrorMsg("Veuillez sélectionner au moins une offre.")
            return;
        }

        const ids = selectedOffres.join(",");

        // 1️⃣ Vérifier si l'action possède une route
        const route = routes_action[action];
        if (route) {
            router.push(`${route}/${ids}`);
            return;
        }

        // 2️⃣ Sinon → ouvrir un modal adapté
        setCurrentAction(action);



        // Déterminer dynamiquement le type de modal
        const type = group_action_type[action];
        if (type) {
            setActionType(type);
        }

        setIsOpen(true);


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

        if (type) {
            setCurrentActionType(type);
        }
        setRowId(id);
        setIsRowModalOpen(true);
    };





    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOffres([]);
        } else {
            setSelectedOffres(usersTab.map((o) => o.id.toString()));
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


    const applyGroupAction = async (newDate?: string) => {
        console.log("Action appliquée :", currentAction);
        console.log("Offres sélectionnées :", selectedOffres);

        const emailsToDelete = usersTab
            .filter(user => selectedOffres.includes(user.id.toString())) // on garde ceux sélectionnés
            .map(user => user.email); // on prend uniquement l'email

        console.log("Emails à supprimer :", emailsToDelete);

        if (currentAction == "❌ Supprimer") {
            const res = await api.delete(`/entreprise/delete_collaborateurs_groupe/${emailsToDelete}`);

            console.log(res)
        }

        setIsOpen(false);
    };

    const applyRowAction = async (payload?: any) => {
        console.log("Action row :", currentAction);
        console.log("ID cible :", rowId);
        console.log("Payload :", payload)



        const recruteur = usersTab.find(item => item.id == parseInt(rowId))

        console.log(recruteur)

        if (currentAction == "✏️ Modifier rôle") {

            let res = await api.patch(`/entreprise/modifer_colaborateur/${recruteur?.email}`, {
                payload
            });

            console.log(res)
            if (res.status == 201) {
                getOffres();

            }

        }

        if (currentAction == "❌ Supprimer") {

            let res = await api.delete(`/entreprise/detele_colaborateur/${recruteur?.email}`);

            console.log(res)

            if (res.status == 201) {
                getOffres();

            }




        }
        setIsRowModalOpen(false);
    };


    // Transforme accepted en statut lisible pour le tableau
    const mapAcceptedToStatut = (accepted: boolean): "Active" | "Bloquer" | "En attente" => {
        return accepted ? "Active" : "En attente"; // ici, tu peux ajouter un cas "Bloquer" si nécessaire
    };

    // Transforme un Collaborateur en objet pour le tableau
    const mapCollaborateurToOffre = (c: Collaborateur) => ({
        ...c,
        statut: mapAcceptedToStatut(c.accepted),
    });


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <ActionGestionCandidatsGrouperModal

                            title={currentAction}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            onConfirm={(message) => applyGroupAction(message)}
                            actionType={actionType}
                            confirmLabel={`Confirmer ${currentAction}`}

                        />

                        <ActionGestionCandidatsModal
                            title={currentAction}
                            isOpen={isRowModalOpen}
                            onClose={() => setIsRowModalOpen(false)}
                            onConfirm={(data) => applyRowAction(data)}
                            actionType={currentActionType}     // "note" | "notification" | "delete"
                            confirmLabel={`Confirmer ${currentAction}`}
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
                            <h2>Parametre . Gestion des utilisateurs . collaborateurs</h2>
                            <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/parametres/ajouter-collaborateur`}>
                                <button className="createButton">➕ Ajouter un collaborateur</button>
                            </Link>

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
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Nom complet</th>
                                    <th>Rôle</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersTab.map((offre) => (
                                    <tr key={offre.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.id.toString())}
                                                onChange={() => handleSelectOne(offre.id.toString())}
                                            /></td>
                                        <td>{offre.nom}</td>
                                        <td>{offre.role}</td>
                                        <td>{offre.email}</td>
                                        <td>
                                            <span
                                                className={`status ${offre.statut === "Active"
                                                    ? "active"
                                                    : offre.statut === "Bloquer"
                                                        ? "wait"
                                                        : "expired"
                                                    }`}
                                            >
                                                {offre.statut}
                                            </span>
                                        </td>
                                        <td className='param-btn'>
                                            <button
                                                className='gearButton'
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === offre.id.toString() ? null : offre.id.toString())
                                                }
                                            >
                                                ⚙️
                                            </button>

                                            {openRowMenu === offre.id.toString() && (
                                                <div className='dropdownRow' ref={rowMenuRef}>
                                                    {actionsRow.map((action) => (
                                                        <div
                                                            key={action}
                                                            className='dropdownItem'
                                                            onClick={() => handleRowAction(action, offre.id.toString())}
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
            </main >
        </div >


    );
}
