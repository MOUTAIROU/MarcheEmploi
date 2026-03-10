"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionGrouperModalQcmEmploi from '@/components/modale/ActionGrouperModalQcmEmploi/page'
import PopupError from '@/components/modale/Popup/PopupError/page'
import ActionModalQcmEmploi from '@/components/modale/ActionModalQcmEmploi/page'
import api from "@/lib/axiosInstance";
import { getCategorieLabel, country, countryCode } from "@/utils/types";


type QcmStatut =
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "REMOVED_BY_COMPANY";

interface Recruteur {
    user_id: string;
    name: string;
}

interface QcmQuestion {
    type: "qcm-unique" | "choix-multiple";
    niveau: "facile" | "moyen" | "difficile";
    points: number;
    intitule: string;
    options: string[];
    tempsMin?: number;
    tempsSec?: number;
}


interface ExamenQcm {
    id: number;
    post_id: string;
    titre: string;
    description: string;
    date_ouverture: string;
    duree: number | string;
    noteMin: number | string;
    mode: "libre" | "chrono";
    params: {
        mail?: boolean;
        chrono?: boolean;
        retour?: boolean;
        difficulte?: boolean;
        inactivite?: boolean;
    };
    questions: QcmQuestion[];
}

interface QcmCandidatItem {
    qcm_id: string;

    statut: QcmStatut;
    statut_label: string;
    startDate: string;
    endDate: string;

    assigned_at: Date | string;
    started_at?: Date | string | null;
    finished_at?: Date | string | null;

    score?: number | null;
    is_done?: boolean;

    examen: ExamenQcm;

    recruteur: Recruteur;
}

const Rowactions = [
    "▶️ Passer l’examen",
    "❌ Supprimer"
];


type ActionOption = (typeof Rowactions)[number];

const routes_action: Record<ActionOption, string | null> = {
    "▶️ Passer l’examen": `${process.env.LOCAL_HOST}/emploi/dashboard/qcm-examen/examin/`,
    "❌ Supprimer": null,
};




