"use client"
import "./style.css"
import Link from "next/link";
export default function Header() {

    return (
        <aside className="sidebar">
            <ul>
                <Link href="/"><li>Aller sur le site</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard`}><li>Tableau de bord</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/mes-candidatures`}><li>Mes candidats</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/recherche`}><li>Postuler</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/enregistrements`}><li>Enregistrements</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/qcm-examen`}><li>QCM / Tests de compétences</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/entretiens`}><li>Entretiens</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/mon-cv`}><li>Mon CV</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/notifications`}><li>Notifications</li></Link>
                <Link href={`${process.env.LOCAL_HOST}/emploi/dashboard/parametres`}><li>Paramètre</li></Link>
                <Link href="/"><li>Déconnexion</li></Link>
            </ul>
        </aside>
    )
}
