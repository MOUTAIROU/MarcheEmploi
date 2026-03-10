'use client';

import './style.css';
import Header from '@/components/header/page';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { TYPE_DISPLAY_MAP, currency, EXPERIENCE_MAP, NIVEAU_ETUDE_MAP, TYPE_CONTRAT_MAP } from '@/utils/types';
import QuillContent from '@/components/QuillContent/page';
import Link from 'next/link';
import apiWithSession from "@/lib/axiosInstance";
import Popup from "@/components/Popup/PopupErrorWithLogin/page";
import PopupError from "@/components/Popup/PopupError/page";
import PostulerAppelOffre from "@/components/PostulerAppelOffre/page";
import PostulerOffreEmploi from "@/components/PostulerOffreEmploi/page";
import Sidebar from "@/components/SidebarEntreprises/page";


import SignalerAnnonce from "@/components/SignalerAnnonce/page";




import { useRouter } from "next/navigation";


interface Props {
    annonce_id: string;
}

interface Annonce {
    id: number;
    post_id: string;
    user_id: string;
    objet: string;
    description?: string | null;
    conditions?: string | null;
    documents_requis?: string | null;

    categorie: string;
    type: string;

    lieu: string;
    countryCode: string;

    budget: string;
    date_publication: string;
    date_limite?: string | null;
    expiration?: string | null;

    date_ouverture?: string | null;

    statut: string;
    visibilite: string;
    source: string;
    salaire: string;
    filenameBase?: string;
    poster_profile: boolean;

    user_info?: string; // ✅ nom entreprise

    experience?: string;        // intermediaire
    niveauEtudes?: string;      // master
    typeContrat?: string;       // freelance
    typeContratAutre?: string;  // si "autre"

}

interface PostuleAnnonce {
    id: string;
    titre: string;
    type: string;
    user_info: string;
};