export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const [qcmTab, setQcmTab] = useState<QcmCandidatItem[]>([]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");
    const [currentAction, setCurrentAction] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowAction, setRowAction] = useState<ActionOption | null>(null);
    const [rowId, setRowId] = useState<string>("");


    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


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






    async function getOffres() {
        const response = await api.get("candidats/all_qcm");

        const { data, status } = response

        if (status == 201) {

            console.log(data.data)

            setQcmTab(data.data)

        }

        // return response.data;
    }

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

        if (action === "Associer un QCM") {
            const ids = selectedOffres.join(",");
            router.push(
                `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/group?ids=${ids}`
            );
            return;
        }



        // Pour les autres actions (supprimer, mettre hors ligne, etc.)
        //  alert(`Action ${action} appliquée sur : ${selectedOffres.join(", ")}`);

        // Pour toutes les autres actions → ouvrir le modal
        setCurrentAction(action);
        setIsOpen(true);
    };


    const handleRowAction = (action: ActionOption, id: string) => {

        console.log(action, id)
        const route = routes_action[action];


        const offre = qcmTab.find(o => o.qcm_id.toString() === id);

        if (!offre) return;

        const ouverture = getOffreStatus(offre.startDate, offre.endDate);


        if (offre.statut_label == "✅ Terminé") {
            alert(
                "🔒 Examen Terminer\n\n" +
                "Cet examen n’est pas encore ouvert ou est déjà fermé.\n" +
                "Veuillez respecter la période définie par le recruteur."
            );
            return; // ⛔ STOP ici
        }


        if (action === "▶️ Passer l’examen" && ouverture.status === "PENDING" || ouverture.status === "CLOSED") {
            alert(
                "🔒 Examen non disponible\n\n" +
                "Cet examen n’est pas encore ouvert ou est déjà fermé.\n" +
                "Veuillez respecter la période définie par le recruteur."
            );
            return; // ⛔ STOP ici
        }


        // 🟥 Si la route est null → ouvrir un modal
        if (!route) {
            setRowAction(action);     // <— IMPORTANT !
            setRowId(id);
            setIsRowModalOpen(true);
            setOpenRowMenu(null);
            return;
        }

        // 🟩 Sinon → redirection automatique avec l’ID ajouté à la fin

        router.push(`${route}${id}`);

        setOpenRowMenu(null);
    };
    const actions = [
        "❌ Supprimer"
    ];

    const toggleSelect = (id: string) => {

        setSelectedOffres(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
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

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);

        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    const getOffreStatus = (startDate?: string, endDate?: string) => {
        const now = new Date();

        if (!startDate || !endDate) {
            return { label: "⛔ Non défini", status: "UNDEFINED" };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { label: "🕒 À venir", status: "PENDING" };
        }

        if (now >= start && now <= end) {
            return { label: "✅ Ouvert", status: "OPEN" };
        }

        return { label: "❌ Fermé", status: "CLOSED" };
    };



    const applyGroupAction = async (newDate?: string) => {
        console.log("Action appliquée :", currentAction);
        console.log("Offres sélectionnées :", selectedOffres);



        if (currentAction.trim() === "❌ Supprimer") {

            // 🔍 Récupérer les lignes concernées
            const selectedRows = qcmTab.filter(item =>
                selectedOffres.includes(item.qcm_id)
            );

            // ⚠️ Vérifier s’il y a au moins un QCM ASSIGNED
            const hasAssignedQcm = selectedRows.some(
                row => row.statut === "ASSIGNED"
            );

            if (hasAssignedQcm) {
                const confirmDesistement = window.confirm(
                    "⚠️ Attention\n\n" +
                    "Parmi les QCM sélectionnés, certains vous ont été assignés par l’entreprise.\n\n" +
                    "En confirmant, vous vous déclarez comme désistant pour ces QCM " +
                    "et vous ne pourrez plus les passer.\n\n" +
                    "Souhaitez-vous vraiment continuer ?"
                );

                // ❌ Annulation utilisateur
                if (!confirmDesistement) {
                    console.log("Suppression groupée annulée par l'utilisateur");
                    return;
                }
            }

            // ✅ Appel API groupé
            const res = await api.get(
                `/candidats/detete_qcm_groupe/${selectedOffres.join(",")}`
            );

            console.log(res);

            if (res.status === 201) {
                // refresh liste / toast succès / reset sélection
                setSelectedOffres([]);
            }
        }


        setIsOpen(false);
    };

    const applyRowAction = async (payload?: any) => {
        console.log("Action row :", rowAction);
        console.log("ID cible :", rowId);
        console.log("Payload :", payload)


        const row = qcmTab.find(item => item.qcm_id == rowId)


        if (rowAction === "❌ Supprimer") {

            console.log(row, rowId);

            // ⚠️ Cas QCM assigné
            if (row?.statut === "ASSIGNED") {

                const confirmDesistement = window.confirm(
                    "⚠️ Attention\n\n" +
                    "Ce QCM vous a été assigné par l’entreprise.\n\n" +
                    "En le supprimant, vous vous déclarez comme désistant et vous ne pourrez plus passer cet examen.\n\n" +
                    "Souhaitez-vous vraiment continuer ?"
                );

                // ❌ L’utilisateur annule
                if (!confirmDesistement) {
                    console.log("Suppression annulée par l'utilisateur");
                    return;
                }
            }

            // ✅ Continuer la suppression
            const res = await api.delete(
                `/candidats/candidats_detete_qcm/${rowId}`
            );

            console.log(res);

            if (res.status === 201) {
                // refresh liste, toast succès, etc.
            }
        }



        setIsRowModalOpen(false);
    };

    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <ActionGrouperModalQcmEmploi
                            title={currentAction}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            onConfirm={applyGroupAction}
                            confirmLabel={`Confirmer ${currentAction}`}

                        />

                        <ActionModalQcmEmploi
                            action={rowAction ?? ""}
                            isOpen={isRowModalOpen}
                            onClose={() => setIsRowModalOpen(false)}
                            onConfirm={(payload) => applyRowAction(payload)}
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
                            <div>
                                <h2>Mes QCM</h2>
                                <p>Gérez vos tests de présélection et associez-les à vos offres d’emploi.</p>
                            </div>

                            <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/creer-qcm`}>
                                <button className="createButton">Créer un nouveau QCM</button>
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

                                {isFilterOpen && (
                                    <div className="dropdown">
                                        {["Filtre", "Catégorie / Domaine", "Durée", "Date de création", "Nombre d’offres associées", "Scores"].map(
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
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    // sélectionner toutes les offres
                                                    setSelectedOffres(qcmTab.map(o => o.qcm_id.toString()));
                                                } else {
                                                    // désélectionner tout
                                                    setSelectedOffres([]);
                                                }
                                            }}
                                            checked={selectedOffres.length === qcmTab.length && qcmTab.length > 0}
                                        />
                                    </th>
                                    <th>Référence QCM</th>
                                    <th>Intitulé</th>
                                    {/* <th>Durée</th>*/}
                                    <th>Recruteur</th>
                                    {/* <th>Questions</th>*/}
                                    <th>Ouverture</th>
                                    <th>Fermeture</th>
                                    <th>Status</th>
                                    <th>Status</th>
                                    <th>Actions</th>

                                </tr>
                            </thead>

                            <tbody>
                                {qcmTab.map((offre) => (
                                    <tr key={offre.qcm_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.qcm_id.toString())}
                                                onChange={() => toggleSelect(offre.qcm_id.toString())}
                                            /></td>
                                        <td>{offre.qcm_id}</td>
                                        <td>{offre.examen.titre}</td>
                                        {/* <td>{offre.examen.duree}</td>*/}
                                        <td>{offre.recruteur.name}</td>
                                        {/* <td>{offre.examen.questions.length}</td>*/}


                                        <td>{formatDateTime(offre.startDate)}</td>
                                        <td>{formatDateTime(offre.endDate)}</td>

                                        <td>{getOffreStatus(offre.startDate, offre.endDate).label}</td>
                                        <td>{offre.statut_label}</td>

                                        <td className='param-btn'>
                                            <button
                                                className='gearButton'
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === offre.qcm_id.toString() ? null : offre.qcm_id.toString())
                                                }
                                            >
                                                ⚙️
                                            </button>


                                            {openRowMenu === offre.qcm_id.toString() && (
                                                <div className='dropdownRow' ref={rowMenuRef}>
                                                    {Rowactions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className='dropdownItem'
                                                            onClick={() => handleRowAction(action, offre.qcm_id.toString())}
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
