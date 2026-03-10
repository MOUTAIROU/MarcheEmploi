'use client';
import './style.css';
import Header from '@/components/header/page';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import QuillContent from '@/components/QuillContent/page';
import { countryNumberCode, country, countryCode, CATEGORIE_DOMAINES } from "@/utils/types";
import Link from 'next/link';
import Image from "next/image";
interface Props {
    annonce_id: string;
}

export const allPays = [
    { code: "BJ", nom: "Bénin" },
    { code: "TG", nom: "Togo" },
    { code: "CI", nom: "Côte d’Ivoire" },
    { code: "SN", nom: "Sénégal" },
    { code: "CM", nom: "Cameroun" },
];

interface Entreprise {
    id: number;
    user_id: string;
    user_info: string;           // nom court affiché, ex: "DOUS TEC"
    nom?: string;                // nom officiel complet
    adresse?: string;
    countryCode: string;
    secteur?: string;
    site?: string;
    filenameBase?: any | null; // logo de l'entreprise
    presentation: string;        // description / présentation HTML
    mission: string;             // missions HTML
    valeurs: string;             // valeurs HTML
    createdAt: string;
    updatedAt: string;
}

export default function Home({ annonce_id }: Props) {
    const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEntreprise() {
            try {
                const res = await api.get(`/frontend/entreprise_info/${annonce_id}`);

                console.log(res)
                if (res.status === 200 || res.status === 201) {
                    setEntreprise(res.data.data);
                }
            } catch (error) {
                console.error('Erreur lors du chargement :', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEntreprise();
    }, [annonce_id]);

    function getCountryName(code?: string) {
        if (!code) return "—";

        const pays = allPays.find((p) => p.code === code);
        return pays ? pays.nom : code; // retourne code si non trouvé
    }

    if (loading) return <div className="loading">Chargement...</div>;
    if (!entreprise) return <div className="error">Entreprise introuvable.</div>;


    return (
        <div>
            <Header />

            <main>
                <div className="entreprise-page">
                    <div className="card">

                        {/* HEADER */}
                        <div className="card-header entreprise-header">
                            {entreprise.filenameBase && (


                                <Image
                                    src={`${process.env.SERVER_HOST}/uploads/${entreprise.filenameBase.photo_profil}`}
                                    alt={`Logo de ${entreprise.user_info}`}
                                    width={400}
                                    height={500}
                                    className="entreprise-logo"
                                />

                            )}
                            <div className="entreprise-title">
                                <h1>{entreprise.user_info}</h1>
                                {entreprise.nom && <p className="entreprise-nom">{entreprise.nom}</p>}
                                {entreprise.secteur && (
                                    <p className="entreprise-secteur">
                                        {CATEGORIE_DOMAINES[entreprise.secteur] || entreprise.secteur}
                                    </p>
                                )}
                                {entreprise.site && <p className="entreprise-secteur"><a href={entreprise.site} target="_blank" rel="noopener noreferrer">
                                    Site web
                                </a></p>}
                            </div>

                            {/* SITE */}

                        </div>



                        {/* PRESENTATION */}
                        <section className="entreprise-section">
                            <h2>Présentation</h2>
                            <QuillContent html={entreprise.presentation} />
                        </section>

                        {/* MISSION */}
                        <section className="entreprise-section">
                            <h2>Mission</h2>
                            <QuillContent html={entreprise.mission} />
                        </section>

                        {/* VALEURS */}
                        <section className="entreprise-section">
                            <h2>Valeurs</h2>
                            <QuillContent html={entreprise.valeurs} />
                        </section>

                        {/* INFORMATIONS COMPLEMENTAIRES */}
                        <section className="entreprise-infos">
                            {entreprise.adresse && (
                                <p>
                                    <strong>Adresse:</strong> {entreprise.adresse}
                                </p>
                            )}
                            <p>
                                <strong>Pays:</strong> {getCountryName(entreprise.countryCode)}
                            </p>
                            {/*<p>
                                <strong>Publié le:</strong> {new Date(entreprise.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                            <p>
                                <strong>Dernière mise à jour:</strong> {new Date(entreprise.updatedAt).toLocaleDateString('fr-FR')}
                            </p>*/}
                        </section>



                    </div>
                </div>
            </main>
        </div>
    );
}
