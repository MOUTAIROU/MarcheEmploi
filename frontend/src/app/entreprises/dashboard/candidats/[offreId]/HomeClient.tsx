"use client";
import React, { useState, useEffect, useRef } from "react";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ActionCandidatModal from "@/components/modale/ActionCandidatModal/page";
import ActionCandidatGrouperModal from "@/components/modale/ActionCandidatGrouperModal/page";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";
import Pagination from "@/components/PaginationTap/Pagination";

const filters = [
    "Filtre",
    "Toutes",
    "Actives",
    "En évaluation",
    "En attente",
    "Acceptés",
    "Rejetés"
] as const;

type FilterKey = typeof filters[number];

const filterStatusMap: Record<FilterKey, string[]> = {
    "Filtre": [],
    "Toutes": [
        "APPLIED",
        "WAITING_EXAM",
        "COMPLETED",
        "ENTRETIEN_PROGRAMME",
        "PENDING",
        "ACCEPTE",
        "REJETE"
    ],

    "Actives": [
        "APPLIED",
        "WAITING_EXAM"
    ],

    "En évaluation": [
        "COMPLETED",
        "ENTRETIEN_PROGRAMME"
    ],

    "En attente": [
        "PENDING"
    ],

    "Acceptés": [
        "ACCEPTE"
    ],

    "Rejetés": [
        "REJETE"
    ]
};

interface QCMResult {
    has_qcm: boolean;
    passed: "reussi" | "echec";
    score: string; // ex: "20%"
}

interface Offre {
    id: string;
    annonce_id: string;
    user_id: string;
    titre: string;
    nom: string;
    email: string;
    status: "envoye" | "en_attente" | "refuse" | "accepte";
    lettre_motivation: boolean;
    qcmResult?: QCMResult;
}


const confirmLabels: Record<RowActionType, string> = {
    delete: "Supprimer",
    changer: "Modifier",
    notification: "Envoyer",
    note: "Enregistrer",
    tel: "Télécharger",
};



const actionsRow = [
    "Changer le statut",
    "Voir la lettre de motivation",
    "Voir le CV",
    "Envoyer notification",
    "Programmer un Entretien",
    "Supprimer",
];

const actions = [
    "Supprimer",
    "Changer le statut",
    "Envoyer notification",
    "Programmer un Entretien"
];

type ActionGroupeOption = (typeof actions)[number];
type GroupeActionType = "notification" | "delete" | "note" | "changer";

const groupe_action_type: Record<ActionGroupeOption, GroupeActionType | null> = {
    "Supprimer": "delete",
    "Changer le statut": "changer",
    "Envoyer notification": "notification",
    "Programmer un Entretien": null
};

const route_groupe_action: Record<ActionGroupeOption, string | null> = {
    "Supprimer": null,
    "Changer le statut": null,
    "Envoyer notificationt": null,
    "Programmer un Entretien": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/programmer-entretien/`
};

type ActionOption = (typeof actionsRow)[number];
type RowActionType = "notification" | "delete" | "note" | "tel" | "changer";


const row_action_type: Record<ActionOption, RowActionType | null> = {
    "Envoyer notification": "notification",
    "Voir la lettre de motivation": null,
    "Changer le statut": "changer",
    "Voir le CV": null,   // pas de modal → redirection
    "Programmer un Entretien": null,
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
    "Voir le CV": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/profil/`,
    "Envoyer notification": null,
    "Changer le statut": null,
    "Voir la lettre de motivation": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/lettre-motivation/`,
    "Programmer un Entretien": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/programmer-entretien/`,
    "Supprimer": null,
};



