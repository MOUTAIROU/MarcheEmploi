'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import Link from "next/link";

 

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
                            <h1>La manière la plus simple de postuler à un emploi au Bénin</h1>
                            <div className='primaryBtnCtn'>
                                <button className="primaryBtn">Inscription gratuite</button>
                                <a href="#" className="link">
                                    Voir les offres d’emploi
                                </a>
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

                    {/* Section 2 */}
                    <section className="solution">
                        <h2>Une solution complète pour l’emploi</h2>
                        <p>
                            Accédez aux offres, postulez et recrutez sans perdre de temps.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="searchemploi">
                        <div className="textContent textContent3">
                            <div>
                                <h3>Moteur de recherche avancé</h3>
                                <p>Profitez de nos nombreux filtres pour créer des recherches ciblées.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Filtrez par métier, secteur ou localisation</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Sauvegardez vos recherches pour y revenir plus tard</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Partagez et organisez vos recherches facilement</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Recevez des suggestions d’offres adaptées à votre profil</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/search.svg"
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
                                <h4>Offres nationales et internationales</h4>
                                <p>Accédez à une large base d’annonces d’emploi, aussi bien locales qu’à l’étranger.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Consultez les offres dans tous les secteurs</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Explorez les opportunités à l’international</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Visualisez les annonces en temps réel</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accédez à des offres vérifiées et mises à jour</span>
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



                     {/* Section 5 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h5>Alertes emploi par e-mail ou WhatsApp</h5>
                                <p>Restez informé sans effort grâce à nos notifications personnalisées.</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Recevez toutes les nouvelles offres dans votre domaine</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Gagnez du temps avec une veille automatique</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Gérez vos alertes depuis votre espace personnel</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Accédez aux offres qui correspondent parfaitement à votre profil</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/news-letter.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image heightImage"
                            />
                        </div>

                    </section>

                    <div className='separation'> <div className='separationctn'> </div></div>

                     {/* Section 2 */}
                    <section className="solution">
                        <h6>Abonnement Premium — Newsletter Emploi</h6>
                        <p>Restez informé en temps réel des nouvelles offres d’emploi qui correspondent à votre profil.</p>
                        <p>Contrairement aux alertes classiques envoyées une fois par jour, vous recevez immédiatement chaque nouvelle annonce.</p>
                        
                    </section>


                    {/* Section 6 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h6>Avantages </h6>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Alertes instantanées dans votre domaine</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Soyez parmi les premiers à postuler</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Plus de chances de décrocher un entretien</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt">Abonnement flexible, sans engagement</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/priceemploi.svg"
                                alt="Premium newsletter emploi"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>

                    </section>


                </div>





            </main>
            <footer >

            </footer>
        </div>
    );
}
