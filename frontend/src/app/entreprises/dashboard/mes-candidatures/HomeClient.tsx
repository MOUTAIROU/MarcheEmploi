"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BoosterModal from '@/components/modale/BoosterModal/page'
import ActionGrouperModal from '@/components/modale/ActionGrouperParOffreModal/page'
//import ActionParOffreModal from '@/components/modale/ActionParOffreModal/page'
import ActionCandidatOffreModal from "@/components/modale/ActionCandidatOffreModal/page";
import PopupError from '@/components/modale/Popup/PopupError/page'
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";

const actions = [
    "Voir la lettre de motivation",
    "Voir l'offre",
    "Voir les notification",
    "Supprimer"
] as const;

type ActionOption = (typeof actions)[number];

type RowActionType = "notification" | "delete";
const row_action_type: Record<ActionOption, RowActionType | null> = {
    "Voir la lettre de motivation": null,
    "Voir les notification": "notification",
    "Voir l'offre": null,
    "Supprimer": "delete"
};

const routes_action: Record<ActionOption, string | null> = {
    "Voir la lettre de motivation": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/lettre-motivation/`,
    "Supprimer": null,
    "Voir les notification": null,
    "Voir l'offre": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/`,
};



const STATUS_UI_MAP: Record<string, StatutUIConfig> = {
    // ===== CANDIDATURE =====
    WAITING: {
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
    HIRED: {
        label: "Accepté / Recruté",
        color: "limegreen",
    },
    REJECTED: {
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
    user_email: string
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

// Déclare les clés autorisées
type RouteOption = "Offre d'emploi" | "Appel d'offre" | "AMI" | "Consultation" | "Recrutement consultant";

// Objet routes correctement typé



const routes: Record<RouteOption, string> = {
    "Offre d'emploi": "/entreprises/dashboard/creer-offre-emploi",
    "Appel d'offre": "/entreprises/dashboard/creer-appel-offre",
    "AMI": "/entreprises/dashboard/creer-ami",
    "Consultation": "/entreprises/dashboard/creer-consultation",
    "Recrutement consultant": "/entreprises/dashboard/creer-recrutement-consultant",
};
export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [offreTab, setOffreTab] = useState<AnnonceDashboardItem[]>([]);
    const [tabAnnonce, setTabAnnonce] = useState<AnnonceEvent[]>([]);

    const [isGroupOpen, setGroupOpen] = useState(false);
    const [btnOffreAppelOpen, setBtnOffreAppelOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");

    const [actionType, setActionType] = useState<"notification" | "delete">("notification");
    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const btnOffreAppelRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);

    const [currentAction, setCurrentAction] = useState<string>("");

    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowAction, setRowAction] = useState<ActionOption | null>(null);
    const [rowId, setRowId] = useState<string>("");

    const router = useRouter();

    const actionsGroupe = [
        "Se Retierer",
    ];


    useEffect(() => {
        getOffres();

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;

            // Si pas de target → clic scrollbar ou zone vide, ne rien faire
            if (!target) return;

            // Vérifier si le clic est dans les éléments à ignorer
            const inside =
                filterRef.current?.contains(target) ||
                groupRef.current?.contains(target) ||
                btnOffreAppelRef.current?.contains(target) ||
                rowMenuRef.current?.contains(target);

            if (inside) return; // clic dans menu → ne pas fermer

            // Vérifier si le clic est dans le document mais en dehors de tout élément (scrollbar)
            const clickX = event.clientX;
            const clickY = event.clientY;
            const docWidth = document.documentElement.clientWidth;
            const docHeight = document.documentElement.clientHeight;

            // Si clic sur scrollbar → ne pas fermer
            if (clickX > docWidth || clickY > docHeight) return;

            // Sinon → fermer tout
            setFilterOpen(false);
            setGroupOpen(false);
            setBtnOffreAppelOpen(false);
            setOpenRowMenu(null);
        };

        document.addEventListener("mousedown", handleClickOutside);

        // return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    async function getOffres() {



        const response = await api.get("entreprise_get/mes_condidatures");

        const { data, status } = response

        console.log(response)

        if (status == 201) {

            setOffreTab(data.data)

        }



        // return response.data;
    }
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

    const handleGroupAction = (action: string) => {

        if (selectedOffres.length === 0) {
            setError(true)
            setErrorMsg("Veuillez sélectionner au moins une offre.")
            return;
        }

        if (action === "Associer un QCM") {
            const ids = selectedOffres.join(",");
            router.push(
                `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/${ids}`
            );
            return;
        }





        // Pour les autres actions (supprimer, mettre hors ligne, etc.)
        //  alert(`Action ${action} appliquée sur : ${selectedOffres.join(", ")}`);

        // Pour toutes les autres actions → ouvrir le modal
        setCurrentAction(action);
        setIsOpen(true);
    };



    function getAnnonceHref(a: any) {
        const slug = slugify(a.objet, a.annonce_id || "");
        const ville = a.ville
            ? a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "toutes-villes";

        if (a.type === "offre_emploi") {
            return `${process.env.LOCAL_HOST}/entreprises/dashboard/recherche-appel-offre/annonces/emploi/${ville}/${slug}`;
        }

        // tout le reste = appel d’offre
        return `${process.env.LOCAL_HOST}/entreprises/dashboard/recherche-appel-offre/annonces/appel-offre/${ville}/${slug}`;
    }

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


    // Fonction pour récupérer le type à partir du post_id
    const getTypeByPostId = (post_id: string): string | undefined => {
        const offre = offreTab.find(o => o.annonce_id === post_id);
        return offre?.type; // retourne undefined si non trouvé
    };

    const handleRowAction = (action: ActionOption, id: string) => {


        const type = row_action_type[action];
        const route = routes_action[action];


        // 🔹 retrouver l'annonce complète par post_id
        const annonce = offreTab.find(
            (item: any) => item.annonce_id === id
        );

        if (!annonce) {
            console.error("Annonce introuvable :", id);
            return;
        }

        setTabAnnonce(annonce.tabAnnonce)

        if (route) {

            //  /candidats=${row?.email}&offres=${row?.annonce_id}

            if (action == "Voir la lettre de motivation") {
                router.push(`${route}/candidats=${annonce.user_email}&offres=${annonce?.annonce_id}`);
                return;
            }

            if (action === "Voir l'offre") {

                // 🔹 générer le lien selon le type
                const lien = getAnnonceHref(annonce);

                router.push(lien);
                return;


            }

        }



        // Pour les actions à modal
        setRowAction(action);
        setRowId(id);
        setIsRowModalOpen(true);
        setActionType(type!)
    };

    const toggleSelect = (id: string) => {
        setSelectedOffres(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const applyGroupAction = async (
        newDate?: string,
        newStatus?: "hors_ligne" | "en_ligne" | "delete"
    ) => {

        // 🔴 SUPPRESSION
        if (currentAction === "Se Retierer") {

            let res = await api.delete(`/entreprise_get/delete_offres_mes_candidature_group/${selectedOffres}`);

            if (res.status == 201) {
                getOffres()
            }

        }

        setIsOpen(false);
    };


    function formatDate(dateString: string | null | undefined): string {
        if (!dateString) return "-"; // si pas de date
        if (!dateString.includes("T")) return dateString; // ne rien faire si pas de T

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} à ${hours}:${minutes}`;
    }

    const getStatutUI = (statut: string) => {
        return STATUS_UI_MAP[statut] ?? {
            label: statut,
            color: "gray",
        };
    };

    function formatType(type: string): string {
        switch (type) {
            case "offre_emploi":
                return "Offre d’emploi";
            case "appel_offre":
                return "ADO"; // Abbreviation pour "Appel d’Offre"
            case "ami":
                return "AMI"; // Abbreviation pour "Appel à Manifestation d’Intérêt"
            case "consultation":
                return "Consultation";
            case "recrutement_consultant":
                return "Recrut. Consultant";
            default:
                return type; // Retourne tel quel si type inconnu
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

    const applyRowAction = async (
        newDate?: string,
        newStatus?: string,
    ) => {
        try {
            console.log("Action row :", rowAction);
            console.log("ID cible :", rowId);
            console.log("newStatus :", newStatus);

            // const response = await api.get("entreprise_get/offres");
            // 🔴 SUPPRESSION
            if (rowAction === "Supprimer") {


                let res = await api.delete(`/entreprise_get/delete_offres_mes_candidature/${rowId}`);

                if (res.status == 201) {
                    getOffres()
                }

            }



            // 🔄 Refresh liste si besoin
            // await fetchOffres();

            setIsRowModalOpen(false);
        } catch (error) {
            console.error("Erreur action offre :", error);
        }
    };

    const getAnnonceType = (annonce_id?: string) => {
        if (!annonce_id) return "🌐 Externe";

        if (annonce_id.startsWith("OFF-") || annonce_id.startsWith("AOF-")) {
            return "✅ Interne";
        }

        return "🌐 Externe";
    };

    return (
        <div>
            <main >
                <div className="container-dashbord">
                    <ActionGrouperModal
                        title={currentAction}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onConfirm={(newDate, newStatus) => applyGroupAction(newDate, newStatus)}
                        confirmLabel={`Confirmer ${currentAction}`}

                    />

                    <ActionCandidatOffreModal
                        title={rowAction ?? ""}
                        isOpen={isRowModalOpen}
                        tabAnnonce={tabAnnonce}
                        actionType={actionType}
                        onClose={() => setIsRowModalOpen(false)}

                        onConfirm={(newStatus) => {


                            if (!actionType) return;

                            switch (actionType) {

                                case "delete":


                                    if (rowId) {
                                        applyRowAction("delete", "null");
                                    }
                                    // API - supprimer
                                    break;



                                case "notification":

                                    console.log('toto', rowId, newStatus)
                                    if (rowId) {



                                        applyRowAction("notification", "null")
                                    }


                                    // API - envoyer notif
                                    break;




                            }

                            setIsRowModalOpen(false);
                        }}
                        confirmLabel='Confirmer'
                    />



                    {isError && (
                        <PopupError
                            isOpen={isError}
                            title="Erreur"
                            message={isErrorMsg}
                            onClose={() => setError(false)}
                        />
                    )}



                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">


                        <div className="header">
                            <h2>Mes candidatures</h2>


                            {/* === >Offre d’emploi / Appels d’offres === */}
                            <div className="filterWrapper">

                            </div>


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
                                        {["Filtre", "Toutes", "Actives", "Expirées", "Brouillons", "Publier"].map(
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
                                                            {actions.map((action) => (
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


                    </div>
                </div>
            </main >
        </div >


    );
}
