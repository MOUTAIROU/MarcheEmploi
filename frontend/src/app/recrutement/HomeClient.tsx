'use client';
import './style.css';
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

    

    return (
        <div>
            <Header />
            <main >

                <div className="containeremploi">
                    {/* Section 1 */}
                    <section className="emploihero">
                        <div className="textContent">
                            <h1>Recrutez les meilleurs talents facilement au Bénin</h1>
                            <p className="textContent-recrutemnt">Publiez vos offres, évaluez les candidats et gagnez du temps dans vos recrutements.</p>
                            <div className='primaryBtnCtn'>

                                <button className="primaryBtn">Inscription gratuite</button>

                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/job2.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="solution">
                        <h2>Nos solutions pour recruter efficacement</h2>
                        <p>
                            Accédez aux offres, postulez et recrutez sans perdre de temps.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="searchemploi">
                        <div className="textContent textContent3">
                            <div>
                                <h3>Publier une offre</h3>
                                <p>Diffusez vos annonces d’emploi en quelques clics.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accès simple et rapide à la mise en ligne</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Large visibilité auprès des candidats inscrits</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Offres optimisées pour le référencement</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Possibilité de mise en avant avec l’abonnement Premium</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/postjob.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image heightImage2"
                            />
                        </div>

                    </section>

                    <div className='separation'> <div className='separationctn'> </div></div>


                    {/* Section 4 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h4>Gérer les candidats et accéder aux CV</h4>
                                <p>Centralisez toutes vos candidatures et consultez les profils complets.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accès direct aux <b> CV </b> des candidats</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Tableau de bord clair </b> et intuitif</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Classement automatique des profils par pertinence</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Sauvegarde et suivi des candidatures</span>
                                    </li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Export et partage des données avec votre équipe RH</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/candidateManager.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>

                    </section>

                    <div className='separation'> <div className='separationctn'> </div></div>



                    {/* Section 5 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h5>Créer et envoyer des QCM</h5>
                                <p>Testez les compétences de vos candidats directement en ligne.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>QCM personnalisés</b>selon vos besoins</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Évaluation rapide des savoir-faire techniques et pratiques</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Résultats instantanés accessibles depuis votre espace recruteur</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Gain de temps dans la présélection des profils</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/test.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image heightImage"
                            />
                        </div>

                    </section>


                    <div className='separation'> <div className='separationctn'> </div></div>



                    {/* Section 5 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h5>Programmer des entretiens</h5>
                                <p>Simplifiez la sélection de vos candidats grâce à un suivi en ligne</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Entretiens téléphoniques planifiés en quelques clics</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Invitation et confirmation automatiques</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Gestion des disponibilités des candidats</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Suivi centralisé des entretiens depuis le tableau de bord</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/schedule.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image heightImage"
                            />
                        </div>

                    </section>


                    <div className='separation'> <div className='separationctn'> </div></div>


                

                    {/* Section 6 */}
                    <section className='premiunctn'>
                        <h2 className="title">Abonnement Premium</h2>
                        <div className="content">
                            {/* Tableau fonctionnalités */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Fonctionnalité</th>
                                        <th>Gratuit</th>
                                        <th>Abonnement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="section">
                                        <td colSpan={3}>Recrutement</td>
                                    </tr>
                                    <tr>
                                        <td>Publier une offre</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Gérer les candidats & accès aux CV</td>
                                        <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Créer et envoyer des QCM</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Programmer des entretiens</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>

                                    <tr className="section">
                                        <td colSpan={3}>Emploi / Candidats</td>
                                    </tr>
                                    <tr>
                                        <td>Recherche simple</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Recherche avancée</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Sauvegarde de recherche</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Alertes e-mail en temps réel</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Consultation des offres</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Postuler directement</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>

                                    <tr className="section">
                                        <td colSpan={3}>Marchés publics / Appels d’offres</td>
                                    </tr>
                                   <tr>
                                        <td>Marchés en cours</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Appels à projets</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Résultats de marchés</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Marchés archivés</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Publication de marchés</td>
                                         <td className='tableValid'>✓</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Télécharger le fichier complet</td>
                                         <td className='tablenotValid'>✗</td>
                                          <td className='tableValid'>✓</td>
                                    </tr>
                                     <tr>
                                        <td>Lire un appel d’offres</td>
                                         <td className='tablenotValid'>✗</td>
                                          <td className='tableValid'>✓</td>
                                    </tr>
                                    <tr>
                                        <td>Recherche de partenaires</td>
                                         <td className='tablenotValid'>✗</td>
                                         <td className='tableValid'>✓</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Bloc abonnement */}
                            <div className="pricingBox">
                                <p className="subtitle">
                                    L'inscription est gratuite et sans engagement
                                </p>
                                <button className="cta">Inscription Gratuit</button>
                                <p className="choose">Choisissez un abonnement</p>

                                <div className="grid">
                                    <div className="plan">
                                        <h3>1 mois</h3>
                                        <p>10 000 XOF</p>
                                        <small>Soit 10000 XOF HT/mois</small>
                                    </div>
                                    <div className="plan">
                                        <h3>3 mois</h3>
                                        <p>25 500 XOF</p>
                                        <small>Soit 8500 XOF HT/mois</small>
                                    </div>
                                    <div className="plan">
                                        <h3>6 mois</h3>
                                        <p>48 000 XOF</p>
                                        <small>Soit 8000 XOF HT/mois</small>
                                    </div>
                                    <div className="plan">
                                        <h3>12 mois</h3>
                                        <p>90 000 XOF</p>
                                        <small>Soit 7500 XOF HT/mois</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                </div>





            </main>
            <footer >

            </footer>
        </div>
    );
}
