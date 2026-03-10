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
                            <h1>Gagnez un appel d’offre au Bénin</h1>
                            <p className="textContent-recrutemnt">Suivez, postulez et maximisez vos chances de remporter les appels d’offres adaptés à votre profil ou votre entreprise.</p>
                            <div className='primaryBtnCtn'>

                                <button className="primaryBtn">Publier une offre gratuitement</button>

                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/announce.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="solution">
                        <h2>Nos solutions pour gagner un appel d’offre</h2>
                        <p>
                            Accédez aux appels d’offres, postulez et optimisez vos chances de succès sans perdre de temps.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="searchemploi">
                        <div className="textContent textContent3">
                            <div>
                                <h3>Appels d’offres nationaux, régionaux et internationaux</h3>
                                <p>Ne manquez aucune opportunité, quel que soit votre périmètre d’action.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Multipliez vos chances en accédant à toutes les opportunités disponibles.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Ciblez les marchés régionaux adaptés à votre expertise</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accédez aux opportunités internationale</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Positionnez votre entreprise sur des projets stratégiques</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/earth.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>

                    </section>

                    <div className='separation'> <div className='separationctn'> </div></div>


                    {/* Section 4 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h4>Marchés publics / projets</h4>
                                <p>Restez informé des appels d’offres et projets disponibles.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accédez à tous les appels d’offres actifs</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Filtrez par secteur, pays, budget ou type de marché</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Soyez alerté des projets correspondant à votre profil</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Gagnez du temps en trouvant rapidement les projets pertinents</span>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/recrutement.svg"
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
                                <h5>Accès aux dossiers d’appels d’offres</h5>
                                <p>Préparez vos candidatures efficacement avec tous les documents nécessaires.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Consultez le cahier des charges détaillé</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accédez aux documents requis et instructions de soumission</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Téléchargez et organisez les dossiers directement depuis votre espace</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Augmentez vos chances de succès en répondant de manière complète et structurée</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/tender_information.svg"
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
