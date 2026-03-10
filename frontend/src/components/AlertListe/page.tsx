import React from "react";
import type { JSX } from "react";
import Link from "next/link";
import "./style.css";

/* =========================
   TYPES
========================= */

export interface DashboardMessage {
    id?: number;
    titre: string;
    texte: string;
    date: string;
    is_read?: boolean;
    type?: string;
}


/* =========================
   UTILS
========================= */

function slugify(titre: string, id: number | string) {
    const mots = titre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 10)
        .join("-");

    return `${mots}-${id}`;
}

function getIcon(type?: string) {
    if (type === "ENTRETIEN_UPDATE") return "📅";
    if (type === "CANDIDATURE") return "📩";
    return "🔔";
}

/* =========================
   COMPONENT
========================= */

const AlertListe: React.FC<any> = ({ annonces }) => {

    return (
        <div className="annonce-list">

            {annonces.map((m: any, index: any) => (
                <Link
                    key={m.id ?? index}
                    href={`${process.env.LOCAL_HOST}/entreprises/dashboard/notifications`}
                    className="titreLink"
                >
                    <div className={`annonce-card ${!m.is_read ? "nonlu" : ""}`}>

                        <div className="annonce-header">
                            <span className="icon">{getIcon(m.type)}</span>
                            <h3 className="titre">{m.titre}</h3>
                            {!m.is_read && <span className="badge">Nouveau</span>}
                        </div>

                        <p className="texte">{m.texte}</p>

                        <div className="date">
                            {new Date(m.date).toLocaleString("fr-FR")}
                        </div>

                    </div>
                </Link>
            ))}
        </div>
    );
};

export default AlertListe;