export default function Home({ annonce_id }: Props) {
    const [annonce, setAnnonce] = useState<Annonce | null>(null);

    const [postuleAnnonce, setPostuleAnnonce] = useState<PostuleAnnonce | null>(null);
    const [showPostuleAnnonce, setShowPostuleAnnonce] = useState(false);

    const [showPostuleAnnonceAppel, setShowPostuleAnnonceAppel] = useState(false);

    const [showSignalerAnnonce, setShowSignalerAnnonce] = useState(false);

    const [isLogin, setIsLogin] = useState(false);
    const [routeLink, setRouteLink] = useState("");




    const [loading, setLoading] = useState(true);

    const [popupMessage, setPopupMessage] = useState("👉 Connectez-vous ou créez un compte pour postuler a cette annonce.");
    const [popupTitle, setPopupTitle] = useState("Authentification nécessaire");
    const [isOpenpopup, setIsOpenpopup] = useState(false);

    const [popupMessageError, setPopupMessageError] = useState("");
    const [popupTitleError, setPopupTitleError] = useState("");

    const [titlebtn, setTitlebtn] = useState("");

    const [isOpenpopupError, setIsOpenpopupError] = useState(false);
    const router = useRouter();



    /* ================= FETCH ================= */
    useEffect(() => {


        async function fetchAnnonce() {
            try {
                const res = await api.get(`/frontend/annonces/${annonce_id}`);


                if (res.status === 200 || res.status === 201) {

                    console.log(res.data.data)
                    setAnnonce(res.data.data);




                    setPostuleAnnonce({
                        id: res.data.data.post_id,
                        titre: res.data.data.objet,
                        type: res.data.data.type,
                        user_info: res.data.data.user_info,
                    })
                }
            } catch (error) {
                console.error('Erreur lors du chargement :', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnnonce();
    }, [annonce_id]);

    /* ================= HELPERS ================= */
    function formatBudget(budget?: string) {
        if (!budget || budget.trim() === '') {
            return 'Non communiqué';
        }

        const trimmedBudget = budget.trim();

        // Vérifie si une devise est déjà présente
        const hasCurrency = Object.values(currency).some(cur =>
            trimmedBudget.includes(cur)
        );

        // Si aucune devise trouvée → on ajoute la devise par défaut
        if (!hasCurrency) {
            return `${trimmedBudget} ${currency.DEFAULT}`;
        }

        return trimmedBudget;
    }

    function formatDate(date?: string | null) {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    function getStatusAndReste(
        date_limite: string | null,
        statut: string | null,
        type: string | null
    ) {
        if (!statut) {
            return {
                statutTexte: 'Indisponible',
                statutCouleur: 'noir',
                resteTexte: '--',
                resteCouleur: 'noir',
            };
        }

        const today = new Date();
        const limite = date_limite ? new Date(date_limite) : null;
        const diffTime = limite ? limite.getTime() - today.getTime() : 0;
        const diffDays = limite ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

        let statutTexte = 'En cours';
        let statutCouleur: 'vert' | 'orange' | 'rouge' | 'noir' = 'vert';
        let resteTexte = '--';
        let resteCouleur: 'vert' | 'orange' | 'rouge' | 'noir' = 'vert';

        if (statut === 'expire' || (limite && diffTime <= 0)) {
            statutTexte = type ?? 'Expiré';
            statutCouleur = 'rouge';
            resteTexte = 'Expiré';
            resteCouleur = 'rouge';
        } else if (statut === 'brouillon') {
            statutTexte = type ?? 'Brouillon';
            statutCouleur = 'orange';
            resteTexte = '--';
            resteCouleur = 'orange';
        } else {
            const mois = Math.floor(diffDays / 30);
            const jours = diffDays % 30;

            const moisTexte = mois > 0 ? `${mois} mois` : '';
            const joursTexte = jours > 0 ? `${jours} jour${jours > 1 ? 's' : ''}` : '';

            resteTexte = [moisTexte, joursTexte].filter(Boolean).join(' ') || '0 jour';

            if (diffDays <= 3) resteCouleur = 'rouge';
            else if (diffDays <= 7) resteCouleur = 'orange';

            statutTexte = type ?? 'En cours';
        }

        return { statutTexte, statutCouleur, resteTexte, resteCouleur };
    }

    function renderEntrepriseProfileLink(annonce: {
        poster_profile: boolean;
        user_id?: string;
        user_info?: string;
    }) {
        if (!annonce.poster_profile || !annonce.user_id) return null;

        const slugify = (text: string) =>
            text
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

        const entrepriseName =
            annonce.user_info && annonce.user_info !== 'indisponible'
                ? annonce.user_info
                : 'entreprise';

        const entrepriseSlug = slugify(entrepriseName);

        const href = `/entreprise/${entrepriseSlug}-${annonce.user_id}`;

        return (
            <Link
                href={href}
                className="action btn-outline"
                title={`Voir le profil de ${entrepriseName}`}
            >
                Voir le profil
            </Link>
        );
    }



    async function handleSaveAnnonce() {

        try {




            const res = await apiWithSession.post("/frontend/save_annonce", postuleAnnonce);


            if (res.status === 201) {

                if (res.data.status == "success") {

                    setPopupMessage("Annonce enregistrée avec succès")
                    setPopupTitle("✅ Succès – Enregistrement effectué")
                    setIsOpenpopup(true)
                }

                if (res.data.status == "info") {
                    setPopupMessage("Annonce déjà enregistrée")
                    setPopupTitle("ℹ️ Déjà enregistrée")
                    setIsOpenpopup(true)
                }

            }


        } catch (error: any) {

            if (error.response?.data?.code === "AUTH_REQUIRED") {
                // redirection login
                setIsOpenpopup(true)
                return;
            }

        }

    }

    async function handleSignalerAnnonce() {


        try {

            const res = await apiWithSession.get("/frontend/check_postulant");




            if (res.status === 201) {

                setShowSignalerAnnonce(true)

            }


        } catch (error: any) {

            if (error.response?.data?.code === "AUTH_REQUIRED") {
                // redirection login
                setPopupMessage("👉 Connectez-vous ou créez un compte pour signaler cette annonce.")
                setIsOpenpopup(true)
                return;
            }

        }

    }


    async function postuler() {
        try {

            const res = await apiWithSession.get("/frontend/check_postulant");




            if (res.status === 201) {

                setIsLogin(true)

                console.log(res)
                const role = res.data.data.role;
                const type = annonce?.type;
                const hasCv = res.data.data.has_cv;
                const has_publicProfile = res.data.data.has_publicProfile;

                const APPEL_OFFRE_TYPES = [
                    "appel_offre",
                    "ami",
                    "consultation",
                    "recrutement_consultant",
                ];


                /* =========================
                   🎯 CANDIDAT
                ==========================*/
                if (role === "candidat") {

                    // 🚫 Appels d’offres non autorisés
                    if (APPEL_OFFRE_TYPES.includes(type!)) {
                        setPopupMessageError(
                            "Cette opportunité est un appel d’offre. Elle est réservée aux consultants et aux entreprises. Si vous êtes consultant, veuillez mettre à jour votre profil."
                        );
                        setPopupTitleError("Accès limité");
                        setTitlebtn("Mettre à jour mon profil");
                        setIsOpenpopupError(true);
                        return;
                    }

                    // ✅ Offre d’emploi
                    if (type === "offre_emploi") {
                        if (hasCv) {
                            setShowPostuleAnnonce(true);
                        } else {
                            setPopupMessageError(
                                "Pour postuler à cette offre d’emploi, vous devez d’abord ajouter votre CV."
                            );

                            setRouteLink("/emploi/dashboard/mon-cv")
                            setPopupTitleError("CV requis");
                            setTitlebtn("Ajouter mon CV");
                            setIsOpenpopupError(true);
                        }
                        return;
                    }
                }

                /* =========================
                   🎯 CONSULTANT
                ==========================*/
                if (role === "consultant") {

                    if (!hasCv) {
                        setPopupMessageError(
                            "Pour postuler, vous devez d’abord ajouter votre CV."
                        );
                        setRouteLink("/emploi/dashboard/mon-cv")
                        setPopupTitleError("CV requis");
                        setTitlebtn("Ajouter mon CV");
                        setIsOpenpopupError(true);
                        return;
                    }

                    if (type === "offre_emploi") {
                        setShowPostuleAnnonce(true);
                    }

                    if (APPEL_OFFRE_TYPES.includes(type!)) {
                        setShowPostuleAnnonceAppel(true);
                    }

                    return;
                }

                /* =========================
                   🎯 ENTREPRISE
                ==========================*/
                if (role === "entreprise") {

                    if (!has_publicProfile) {
                        setPopupTitleError("Informations requises");
                        setRouteLink("/entreprises/dashboard/parametres/presentation-publique")
                        setPopupMessageError(
                            "Pour continuer, veuillez compléter les informations publiques de votre entreprise. Ces informations sont nécessaires pour assurer la visibilité et la crédibilité de votre profil."
                        );
                        setTitlebtn("Compléter maintenant");
                        setIsOpenpopupError(true);

                        return;

                    }

                    // 🚫 Entreprise sur offre emploi
                    if (type === "offre_emploi") {
                        setPopupMessageError(
                            "Les offres d’emploi sont réservées aux candidats. Les entreprises peuvent publier des offres et répondre aux appels d’offres."
                        );
                        setPopupTitleError("Information");
                        setTitlebtn("Publier une offre");
                        setIsOpenpopupError(true);
                        return;
                    }

                    // ✅ Appels d’offres
                    if (APPEL_OFFRE_TYPES.includes(type!)) {
                        setShowPostuleAnnonceAppel(true);
                        return;
                    }
                }
            }


        } catch (error: any) {

            if (error.response?.data?.code === "AUTH_REQUIRED") {
                // redirection login
                setIsOpenpopup(true)
                return;
            }

        }
    }

    const display_login = async () => {
        setIsOpenpopup(true)
        return;

    }
    const gotoLogin = async () => {

        if (!isLogin) {
            router.push(`${process.env.LOCAL_HOST}/connexion`);
            setIsOpenpopup(false)
            return;
        }

        router.push(`${process.env.LOCAL_HOST}/${routeLink}`);
        setIsOpenpopup(false)
        return;
    }


    /* ================= STATES ================= */
    if (loading) return <div className="loading">Chargement...</div>;
    if (!annonce) return <div className="error">Annonce introuvable.</div>;

    const status = getStatusAndReste(
        annonce.type === "offre_emploi"
            ? annonce.expiration ?? null
            : annonce.date_limite ?? null,
        annonce.statut ?? null,
        TYPE_DISPLAY_MAP[annonce.type] ?? annonce.type
    );



    /* ================= RENDER ================= */
    return (

        <div>
            <main >




                {showPostuleAnnonce && postuleAnnonce && (
                    <PostulerOffreEmploi
                        annonce={postuleAnnonce}
                        display_login={() => display_login()}
                        onClose={() => setShowPostuleAnnonce(false)}
                    />
                )}

                {showSignalerAnnonce && postuleAnnonce && (
                    <SignalerAnnonce
                        annonce={postuleAnnonce}
                        display_login={() => display_login()}
                        onClose={() => setShowSignalerAnnonce(false)}
                    />
                )}




                {showPostuleAnnonceAppel && postuleAnnonce && (
                    <PostulerAppelOffre
                        annonce={postuleAnnonce}
                        display_login={() => display_login()}
                        onClose={() => setShowPostuleAnnonceAppel(false)}
                    />
                )}



                {isOpenpopup && (
                    <Popup
                        isOpen={isOpenpopup}
                        title={popupTitle}
                        message={popupMessage}
                        onClose={() => setIsOpenpopup(false)}
                        onLogin={() => gotoLogin()}
                    />
                )}


                {isOpenpopupError && (
                    <PopupError
                        isOpen={isOpenpopupError}
                        title={popupTitleError}
                        message={popupMessageError}
                        titlebtn={titlebtn}
                        onClose={() => setIsOpenpopupError(false)}
                        onLogin={() => gotoLogin()}

                    />
                )}

                <div className="container-dashbord">

                    <Sidebar />

                    <div className="mainContent">

                        <div className="annonce-page">
                            <div className="card">

                                {/* HEADER */}
                                <div className="card-header">
                                    <div className="left">
                                        <span >
                                            {annonce.user_info && annonce.user_info !== 'indisponible'
                                                ? annonce.user_info
                                                : 'Entreprise inconnue'}
                                            {' · '}
                                            {status.statutTexte}
                                        </span>
                                    </div>

                                    <div className="right">
                                        <span className={`reste ${status.resteCouleur}`}>
                                            {status.resteTexte}
                                        </span>
                                    </div>
                                </div>

                                {/* TITRE */}
                                <h1 className="titre">{annonce.objet}</h1>

                                {/* CTA */}
                                <div className="ctas">
                                    {annonce.filenameBase && (
                                        <a
                                            className="btn btn-secondary"
                                            href={`/uploads/${annonce.filenameBase}`}
                                            download
                                        >
                                            Télécharger le dossier (PDF)
                                        </a>
                                    )}
                                    <button className="btn btn-primary" onClick={() => postuler()}>Postuler maintenant</button>
                                </div>

                                {/* CONTENU QUILL */}
                                {annonce.description && (
                                    <div className="content">
                                        <QuillContent html={annonce.description} />
                                    </div>
                                )}

                                {annonce.conditions && (
                                    <div className="content">
                                        <QuillContent html={annonce.conditions} />
                                    </div>
                                )}

                                {annonce.documents_requis && (
                                    <div className="content">
                                        <QuillContent html={annonce.documents_requis} />
                                    </div>
                                )}

                                {/* INFOS OFFRE EMPLOI */}
                                {annonce.type === "offre_emploi" && (
                                    <>
                                        {annonce.experience && (
                                            <div className="info-item">
                                                <label>Expérience requise</label>
                                                <p className="info-val nowrap">
                                                    {EXPERIENCE_MAP[annonce.experience] ?? annonce.experience}
                                                </p>
                                            </div>
                                        )}

                                        {annonce.niveauEtudes && (
                                            <div className="info-item">
                                                <label>Niveau d’études</label>
                                                <p className="info-val nowrap">
                                                    {NIVEAU_ETUDE_MAP[annonce.niveauEtudes] ?? annonce.niveauEtudes}
                                                </p>
                                            </div>
                                        )}

                                        {annonce.typeContrat && (
                                            <div className="info-item">
                                                <label>Type de contrat</label>
                                                <p className="info-val nowrap">
                                                    {TYPE_CONTRAT_MAP[annonce.typeContrat] ?? annonce.typeContrat}
                                                </p>
                                            </div>
                                        )}

                                        {annonce.typeContrat === "autre" && annonce.typeContratAutre && (
                                            <div className="info-item">
                                                <label>Autre type de contrat</label>
                                                <p className="info-val nowrap">
                                                    {annonce.typeContratAutre}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}


                                {/* INFOS */}
                                <div className="infos">
                                    <div className="info-item">
                                        <label>Localisation</label>
                                        <p className="info-val nowrap">
                                            {annonce.lieu} ({annonce.countryCode})
                                        </p>
                                    </div>

                                    <div className="info-item">
                                        <label>Budget</label>
                                        <p className="info-val nowrap">

                                            {
                                                annonce.type == "offre_emploi" ? formatBudget(annonce.salaire) : formatBudget(annonce.budget)
                                            }
                                        </p>
                                    </div>

                                    <div className="info-item">
                                        <label>Publié le</label>
                                        <p className="info-val nowrap">
                                            {formatDate(annonce.date_publication)}
                                        </p>
                                    </div>

                                    <div className="info-item">
                                        <label>Date limite</label>
                                        <p className="info-val nowrap">
                                            {
                                                annonce.type == "offre_emploi" ? formatDate(annonce.expiration) : formatDate(annonce.date_limite)
                                            }

                                        </p>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="actions">
                                    <button className="action btn-ghost" onClick={() => handleSaveAnnonce()}>Enregistrer</button>
                                    {

                                        annonce.poster_profile && (
                                            <>{renderEntrepriseProfileLink(annonce)}</>
                                        )
                                    }

                                    <button className="action btn-danger" onClick={() => handleSignalerAnnonce()}>Signaler</button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </main>

            <footer >

            </footer>
        </div>
    );
}
