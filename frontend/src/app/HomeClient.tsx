'use client';

import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";


const placeholders = [
    "Rechercher un emploi…",
    "Rechercher un talent…",
    "Rechercher un appel d’offres…",
];


export default function Home() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % placeholders.length);
        }, 3000); // change toutes les 3 secondes
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Header />
            <main >

                <section className="hero">
                    {/* Image décorative */}
                    <div className="heroImage">
                        <img src="/sepao_cover.svg" alt="Header illustration" />
                    </div>

                    {/* Texte au-dessus */}
                    <div className="textContent">
                        <h1 className="title">
                            Postulez à un emploi, recrutez un talent, gagnez un appel d’offres au Bénin
                        </h1>

                        <div className="search-container">
                            <span className="icon">🔍</span>
                            <input type="text" placeholder={placeholders[current]} />
                        </div>
                    </div>
                </section>

                <section className="container-section">
                    <div className="emplois">
                        <h2>Emplois</h2>
                        <ul>
                            <li> <span className="icons-circle"><FaCircle color="#2563eb" /></span> <span>Consultez toutes les offres nationales et internationales</span></li>
                            <li> <span className="icons-circle"><FaCircle color="#2563eb" /></span> <span>Recherche avancée : trouvez l’emploi qui correspond à votre profil</span></li>
                            <li> <span className="icons-circle"><FaCircle color="#2563eb" /></span> <span>Recevez dans votre domaine toutes les nouvelles offres d’emploi par e-mail</span></li>
                            <li>
                                <span className="icons-circle"><FaCircle color="#2563eb" /></span> <span >Soyez alerté immédiatement des nouvelles offres et postulez sans attendre </span>
                            </li>
                        </ul>
                        <button className="btn">En Savoir plus</button>
                    </div>

                    {/* Bloc Offres récentes */}
                    <div className="offres">
                        <h4>Offres récentes</h4>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 27 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 25 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 25 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 25 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <button className="btn">Toutes les offres d’emploi</button>
                    </div>
                </section>


                <section className="container-section container-section-auto">
                    {/* Bloc Offres récentes */}

                    <div className="entreprises">
                        <h2>Entreprises / Recrutement</h2>
                        <p>
                            Publiez vos offres, gérez vos candidats et organisez vos processus de recrutement facilement.
                        </p>

                        <ul>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Publier une offre</span></span>  <span className="entreprises-des">Déposez vos annonces rapidement et atteignez un large public de candidats qualifiés.</span>
                            </li>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Gérer les candidats</span></span>  <span className="entreprises-des">Accédez aux CV et suivez facilement les candidatures depuis votre tableau de bord.</span>
                            </li>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Créer et envoyer des QCM</span></span>  <span className="entreprises-des">Évaluez les compétences des candidats grâce à des QCM envoyés directement par email.</span>
                            </li>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Programmer des entretiens</span></span>  <span className="entreprises-des">Programmez facilement des entretiens avec vos candidats et gérez le processus de recrutement.</span>
                            </li>
                        </ul>
                        <button className="btn">Commencez à recruter</button>
                    </div>

                    <div className="emplois recrutement-image-ctn">
                        <div className="recrutement-image-ctn">
                            <Image
                                src="/recrutement.svg"
                                alt="Annonce fille"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>
                    </div>


                </section>

                <section className="container-section">
                    <div className="appels-doffres">
                        <h2>Appels d’offres recents</h2>

                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 27 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 25 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 25 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>
                        <div className="offre-card">
                            <h3>Développeur Front-End React (H/F)</h3>
                            <p>
                                Intégrez notre équipe tech pour développer des applications web modernes. Contribuez à des projets innovants et évolutifs…
                            </p>
                            <span className="date">Publié le 25 Septembre 2025</span>
                            <span className="status">En cours</span>
                            <button className="link">Consultez l’offre →</button>
                        </div>

                        <button className="btn">Tous les appels d'offres</button>
                    </div>

                    {/* Bloc Offres récentes */}
                    <div className="offres appeldoffres">
                        <h4>Entreprises / Appels d’offres</h4>



                        <p>
                            Restez informé des derniers marchés publics et projets disponibles.
                            Accédez facilement aux dossiers complets pour postuler
                            et ne manquer aucune opportunité.
                        </p>

                        <ul>
                            <li>
                                <span className="entreprises-titre">
                                    <span className="icons-circle"><FaCircle color="#fff" /></span>
                                    <span className="entreprises-titre-ctn">Marchés publics / projets</span>
                                </span>  <span className="entreprises-des">Consultez les derniers marchés publics et projets disponibles dans votre secteur. Restez informé des opportunités pour répondre rapidement aux appels d’offres pertinents.</span>
                            </li>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Accès aux dossiers d’appels d’offres</span></span>
                                <span className="entreprises-des">Accédez facilement aux documents et dossiers complets pour chaque appel d’offres. Préparez vos candidatures efficacement et ne manquez aucune opportunité.</span>
                            </li>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Filtre de recherche avancé</span></span>
                                <span className="entreprises-des">Trouvez rapidement les appels d’offres qui vous intéressent grâce à une recherche avancée. Filtrez par secteur, région, budget ou date limite pour accéder aux projets qui correspondent vraiment à vos besoins.</span>
                            </li>
                            <li>
                                <span className="entreprises-titre"><span className="icons-circle"><FaCircle color="#fff" /></span><span className="entreprises-titre-ctn">Messagerie & newsletter</span></span>
                                <span className="entreprises-des">Recevez des alertes d’appels d’offres directement dans votre compte et par e-mail. Grâce à la messagerie intégrée et à la newsletter personnalisée, vous restez toujours informé des nouvelles opportunités</span>
                            </li>

                        </ul>
                        <button className="btn">En savoire plus</button>

                    </div>
                </section>






            </main>
            <footer >

            </footer>
        </div>
    );
}
