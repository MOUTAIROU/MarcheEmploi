import React from "react";
import Link from "next/link";
import Pagination from "@/components/PaginationDashbordEmploi/page";
import "./style.css";
import { TYPE_DISPLAY_MAP, currency } from '@/utils/types';
interface Annonce {
    id: number;
    user_info: string | null;
    post_id: string | null;
    type: "appel_offre" | "offre_emploi";
    user_id: string | null;
    countryCode: string | null;
    categorie: string | null;
    objet: string | null;
    description: string;
    lieu: string | null;
    budget: string | null;
    visibilite: string | null;
    statut: string | null;
    date_publication: string | null;
    date_limite: string | null;
    salaire: string | null;
    date_ouverture: string | null;
    createdAt: string | null;
}

interface Props {
    annonces: Annonce[];
    total: number;
    currentpage: number;
}

export const allPays = [
    { code: "BJ", nom: "Bénin" },
    { code: "TG", nom: "Togo" },
    { code: "CI", nom: "Côte d’Ivoire" },
    { code: "SN", nom: "Sénégal" },
    { code: "CM", nom: "Cameroun" },
];

const AnnonceList: React.FC<Props> = ({ annonces, total, currentpage }) => {


    /* ---------------- SLUG ---------------- */

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



    function formatBudget(budget?: string | null) {
        if (!budget || budget.trim() === '') {
            return 'Non communiqué';
        }

        const trimmedBudget = budget.trim();

        // Vérifie si une devise est déjà présente
        const hasCurrency = Object.values(currency).some(cur =>
            trimmedBudget.includes(cur)
        );

        // Si aucune devise trouvée → on ajoute la devise par défaut
        if (!hasCurrency) {
            return `${trimmedBudget} ${currency.DEFAULT}`;
        }

        return trimmedBudget;
    }


    /* ---------------- STATUS ---------------- */



    function getStatusAndReste(
        date_limite: string | null,
        statut: string | null,
        type: string | null // nouveau param
    ) {
        if (!statut) {
            return {
                statutTexte: "Indisponible",
                statutCouleur: "noir",
                resteTexte: "--",
                resteCouleur: "noir",
            };
        }



        const today = new Date();
        const limite = date_limite ? new Date(date_limite) : null;
        const diffTime = limite ? limite.getTime() - today.getTime() : 0;
        const diffDays = limite ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

        let statutTexte = "En cours";
        let statutCouleur: "vert" | "orange" | "rouge" | "noir" = "vert";
        let resteTexte = "--";
        let resteCouleur: "vert" | "orange" | "rouge" | "noir" = "vert";

        if (statut === "expire" || (limite && diffTime <= 0)) {
            statutTexte = type ? `${type}` : "Expiré";
            statutCouleur = "rouge";
            resteTexte = "Expiré";
            resteCouleur = "rouge";
        } else if (statut === "brouillon") {
            statutTexte = type ? `${type}` : "Brouillon";
            statutCouleur = "orange";
            resteTexte = "--";
            resteCouleur = "orange";
        } else {
            const mois = Math.floor(diffDays / 30);
            const jours = diffDays % 30;

            const moisTexte = mois > 0 ? `${mois} mois` : "";
            const joursTexte = jours > 0 ? `${jours} jour${jours > 1 ? "s" : ""}` : "";

            // Combiner mois et jours proprement
            resteTexte = [moisTexte, joursTexte].filter(Boolean).join(" ").trim();


            // Si aucun jour ni mois restant, mettre 0 jour restant
            if (!resteTexte) resteTexte = "0 jour";

            // Couleur selon urgence
            if (diffDays <= 3) resteCouleur = "rouge";
            else if (diffDays <= 7) resteCouleur = "orange";
            else resteCouleur = "vert";

            // Ligne modifiée pour ton nouveau texte
            statutTexte = type ? `${type}` : "En cours";
        }

        return { statutTexte, statutCouleur, resteTexte, resteCouleur };
    }



    /* ---------------- COUNTRY ---------------- */
    function getCountryInfo(code: string | null) {
        if (!code) {
            return { nom: "Indisponible", drapeauUrl: "" };
        }

        const pays = allPays.find(p => p.code === code.toUpperCase());
        if (!pays) {
            return { nom: code, drapeauUrl: "" };
        }

        return {
            nom: pays.nom,
            drapeauUrl: `https://flagcdn.com/w40/${code.toLowerCase()}.png`,
        };
    }

    /* ---------------- FORMAT ---------------- */
    function formatMontant(budget: string | null) {
        return budget && budget.trim() !== "" ? budget : "Non communiqué";
    }

    function formatDateLisible(dateStr: string | null) {
        if (!dateStr) return "--";

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "--";

        return (
            date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }) +
            " à " +
            date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    }

    function getAnnonceHref(a: Annonce) {
        const slug = slugify(a.objet, a.post_id || "");
        const ville = a.lieu
            ? a.lieu.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "toutes-villes";


        // tout le reste = appel d’offre
        return `${process.env.LOCAL_HOST}/emploi/dashboard/recherche/annonces/appel-offre/${ville}/${slug}`;
    }

    /* ---------------- RENDER ---------------- */
    return (
        <>
            <div className="annonce-list">
                {annonces.map(a => {
                    const status = getStatusAndReste(a.date_limite, a.statut, TYPE_DISPLAY_MAP[a.type]);
                    const pays = getCountryInfo(a.countryCode);


                    return (
                        <Link
                            key={a.id}
                            href={getAnnonceHref(a)}
                            className="titreLink"
                        >
                            <div className="annonce-card">
                                <div className="annonce-header">
                                    <span className={`status-annonce-liste ${status.statutCouleur}`}>

                                        {a.user_info == "indisponible" ? "Entreprise inconnue" : a.user_info}
                                        {" · "}
                                        {status.statutTexte}


                                    </span>
                                    <span className={`reste ${status.resteCouleur}`}>
                                        {status.resteTexte}
                                    </span>
                                </div>

                                <h3 className="titre">{a.objet ?? "Annonce sans titre"}</h3>

                                <div className="annonce-infos">
                                    <div>
                                        <label>Pays / Ville</label>
                                        <p>
                                            {pays.drapeauUrl && (
                                                <img src={pays.drapeauUrl} alt={pays.nom} width={30} />
                                            )}{" "}
                                            {pays.nom} {a.lieu ? `- ${a.lieu}` : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <label>Montant</label>
                                        <p>
                                            {
                                                a.type === "offre_emploi"
                                                    ? formatBudget(a.budget ?? undefined)
                                                    : formatBudget(a.budget ?? undefined)
                                            }


                                        </p>
                                    </div>

                                    <div>
                                        <label>Publié le</label>
                                        <p>{formatDateLisible(a.date_publication)}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <Pagination
                totalItems={total}
                currentPage={currentpage}
                itemsPerPage={12}
            />
        </>
    );
};

export default AnnonceList;
