"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BoosterModal from '@/components/modale/BoosterModal/page'
import ActionGrouperModal from '@/components/modale/ActionGrouperParOffreModal/page'
import ActionParOffreModal from '@/components/modale/ActionParOffreModal/page'
import ActionCandidatModal from "@/components/modale/ActionCandidatModal/page";
import Link from "next/link";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

import api from "@/lib/axiosInstance";

const actions = [
    "Retirer",
    "Voir le CV",
    "Envoyer notification",
    "Programmer un Entretien"
] as const;

type ActionOption = (typeof actions)[number];




interface Offre {
    id: number;                    // ID technique (DB)
    user_id: string;               // Entreprise qui publie
    candidate_id: string;               // OFF-xxx | AOF-xxx
    type: "offre_emploi" | "appel_offre" | string;
    nom: string;                 // Titre / objet de l’annonce
    email: string;
    createdAt: string;
    titre: string;
    source: string;
    notification: string;
    date_publication: string;      // ISO string
    expiration?: string | null;    // emploi
    date_limite?: string | null;   // appel d’offre
    date_ouverture?: string | null;
    statut: "en_ligne" | "hors_ligne" | "archive" | string;
    nbr_candidat: number;          // compteur auto
}



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
    const [offreTab, setOffreTab] = useState<Offre[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [isGroupOpen, setGroupOpen] = useState(false);
    const [btnOffreAppelOpen, setBtnOffreAppelOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Toutes");
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isError, setError] = useState(false);
    const [selectedCandidatId, setSelectedCandidatId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [actionType, setActionType] = useState<"notification" | "delete" | "note" | "tel" | "changer">("notification");

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
        "Retirer",
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



        const response = await api.get("entreprise_get/mes_candidats_save");

        const { data, status } = response

        if (status == 201) {

            setOffreTab(data.data)

        }



    }
    const handleSelect = (value: string) => {
        setSelectedFilter(value);
        setFilterOpen(false);
    };


    function getStatus(offre: Offre): { label: string; className: string } {
        // Récupérer la date d'expiration selon le type
        const expirationDate = getExpirationDate(offre); // utilise ta fonction existante
        const now = new Date();

        // Vérifier si la date est déjà passée
        if (expirationDate && new Date(expirationDate) < now) {
            return { label: "Expiré", className: "expired" };
        }

        // Sinon, utiliser le statut de l'offre
        switch (offre.statut) {
            case "publie":
                return { label: "Publié", className: "active" };
            case "fermer":
                return { label: "Fermé", className: "wait" };
            default:
                return { label: offre.statut, className: "wait" }; // par défaut
        }
    }
    const handleGroupAction = (action: string) => {

        if (selectedOffres.length === 0) {

            setErrorMsg("Veuillez sélectionner au moins une offre.");
            setShowError(true);

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

    // Fonction pour récupérer le type à partir du post_id
    const getTypeByPostId = (post_id: string): string | undefined => {
        const offre = offreTab.find(o => o.candidate_id === post_id);
        return offre?.type; // retourne undefined si non trouvé
    };



    function getAnnonceHref(a: any) {
        const slug = slugify(a.titre, a.post_id || "");
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

    const handleRowAction = (action: ActionOption, id: string) => {

        if (action === "Voir le CV") {

            // 🔹 retrouver l'annonce complète par post_id
            const annonce = offreTab.find(
                (item: any) => item.candidate_id === id
            );

            if (!annonce) {
                console.error("Annonce introuvable :", id);
                return;
            }
            const lien = `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/cv/${id}`
            router.push(lien);
            return;

        }

        if (action === "Envoyer notification") {

            // 🔹 retrouver l'annonce complète par post_id
            const annonce = offreTab.find(
                (item: any) => item.candidate_id === id
            );

            console.log(offreTab)
            if (!annonce) {
                console.error("Annonce introuvable :", id);
                return;
            }

            setSelectedCandidatId(id)
            // 🔹 générer le lien selon le type
            const lien = getAnnonceHref(annonce);


            setActionType("notification");
            setIsModalOpen(true);
            return;
        }

        if (action === "Programmer un Entretien") {

            // 🔹 retrouver l'annonce complète par post_id
            const annonce = offreTab.find(
                (item: any) => item.candidate_id === id
            );

            if (!annonce) {
                console.error("Annonce introuvable :", id);
                return;
            }



            // 🔹 générer le lien selon le type
            const lien = `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/programmer-entretien/candidats=${annonce.email}`



            router.push(lien);
            return;
        }




        // Pour les actions à modal
        setRowAction(action);
        setRowId(id);
        setIsRowModalOpen(true);
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
        if (currentAction === "Retirer") {

            // ✅ Demander confirmation
            const confirmed = window.confirm("Êtes-vous sûr de vouloir retirer cette offre ? Cette action est irréversible.");


            if (!confirmed) return; // sortir si l'utilisateur annule
            let res = await api.delete(`/entreprise_get/delete_candidats_save_groupe/${selectedOffres}`);

            if (res.status == 201) {
                //  getOffres()
            }































































        }




        setIsOpen(false);
    };

    function getExpirationDate(offre: Offre): string | null {
        if (offre.type === "offre_emploi") {
            return offre.expiration || null;
        } else if (
            offre.type === "appel_offre" ||
            offre.type === "ami" ||
            offre.type === "consultation" ||
            offre.type === "recrutement_consultant"
        ) {
            return offre.date_limite || null;
        } else {
            return null;
        }
    }

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



    const applyRowAction = async (
        newDate?: string,
        newStatus?: "hors_ligne" | "en_ligne" | "delete"
    ) => {
        try {
            console.log("Action row :", rowAction);
            console.log("ID cible :", rowId);
            console.log("newStatus :", newStatus);

            // const response = await api.get("entreprise_get/offres");
            // 🔴 SUPPRESSION



            if (rowAction === "Retirer") {

                // ✅ Demander confirmation

                let res = await api.delete(`/entreprise_get/delete_candidats_save/${rowId}`);

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


    const handleActionType = async (type: string, message: string, post_id: string,) => {


        console.log(type, message, post_id)

        if (type === "notification") {

            let res = await api.patch(`/entreprise_get/send_candidat_notification_emploi_contact/${post_id}`, {
                statut: message,
            });

            if (res.status == 201) {
                getOffres();

            }



        }


    }
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

                    <ActionCandidatModal
                        title={actionType ? "Envoyer une notification" : ""}
                        isOpen={isModalOpen}
                        actionType={actionType}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={(newStatus) => {
                            if (!actionType) return;

                            switch (actionType) {



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

                                case "note":
                                    console.log("Note enregistrée pour :", selectedCandidatId);
                                    // API - enregistrer note
                                    break;

                                case "tel":
                                    console.log("Téléchargement document pour :", selectedCandidatId);
                                    // Pas vraiment un modal normalement → mais selon ton UI
                                    break;
                            }

                            setIsModalOpen(false);
                        }}

                        confirmLabel={actionType ? "Envoyer" : "Valider"}
                    />

                    <ActionParOffreModal
                        title={rowAction ?? ""}
                        isOpen={isRowModalOpen}
                        onClose={() => setIsRowModalOpen(false)}
                        onConfirm={(newDate, newStatus) => applyRowAction(newDate, newStatus)}
                        confirmLabel='Confirmer'
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



                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">


                        <div className="header">
                            <h2>Offre d’emploi / Appels d’offres</h2>


                            {/* === >Offre d’emploi / Appels d’offres === */}
                            <div className="filterWrapper" ref={btnOffreAppelRef}>
                                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/enregistrements`}>
                                    <button
                                        className="createButton"
                                    >
                                        Offre emploi
                                    </button>
                                </Link>


                                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/enregistrements/candidats`}>
                                    <button
                                        className="createButton"
                                    >
                                        Candidats
                                    </button>
                                </Link>



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
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    // sélectionner toutes les offres
                                                    setSelectedOffres(offreTab.map(o => o.candidate_id.toString()));
                                                } else {
                                                    // désélectionner tout
                                                    setSelectedOffres([]);
                                                }
                                            }}
                                            checked={selectedOffres.length === offreTab.length && offreTab.length > 0}
                                        />
                                    </th>
                                    <th>ID de l’offre</th>
                                    <th>Entreprise</th>
                                    <th>Titre</th>
                                    <th>Date Enr</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {offreTab.map((offre) => {

                                    const status = getStatus(offre);


                                    return (
                                        <tr key={offre.candidate_id}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.candidate_id.toString())}
                                                onChange={() => toggleSelect(offre.candidate_id.toString())}
                                            /></td>
                                            <td>{offre.candidate_id}</td>
                                            <td>{offre.nom}</td>

                                            <td>{offre.email}</td>
                                            <td> {formatDate(offre.createdAt)}</td>


                                            <td className='param-btn'>
                                                <button
                                                    className='gearButton'
                                                    onClick={() =>
                                                        setOpenRowMenu(openRowMenu === offre.candidate_id.toString() ? null : offre.candidate_id.toString())
                                                    }
                                                >
                                                    ⚙️
                                                </button>

                                                {openRowMenu === offre.candidate_id.toString() && (
                                                    <div className='dropdownRow' ref={rowMenuRef}>
                                                        {actions.map((action) => (
                                                            <div
                                                                key={action}
                                                                className='dropdownItem'
                                                                onClick={() => handleRowAction(action, offre.candidate_id.toString())}
                                                            >
                                                                {action}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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
