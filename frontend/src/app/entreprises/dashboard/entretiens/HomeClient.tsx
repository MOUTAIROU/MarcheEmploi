"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import ActionEntretienGrouperModal from '@/components/modale/ActionEntretienGrouperModal/page'
import ActionEntretienModal from '@/components/modale/ActionEntretienModal/page'
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'
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
        "PLANNED",
        "DONE",
        "COMPLETED",
        "CANDIDAT_CONFIRME",
        "CANDIDAT_REFUSE"
    ],

    "Actives": [
        "PLANNED",
        "CANDIDAT_CONFIRME"
    ],

    "En évaluation": [
        "DONE"
    ],

    "En attente": [
        "PLANNED"
    ],

    "Acceptés": [
        "CANDIDAT_CONFIRME"
    ],

    "Rejetés": [
        "CANDIDAT_REFUSE"
    ]
};

interface Offre {
    id: number;
    post_id: string;
    entr_id: string;
    candidat_id: string;
    nom: string;
    email: string;
    offre: string;
    titre: string;
    typeEntretien: string;
    date_entretien: string; // ex: "18/12/2025 à 10h30"
    status: "PLANNED" | "DONE" | "REMOVED_BY_COMPANY" | "CANDIDAT_CONFIRME" | "annule" | "termine";
    responsable: string;
    type: string;
}



const Rowactions = [
    "📝 Clôturer l’entretien",
    "📨 Envoyer une notification",
    "✏️ Modifier",
    "❌ Supprimer"
];


type ActionOption = (typeof Rowactions)[number];
type RowActionType = "notification" | "delete" | "note";

const row_action_type: Record<ActionOption, RowActionType | null> = {
    "📝 Clôturer l’entretien": "note",
    "📨 Envoyer une notification": "notification",
    "✏️ Modifier": null,   // pas de modal → redirection
    "❌ Supprimer": "delete"
};

const routes_action: Record<ActionOption, string | null> = {
    "📝 Clôturer l’entretien": `${process.env.LOCAL_HOST}/entreprises/dashboard/entretiens/`,
    "📨 Envoyer une notification": null,
    "✏️ Modifier": `${process.env.LOCAL_HOST}/entreprises/dashboard/entretiens/modifier/`,
    "❌ Supprimer": null,
};



const action_modal_type: Record<ActionGroupOption, "delete" | "notification" | "note"> = {
    "🗑️Supprimer ": "delete",
    "📨 Envoyer une notification": "notification",
    "📝 Clôturer l’entretien": "note",
};

const actions = [
    "🗑️Supprimer ",
    "📨 Envoyer une notification",
    "📝 Clôturer l’entretien",
];

type ActionGroupOption = (typeof Rowactions)[number];

const routes_groupe_action: Record<ActionGroupOption, string | null> = {
    "🗑️Supprimer": null,
    "📨 Envoyer une notification": null,
    "📝 Clôturer l’entretien": `${process.env.LOCAL_HOST}/entreprises/dashboard/entretiens/`,
};


