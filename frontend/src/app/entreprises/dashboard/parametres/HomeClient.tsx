'use client';
import './style.css';
import Sidebar from "@/components/SidebarEntreprises/page";
import Link from "next/link";

interface Parametre {
    icon: string;
    label: string;
    lien: string;
}

const parametres: Parametre[] = [
    { icon: "👤", label: "KYC (Know Your Customer)", lien: "/entreprises/dashboard/parametres/informations" },
    { icon: "🔒", label: "Ajouter collaborateurs", lien: "/entreprises/dashboard/parametres/ajouter-collaborateur" },
    { icon: "🔔", label: "Préférences de notification", lien: "/entreprises/dashboard/parametres/notification-preferences" },
    { icon: "🕵️‍♂️", label: "Facturation / abonnements", lien: "/entreprises/dashboard/parametres/facturation" },
    { icon: "🔔", label: "À propos de l’entreprise", lien: "/entreprises/dashboard/parametres/presentation-publique" },
    { icon: "🔔", label: "Gestion des utilisateurs", lien: "/entreprises/dashboard/parametres/gestion-utilisateurs" }
];

export default function Home() {

    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />
                    <div className="mainContent">
                        <div className="titre-content"><h3>Parametre</h3></div>

                        <div className='container-btn'>
                            {parametres.map((item, i) => (
                                <Link href={item.lien} key={i} className="card">
                                    <div className='icon'>{item.icon}</div>
                                    <div className="label">{item.label}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
