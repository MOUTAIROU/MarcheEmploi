"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionGrouperModal from '@/components/modale/ActionGrouperParOffreModal/page'
import PopupError from '@/components/modale/Popup/PopupError/page'
import ActionModal from '@/components/modale/ActionQCMModal/page'
import api from "@/lib/axiosInstance";
import { getCategorieLabel, country, countryCode } from "@/utils/types";


interface Offre {
    id: number;                     // ID du QCM
    categorie: string;               // ex: "gestion_projet"
    duree: number | string;          // durée en minutes
    nombreQuestions: number;         // nombre total de questions
    nombreCandidats: number;         // nombre de candidats ayant passé le QCM
    nombreOffresByQcmId: number;
    scoreMoyen: number;              // score moyen (sur 20 ou 100 selon logique)
    offreId: string | null;
    post_id: string;
}



const Rowactions = [
    "👁️ Voir",
    "📌 Offres associées",
    "📨 Envoyer à des candidats",
    "✏️ Modifier",
    "📋 Candidats examinés",
    "❌ Supprimer"
];


type ActionOption = (typeof Rowactions)[number];

const routes_action: Record<ActionOption, string | null> = {
    "👁️ Voir": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/`,
    "📌 Offres associées": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/offre-associer/`,
    "📨 Envoyer à des candidats": null,
    "✏️ Modifier": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/modifier-qcm/`,
    "📋 Candidats examinés": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/candidats-examiner/`,
    "❌ Supprimer": null,
};




export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

    const [qcmTab, setQcmTab] = useState<Offre[]>([]);

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
        const response = await api.get("entreprise_get/all_qcm");

        const { data, status } = response

        if (status == 201) {


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
        const route = routes_action[action];

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
        "🗑️Supprimer les QCM "
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
    const applyGroupAction = async (newDate?: string) => {
        console.log("Action appliquée :", currentAction);
        console.log("Offres sélectionnées :", selectedOffres);



        if (currentAction.trim() === "🗑️Supprimer les QCM") {

            let res = await api.delete(`/entreprise_get/detete_qcm_groupe/${selectedOffres}`);


            console.log(res)
            if (res.status == 201) {
                getOffres();

            }

            // Exemple : API
            // await prolongerExpiration(selectedOffres, newDate);


        }

        setIsOpen(false);
    };

    const applyRowAction = async (payload?: any) => {
        console.log("Action row :", rowAction);
        console.log("ID cible :", rowId);
        console.log("Payload :", payload)
        if (rowAction === "📌 Offres associées") {


            // Exemple API :

            let res = await api.patch(`/entreprise_get/associer_offre_qcm/${rowId}`, {
                payload,
            });

            if (res.status == 201) {


            }


        }

        if (rowAction === "📨 Envoyer à des candidats") {

            let res = await api.patch(`/entreprise_get/associer_candidat_qcm/${rowId}`, {
                payload,
            });

            console.log(res)

            if (res.status == 201) {


            }




        }

        if (rowAction === "❌ Supprimer") {
            console.log("Suppression de", rowId);

            let res = await api.delete(`/entreprise_get/detete_qcm/${rowId}`);

            console.log(res)
            if (res.status == 201) {
                getOffres();

            }


            // Exemple API :
            // await supprimerOffre(rowId);
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

                        <ActionGrouperModal
                            title={currentAction}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            onConfirm={applyGroupAction}
                            confirmLabel={`Confirmer ${currentAction}`}

                        />

                        <ActionModal
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
                                                    setSelectedOffres(qcmTab.map(o => o.post_id.toString()));
                                                } else {
                                                    // désélectionner tout
                                                    setSelectedOffres([]);
                                                }
                                            }}
                                            checked={selectedOffres.length === qcmTab.length && qcmTab.length > 0}
                                        />
                                    </th>
                                    <th>ID QCM</th>
                                    <th>Domaine</th>
                                    <th>Nombre de Question</th>
                                    <th>Durée (min)</th>
                                    <th>Offres Associées</th>
                                    <th>Score Moyenne</th>
                                    <th>Nbre Candidats</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {qcmTab.map((offre) => (
                                    <tr key={offre.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.post_id.toString())}
                                                onChange={() => toggleSelect(offre.post_id.toString())}
                                            /></td>
                                        <td>{offre.post_id}</td>
                                        <td>{getCategorieLabel(offre.categorie)}</td>
                                        <td>{offre.nombreQuestions}</td>
                                        <td>{offre.duree}</td>
                                        <td>{offre.nombreOffresByQcmId}</td>
                                        <td>{offre.scoreMoyen}</td>

                                        <td>{offre.nombreCandidats}</td>

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
                                                    {Rowactions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className='dropdownItem'
                                                            onClick={() => handleRowAction(action, offre.post_id.toString())}
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