export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [entretienTab, setEntretienTab] = useState<Offre[]>([]);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"delete" | "notification" | "note">("notification");

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [currentRowId, setCurrentRowId] = useState<string | null>(null);
    const [isError, setError] = useState(false);
    const [currentAction, setCurrentAction] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowAction, setRowAction] = useState<ActionOption | null>(null);
    const [rowId, setRowId] = useState<string>("");

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState<FilterKey>("Filtre");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;



    const router = useRouter();

    const statutLabels: Record<string, string> = {
        PLANNED: "🗓️ Planifié (en attente de confirmation du candidat)",
        CANDIDAT_CONFIRME: "✅ Confirmé par le candidat",
        DONE: "✅ Clôturé (entretien terminé)",
        TERMINE: "🏁 Terminé",
        ANNULE: "❌ Annulé",
        REMOVED_BY_COMPANY: "🗑️ Retiré par l’entreprise",
    };

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);


    // Fermer les menus si clic extérieur
    useEffect(() => {

        getOffres();

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

            const res = await api.get("entreprise_get/entretiens_search", {
                params: {
                    search: searchValue,
                    filter: status,
                    page: pageNumber,
                    limit: 10
                }
            });


            setEntretienTab(res.data.data)
            setTotal(res.data.total)


        } catch (error) {
            console.error(error);
        }

    };


    async function getOffres(pageNumber: number = 1, limit: number = 10) {
        const response = await api.get("entreprise_get/entretiens", {
            params: {
                page: pageNumber,
                limit: limit
            }
        });

        const { data, status } = response

        console.log(response)

        if (status == 201) {

            setEntretienTab(data.data)
            setTotal(data.total)


        }



        // return response.data;
    }

    const handleSelect = (value: FilterKey) => {
        setSelectedFilter(value);
        setFilterOpen(false);
    };

    const handleGroupAction = (action: ActionGroupOption) => {

        if (selectedOffres.length === 0) {

            setErrorMsg("Veuillez sélectionner au moins une offre.");
            setShowError(true);
            return;
        }

        const ids = selectedOffres.join(",");

        // 1️⃣ Vérifier si l'action possède une route
        const route = routes_groupe_action[action];
        if (route) {
            router.push(`${route}/${ids}`);
            return;
        }

        // 2️⃣ Sinon → ouvrir un modal adapté
        setCurrentAction(action);


        // Déterminer dynamiquement le type de modal
        const type = action_modal_type[action];


        setActionType(type);   // <<— nouvelle state utilisée par ton modal

        setIsOpen(true);
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

    const handleRowAction = (action: ActionOption, id: string) => {
        setOpenRowMenu(null);

        const route = routes_action[action];
        const type = row_action_type[action];

        const entretien = entretienTab.find(
            (item) => item.entr_id === id
        );

        const entr_id = entretien?.entr_id;

        // Si route → redirection
        if (route) {
            router.push(`${route}${entr_id}`);
            return;
        }

        // Sinon → modal

        setCurrentAction(action);

        setActionType(type!);
        setRowId(id);
        setIsRowModalOpen(true);
    };




    const actionsFiltre = [
        "Par candidat",
        "Par offre",
        "Par statut",
        "Par type d’entretien",
        "Par recruteur"
    ]

    const toggleSelect = (id: string) => {

        setSelectedOffres(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const applyGroupAction = async (payload?: any) => {
        console.log("Action appliquée :", entretienTab);
        console.log("Entretiens sélectionnés :", selectedOffres);

        // 🔎 retrouver les entretiens via entr_id
        const entretiensSelectionnes = entretienTab.filter(item =>
            selectedOffres.includes(item.entr_id)
        );

        // IDs entretiens
        const entr_ids = entretiensSelectionnes.map(item => item.entr_id);


        if (actionType === "notification") {

            // infos candidat + offre
            const entr_infos = entretiensSelectionnes.map(item => ({
                candidat_id: item.candidat_id,
                offre: item.offre,
                msg: treatment_msg_to_send(payload),
                entr_id: item.entr_id
            }));




            let res = await api.patch(`/entreprise_get/entretien_notification_groupe/${selectedOffres}`, {
                payload: { msg: treatment_msg_to_send(payload), entr_ids, entr_infos }
            });

            console.log(res)

            if (res.status == 201) {
                getOffres();

            }




        }


        if (actionType === "delete") {

            let res = await api.delete(`/entreprise_get/detele_entretien_groupe/${entr_ids}`);

            console.log(res)

            if (res.status == 201) {
                getOffres();

            }




        }

        setIsOpen(false);
    };


    const applyRowAction = async (payload?: any) => {



        const entretien = entretienTab.find(
            (item) => item.entr_id === rowId
        );

        const entr_id = entretien?.entr_id;


        if (actionType === "notification") {
            console.log("Offre hors ligne :", rowId);


            let res = await api.patch(`/entreprise_get/entretien_notification/${entretien?.candidat_id}`, {
                payload: {
                    msg: treatment_msg_to_send(payload),
                    entr_id: entretien?.entr_id,
                    entr_info: entretien?.offre
                }
            });

            console.log(res)

            if (res.status == 201) {

                getOffres();
            }




        }

        if (actionType === "delete") {
            console.log("Offre hors ligne :", entr_id);



            // ✅ Demander confirmation
            const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.");


            if (!confirmed) return; // sortir si l'utilisateur annule
            let res = await api.delete(`/entreprise_get/detele_entretien/${entr_id}`);

            console.log(res)

            if (res.status == 201) {
                getOffres();

            }




        }




        setIsRowModalOpen(false);
    };

    const candidats_info = (candidat: { nom: string; email: string }): string => {
        if (!candidat) return "";

        const nom = candidat.nom ?? "";
        const email = candidat.email ?? "";

        return `${nom} — ${email}`;
    };

    const formatStatutEntretien = (statut: string) => statutLabels[statut] || "🕒 En attente";

    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <ActionEntretienGrouperModal

                            title={currentAction}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            onConfirm={(message) => applyGroupAction(message)}
                            actionType={actionType}
                            confirmLabel={`Confirmer ${currentAction}`}

                        />

                        <ActionEntretienModal
                            title={currentAction}
                            isOpen={isRowModalOpen}
                            onClose={() => setIsRowModalOpen(false)}
                            onConfirm={(data) => applyRowAction(data)}
                            actionType={actionType}     // "note" | "notification" | "delete"
                            confirmLabel={`Confirmer ${currentAction}`}
                        />



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



                        <div className="header">
                            <div>
                                <h2>Entretiens</h2>
                                <p>Gérez vos entretiens associez à vos offres.</p>
                            </div>

                            <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/programmer-entretien`}>
                                <button className="createButton">Créer un entretien</button>
                            </Link>
                        </div>

                        <div className="actions">
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
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    // sélectionner toutes les offres
                                                    setSelectedOffres(entretienTab.map(o => o.entr_id.toString()));
                                                } else {
                                                    // désélectionner tout
                                                    setSelectedOffres([]);
                                                }
                                            }}
                                            checked={selectedOffres.length === entretienTab.length && entretienTab.length > 0}
                                        /></th>
                                    <th>ID de l’entretien</th>
                                    <th>Candidat</th>
                                    <th>Offre associée</th>
                                    <th>Type d’entretien</th>
                                    <th>Date & Heure</th>
                                    <th>Statut</th>
                                    <th>Recruteur</th>
                                    <th>Action</th>
                                </tr>
                            </thead>



                            <tbody>
                                {entretienTab.map((offre) => (


                                    <tr key={offre.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.entr_id.toString())}
                                                onChange={() => toggleSelect(offre.entr_id.toString())}
                                            /></td>
                                        <td>{offre.entr_id}</td>
                                        <td>{offre.nom} </td>
                                        <td>{offre.titre}</td>
                                        <td>{offre.type}</td>
                                        <td>{offre.date_entretien}</td>
                                        <td>{formatStatutEntretien(offre.status)}</td>
                                        <td>{offre.responsable}</td>
                                        <td className='param-btn'>
                                            <button
                                                className='gearButton'
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === offre.entr_id.toString() ? null : offre.entr_id.toString())
                                                }
                                            >
                                                ⚙️
                                            </button>

                                            {openRowMenu === offre.entr_id.toString() && (
                                                <div className='dropdownRow' ref={rowMenuRef}>
                                                    {Rowactions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className='dropdownItem'
                                                            onClick={() => handleRowAction(action, offre.entr_id)}
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
