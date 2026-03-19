"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionConfirmeEntretienModal from "@/components/modale/ActionConfimeEntretienModal/page";
import PopupError from '@/components/modale/Popup/PopupError/page'
import ActionConfirmeEntretienGroupeModal from "@/components/modale/ActionConfirmeEntretienGroupeModal/page";
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


interface EntretienCandidat {
    id: number;
    entr_id: string;
    candidat_id: string;
    entreprise_id: string;
    offre: string;
    title: string;
    nom: string;
    responsable: string;
    date_entretien: string;
    duree: number | null;
    type: "Présentiel" | "Visioconférence" | "Téléphonique";
    lieu: string | null;
    lien: string | null;
    filenameBase: string | null;
    message: string;
    status: "PLANNED" | "COMPLETED" | "CANCELLED" | "POSTPONED";
    // État de l’entretien
}



const actions = [
    "✅ Confirmer",
    "📄 Voir détails",
    "🗑️ Supprimer",
];


type ActionOption = (typeof actions)[number];



type rowType = "notification" | "delete" | "note" | "changer";

const action_type: Record<ActionOption, rowType | null> = {
    "✅ Confirmer": "changer",
    "📄 Voir détails": null,
    "🗑️ Supprimer": "delete",
};



const route_action: Record<ActionOption, string | null> = {
    "✅ Confirmer": null,
    "📄 Voir détails": `${process.env.LOCAL_HOST}/emploi/dashboard/entretiens/details`,
    "🗑️ Supprimer": null,
};

const actionsGroupe = [
    "✅ Confirmer",
    "🗑️ Supprimer",
];

type GroupeType = "notification" | "delete" | "note" | "changer";
type ActionGroupeOption = (typeof actionsGroupe)[number];

const groupe_action_type: Record<ActionGroupeOption, GroupeType | null> = {
    "✅ Confirmer": "changer",
    "🗑️ Supprimer": "delete",
};

const route_groupe_action: Record<ActionGroupeOption, string | null> = {
    "✅ Confirmer": null,
    "🗑️ Supprimert": null
};


const confirmLabels: Record<rowType, string> = {
    delete: "Supprimer",
    changer: "Modifier",
    notification: "Envoyer",
    note: "Enregistrer"
};

const modalTitles: Record<rowType, string> = {
    notification: "Envoyer une notification",
    delete: "Confirmer la suppression de l’entretiene",
    note: "Ajouter une note",
    changer: "Veuillez confirmer votre présence",
};


