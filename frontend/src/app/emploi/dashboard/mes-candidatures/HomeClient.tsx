'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import ActionCandidatOffreModal from "@/components/modale/ActionCandidatOffreModal/page";
import ActionCandidatOffreModalGrouper from "@/components/modale/ActionCandidatOffreModalGrouper/page";
import PopupError from '@/components/modale/Popup/PopupError/page'
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import api from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import Pagination from "@/components/PaginationTap/Pagination";
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'



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

type AnnonceEvent = {
    meta: {
        is_read: boolean;
        createdAt: string;

        annonce_id?: string;
        candidat_id?: string;
        annonce_reference?: string;

        system?: boolean;
    };

    type: string;

    action: string;

    title: string;

    message?: string;

    actor?: {
        id: string;
        name?: string;
    };

    receiver?: {
        id: string;
        name?: string;
    };

    object?: {
        id: string;
        type: string;
        label?: string;
    };

    is_read: boolean; // ⚠️ cohérent avec meta.is_read
};





type AnnonceDashboardItem = {
    postulation_id: number;
    annonce_id: string; // OFF-BJ-2026-20260129-1002
    ville: string;
    offre_title: string; // "Technicien / Technicienne en Agronomie"
    entreprise_nom: string; // "Rebazar Store"
    statut: string;
    type: string;
    createdAt: string; // ISO date
    unread_annonce_count: number; // nombre d'annonces non lues
    tabAnnonce: AnnonceEvent[];
};

type StatutUIConfig = {
    label: string;
    color: string;
};


const actions = [
    "Supprimer"
];

type ActionGroupeOption = (typeof actions)[number];
type GroupeActionType = "delete";

const groupe_action_type: Record<ActionGroupeOption, GroupeActionType | null> = {
    "Supprimer": "delete"
};

const route_groupe_action: Record<ActionGroupeOption, string | null> = {
    "Supprimer": null,
    "Changer le statut": null,
    "Envoyer notificationt": null,
};

const STATUS_UI_MAP: Record<string, StatutUIConfig> = {
    // ===== CANDIDATURE =====
    PENDING: {
        label: "En attente",
        color: "gray",
    },
    WAITING_EXAM: {
        label: "En attente d’examen",
        color: "orange",
    },
    EXAM_COMPLETED: {
        label: "Examen terminé",
        color: "green",
    },
    INTERVIEW_SELECTED: {
        label: "Sélectionné pour entretien",
        color: "dodgerblue",
    },
    ACCEPTE: {
        label: "Accepté / Recruté",
        color: "limegreen",
    },
    REJETE: {
        label: "Refusé",
        color: "red",
    },
    DELETED_BY_COMPANY: {
        label: "Candidature clôturée",
        color: "darkred",
    },
    DELETED_BY_CANDIDAT: {
        label: "Candidature retirée",
        color: "gray",
    },

    // ===== ANNONCE =====
    OFFER_PAUSED: {
        label: "Annonce suspendue",
        color: "gold",
    },
    OFFER_REPUBLISHED: {
        label: "Annonce active",
        color: "limegreen",
    },
    OFFER_CLOSED: {
        label: "Annonce clôturée",
        color: "red",
    },
};

const actionsRow = [
    "Voir la lettre de motivation",
    "Voir les notification",
    "Voir offres",
    "Supprimer",
];


type ActionOption = (typeof actionsRow)[number];

type RowActionType = "notification" | "delete";

const row_action_type: Record<ActionOption, RowActionType | null> = {
    "Voir la lettre de motivation": null,
    "Voir les notification": "notification",
    "Voir offres": null,
    "Supprimer": "delete"
};

const confirmLabels: Record<RowActionType, string> = {
    delete: "Se Retire de l'offre",
    notification: "Toutes les notification",
};

const modalTitles: Record<RowActionType, string> = {
    notification: "Envoyer une notification",
    delete: "Se Retire de l'offre"
};

const routes_action: Record<ActionOption, string | null> = {
    "Voir la lettre de motivation": `${process.env.LOCAL_HOST}/emploi/dashboard/mes-candidatures/lettre-motivation/`,
    "Voir les notification": null,
    "Voir offres": `${process.env.LOCAL_HOST}/emploi/dashboard/mes-candidatures/lettre-motivation/`,
    "Supprimer": null
};

