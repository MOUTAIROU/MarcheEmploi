'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";



export default function Home() {
    const [role, setRole] = useState("candidat");

    console.log(role)

    return (
        <div>
            <Header />
            <main >
                <div className="signup-container-login">
                    <div className="form-section-login">
                        <div className="form-section-login2">
                            <h2>Connexion</h2>



                            <form className="signup-form">
                                <input type="email" placeholder="E-mail" />
                                <input type="password" placeholder="Mot de passe" />

                                <button type="submit" className="btn-submit">Connexion</button>

                                <div className="or">ou</div>


                                <div className="social-buttons">
                                    <button className="social-btn google-btn">Google</button>
                                    <button className="social-btn linkedin-btn">Linkedin</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="info-section-login">

                        <div className="info-section-ctn">
                                    <h3>Reprenez là où vous vous êtes arrêté</h3>
                                    <ul>
                                        <li>Accédez rapidement à votre tableau de bord</li>
                                        <li>Retrouvez vos candidatures, offres et alertes actives</li>
                                        <li>Publiez, suivez ou mettez à jour vos offres en toute simplicité</li>
                                        <li>Profitez d’une expérience fluide, que vous soyez candidat ou recruteur</li>
                                    </ul>
                                </div>



                    </div>
                </div>


            </main>
            <footer >

            </footer>
        </div>
    );
}
