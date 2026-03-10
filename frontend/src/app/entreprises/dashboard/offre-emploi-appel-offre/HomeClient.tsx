"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ActionGrouperModal from '@/components/modale/ActionGrouperParOffreModal/page'
import ActionParOffreModal from '@/components/modale/ActionParOffreModal/page'
import PopupError from '@/components/modale/Popup/PopupError/page'
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";
import { truncateWords } from "@/utils/types";
import Pagination from "@/components/PaginationTap/Pagination";

const actions = [
    "Supprimer",
    "Associer un QCM",
    "Liste",
    "Mettre hors ligne",
    "Modifier",
] as const;

type ActionOption = (typeof actions)[number];

const routes_action: Record<ActionOption, string | null> = {
    "Supprimer": null,
    "Associer un QCM": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/`,
    "Liste": `${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/`,
    "Mettre hors ligne": null,
    "Modifier": `${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/`,
};




interface Offre {
    id: number;
    user_id: string;
    post_id: string;
    type: "offre_emploi" | "appel_offre" | string;
    objet: string;
    lieu: string;
    date_publication: string; // format "YYYY-MM-DDTHH:mm"
    expiration?: string | null; // optionnel
    date_limite?: string | null;
    date_ouverture?: string | null;
    statut: string;
    nbr_candidat: number;
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

    const [isGroupOpen, setGroupOpen] = useState(false);
    const [btnOffreAppelOpen, setBtnOffreAppelOpen] = useState(false);
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isError, setError] = useState(false);
    const [isErrorMsg, setErrorMsg] = useState<string>("");

    const filterRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const btnOffreAppelRef = useRef<HTMLDivElement>(null);
    const rowMenuRef = useRef<HTMLDivElement>(null);

    const [currentAction, setCurrentAction] = useState<string>("");

    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowAction, setRowAction] = useState<ActionOption | null>(null);
    const [rowId, setRowId] = useState<string>("");

    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("Filtre");
    const [page, setPage] = useState(1);

    const renderCount = useRef(0);

    const [total, setTotal] = useState(0);
    const limit = 10;

    const router = useRouter();

    const actionsGroupe = [
        "Supprimer",
        "Associer un QCM",
        // "Prolonger la date d’expiration",
        "Mettre hors ligne",
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


    async function getOffres(pageNumber: number = 1, limit: number = 10) {

        const response = await api.get("entreprise_get/offres", {
            params: {
                page: pageNumber,
                limit: limit
            }
        });

        const { data, status } = response

        if (status == 201) {

            setOffreTab(data.data)

            setTotal(data.total)
        }

    }

    const fetchOffres = async (searchValue: string, filterValue: string, pageNumber: number) => {

        try {

            const res = await api.get("entreprise_get/search_offres", {
                params: {
                    search: searchValue,
                    filter: filterValue,
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

    const handleSelect = (option: string) => {
        setSelectedFilter(option);
        setFilterOpen(false);
        setPage(1);
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
            case "en_ligne":
                return { label: "Publié", className: "active" };
            case "fermer":
                return { label: "Fermé", className: "wait" };
            default:
                return { label: offre.statut, className: "wait" }; // par défaut
        }
    }
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

    // Fonction pour récupérer le type à partir du post_id
    const getTypeByPostId = (post_id: string): string | undefined => {
        const offre = offreTab.find(o => o.post_id === post_id);
        return offre?.type; // retourne undefined si non trouvé
    };

    const handleRowAction = (action: ActionOption, id: string) => {

        if (action === "Associer un QCM") {

            router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen/associer-qcm/${id}`);
            return;
        }

        if (action === "Modifier") {

            const offre = offreTab.find(
                (item) => item.post_id.toString() === id
            );



            if (offre?.type == "offre_emploi") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/modifie/offre-emploi/${id}`);

            }

            if (offre?.type == "appel_offre") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/modifie/appel-offre/${id}`);
            }
            if (offre?.type == "ami") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/modifie/ami/${id}`);
            }
            if (offre?.type == "consultation") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/modifie/consultation/${id}`);
            }
            if (offre?.type == "recrutement_consultant") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/modifie/recrutement-consultant/${id}`);
            }

            return;


        }

        const type_offre = getTypeByPostId(id);

        if (action === "Liste") {

            if (type_offre == "offre_emploi") {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/${id}`);
            } else {
                router.push(`${process.env.LOCAL_HOST}/entreprises/dashboard/candidats/appel-offre/${id}`);
            }

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
        console.log("newStatus", newStatus)
        console.log("Action appliquée :", currentAction);
        console.log("Offres sélectionnées :", selectedOffres);


        if (currentAction === "Prolonger la date d’expiration") {
            console.log("Nouvelle date reçue :", newDate);

            // Exemple : API
            // await prolongerExpiration(selectedOffres, newDate);

            if (!newDate) {
                console.error("Aucune date reçue !");
            }
        }

        // 🔴 SUPPRESSION
        if (currentAction === "Supprimer") {


            let res = await api.delete(`/entreprise_get/delete_offres_groupe/${selectedOffres}`);

            if (res.status == 201) {
                getOffres(page, limit);
            }

        }

        // 🟠 METTRE HORS LIGNE / REMETTRE EN LIGNE
        if (currentAction === "Mettre hors ligne" && newStatus) {
            let res = await api.patch(`/entreprise_get/offres_status_groupe/${selectedOffres}/status`, {
                statut: newStatus,
            });

            if (res.status == 201) {
                getOffres(page, limit);
            }

            console.log("Statut mis à jour :", newStatus);
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
        // if (!dateString.includes("T")) return dateString; // ne rien faire si pas de T

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
            if (rowAction === "Supprimer") {

                // ✅ Demander confirmation
                const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.");

                if (!confirmed) return; // sortir si l'utilisateur annule
                let res = await api.delete(`/entreprise_get/delete_offres/${rowId}`);

                if (res.status == 201) {
                    getOffres(page, limit);
                }

            }

            // 🟠 METTRE HORS LIGNE / REMETTRE EN LIGNE
            if (rowAction === "Mettre hors ligne" && newStatus) {
                let res = await api.patch(`/entreprise_get/offres_status/${rowId}/status`, {
                    statut: newStatus,
                });

                if (res.status == 201) {
                    getOffres(page, limit);
                }

                console.log("Statut mis à jour :", newStatus);
            }

            // 🔄 Refresh liste si besoin
            // await fetchOffres();

            setIsRowModalOpen(false);
        } catch (error) {
            console.error("Erreur action offre :", error);
        }
    };

    const handleSearch = async () => {

        const data = {
            search: search,
            filter: selectedFilter,
            page: page,
            limit: 10
        };

        console.log("Recherche envoyée :", data);

        try {

            const res = await api.get("/offres", {
                params: data
            });

            console.log("Résultat :", res.data);

        } catch (error) {
            console.error(error);
        }
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
                        confirmLabel={`Confirmer`}

                    />

                    <ActionParOffreModal
                        title={rowAction ?? ""}
                        isOpen={isRowModalOpen}
                        onClose={() => setIsRowModalOpen(false)}
                        onConfirm={(newDate, newStatus) => applyRowAction(newDate, newStatus)}
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
                            <h2>Offres d’emploi & Appels d’offres</h2>


                            {/* === >Offre d’emploi / Appels d’offres === */}
                            <div className="filterWrapper" ref={btnOffreAppelRef}>
                                <button
                                    className="createButton"
                                    onClick={() => setBtnOffreAppelOpen(!btnOffreAppelOpen)}
                                >
                                    Créer une nouvelle offre
                                </button>

                                {btnOffreAppelOpen && (
                                    <div className="dropdown">
                                        {Object.keys(routes).map((option) => {
                                            const typedOption = option as RouteOption;

                                            return (
                                                <div
                                                    key={typedOption}
                                                    className="dropdownItem"
                                                    onClick={() =>
                                                        router.push(`${process.env.LOCAL_HOST}${routes[typedOption]}`)
                                                    }
                                                >
                                                    {typedOption}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>


                        </div>

                        <div className="actions">

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
                                        {["Filtre", "Toutes", "Actives", "Expirées"].map(
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
                                                    setSelectedOffres(offreTab.map(o => o.post_id.toString()));
                                                } else {
                                                    // désélectionner tout
                                                    setSelectedOffres([]);
                                                }
                                            }}
                                            checked={selectedOffres.length === offreTab.length && offreTab.length > 0}
                                        />
                                    </th>
                                    <th>ID de l’offre</th>
                                    <th>Titre</th>
                                    <th>Type</th>
                                    <th>Date Exp</th>
                                    <th>Statut</th>
                                    <th>Candidatures</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offreTab.map((offre) => {

                                    const status = getStatus(offre);

                                    return (
                                        <tr key={offre.post_id}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedOffres.includes(offre.post_id.toString())}
                                                onChange={() => toggleSelect(offre.post_id.toString())}
                                            /></td>
                                            <td>{offre.post_id}</td>
                                            <td>{truncateWords(offre.objet)}</td>
                                            <td>{formatType(offre.type)}</td>

                                            <td> {formatDate(getExpirationDate(offre))}</td>
                                            <td>
                                                <span className={`status ${status.className}`}>{status.label}</span>
                                            </td>
                                            <td>{offre.nbr_candidat}</td>
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
                                                        {actions.map((action) => (
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
            </main >
        </div >


    );
}