export default function OffresPage() {

    const [offres, setOffres] = useState<EntretienCandidat[]>([]);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);


    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState<string>("");
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);

    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");

    const [selectedCandidats, setSelectedCandidats] = useState<string[]>([]);
    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false);

    const [actionGroupeType, setActionGroupeType] = useState<"notification" | "delete" | "note" | "changer">("notification");


    // 🔥 états de la modale supprimer
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOffreId, setSelectedOffreId] = useState<string | null>(null);

    const [actionType, setActionType] = useState<"notification" | "delete" | "note" | "changer">("notification");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectAll, setSelectAll] = useState(false);

    const rowMenuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();


    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

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


    useEffect(() => {

        getOffres();
    }, []);

    async function getOffres(pageNumber: number = 1, limit: number = 10) {


        try {

            const response = await api.get(
                `candidats/entretien/`, {
                params: {
                    page: pageNumber,
                    limit: limit
                }
            }
            );


            const { data, status } = response

            if (status == 201) {

                setOffres(data.data)
                setTotal(data.total)
                
            }


        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }




    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOffres([]);
        } else {
            setSelectedOffres(offres.map((o) => o.entr_id));
        }
        setSelectAll(!selectAll);
    };

    const handleRowAction = (action: ActionOption, id: string) => {
        setOpenRowMenu(null);


        const route = route_action[action];
        const type = action_type[action];

        // Si route → redirection
        if (route) {
            const candidature = offres.find(c => c.entr_id === id);

            if (!candidature) {
                console.error("ID introuvable :", id);
                return;
            }

            router.push(`${route}/${id}`);

            return;
        }

        // Sinon → modal

        setCurrentAction(action);

        setActionType(type!);
        setSelectedCandidatId(id);
        setIsModalOpen(true);
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

        console.log(type, action)
        setActionGroupeType(type!);   // <<— nouvelle state utilisée par ton modal

        setIsModalOpenGroupe(true);
    };


    const applyGroupeAction = async (type: String, action: String, selectedCandidatId: String[]) => {



        if (type == "changer") {


            let payload = {
                newStatus: action
            }

            const response = await api.patch(`candidats/entretien_status_groupe/${selectedCandidatId}`, payload);

            if (response.status == 201) {
                getOffres()
            }

        }

        if (type == "delete") {


            const response = await api.delete(`candidats/delete_entretien_groupe/${selectedCandidatId}`);

            if (response.status == 201) {
                getOffres()
            }

        }
    }

    const applyRowAction = async (type: String, action: String, selectedCandidatId: String) => {

        console.log(type)
        console.log(action)
        console.log(selectedCandidatId)

        const info = offres.find(item => item.entr_id == selectedCandidatId)

        if (!info) return

        console.log(info)

        if (type == "changer") {
            let payload = {
                candidat_id: info.candidat_id,
                newStatus: action

            }

            const response = await api.patch(`candidats/entretien_status/${selectedCandidatId}`, payload);

            if (response.status == 201) {
                getOffres()
            }

        }

        if (type == "delete") {
            let payload = {
                candidat_id: info.candidat_id,
                newStatus: action

            }

            const response = await api.delete(`candidats/delete_entretien/${selectedCandidatId}`);

            if (response.status == 201) {
                getOffres()
            }

        }
    }


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



    const actionsFiltre = [
        "Par candidat",
        "Par offre",
        "Par statut",
        "Par type d’entretien",
        "Par recruteur"
    ]


    const statutLabels: Record<string, string> = {
        PLANNED: "🗓️ Planifié (en attente de confirmation du candidat)",
        CANDIDAT_CONFIRME: "✅ Confirmé par le candidat",
        DONE: "✅ Clôturé (entretien terminé)",
        TERMINE: "🏁 Terminé",
        ANNULE: "❌ Annulé",
        REMOVED_BY_COMPANY: "🗑️ Retiré par l’entreprise",
    };

    const formatStatutEntretien = (statut: string) => statutLabels[statut] || "🕒 En attente";



    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
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

                        <ActionConfirmeEntretienGroupeModal
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


                                            applyGroupeAction("delete", "null", selectedCandidats)
                                        }


                                        // API - supprimer
                                        break;

                                    case "changer":
                                        console.log("Nouveau statut :", newStatus, "pour :", selectedCandidats);

                                        if (newStatus && selectedCandidats) {

                                            if (newStatus == "En attente") {
                                                return
                                            }

                                            console.log('toto')
                                            applyGroupeAction("changer", newStatus, selectedCandidats)
                                        }
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

                        <ActionConfirmeEntretienModal
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


                                            applyRowAction("delete", "null", selectedCandidatId)
                                        }


                                        // API - supprimer
                                        break;

                                    case "changer":

                                        if (newStatus && selectedCandidatId) {

                                            if (newStatus == "En attente") {
                                                return
                                            }
                                            applyRowAction("changer", newStatus, selectedCandidatId)
                                        }

                                        console.log("Nouveau statut :", newStatus, "pour :", selectedCandidatId);
                                        // API - changer statut
                                        break;




                                }

                                setIsModalOpen(false);
                            }}

                            confirmLabel={actionType ? confirmLabels[actionType] : "Valider"}
                        />

                        <div className="header">
                            <h2>Entretiens</h2>
                        </div>

                        <div className="actions">



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
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>ID de l’entretien</th>
                                    <th>Offre associée</th>
                                    <th>Entreprise</th>
                                    <th>Type d’entretien</th>
                                    <th>Date & Heure</th>
                                    <th>Lieu</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>



                            <tbody>
                                {offres.map((offre) => (
                                    <tr key={offre.entr_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.entr_id)}
                                                onChange={() => handleSelectOne(offre.entr_id)}
                                            />

                                        </td>
                                        <td>{offre.entr_id}</td>
                                        <td>{offre.title}</td>
                                        <td>{offre.nom}</td>
                                        <td>{offre.type}</td>
                                        <td>{offre.date_entretien}</td>
                                        <td>{offre.lieu}</td>


                                        <td>{formatStatutEntretien(offre.status)}</td>

                                        <td className="param-btn">
                                            <button
                                                className="gearButton"
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === offre.entr_id ? null : offre.entr_id)
                                                }
                                            >
                                                ⚙️
                                            </button>

                                            {openRowMenu === offre.entr_id && (
                                                <div className="dropdownRow" ref={rowMenuRef}>
                                                    {actions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className="dropdownItem"
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
