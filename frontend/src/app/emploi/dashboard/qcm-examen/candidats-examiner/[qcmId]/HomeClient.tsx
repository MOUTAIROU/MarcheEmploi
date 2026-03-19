"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PopupError from '@/components/modale/Popup/PopupError/page'
import ActionGrouperExaminCandidatsModal from '@/components/modale/ActionGrouperExaminCandidatsModal/page'
import ActionModal from '@/components/modale/ActionCandidatExamenModal/page'
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";

interface Offre {
    user_id: string;
    nom: string;
    email: string;
    status: string;
    tmp: number;
    score: number;
}



export default function OffresPage() {

    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isGroupOpen, setGroupOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [offres, setoffres] = useState<Offre[]>([]);
    const [offresID, setoffresID] = useState<string | null>(null);

    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");
    const [currentAction, setCurrentAction] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowAction, setRowAction] = useState<ActionOption | null>(null);
    const [rowId, setRowId] = useState<string>("");


    const router = useRouter();

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);

    const params = useParams();

    useEffect(() => {

        console.log(params)

        const post_id_param = params["qcmId"];
        const post_id = Array.isArray(post_id_param) ? post_id_param[0] : post_id_param;

        console.log(post_id)

        if (!post_id) return;

        setoffresID(post_id)
        getOffres(post_id);
    }, [params]);




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


    async function getOffres(post_id: string) {


        try {
            const response = await api.get(
                `entreprise_get/qcm_candidats_all/${post_id}`
            );

            const offre = response.data.data; // 👈 objet simple

            if (!offre) return;

            setoffres(offre)



        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
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
    const applyRowAction = async (payload?: any) => {
        console.log("Action row :", rowAction);
        console.log("ID cible :", rowId);
        console.log("Payload :", payload)

        if (rowAction === "❌ Supprimer") {
            console.log("Nouvelle date :", payload);

            let res = await api.patch(`/entreprise_get/detete_qcm_by_candidats/${rowId}`, {
                offresID,
            });


            if (res.status == 201 && offresID) {

                getOffres(offresID);

            }

            // Exemple API :
            // await prolongerOffre(rowId, newDate);
        }



        if (rowAction === "📨 Envoyer notification") {

            console.log(`/entreprise_get/by_candidats_send_msg/${rowId}`)
            let res = await api.patch(`/entreprise_get/by_candidats_send_msg/${rowId}`, {
                statut: treatment_msg_to_send(payload),
            });

            if (res.status == 201 && offresID) {
                getOffres(offresID);

            }


            // API…
        }

        if (rowAction === "Remettre en ligne") {
            console.log("Offre remise en ligne :", rowId);

            // API…
        }

        setIsRowModalOpen(false);
    };

    const actions = [
        "🗑️ Retirer des candidats",             // Supprimer plusieurs QCM sélectionnés
        // "📨 Envoyer notification aux candidats", // Envoyer un message à tous les candidats sélectionnés
    ];

    type ActionGroupeOption = (typeof Rowactions)[number];

    const routes_action_groupe: Record<ActionGroupeOption, string | null> = {
        "🗑️ Supprimer les QCM": null,
        "📨 Envoyer notification aux candidats": null
    };

    const Rowactions = [
        "👁️ Voir détails",       // Voir le QCM du candidat avec ses réponses et scores
        //  "📨 Envoyer notification", // Envoi d’un rappel ou message personnalisé
        "❌ Supprimer"             // Supprimer le candidat du QCM (utile pour gestion ou cas litigieux)
    ];


    type ActionOption = (typeof Rowactions)[number];

    const routes_action: Record<ActionOption, string | null> = {
        "👁️ Voir détails": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/candidats-qcm/`,
        "📨 Envoyer notification": null,
        "❌ Supprimer": null
    };


    const Filtreactions = [
        "Filtre",
        "Catégorie / Domaine",
        "Durée",
        "Scores"
    ];

    const toggleSelect = (id: string) => {

        setSelectedOffres(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const applyGroupAction = async (playload?: string) => {
        console.log("Action appliquée :", currentAction);
        console.log("Offres sélectionnées :", selectedOffres);

        if (currentAction.trim() === "🗑️ Retirer des candidats") {
            console.log("Nouvelle date reçue :", playload);


            let res = await api.patch(`/entreprise_get/detete_qcm_by_candidats_groupe/${selectedOffres}`, {
                offresID,
            });


            if (res.status == 201 && offresID) {

                getOffres(offresID);

            }

        }

        if (currentAction === "📨 Envoyer notification aux candidats") {
            console.log("Message à envoyer :", playload);
            if (!playload) {
                console.error("Aucun message saisi !");
            }
            // Exemple : API pour envoyer notification
            // await envoyerNotification(selectedOffres, inputValue);
        }

        // Fermer le modal après action
        setIsOpen(false);
    };


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <ActionGrouperExaminCandidatsModal
                            title={currentAction}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            onConfirm={(playload) => applyGroupAction(playload)}
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
                                        {Filtreactions.map(
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
                                                    setSelectedOffres(offres.map(o => o.user_id));
                                                } else {
                                                    // désélectionner tout
                                                    setSelectedOffres([]);
                                                }
                                            }}
                                            checked={selectedOffres.length === offres.length && offres.length > 0}
                                        />
                                    </th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Score (%)</th>
                                    <th>Temps passé (min)</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {offres.map((offre) => (
                                    <tr key={offre.user_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.user_id)}
                                                onChange={() => toggleSelect(offre.user_id)}
                                            /></td>
                                        <td>{offre.nom}</td>
                                        <td>{offre.email}</td>
                                        <td>{offre.score}</td>
                                        <td>{offre.tmp}</td>
                                        <span
                                            className={`status ${offre.status === "Reussi"
                                                ? "active"
                                                : offre.status === "Echoue"
                                                    ? "wait"
                                                    : "expired"
                                                }`}
                                        >
                                            {offre.status}
                                        </span>
                                        <td className='param-btn'>
                                            <button
                                                className='gearButton'
                                                onClick={() =>
                                                    setOpenRowMenu(openRowMenu === offre.user_id ? null : offre.user_id)
                                                }
                                            >
                                                ⚙️
                                            </button>

                                            {openRowMenu === offre.user_id && (
                                                <div className='dropdownRow' ref={rowMenuRef}>
                                                    {Rowactions.map((action) => (
                                                        <div
                                                            key={action}
                                                            className='dropdownItem'
                                                            onClick={() => handleRowAction(action, offre.user_id)}
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
