"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ActionCandidatModal from "@/components/modale/ActionCandidatModal/page";
import ActionCandidatGrouperModal from "@/components/modale/ActionCandidatGrouperModal/page";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axiosInstance";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'
import Pagination from "@/components/PaginationTap/Pagination";
import { cp } from "fs";


const filters = [
    "Filtre",
    "Toutes",
    "En entretien",
    "En attente",
    "Acceptés",
    "Rejetés"
] as const;

type FilterKey = typeof filters[number];

const filterStatusMap: Record<FilterKey, string[]> = {
    "Filtre": [],
    "Toutes": [
        "ENTRETIEN_PROGRAMME",
        "PENDING",
        "ACCEPTE",
        "REJETE"
    ],

    "En entretien": [
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

export interface CandidatureAnnonce {
    id: number;
    annonce_id: string;              // ex: AOF-BJ-2026-20260102-1002
    user_id: string;                 // ID du candidat
    nom: string;                     // Nom du candidat
    email: string;
    telephone: string;

    message?: string | null;         // Message du candidat
    fichier_pdf?: string | null;     // Devis / CV / PDF
    metadata?: any | null;           // Données complémentaires (JSON)

    statut:
    | "envoye"
    | "en_revision"
    | "accepte"
    | "rejete";

    createdAt: string;               // ISO date
    updatedAt: string;               // ISO date
}




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
    "Voir la lettre de motivation",
    "Programmer un Entretien",
    "Tél. doc. technique",
    "Changer le statut",
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
    "Voir la lettre de motivation": null,
    "Programmer un Entretien": null,
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
    "Visualiser le profil": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/profile/`,
    "Voir la lettre de motivation": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/lettre-motivation/`,
    "Programmer un Entretien": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/programmer-entretien/`,
    "Envoyer notification": null,
    "Changer le statut": null,
    "Tél. doc. technique": `${process.env.LOCAL_HOST}/entreprises/dashboard/documents/`
    ,
};



export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState<FilterKey>("Filtre");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"notification" | "delete" | "note" | "tel" | "changer">("notification");
    const [actionGroupeType, setActionGroupeType] = useState<"notification" | "delete" | "note" | "changer">("notification");
    const [currentAction, setCurrentAction] = useState<string>("");
    const [annonceID, setAnnonceID] = useState<string>("");
    const [offreTab, setOffreTab] = useState<CandidatureAnnonce[]>([]);
    const [annonceInfo, setAnnonceInfo] = useState<string | "">("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);


    const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const [isError, setError] = useState(false);

    const truncate = (text?: string, max = 60) =>
        text && text.length > max
            ? text.slice(0, max) + "..."
            : text || "";

    const router = useRouter();


    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;



    const params = useParams();
    useEffect(() => {

        const post_id_param = params["appel-offre"];
        const post_id = Array.isArray(post_id_param) ? post_id_param[0] : post_id_param;

        if (!post_id) return;

        setAnnonceID(post_id)
        getOffres(post_id, page, limit);
    }, [params]);

    async function getOffres(post_id: string, pageNumber: number = 1, limit: number = 10) {

        try {

            if (!post_id) return

            const response = await api.get("entreprise_get/annonce_post_id", {
                params: {
                    post_id: post_id,
                    page: pageNumber,
                    limit: limit
                }
            });

            const offre = response.data.data; // 👈 objet simple

            if (!offre) return;

            console.log(offre)

            setOffreTab(offre.candidats)
            setAnnonceInfo(offre.annonce.title)

            setTotal(response.data.total);

        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }
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


    useEffect(() => {

        if (search.trim().length !== 0) return;
        getOffres(annonceID, page, limit);
    }, [page]);


    const fetchCandidats = async (searchValue: string, filterValue: FilterKey, pageNumber: number) => {


        const status = filterStatusMap[filterValue];



        try {

            const res = await api.get("entreprise_get/annonce_post_id_search_candidats", {
                params: {
                    post_id: annonceID,
                    search: searchValue,
                    filter: status,
                    page: pageNumber,
                    limit
                }
            });


            setOffreTab(res.data.data.annonce);
            setTotal(res.data.total);


        } catch (error) {
            console.error(error);
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
            router.push(`${route} / ${ids}`);
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

        console.log("route", route)

        console.log("action", action)

        console.log("type", type)

        const candidature = offreTab.find(c => c.id.toString() === id);

        // Vérifier que la candidature existe avant d'accéder à user_id
        const userId = candidature?.user_id;
        if (!userId) {

            console.warn(`Aucune candidature trouvée pour l'annonce_id: ${id}`);
            return;
        }

        console.log('User ID:', userId);

        // Si route → redirection


        if (route) {


            if (action == "Tél. doc. technique") {
                console.log(candidature.fichier_pdf)

                if (!candidature.fichier_pdf) {
                    setShowError(true)
                    setErrorMsg("Le candidat n’a pas joint de fichier PDF.")
                    return;
                }

                router.push(`${route}/${candidature.fichier_pdf}`);
                return;
            }

            if (action == "Voir la lettre de motivation") {
                router.push(`${route}/candidats=${candidature?.email}&offres=${candidature?.annonce_id}`);
                return;
            }
            if (action == "Programmer un Entretien") {
                router.push(`${route}/candidats=${candidature?.email}&offres=${candidature?.annonce_id}`);
                return;
            }
            if (action == "Visualiser le profil") {
                router.push(`${route}/${userId}`);
                return;
            }





            //    router.push(`${route}/candidats=${row?.email}&offres=${row?.annonce_id}`);

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
            setSelectedOffres(offreTab.map((o) => o.id.toString()));
        }
        setSelectAll(!selectAll);
    };

    const handleActionType = async (type: string, message: string, post_id: string,) => {

        if (type === "notification") {
            console.log('toto')


            let res = await api.patch(`/entreprise_get/send_candidat_notification/${post_id}`, {
                statut: message,
            });

            if (res.status == 201) {
                getOffres(annonceID, page);

            }



        }

        if (type === "changer") {

            console.log(message)


            let res = await api.patch(`/entreprise_get/send_candidat_changer_status/${post_id}`, {
                statut: message,
            });

            console.log(res)

            if (res.status == 201) {
                getOffres(annonceID, page);
            }



        }

        if (type === "delete") {

            // ✅ Demander confirmation
            const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.");

            if (!confirmed) return; // sortir si l'utilisateur annule
            let res = await api.delete(`/entreprise_get/send_candidat_delete_offres/${post_id}`);

            if (res.status == 201) {
                getOffres(annonceID, page);
            }

        }
    }

    const handleGroupeActionType = async (type: string, message: string, post_id: string[]) => {



        if (type === "notification") {


            let res = await api.patch(`/entreprise_get/send_candidat_notification_group/${post_id}`, {
                statut: message,
            });

            if (res.status == 201) {
                getOffres(annonceID, page);

            }


        }

        if (type === "changer") {



            let res = await api.patch(`/entreprise_get/send_candidat_changer_status_group/${post_id}`, {
                statut: message,
            });


            if (res.status == 201) {
                getOffres(annonceID, page);
            }



        }
        if (type === "delete") {


            // ✅ Demander confirmation
            const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.");

            if (!confirmed) return; // sortir si l'utilisateur annule
            let res = await api.delete(`/entreprise_get/send_candidat_delete_offres_group/${post_id}`);

            if (res.status == 201) {
                getOffres(annonceID, page);

            }

        }
    }

    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="mainContent">

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


                                        if (selectedCandidats && newStatus) {
                                            handleGroupeActionType("notification", newStatus, selectedCandidats)
                                        }

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


                                        if (selectedCandidatId) {
                                            handleActionType("delete", "null", selectedCandidatId);
                                        }
                                        // API - supprimer
                                        break;

                                    case "changer":

                                        if (selectedCandidatId && newStatus) {
                                            handleActionType("changer", newStatus, selectedCandidatId)
                                        }

                                        // API - changer statut
                                        break;

                                    case "notification":

                                        if (selectedCandidatId && newStatus) {
                                            handleActionType("notification", newStatus, selectedCandidatId)
                                        }


                                        // API - envoyer notif
                                        break;

                                    case "note":


                                        if (selectedCandidatId && newStatus) {
                                            handleActionType("note", newStatus, selectedCandidatId)
                                        }

                                        // API - enregistrer note
                                        break;

                                    case "tel":


                                        if (selectedCandidatId && newStatus) {
                                            handleActionType("tel", newStatus, selectedCandidatId)
                                        }

                                        // Pas vraiment un modal normalement → mais selon ton UI
                                        break;
                                }

                                setIsModalOpen(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />




                        <div className="header">
                            <h2>Liste des candidats · {truncate(annonceInfo, 100)} </h2>
                        </div>

                        <div className="actions">
                            <input
                                type="text"
                                placeholder="Rechercher par nom d'entreprise"
                                className="search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
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
                                    <th>Entreprise</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Proposition technique</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offreTab.map((c, index) => (
                                    <tr key={index}>
                                        <input
                                            type="checkbox"
                                            checked={selectedOffres.includes(c.id.toString())}
                                            onChange={() => handleSelectOne(c.id.toString())} />
                                        <td>{index}</td>
                                        <td>{c.nom}</td>
                                        <td>{c.email}</td>
                                        <td>{c.statut}</td>

                                        <td className="clickable">{c.fichier_pdf ? `📄` : "—"}</td>




                                        <td className="clickable">
                                            <div className="actionWrapper" style={{ position: "relative" }}>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // IMPORTANT : ne ferme pas immédiatement !
                                                        setOpenRowMenu(openRowMenu === c.id.toString() ? null : c.id.toString());
                                                    }}
                                                >
                                                    ⚙️
                                                </span>

                                                {openRowMenu === c.id.toString() && (
                                                    <div className="dropdownRow" ref={rowMenuRef}>
                                                        {actionsRow.map((action) => (
                                                            <div
                                                                key={action}
                                                                className="dropdownItem"
                                                                onClick={() => handleRowAction(action, c.id.toString())}
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
