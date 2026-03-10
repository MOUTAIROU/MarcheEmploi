"use client";
import React from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import LettreMotivation from "@/components/LettreMotivationPage/page";

interface LettreProps {
    data: {
        nomCandidat: string;
        email: string;
        lettre: string;
        statut: string;
    };
}


const exempleLettre = `
<p>Objet : Candidature pour le poste de Développeur Web</p>

<p>Madame, Monsieur,</p>

<p>Actuellement passionné par le développement web et diplômé en informatique, je souhaite mettre mes compétences au service de votre entreprise. Fort de plusieurs expériences en projets web, je maîtrise les technologies React, Next.js, et Node.js, ainsi que la conception d'interfaces utilisateurs modernes et responsives.</p>

<p>Motivé, rigoureux et curieux, je suis capable de m'adapter rapidement à de nouveaux environnements et de contribuer efficacement à des projets ambitieux. Je suis convaincu que mon profil correspond aux besoins de votre équipe et je serais ravi de participer à vos projets.</p>

<p>Je me tiens à votre disposition pour un entretien afin de vous présenter mes réalisations et discuter de ma candidature.</p>

<p>Je vous remercie pour l’attention portée à ma candidature et vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.</p>

<p><strong>Moutaïrou Bastou</strong></p>
`;


export default function LettreMotivationPage({ data }: LettreProps) {
    return (
        <div>
            <main>
                <div className="container-dashbord">
                    <Sidebar />

                    <div className="mainContent">
                        <div className="header">
                            <h2>Lettre de motivation</h2>
                        </div>

                        <LettreMotivation
                            data={{
                                nomCandidat: "Moutaïrou Bastou",
                                email: "mbastouabdele55@gmail.com",
                                lettre: exempleLettre,
                                statut: ""
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
