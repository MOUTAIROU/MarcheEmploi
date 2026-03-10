'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";



export default function Home() {
    const [role, setRole] = useState("candidat");


    return (
        <div>
            <Header />
            <main >
                <div className="signup-container">
                    <div className="form-section">
                        <h2>Inscription</h2>

                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    checked={role === "candidat"}
                                    onChange={() => setRole("candidat")}
                                />
                                Candidat / Particulier
                            </label>
                            <label>

                                <input
                                    type="radio"
                                    checked={role === "entreprise"}
                                    onChange={() => setRole("entreprise")}
                                />
                                Entreprise / Recruteur
                            </label>
                        </div>

                        <form className="signup-form">
                            <input type="text" placeholder="Nom complet..." />
                            <input type="email" placeholder="E-mail" />
                            <input type="email" placeholder="Confirmer" />
                            <input type="password" placeholder="Mot de passe" />

                            <div className="checkbox">
                                <input type="checkbox" id="terms" />
                                <label htmlFor="terms">
                                    J’ai lu et j’accepte les Conditions d’utilisation et la Politique
                                    de confidentialité
                                </label>
                            </div>

                            <button type="submit" className="btn-submit">S’inscrire</button>

                            <div className="or">ou</div>


                            <div className="social-buttons">
                                <button className="social-btn google-btn">Google</button>
                                <button className="social-btn linkedin-btn">Linkedin</button>
                            </div>
                        </form>
                    </div>

                    <div className="info-section">
                        {
                            role == "candidat" ? 
                             <div className="info-section-ctn">
                                    <h3>Postulez facilement, restez informé</h3>
                                    <ul>
                                        <li>Offres d’emploi locales, régionales et internationales</li>
                                        <li>Appels d’offres ouverts aux particuliers</li>
                                        <li>Alertes personnalisées par e-mail ou WhatsApp</li>
                                        <li>Gestion facile de vos candidatures</li>
                                    </ul>
                                </div>
                                :
                                  <div className="info-section-ctn">
                                    <h3>Toutes vos offres d’emploi et appels d’offres au même endroit</h3>
                                    <ul>
                                        <li>Publication rapide d’offres d’emploi et d’appels d’offres</li>
                                        <li>Appels d’offres ouverts aux particuliers</li>
                                        <li>Organisation de QCM</li>
                                        <li>Accès à un vivier de talents ciblés</li>
                                    </ul>
                                </div>
                        }
                    </div>
                </div>


            </main>
            <footer >

            </footer>
        </div>
    );
}
