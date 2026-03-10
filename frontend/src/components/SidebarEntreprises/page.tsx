"use client"
import "./style.css"
import Link from "next/link";


export default function Header() {
    return (
        <aside className="sidebar">
            <ul>
                <Link href="/"><li>Aller sur le site</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard`}><li>Tableau de bord</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/offre-emploi-appel-offre`}><li>Offre d'emploi/Appels d’offres</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/recherche-candidats`}><li> Recherche candidats</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/recherche-appel-offre`}><li> Recherche appels d’offres</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/mes-candidatures`}><li>Mes candidatures</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/enregistrements`}><li>Enregistrements</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/qcm-examen`}><li>QCM / Tests de compétences</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/entretiens`}><li>Entretiens</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/notifications`}><li>Notifications</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/parametres`}><li>Paramètres entreprise</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/entreprises/dashboard/login`}><li>Support / Aide</li></Link>
                <Link href="/"><li>Déconnexion</li></Link>
            </ul>
        </aside>
    )
}
