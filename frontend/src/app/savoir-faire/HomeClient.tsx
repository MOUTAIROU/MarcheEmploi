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
                            <h1>Faciliter la rencontre entre emplois, recrutements, appels d’offres.</h1>
                            <p className="textContent-recrutemnt">Chez MarcheEmploi, notre intelligence artificielle centralise et analyse les opportunités professionnelles et commerciales pour aider les entreprises et les candidats à gagner du temps et à élargir leur horizon.</p>
                            <div className='primaryBtnCtn'>

                                <button className="primaryBtn">Inscription gratuite</button>

                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/savoirfaire.svg"
                                alt="Postuler à un emploi facilement"
                                width={400}
                                height={500}
                                className="image"
                            />
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="savoir-faire">


                        <h1 className="title"> Notre savoir-faire</h1>

                        <div className="grid">
                            <div className="card">
                                <h2>Veille automatisée</h2>
                                <p>
                                    Alimenté par une intelligence artificielle de pointe, notre système de veille intelligente scrute en temps réel des milliers de sources pour révéler les meilleures opportunités d’emploi et appels d’offres.
                                </p>
                                <p>
                                    Les informations essentielles de chaque annonce (lots, budgets, cahiers des charges, lieux d’exécution, conditions de participation, etc.) sont automatiquement détectées, organisées et présentées de manière claire pour faciliter la recherche et la lecture des utilisateurs.
                                </p>
                            </div>

                            <div className="card">
                                <h2>Partenariats</h2>
                                <p>
                                    Nos partenariats stratégiques avec des entreprises, institutions
                                    publiques ou organismes spécialisés nous permettent d’obtenir des
                                    informations exclusives sur les appels d’offres et les offres
                                    d’emploi.
                                </p>
                                <p>
                                    Ces collaborations renforcent la fiabilité de notre base de données
                                    et assurent à nos utilisateurs un accès privilégié à des opportunités
                                    vérifiées et mises en ligne rapidement.
                                </p>
                            </div>

                            <div className="card">
                                <h2>Analyse & classification</h2>
                                <p>
                                    Chaque annonce collectée est analysée en profondeur puis classée
                                    grâce à nos algorithmes de traitement intelligent. Les informations
                                    sont organisées par secteur d’activité, localisation géographique,
                                    type de contrat, budget ou date limite afin de faciliter la
                                    recherche.
                                </p>
                                <p>
                                    Ce processus garantit une navigation fluide et permet aux candidats
                                    comme aux entreprises de trouver rapidement les appels d’offres et
                                    offres d’emploi qui correspondent à leurs besoins.
                                </p>
                            </div>

                            <div className="card">
                                <h2>Mise à jour continue</h2>
                                <p>
                                    Notre système est actualisé en permanence pour garantir que seules
                                    les informations validées restent accessibles. Les annonces
                                    expirées ou obsolètes sont automatiquement retirées, tandis que les
                                    nouvelles opportunités sont intégrées sans délai.
                                </p>
                                <p>
                                    Grâce à cette mise à jour continue, nos utilisateurs disposent
                                    toujours d’une base de données fiable et à jour pour leurs
                                    recherches d’emplois ou de marchés.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className='separation'> <div className='separationctn'> </div></div>

                    {/* Section 3 */}
                    <section className="searchemploi">
                        <div className="textContent textContent3">
                            <div>
                                <h3>Nos garanties</h3>
                                <p>Pourquoi faire confiance à MarcheEmploi ?</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Fiabilité –</b> des informations vérifiées et régulièrement mises à jour.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Accessibilité –</b> une plateforme simple à utiliser, disponible partout et à tout moment.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Neutralité –</b> toutes les offres sont traitées de manière équitable, sans favoritisme.</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Sécurité –</b> protection des données et respect de la confidentialité des utilisateurs</span>
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
                                className="image heightImage2"
                            />
                        </div>

                    </section>

                    <div className='separation'> <div className='separationctn'> </div></div>


                    {/* Section 4 */}
                    <section className="searchemploi searchemploiTop">
                        <div className="textContent textContent3">
                            <div>
                                <h4>Notre vision et mission</h4>
                                <p>Ce qui guide MarcheEmploi</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Vision –</b> devenir la plateforme de référence pour l’emploi et les appels d’offres en Afrique francophone.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Mission –</b> connecter efficacement talents, entreprises et institutions grâce à une technologie intelligente.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Impact –</b> simplifier l’accès aux opportunités pour tous, quels que soient les secteurs.</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Engagement –</b> offrir un service fiable, transparent et en amélioration continue.</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <div className="imagectn">

                            <Image
                                src="/garantie.svg"
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
                                <h5>Passez à l’action</h5>
                                <p>Rejoignez dès aujourd’hui la communauté MarcheEmploi</p>
                                <ul>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Entreprises –</b>  publiez vos offres d’emploi et vos appels d’offres pour toucher plus de candidats et de partenaires.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Candidats –</b> trouvez des opportunités adaptées à votre profil et postulez en quelques clics.</span></li>
                                    <li> <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Partenaires –</b> collaborez avec nous pour enrichir et développer l’écosystème.</span></li>
                                    <li>
                                        <span className="icons-circle"><FaCircle color="#2563eb" size={12} /></span> <span className="icons-circle-txt"><b>Tous utilisateurs –</b> profitez d’une plateforme claire, sécurisée et toujours à jour.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                         <div className='passer-action'>
                             <button>Rejoignez la communauté MarcheEmploi</button>
                       </div>

                    </section>


                    <div className='separation'> <div className='separationctn'> </div></div>





                


                </div>





            </main>
            <footer >

            </footer>
        </div>
    );
}