export default function Home() {


    const [offreTab, setOffreTab] = useState<AnnonceDashboardItem[]>([]);
    const [tabAnnonce, setTabAnnonce] = useState<AnnonceEvent[]>([]);
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"notification" | "delete">("notification");
    const [actionGroupeType, setActionGroupeType] = useState<"notification" | "delete">("notification");
    const [currentAction, setCurrentAction] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);
    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const groupRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);
    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);
    const [isError, setError] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterKey>("Filtre");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;


    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {

        getOffres();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

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

        // Cas 1 : aucun filtre et aucune recherche
        if (!search && selectedFilter === "Filtre") return;

        // Cas 2 : recherche mais moins de 3 caractères
        if (search && search.trim().length > 0 && search.trim().length < 3) return;

        const timer = setTimeout(() => {

            fetchOffres(search, selectedFilter, page);

        }, 500);

        return () => clearTimeout(timer);

    }, [search, selectedFilter, page]);


    useEffect(() => {

        if (search.trim().length !== 0) return;
        getOffres(page, limit);
    }, [page]);

    const fetchOffres = async (searchValue: string, filterValue: FilterKey, pageNumber: number) => {

        try {

            const status = filterStatusMap[filterValue];

            const res = await api.get("candidats/annonce_post_id_search", {
                params: {
                    search: searchValue,
                    filter: status,
                    page: pageNumber,
                    limit: 10
                }
            });


            setOffreTab(res.data.data)

            setTotal(res.data.total)


        } catch (error) {
            console.error(error);
        }

    };

    async function getOffres(pageNumber: number = 1, limit: number = 10) {


        try {
            const response = await api.get(`candidats/annonce_post_id/`, {
                params: {
                    page: pageNumber,
                    limit: 10
                }
            }
            );

            const offre = response.data.data; // 👈 objet simple

            if (!offre) return;


            setOffreTab(offre)

            setTotal(response.data.total)


        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }

    const getAnnonceType = (annonce_id?: string) => {
        if (!annonce_id) return "🌐 Externe";

        if (annonce_id.startsWith("OFF-") || annonce_id.startsWith("AOF-")) {
            return "✅ Interne";
        }

        return "🌐 Externe";
    };
    const handleSelect = (value: FilterKey) => {
        setSelectedFilter(value);
        setFilterOpen(false);
    };

    const getStatutUI = (statut: string) => {
        return STATUS_UI_MAP[statut] ?? {
            label: statut,
            color: "gray",
        };
    };

    const handleGroupAction = (action: ActionGroupeOption) => {

        if (selectedOffres.length === 0) {
            setErrorMsg("Veuillez sélectionner au moins une offre.");
            setShowError(true);
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

        console.log(type, action)
        setActionGroupeType(type!);   // <<— nouvelle state utilisée par ton modal

        setIsModalOpenGroupe(true);
    };

    const handleRowAction = (action: ActionOption, id: string) => {
        setOpenRowMenu(null);

        const route = routes_action[action];
        const type = row_action_type[action];

        const candidature = offreTab.find(c => c.annonce_id.toString() === id);

        // Vérifier que la candidature existe avant d'accéder à user_id
        const userId = candidature?.postulation_id;
        if (!userId) {
            console.warn(`Aucune candidature trouvée pour l'annonce_id: ${id}`);
            return;
        }

        setTabAnnonce(candidature.tabAnnonce)

        if (route) {

            if (action == "Voir la lettre de motivation") {
                router.push(`${route}/candidats=${candidature.postulation_id}&offres=${candidature?.annonce_id}`);
                return;
            }

            if (action == "Voir offres") {

                router.push(getAnnonceHref(candidature));
                return;
            }

        }

        setCurrentAction(action);
        setActionType(type!);
        setSelectedCandidatId(id);
        setIsModalOpen(true);

    };


    function slugify(
        titre: string | null,
        id: string
    ) {
        if (!id) return "annonce";

        const clean = (value?: string | null) =>
            value
                ? value
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9\s]/g, "")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 8)
                    .join("-")
                : "";

        const parts = [clean(titre)].filter(Boolean);

        return `${parts.join("-")}-${id}`;
    }
    function getAnnonceHref(a: AnnonceDashboardItem) {


        const slug = slugify(a.offre_title, a.annonce_id || "");
        const ville = a.ville
            ? a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "toutes-villes";

        // tout le reste = appel d’offre
        return `${process.env.LOCAL_HOST}/emploi/dashboard/recherche/annonces/appel-offre/${ville}/${slug}`;
    }

    const handleActionType = async (type: string, message: string, post_id: string) => {

        if (type === "notification") {

            let res = await api.get(`/candidats/set_notification_read/${post_id}`);

            if (res.status == 201) {
                getOffres();
            }


        }



        if (type === "delete") {

            // ✅ Demander confirmation
            const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.");

            if (!confirmed) return; // sortir si l'utilisateur annule
            let res = await api.delete(`/candidats/se_retirer_offre/${post_id}`);

            if (res.status == 201) {
                getOffres();
            }

        }
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOffres([]);
        } else {
            setSelectedOffres(offreTab.map((o) => o.annonce_id.toString()));
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

    const handleGroupeActionType = async (type: string, message: string, post_id: string[]) => {

        if (type === "delete") {


            let res = await api.delete(`/candidats/se_retirer_offre_group/${post_id}`);

            if (res.status == 201) {
                getOffres();

            }

        }
    }

    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
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

                        <ActionCandidatOffreModalGrouper
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




                                }

                                setIsModalOpenGroupe(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />

                        <ActionCandidatOffreModal
                            title={actionType ? modalTitles[actionType] : ""}
                            isOpen={isModalOpen}
                            tabAnnonce={tabAnnonce}
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



                                    case "notification":

                                        if (selectedCandidatId) {



                                            handleActionType("notification", "null", selectedCandidatId)
                                        }


                                        // API - envoyer notif
                                        break;




                                }

                                setIsModalOpen(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />


                        <div className="titre-content"> <h3>Mes candidatures</h3></div>

                        <div className="filterWrapper" ref={groupRef}>

                            <div className="searchWrapper">

                                <input
                                    type="text"
                                    placeholder="Rechercher par titre / référence"
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

                        <table className="table">
                            <thead>
                                <tr>
                                    <th><input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                    /></th>
                                    <th>Offre</th>
                                    <th>Entreprise</th>
                                    <th>Origine</th>
                                    <th>Date</th>
                                    <th>Notification</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offreTab.map((item, i) => {


                                    // Formater la date
                                    const createdAt = new Date(item.createdAt);
                                    const formattedDate = createdAt.toLocaleDateString('fr-FR');
                                    const formattedTime = createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                    return (

                                        <tr key={i}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedOffres.includes(item.annonce_id.toString())}
                                                onChange={() => handleSelectOne(item.annonce_id.toString())} /></td>
                                            <td>{item.offre_title}</td>
                                            <td>{item.entreprise_nom}</td>
                                            <td>{getAnnonceType(item.annonce_id)}

                                            </td>
                                            <td>{formattedDate} {formattedTime}</td>
                                            <td>{item.unread_annonce_count}</td>

                                            <td>
                                                {(() => {
                                                    const statutUI = getStatutUI(item.statut);

                                                    return (
                                                        <span className="status">
                                                            <span
                                                                className="dot"
                                                                style={{ backgroundColor: statutUI.color }}
                                                            />
                                                            {statutUI.label}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="clickable">
                                                <div className="actionWrapper" style={{ position: "relative" }}>
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // IMPORTANT : ne ferme pas immédiatement !
                                                            setOpenRowMenu(openRowMenu === item.annonce_id.toString() ? null : item.annonce_id.toString());
                                                        }}
                                                    >
                                                        ⚙️
                                                    </span>

                                                    {openRowMenu === item.annonce_id.toString() && (
                                                        <div className="dropdownRow" ref={rowMenuRef}>
                                                            {actionsRow.map((action) => (
                                                                <div
                                                                    key={action}
                                                                    className="dropdownItem"
                                                                    onClick={() => handleRowAction(action, item.annonce_id.toString())}
                                                                >
                                                                    {action}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
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

            </main>
            <footer >

            </footer>
        </div>
    );
}