export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState<FilterKey>("Filtre");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<string | null>("");
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);


    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [annonceInfo, setAnnonceInfo] = useState<string | "">("");
    const [offreTab, setOffreTab] = useState<Offre[]>([]);

    const [actionType, setActionType] = useState<"notification" | "delete" | "note" | "tel" | "changer">("notification");
    const [actionGroupeType, setActionGroupeType] = useState<"notification" | "delete" | "note" | "changer">("notification");

    const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const [isError, setError] = useState(false);

    const router = useRouter();


    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const [annonceID, setAnnonceID] = useState<string>("");
    const rowMenuRef = useRef<HTMLDivElement>(null);
    const params = useParams();


    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {


        const post_id_param = params["offreId"];
        const post_id = Array.isArray(post_id_param) ? post_id_param[0] : post_id_param;

        if (!post_id) return;

        setAnnonceID(post_id)
        getOffres(post_id, page, limit);
    }, [params]);


    useEffect(() => {

        // aucun filtre et aucune recherche


        if (!search && selectedFilter === "Filtre") {
            getOffres(annonceID, page);
            return;
        }

        // recherche trop courte
        if (search && search.trim().length > 0 && search.trim().length < 3) return;

        const timer = setTimeout(() => {

            fetchCandidats(search, selectedFilter, page);

        }, 500);

        return () => clearTimeout(timer);

    }, [search, selectedFilter, page]);

    const fetchCandidats = async (searchValue: string, filterValue: FilterKey, pageNumber: number) => {


        const status = filterStatusMap[filterValue];

       
      
        try {

            const res = await api.get("entreprise_get/annonce_post_id_emploi_search_candidats", {
                params: {
                    post_id: annonceID,
                    search: searchValue,
                    filter: status,
                    page: pageNumber,
                    limit: 10
                }
            });

            setOffreTab(res.data.data.annonce);
            setTotal(res.data.total);

        } catch (error) {
            console.error(error);
        }

    };

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

    useEffect(() => {

        if (search.trim().length !== 0) return;
        getOffres(annonceID, page, limit);
    }, [page]);

    async function getOffres(post_id: string, pageNumber: number = 1, limit: number = 10) {


        // 🚫 bloquer si post_id est vide
        if (!post_id) {
            return;
        }

        try {


            const response = await api.get("entreprise_get/annonce_post_id_emploi", {
                params: {
                    post_id: post_id,
                    page: pageNumber,
                    limit: limit
                }
            });

            const offre = response.data.data; // 👈 objet simple


            if (!offre) return;

            setOffreTab(offre.annonce)
            setAnnonceInfo(offre.candidats)
            setTotal(response.data.total)


        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }

    const handleSelect = (value: FilterKey) => {
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



            // Extraire toutes les lignes depuis les IDs sélectionnés
            const rows = selectedOffres
                .map(id => offreTab.find(o => o.id === id))
                .filter(r => r !== undefined);

            // Séparer candidats et offres
            const candidats = rows.map(r => r!.email).join(",");
            const offresAssociees = rows.map(r => r!.annonce_id).join(",");


            router.push(`${route}/candidats=${encodeURIComponent(candidats)}&offres=${encodeURIComponent(offresAssociees)}`);
            return;
        }

        // 2️⃣ Sinon → ouvrir un modal adapté
        setCurrentAction(action);

        // Déterminer dynamiquement le type de modal
        const type = groupe_action_type[action];

        console.log(type, action)
        setActionGroupeType(type!);   // <<— nouvelle state utilisée par ton modal

        setIsModalOpenGroupe(true);
    };


    const handleRowAction = (action: ActionOption, id: string) => {
        setOpenRowMenu(null);

        const route = routes_action[action];
        const type = row_action_type[action];



        // Si route → redirection
        if (route) {
            const row = offreTab.find(o => o.id === id);



            router.push(`${route}/candidats=${row?.email}&offres=${row?.annonce_id}`);
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
            setSelectedOffres(offreTab.map((o) => o.id));
        }
        setSelectAll(!selectAll);
    };

    function treatment_msg_to_send(msg: string): string {
        if (!msg.trim()) return "";

        return msg
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "''")
            .replace(/\n/g, "<br>")
            .replace(/ /g, "&nbsp;");
    }


    const handleActionType = async (type: string, message: string, post_id: string,) => {




        if (type === "notification") {

            let res = await api.patch(`/entreprise_get/send_candidat_notification_emploi/${post_id}`, {
                statut: treatment_msg_to_send(message),
            });

            if (res.status == 201) {
                getOffres(annonceID, page, limit);

            }



        }

        if (type === "changer") {



            let res = await api.patch(`/entreprise_get/send_candidat_changer_status_emploi/${post_id}`, {
                statut: message,
            });

            if (res.status == 201) {
                getOffres(annonceID, page, limit);
            }



        }
        if (type === "delete") {


            let res = await api.delete(`/entreprise_get/send_candidat_delete_offres/${post_id}`);

            if (res.status == 201) {
                getOffres(annonceID, page, limit);
            }

        }
    }


    const handleGroupeActionType = async (type: string, message: string, post_id: string[]) => {


        if (type === "notification") {


            let res = await api.patch(`/entreprise_get/send_candidat_notification_group_emploi/${post_id}`, {
                statut: message,
            });

            if (res.status == 201) {
                getOffres(annonceID, page, limit);

            }


        }

        if (type === "changer") {



            let res = await api.patch(`/entreprise_get/send_candidat_changer_status_group_emploi/${post_id}`, {
                statut: message,
            });


            if (res.status == 201) {
                getOffres(annonceID, page, limit);
            }



        }
        if (type === "delete") {


            let res = await api.delete(`/entreprise_get/send_candidat_delete_offres_emploi_groupe/${post_id}`);

            if (res.status == 201) {
                getOffres(annonceID, page, limit);

            }

        }
    }

    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {showError && (
                        <PopupError
                            isOpen={showError}
                            title="Erreur"
                            message={errorMsg}
                            onClose={() => setShowError(false)}
                        />
                    )}

                    {showSuccess && (
                        <PopupSuccess
                            isOpen={showSuccess}
                            title="Success"
                            message={successMsg}
                            onClose={() => setShowSuccess(false)}
                        />
                    )}

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

                                        if (selectedCandidats) {
                                            handleGroupeActionType("delete", "null", selectedCandidats)
                                        }
                                        // API - supprimer
                                        break;

                                    case "changer":
                                        console.log("Nouveau statut :", newStatus, "pour :", selectedCandidats);

                                        if (selectedCandidats && newStatus) {
                                            handleGroupeActionType("changer", newStatus, selectedCandidats)
                                        }
                                        // API - changer statut
                                        break;

                                    case "notification":
                                        console.log("Notification envoyée à :", "message :", newStatus, selectedCandidats);

                                        if (selectedCandidats && newStatus) {
                                            handleGroupeActionType("notification", newStatus, selectedCandidats)
                                        }
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

                                        if (selectedCandidatId) {
                                            handleActionType("delete", "null", selectedCandidatId);
                                        }
                                        // API - supprimer
                                        break;

                                    case "changer":
                                        console.log("Nouveau statut :", newStatus, "pour :", selectedCandidatId);

                                        if (selectedCandidatId && newStatus) {
                                            handleActionType("changer", newStatus, selectedCandidatId)
                                        }

                                        // API - changer statut
                                        break;

                                    case "notification":
                                        console.log("Notification envoyée à :", "message :", newStatus, selectedCandidatId);

                                        if (selectedCandidatId && newStatus) {
                                            handleActionType("notification", newStatus, selectedCandidatId)
                                        }
                                        // API - envoyer notif
                                        break;


                                }

                                setIsModalOpen(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />



                        <div className="header">
                            <h2>{annonceID}</h2>
                        </div>

                        <div className="actions">
                            <div className="searchWrapper">

                                <input
                                    type="text"
                                    placeholder="Rechercher par nom du candidat"
                                    className="search"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />

                            </div>
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
                                        {filters.map((option) => (
                                            <div
                                                key={option}
                                                className="dropdownItem"
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option}
                                            </div>
                                        ))}
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
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Lettre de motivation</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offreTab.map((offre, index) => {

                                    return (
                                        <tr key={offre.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOffres.includes(offre.id)}
                                                    onChange={() => handleSelectOne(offre.id)} /></td>

                                            <td>{index}</td>
                                            <td>{offre.nom}</td>
                                            <td>{offre.email}</td>
                                            <td>


                                                <span
                                                    className={`status ${offre.status === "accepte"
                                                        ? "active"
                                                        : "expired"
                                                        }`}
                                                >
                                                    {offre.status}
                                                </span>

                                            </td>



                                            <td>
                                                {offre.lettre_motivation ? "💌 Oui" : "—"}
                                            </td>
                                            <td className='param-btn'>
                                                <button
                                                    className='gearButton'
                                                    onClick={() =>
                                                        setOpenRowMenu(openRowMenu === offre.id ? null : offre.id)
                                                    }
                                                >
                                                    ⚙️
                                                </button>

                                                {openRowMenu === offre.id && (
                                                    <div className='dropdownRow' ref={rowMenuRef}>
                                                        {actionsRow.map((action) => (
                                                            <div
                                                                key={action}
                                                                className='dropdownItem'
                                                                onClick={() => handleRowAction(action, offre.id)}
                                                            >
                                                                {action}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>

                        <Pagination
                            page={page}
                            setPage={setPage}
                            total={total}
                            limit={limit}
                        />

                    </div>
                </div>
            </main >
        </div >


    );
}
