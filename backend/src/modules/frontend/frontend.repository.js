const { Op } = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");


const OffreEmploi = require("../models/offreEmploi");
const AppelOffre = require("../models/appelOffre");

const EntrepriseSaveCandidats = require("../models/EntrepriseSaveCandidats");
const User = require("../models/User");
const EntretienCandidat = require("../models/EntretienCandidat");
const NotesEntretien = require("../models/notesEntretie");
const EntrepriseInformation = require("../models/entrepriseInformation");
const NotificationPreference = require("../models/notificationPreference");
const PresentationPublic = require("../models/presentationPublic");
const AjouterCollaborateur = require("../models/ajouterCollaborateur");
const AppelOffreAmi = require("../models/appelOffreAmi");
const AppelOffreConsultation = require("../models/appelOffreConsultation");
const AppelOffreRecrutementConsultant = require("../models/appelOffreRecrutementConsultant");
const RechercheUtilisateur = require("../models/recherchesUtilisateurs");
const CandidatCv = require("../models/candidatCv");
const PostulationAnnonceOffreEmploi = require("../models/PostulationAnnonceOffreEmploi");
const PostulationAppelOffre = require("../models/PostulationAppelOffre");
const SaveAnnonce = require("../models/saveAnnonce");
const SignalAnnonce = require("../models/SignalAnnonce");
const SavedSearches = require("../models/savedSearches");
const candidatCvInformationPersonelle = require("../models/candidatCvInfoPersonnel");
const candidatCvProfil = require("../models/candidatCvProfil")


const { userInfo } = require("os");
const { createOrUpdateNotification } = require("../notification/notification.service");
const { title } = require("process");
const { Json } = require("sequelize/lib/utils");

const { PAYS_CODE_MAP, tablesToQuery } = require('../../../utils/helper')

const TYPE_TABLE_MAP = {
    "Offre d'emploi": OffreEmploi,
    "Appel d'offre": AppelOffre,
    "Appel à manifestation d'intérêt (AMI)": AppelOffreAmi,
    "Consultation": AppelOffreConsultation,
    "Recrutement consultant": AppelOffreRecrutementConsultant,
};




const getDateFromPeriode = (periode) => {
    const now = new Date();

    switch (periode) {
        case "Il y a 24h":
            return new Date(now.setDate(now.getDate() - 1));
        case "Il y a 7 jours":
            return new Date(now.setDate(now.getDate() - 7));
        case "Il y a 12 jours":
            return new Date(now.setDate(now.getDate() - 12));
        case "Il y a 30 jours":
            return new Date(now.setDate(now.getDate() - 30));
        default:
            return null;
    }
};


// 4️⃣ Repository
module.exports = {

    appelsOffres: async (codeContry) => {
        try {



            const [
                offresEmploi,
                appelsOffres,
                amis,
                consultations,
                recrutements
            ] = await Promise.all([

                OffreEmploi.findAll({
                    where: { countryCode: codeContry, statut: ["en_ligne"] },
                    order: [["createdAt", "DESC"]],
                }),


                AppelOffre.findAll({
                    where: { countryCode: codeContry, statut: ["en_ligne"] },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffreAmi.findAll({
                    where: { countryCode: codeContry, statut: ["en_ligne"] },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffreConsultation.findAll({
                    where: { countryCode: codeContry, statut: ["en_ligne"] },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffreRecrutementConsultant.findAll({
                    where: { countryCode: codeContry, statut: ["en_ligne"] },
                    order: [["createdAt", "DESC"]],
                }),
            ]);

            // Fusionner toutes les offres
            const allOffres = [
                ...appelsOffres.map(o => o.dataValues),
                ...amis.map(o => o.dataValues),
                ...consultations.map(o => o.dataValues),
                ...recrutements.map(o => o.dataValues),
            ];



            const allOffresEmploi = [
                ...offresEmploi.map(o => o.dataValues),
            ];

            //  console.log(allOffresEmploi)


            // Transformation du tableau
            const filteredOffresEmploi = await Promise.all(
                allOffresEmploi.map(async (offre, index) => ({
                    user_info: await getEntrepriseInfo(offre.user_id),
                    id: index,
                    user_id: offre.user_id,
                    post_id: offre.post_id,
                    type: offre.type,
                    objet: offre.objet,
                    categorie: offre.categorie,
                    description: offre.description,
                    lieu: offre.lieu,
                    date_publication: offre.date_publication,
                    visibilite: offre.visibilite,
                    date_limite: offre.expiration,
                    date_ouverture: null,
                    statut: offre.statut,
                    budget: offre.salaire,
                    countryCode: offre.countryCode,
                    createdAt: offre.createdAt
                })))

            // Transformation du tableau

            const filteredOffres = await Promise.all(
                allOffres.map(async (offre, index) => ({
                    id: index,
                    user_info: await getEntrepriseInfo(offre.user_id),
                    user_id: offre.user_id,
                    post_id: offre.post_id,
                    type: offre.type,
                    categorie: offre.categorie,
                    objet: offre.objet,
                    visibilite: offre.visibilite,
                    lieu: offre.lieu,
                    description: offre.type === 'appel_offre' ? offre.cahier_de_charge || '' : offre.description || '',
                    date_publication: offre.date_publication,
                    date_limite: offre.date_limite,
                    date_ouverture: offre.date_ouverture,
                    statut: offre.statut,
                    budget: offre.budget,
                    countryCode: offre.countryCode,
                    createdAt: offre.createdAt
                }))
            )


            // Combiner les deux tableaux
            let combinedOffres = [...filteredOffresEmploi, ...filteredOffres];

            // Trier par date de création décroissante (le plus récent en premier)
            combinedOffres.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Limiter aux 12 dernières offres
            let combinedOffresres = combinedOffres.slice(0, 12);

            // Réassigner les id : le dernier créé aura id = 0
            combinedOffresres = combinedOffresres.map((offre, index) => ({
                ...offre,
                id: index // index 0 = plus récent
            }));

            //console.log(combinedOffres)

            if (!combinedOffres) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: combinedOffres.length,
                    data: combinedOffresres,
                };
            }



        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    invitation: async (data) => {


        const token = data

        try {

            const collab = await AjouterCollaborateur.findOne({
                where: { invite_token: token },
            });

            if (!collab)
                return {
                    status: "error",
                    message: "Invitation invalide",
                    data: null,
                };

            if (collab.invite_expire < new Date())
                return {
                    status: "error",
                    message: "Invitation expirée",
                    data: null,
                };

            const entreprise = await User.findOne({
                where: { id: collab.user_id },
                raw: true,
            });

            let data = {
                nom: collab.nom,
                email: collab.email,
                entreprise: entreprise.nom,
            }
            // ✅ Succès
            return {
                status: "success",
                data: data,
            };


        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    invitation_accept: async (data) => {


        const { token, password } = data

        try {
            // 🔎 récupérer collaborateur par token
            const collaborateur = await AjouterCollaborateur.findOne({
                where: { invite_token: token },
            });

            if (!collaborateur) {
                return {
                    status: "error",
                    message: "Invitation invalide",
                }
            }

            // 🔒 vérifier expiration
            if (collaborateur.invite_expire && collaborateur.invite_expire < new Date()) {
                return {
                    status: "error",
                    message: "Invitation expirée",
                }
            }

            // 🔐 hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // ✅ mettre à jour le collaborateur
            await collaborateur.update({
                password: hashedPassword,
                accepted: true,
                invite_token: null,
                invite_expire: null,
            });

            return {
                status: "success",
                message: "Compte collaborateur activé avec succès",
            };
        } catch (err) {
            console.error("Erreur invitation_accept:", err);
            throw err;
        }
    },
    annonces: async (annonces_id) => {
        try {
            console.log("ID reçu:", annonces_id);

            if (!annonces_id) {
                return {
                    status: "error",
                    message: "ID annonce manquant",
                    data: null,
                };
            }

            let annonce = null;
            let source = null;

            // 🔹 OFF → OffreEmploi
            if (annonces_id.startsWith("OFF-")) {
                annonce = await OffreEmploi.findOne({
                    where: { post_id: annonces_id }
                });
                source = "OffreEmploi";
            }

            // 🔹 AOF → chercher dans toutes les tables AOF
            else if (annonces_id.startsWith("AOF-")) {

                const tables = [
                    { model: AppelOffre, name: "AppelOffre" },
                    { model: AppelOffreAmi, name: "AppelOffreAmi" },
                    { model: AppelOffreConsultation, name: "AppelOffreConsultation" },
                    { model: AppelOffreRecrutementConsultant, name: "AppelOffreRecrutementConsultant" },
                ];

                for (const t of tables) {
                    annonce = await t.model.findOne({
                        where: { post_id: annonces_id }
                    });

                    if (annonce) {
                        source = t.name;
                        break; // 🛑 stop dès qu'on trouve
                    }
                }
            }



            // 🧠 récupération profil du poster (async)
            const poster_profile = await getPosterProfile(annonce.user_id ?? null);

            const user_info = await getEntrepriseInfo(annonce.user_id ?? null);




            // ✅ OBJET FINAL NORMALISÉ
            const annonceFinale = {
                ...annonce.dataValues,
                poster_profile,
                user_info,
                source,         // utile pour debug / analytics
            };


            // ❌ Introuvable
            if (!annonce) {
                return {
                    status: "success",
                    data: null,
                    message: "Annonce introuvable",
                };
            }

            // ✅ Succès
            return {
                status: "success",
                source,
                data: annonceFinale,
            };

        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    check_postulant: async (user_id) => {
        try {
            if (!user_id) {
                throw new Error("Paramètres manquants");
            }

            // Récupération des informations de l'utilisateur
            const user_info = await User.findOne({
                where: { id: user_id },
                attributes: ["id", "role", "candidate_type"],
                raw: true,
            });



            // ❌ Utilisateur introuvable
            if (!user_info) {
                return {
                    status: "success",
                    data: null,
                    message: "Utilisateur introuvable",
                };
            }

            // Préparer les données finales
            let finaldata = { ...user_info };

            // Vérifier si c'est un candidat
            if (user_info.role === "candidat") {
                const is_cv = await CandidatCv.findOne({
                    where: { user_id },
                    raw: true,
                });

                // Ajouter un champ indiquant si le candidat a un CV
                finaldata.has_cv = !!is_cv; // true si CV trouvé, false sinon
            }

            let check_profile = await getPosterProfile(user_id)


            finaldata.has_publicProfile = check_profile
            // ✅ Succès
            return {
                status: "success",
                data: finaldata,
            };

        } catch (err) {
            console.error("Erreur check_postulant:", err);
            throw err;
        }
    },
    entreprise_info_data: async (user_id) => {
        try {


            if (!user_id) {
                throw new Error("Paramètres manquants");
            }

            // Récupération des informations de l'utilisateur
            const user_info = await User.findOne({
                where: { id: user_id },
                attributes: ["id", "role", "candidate_type", "email", "nom"],
                raw: true,
            });



            // ❌ Utilisateur introuvable
            if (!user_info) {
                return {
                    status: "success",
                    data: null,
                    message: "Utilisateur introuvable",
                };
            }



            // ✅ Succès
            return {
                status: "success",
                data: user_info,
            };

        } catch (err) {
            console.error("Erreur check_postulant:", err);
            throw err;
        }
    },
    postuler_annonce_appel_offre: async (data) => {
        try {


            console.log(data)
            const { user_id, annonce_id, nom, email, telephone, message, filenameBase } = data

            if (!user_id || !annonce_id) {
                throw new Error("Paramètres manquants");
            }


            // 🔍 Vérifier si déjà postulé
            const dejaPostule = await PostulationAppelOffre.findOne({
                where: { user_id, annonce_id },
            });

            if (dejaPostule) {

                return {
                    status: "error",
                    message: "Vous avez déjà postulé à cette annonce",
                };
            }

            // 🔔 Notification initiale (candidat)
            const notificationInitiale = {
                id: `notif_${Date.now()}`,
                status: "APPLIED",
                message_type: "INFO",
                message: "Votre candidature a bien été envoyée",
                action_type: "NONE",
                action_link: null,
                is_read: false,
                created_at: new Date()
            };


            // ✅ Création candidature
            const postulation = await PostulationAppelOffre.create({
                user_id,
                annonce_id,
                nom,
                email,
                telephone,
                lettre_motivation: message,
                metadata: {},
                tab_notification: [notificationInitiale],
                fichier_pdf: filenameBase
            });



            let annonce = await getEntrepriseIDbyAnnonceID(annonce_id)

            let info_entreprise = await getEntrepriseInfo(annonce.entreprise_id)

            let user_info = await getCandidatinfo(user_id)


            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur
                receiver_id: annonce.entreprise_id,
                receiver_name: info_entreprise,     // nom du candidat

                type: "APPLICATION",
                action: "APPLIED",

                title: "Nouvelle candidature reçue",
                message: `${user_info.nom} a postulé à votre appel d’offre : ${annonce.title}.`,

                object_id: annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: user_id,
                    annonce_reference: postulation.id || null,
                    is_read: false

                },

            });




            // Notification candidat
            await createOrUpdateNotification({
                sender_id: annonce.entreprise_id,
                sender_name: info_entreprise,            // Nom de l’entreprise

                receiver_id: user_id,
                receiver_name: user_info.nom,             // Nom du candidat

                type: "APPLICATION",
                action: "APPLIED",

                title: "Candidature envoyée avec succès",
                message: `Votre candidature pour l’appel d’offre « ${annonce.title} » a bien été envoyée à l’entreprise.`,

                object_id: annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    postulation_id: postulation.id,
                    entreprise_id: annonce.entreprise_id,
                    is_read: false,
                },
            });





            return {
                status: "success",
                data: postulation,
                message: "Candidature envoyée avec succès",
            };


        } catch (err) {
            console.error("Erreur postuler_annonce:", err);
            throw err;
        }
    },
    postuler_annonce: async (user_id, annonce_id, lettre_motivation, metadata = {}) => {
        try {
            if (!user_id || !annonce_id || !lettre_motivation) {
                throw new Error("Paramètres manquants");
            }




            // 🔍 Vérifier si déjà postulé
            const dejaPostule = await PostulationAnnonceOffreEmploi.findOne({
                where: { user_id, annonce_id },
            });

            if (dejaPostule) {
                return {
                    status: "error",
                    message: "Vous avez déjà postulé à cette annonce",
                };
            }

            // 🔔 Notification initiale (candidat)
            const notificationInitiale = {
                id: `notif_${Date.now()}`,
                status: "APPLIED",
                message_type: "INFO",
                message: "Votre candidature a bien été envoyée",
                action_type: "NONE",
                action_link: null,
                is_read: false,
                created_at: new Date()
            };


            // ✅ Création candidature
            const postulation = await PostulationAnnonceOffreEmploi.create({
                user_id,
                annonce_id,
                lettre_motivation,
                metadata,
                tab_notification: [notificationInitiale]
            });



            let annonce = await getEntrepriseIDbyAnnonceID(annonce_id)

            let info_entreprise = await getEntrepriseInfo(annonce.entreprise_id)

            let user_info = await getCandidatinfo(user_id)



            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur
                receiver_id: annonce.entreprise_id,
                receiver_name: info_entreprise,     // nom du candidat

                type: "APPLICATION",
                action: "APPLIED",

                title: "Nouvelle candidature reçue",
                message: `${user_info.nom} a postulé à votre appel d’offre : ${annonce.title}.`,

                object_id: annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: user_id,
                    annonce_reference: postulation.id || null,
                    is_read: false

                },

            });




            // Notification candidat
            await createOrUpdateNotification({
                sender_id: annonce.entreprise_id,
                sender_name: info_entreprise,            // Nom de l’entreprise

                receiver_id: user_id,
                receiver_name: user_info.nom,             // Nom du candidat

                type: "APPLICATION",
                action: "APPLIED",

                title: "Candidature envoyée avec succès",
                message: `Votre candidature pour l’appel d’offre « ${annonce.title} » a bien été envoyée à l’entreprise.`,

                object_id: annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    postulation_id: postulation.id,
                    entreprise_id: annonce.entreprise_id,
                    is_read: false,
                },
            });



            return {
                status: "success",
                data: postulation,
                message: "Candidature envoyée avec succès",
            };

        } catch (err) {
            console.error("Erreur postuler_annonce:", err);
            throw err;
        }
    },
    appels_offres_enregistrer: async (user_id, criteres) => {
        try {
            if (!user_id || !criteres) {
                throw new Error("Paramètres manquants");
            }

            // 1️⃣ Sérialisation des critères
            const criteresString = JSON.stringify(criteres);

            // 2️⃣ Génération du hash (unicité)
            const criteresHash = crypto
                .createHash("sha256")
                .update(criteresString)
                .digest("hex");

            // 3️⃣ Vérifier si la recherche existe déjà
            const rechercheExistante = await RechercheUtilisateur.findOne({
                where: {
                    user_id,
                    criteres_hash: criteresHash,
                },
            });

            // 4️⃣ Mettre toutes les autres recherches en inactif SEO
            await RechercheUtilisateur.update(
                { est_active_seo: false },
                { where: { user_id } }
            );

            if (rechercheExistante) {
                // 🔁 CAS : recherche déjà existante → mise à jour
                await RechercheUtilisateur.update({
                    nb_recherches: rechercheExistante.nb_recherches + 1,
                    derniere_utilisation: new Date(),
                    est_active_seo: true,
                }, {
                    where: {
                        user_id,
                        criteres_hash: criteresHash,
                    },
                });

                return {
                    status: "updated",
                    message: "Recherche existante mise à jour",
                };
            }

            // 5️⃣ CAS : nouvelle recherche
            const dateExpiration = new Date();
            dateExpiration.setMonth(dateExpiration.getMonth() + 6);

            await RechercheUtilisateur.create({
                user_id,
                criteres: criteresString,
                criteres_hash: criteresHash,
                est_active_seo: true,
                nb_recherches: 1,
                date_expiration: dateExpiration,
            });

            return {
                status: "created",
                message: "Recherche enregistrée avec succès",
            };

        } catch (err) {
            console.error("Erreur appels_offres_enregistrer:", err);
            throw err;
        }
    },

    entreprise_save_candidats: async (user_id, userId) => {
        try {

            let candidate_id = userId


            if (!user_id || !candidate_id) {
                throw new Error("Paramètres manquants");
            }

            // 🔹 Vérifier si le candidat est déjà enregistré par cette entreprise
            const existing = await EntrepriseSaveCandidats.findOne({
                where: { user_id, candidate_id },
            });

            if (existing) {
                console.log("Candidat déjà enregistré");
                return { message: "Candidat déjà enregistré", saved: false };
            }

            // 🔹 Enregistrement
            const saved = await EntrepriseSaveCandidats.create({
                user_id,
                candidate_id,
            });

            console.log("Candidat enregistré avec succès :", saved.id);
            return { message: "Candidat enregistré avec succès", saved: true };

        } catch (err) {
            console.error("Erreur appels_offres_enregistrer:", err);
            throw err;
        }
    },

    entreprise_info: async (annonces_id) => {
        try {
            console.log("ID reçu:", annonces_id);

            if (!annonces_id) {
                return {
                    status: "error",
                    message: "ID annonce manquant",
                    data: null,
                };
            }


            const profile = await PresentationPublic.findOne({
                where: { user_id: annonces_id },
                raw: true
            });


            const user_info = await getEntrepriseInfo(annonces_id ?? null);

            // ✅ OBJET FINAL NORMALISÉ
            const annonceFinale = {
                ...profile,
                user_info,
            };


            // ❌ Introuvable
            if (!annonceFinale) {
                return {
                    status: "success",
                    data: null,
                    message: "Annonce introuvable",
                };
            }

            // ✅ Succès
            return {
                status: "success",
                data: annonceFinale,
            };



        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    appels_offres_by_page: async (pays, page = 1, search = null) => {
        try {
            const LIMIT = 12;
            const offset = (page - 1) * LIMIT;

            console.log("PARAMS =>", pays, page, search);

            const isSearchEmpty =
                !search ||
                (
                    search.motsCles?.length === 0 &&
                    search.types?.length === 0 &&
                    search.pays?.length === 0 &&
                    search.villes?.length === 0 &&
                    search.secteurs?.length === 0 &&
                    !search.periode &&
                    !search.dateDebut &&
                    !search.dateFin
                );

            // 🔹 WHERE de base
            const baseWhere = {
                countryCode: pays,
                statut: "en_ligne",
            };

            // 🔹 Récupération des données (recherche vide pour l’instant)
            const [
                offresEmploi,
                appelsOffres,
                amis,
                consultations,
                recrutements,
            ] = await Promise.all([
                OffreEmploi.findAll({
                    where: baseWhere,
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffre.findAll({
                    where: baseWhere,
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffreAmi.findAll({
                    where: baseWhere,
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffreConsultation.findAll({
                    where: baseWhere,
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffreRecrutementConsultant.findAll({
                    where: baseWhere,
                    order: [["createdAt", "DESC"]],
                }),
            ]);

            // 🔹 Mapping


            console.log(offresEmploiMapped)

            const offresEmploiMapped = await Promise.all(
                offresEmploi.map(async (offre) => ({
                    user_info: await getEntrepriseInfo(offre.user_id),
                    user_id: offre.user_id,
                    post_id: offre.post_id,
                    type: offre.type,
                    objet: offre.objet,
                    categorie: offre.categorie,
                    description: offre.description,
                    lieu: offre.lieu,
                    date_publication: offre.date_publication,
                    visibilite: offre.visibilite,
                    date_limite: offre.expiration,
                    date_ouverture: null,
                    statut: offre.statut,
                    budget: offre.salaire,
                    countryCode: offre.countryCode,
                    createdAt: offre.createdAt,
                }))
            )

            const autresOffres = await Promise.all(

                [
                    ...appelsOffres,
                    ...amis,
                    ...consultations,
                    ...recrutements,
                ].map(async (offre) => ({
                    user_info: await getEntrepriseInfo(offre.user_id),
                    user_id: offre.user_id,
                    post_id: offre.post_id,
                    type: offre.type,
                    categorie: offre.categorie,
                    objet: offre.objet,
                    visibilite: offre.visibilite,
                    lieu: offre.lieu,
                    description:
                        offre.type === "appel_offre"
                            ? offre.cahier_de_charge || ""
                            : offre.description || "",
                    date_publication: offre.date_publication,
                    date_limite: offre.date_limite,
                    date_ouverture: offre.date_ouverture,
                    statut: offre.statut,
                    budget: offre.budget,
                    countryCode: offre.countryCode,
                    createdAt: offre.createdAt,
                }))
            )



            // 🔹 Fusion
            let combinedOffres = [...offresEmploiMapped, ...autresOffres];

            console.log(combinedOffres)

            // 🔹 Tri par date
            combinedOffres.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            const total = combinedOffres.length;




            // 🔹 Pagination
            const paginatedData = combinedOffres
                .slice(offset, offset + LIMIT)
                .map((offre, index) => ({
                    ...offre,
                    id: offset + index,
                }));

            console.log(paginatedData)

            return {
                status: "success",
                total,
                page,
                perPage: LIMIT,
                data: paginatedData,
            };
        } catch (err) {
            console.error("Erreur appels_offres_by_page:", err);
            throw err;
        }
    },

    appels_offres_recherche: async (data, page = 1) => {
        try {




            const LIMIT = 12;
            const offset = (page - 1) * LIMIT;

            /* =============================
               1️⃣ Types & tables
            ============================== */

            const selectedTypes = Array.isArray(data.types) ? data.types : [];

            const tablesToQuery =
                selectedTypes.length > 0
                    ? selectedTypes.map(t => TYPE_TABLE_MAP[t]).filter(Boolean)
                    : Object.values(TYPE_TABLE_MAP);



            /* =============================
               2️⃣ Base WHERE commun
            ============================== */

            const baseWhere = {
                statut: "en_ligne"
            };



            if (data.pays?.length > 0) {
                // transforme ["Bénin", "Togo"] → ["BJ", "TG"]
                const countryCodes = data.pays
                    .map(nomPays => PAYS_CODE_MAP[nomPays])
                    .filter(Boolean); // ignore les noms qui n’existent pas dans le mapping

                if (countryCodes.length > 0) {
                    baseWhere.countryCode = countryCodes;
                }
            }

            if (data.villes?.length > 0) {
                baseWhere.lieu = data.villes;
            }

            if (data.secteurs?.length > 0) {
                baseWhere.categorie = data.secteurs;
            }

            /* =============================
               3️⃣ Mots-clés (AND / OR)
            ============================== */

            const motsClesConditions = [];

            if (data.motsCles?.length > 0) {
                data.motsCles.forEach(mot => {
                    motsClesConditions.push({
                        [Op.or]: [
                            { objet: { [Op.like]: `%${mot}%` } },
                            { description: { [Op.like]: `%${mot}%` } },
                            { categorie: { [Op.like]: `%${mot}%` } },
                        ],
                    });
                });
            }

            if (motsClesConditions.length > 0) {
                baseWhere[Op.and] = motsClesConditions;
            }

            /* =============================
               4️⃣ Dates (PRIORITÉ période)
            ============================== */

            if (data.periode) {
                const minDate = getDateFromPeriode(data.periode);
                if (minDate) {
                    baseWhere.createdAt = { [Op.gte]: minDate };
                }
            } else if (data.dateDebut || data.dateFin) {
                if (data.dateDebut && data.dateFin) {
                    baseWhere.createdAt = {
                        [Op.between]: [
                            new Date(data.dateDebut),
                            new Date(data.dateFin),
                        ],
                    };
                } else if (data.dateDebut) {
                    baseWhere.createdAt = {
                        [Op.gte]: new Date(data.dateDebut),
                    };
                } else if (data.dateFin) {
                    baseWhere.createdAt = {
                        [Op.lte]: new Date(data.dateFin),
                    };
                }
            }



            /* =============================
               5️⃣ Requêtes dynamiques
            ============================== */

            const queries = tablesToQuery.map(model =>
                model.findAll({
                    where: baseWhere,
                    order: [["createdAt", "DESC"]],
                })
            );

            const results = (await Promise.all(queries)).flat();

            /* =============================
               6️⃣ Normalisation & tri
            ============================== */


            const combinedOffres = await Promise.all(
                results
                    .map(async (offre) => ({
                        user_info: await getEntrepriseInfo(offre.user_id),
                        user_id: offre.user_id,
                        post_id: offre.post_id,
                        type: offre.type,
                        objet: offre.objet,
                        categorie: offre.categorie,
                        description: offre.description || offre.cahier_de_charge || "",
                        lieu: offre.lieu,
                        date_publication: offre.date_publication,
                        date_limite: offre.date_limite || offre.expiration,
                        date_ouverture: offre.date_ouverture || null,
                        statut: offre.statut,
                        budget: offre.budget || offre.salaire,
                        countryCode: offre.countryCode,
                        createdAt: offre.createdAt,
                    }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            )



            const total = combinedOffres.length;

            /* =============================
               7️⃣ Pagination finale
            ============================== */

            const dataPaginated = combinedOffres
                .slice(offset, offset + LIMIT)
                .map((offre, index) => ({
                    ...offre,
                    id: offset + index,
                }));

            return {
                status: "success",
                total,
                page,
                perPage: LIMIT,
                data: dataPaginated,
            };

        } catch (err) {
            console.error("Erreur appels_offres_recherche:", err);
            throw err;
        }
    },
    entreprises_candidats_recherche: async (data, page = 1) => {
        try {
            const LIMIT = 12;
            const offset = (page - 1) * LIMIT;

            const { criteres, user_id } = data;

            // 1️⃣ Recherche dans les recherches sauvegardées
            const savedSearchResults = await searchCandidatesByKeywords(
                criteres,
                page
            );

            console.log(criteres);

            // 2️⃣ Enrichir les candidats avec CV, profil, pays, etc.
            let res = await enrichCandidatesWithSavedSearch(savedSearchResults, criteres);

            // 3️⃣ Filtrer par pays si précisé dans les critères
            if (criteres.pays && criteres.pays.length > 0) {
                const allowedPays = criteres.pays.map(p => normalize(p));
                res = res.filter(c => allowedPays.includes(normalize(c.pays)));
            }

            if (res.length > 0) {
                return {
                    source: "saved_searches",
                    results: res
                };
            }

            return {
                source: "saved_searches",
                results: []
            };


        } catch (err) {
            console.error("Erreur entreprises_candidats_recherche:", err);
            throw err;
        }
    },



    candidat_recherche_emploi: async (data, page = 1) => {
        try {
            const LIMIT = 12;
            const offset = (page - 1) * LIMIT;
            const { criteres, user_id } = data;

            const userInfo = await getCandidatinfo(user_id)

            // Construire la phrase résumé
            const resume = buildProfilPhrase(criteres, userInfo.nom);


            // Vérifier si une recherche similaire existe pour cet utilisateur
            const existing = await SavedSearches.findOne({
                where: {
                    user_id,
                    resume, // ou criteres_json si tu veux comparer le JSON exact
                },
            });

            if (existing) {
                // Mise à jour
                await SavedSearches.update(
                    {
                        criteres_json: JSON.stringify(criteres),
                        updated_at: new Date(),
                    },
                    {
                        where: { user_id },
                    }
                );
                console.log("Recherche existante mise à jour !");
            } else {
                // Création
                await SavedSearches.create({
                    user_id,
                    criteres_json: JSON.stringify(criteres),
                    resume,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                console.log("Nouvelle recherche enregistrée !");
            }

            const codesPays = criteres.pays ? criteres.pays.split(",").map(p => p.trim()) : [];

            const result = await rechercherEmploi(criteres, codesPays[1], page);

            const formattedResult = await formatResultTab(formatResult(result))

            return {
                status: "success",
                data: formattedResult,
                message: "Eenvoyé avec succès",
            };




        } catch (err) {
            console.error("Erreur candidat_recherche_emploi:", err);
            throw err;
        }
    },

    candidat_recherche_emploi_save: async (data, page = 1) => {
        try {


            const LIMIT = 12;
            const offset = (page - 1) * LIMIT;

            console.log(data)


        } catch (err) {
            console.error("Erreur appels_offres_recherche:", err);
            throw err;
        }
    },
    save_annonce: async (data) => {
        try {


            // Vérifier si déjà enregistré
            const exist = await SaveAnnonce.findOne({
                where: {
                    post_id: data.id,
                    user_id: data.user_id,
                },
            });

            if (exist) {
                return {
                    status: "info",
                    data: exist,
                    message: "Annonce déjà enregistrée",
                };
            }

            // Sinon on crée
            const annonce = await SaveAnnonce.create({
                post_id: data.id,
                user_id: data.user_id,
                user_info: data.user_info,
                titre: data.titre,
                type: data.type,
            });

            return {
                status: "success",
                data: annonce,
                message: "Enregistré avec succès",
            };



        } catch (err) {
            console.error("Erreur appels_offres_recherche:", err);
            throw err;
        }
    },
    signaler_annonce: async (data) => {
        try {


            // 1️⃣ Vérifier si déjà signalée par cet utilisateur
            const exist = await SignalAnnonce.findOne({
                where: {
                    annonce_id: data.annonce_id,
                    user_id: data.user_id,
                },
            });

            if (exist) {
                return {
                    status: "info",
                    message: "Vous avez déjà signalé cette annonce",
                };
            }

            // 2️⃣ Enregistrement du signalement
            const signalement = await SignalAnnonce.create({
                annonce_id: data.annonce_id,
                user_id: data.user_id,
                message: data.lettre_motivation,
            });

            return {
                status: "success",
                data: signalement,
                message: "Signalement envoyé avec succès",
            };

        } catch (err) {
            console.error("Erreur signaler_annonce:", err);
            throw err;
        }
    },


};

/*
async function rechercherEmploi(criteres, codeContry, page = 1) {
    const LIMIT = 12;
    const offset = (page - 1) * LIMIT;


    console.log(criteres)

    const { emploiRecherche, villes, typeContrat, secteurs, niveauEtude } = criteres;

    // 🔹 Filtres communs pour toutes les tables
    const filtreCommun = {
        countryCode: codeContry,
        statut: { [Op.in]: ["en_ligne"] },
    };
  
    
    
    // 🔹 Filtres dynamiques communs
    if (emploiRecherche) {
        const mots = emploiRecherche.split(",").map(m => m.trim());
        filtreCommun[Op.or] = mots.map(mot => ({
            [Op.or]: [
                { objet: { [Op.like]: `%${mot}%` } },
                { description: { [Op.like]: `%${mot}%` } }
            ]
        }));
    }

    // 🔹 Recherche du niveau d’étude dans la description (texte libre)
    
    if (niveauEtude && niveauEtude.length > 0) {
        const niveauKeywords = niveauEtude.flatMap(n =>
            normalizeNiveauEtude(n)
        );

        const niveauConditions = niveauKeywords.map(keyword => ({
            description: { [Op.like]: `%${keyword}%` }
        }));

        if (filtreCommun[Op.or]) {
            filtreCommun[Op.or].push(...niveauConditions);
        } else {
            filtreCommun[Op.or] = niveauConditions;
        }
    }
   

    if (secteurs && secteurs.length > 0) {
        filtreCommun.categorie = { [Op.in]: secteurs };
    }


    // 🔹 Recherche dans toutes les tables

    console.log({
                ...filtreCommun,
                ...(typeContrat && typeContrat.length > 0
                    ? { typeContrat: { [Op.in]: typeContrat } }
                    : {}),
                ...(niveauEtude && niveauEtude.length > 0
                    ? { niveauEtudes: { [Op.in]: niveauEtude } }
                    : {})
            })
    const [
        offresEmploi,
        amis,
        consultations,
        recrutements
    ] = await Promise.all([

        // ✅ Offres emploi : typeContrat + niveauEtudes
        OffreEmploi.findAll({
            where: {
                ...filtreCommun,
                ...(typeContrat && typeContrat.length > 0
                    ? { typeContrat: { [Op.in]: typeContrat } }
                    : {}),
                ...(niveauEtude && niveauEtude.length > 0
                    ? { niveauEtudes: { [Op.in]: niveauEtude } }
                    : {})
            },
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),

        // 🔹 Autres tables : pas de typeContrat ni niveauEtudes
        AppelOffreAmi.findAll({
            where: { ...filtreCommun },
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),

        AppelOffreConsultation.findAll({
            where: { ...filtreCommun },
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),

        AppelOffreRecrutementConsultant.findAll({
            where: { ...filtreCommun },
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),
    ]);
    

    return { offresEmploi, amis, consultations, recrutements };
}
*/


async function rechercherEmploi(criteres, codeContry, page = 1) {

    const LIMIT = 12;
    const offset = (page - 1) * LIMIT;

    const { emploiRecherche, villes, typeContrat, secteurs, niveauEtude } = criteres;

    // 🔹 Base commune
    const baseWhere = {
        countryCode: codeContry,
        statut: "en_ligne"
    };

    // =========================
    // 🔹 Recherche texte
    // =========================
    let rechercheTexte = {};

    if (emploiRecherche) {
        const mots = emploiRecherche
            .split(",")
            .map(m => m.trim())
            .filter(Boolean);

        rechercheTexte = {
            [Op.and]: mots.map(mot => ({
                [Op.or]: [
                    { objet: { [Op.like]: `%${mot}%` } },
                    { description: { [Op.like]: `%${mot}%` } }
                ]
            }))
        };
    }

    // =========================
    // 🔹 WHERE OFFRES EMPLOI
    // =========================
    const whereOffres = {
        ...baseWhere,
        ...rechercheTexte
    };

    if (villes && villes.length > 0) {
        whereOffres.lieu = { [Op.in]: villes };
    }

    if (secteurs && secteurs.length > 0) {
        whereOffres.categorie = { [Op.in]: secteurs };
    }

    if (typeContrat && typeContrat.length > 0) {
        whereOffres.typeContrat = { [Op.in]: typeContrat };
    }

    if (niveauEtude && niveauEtude.length > 0) {
        whereOffres.niveauEtudes = { [Op.in]: niveauEtude };
    }

    // =========================
    // 🔹 WHERE APPELS D'OFFRES
    // =========================
    const whereAppelOffre = {
        ...baseWhere,
        ...rechercheTexte
    };

    console.log("WHERE OFFRES :", whereOffres);
    console.log("WHERE APPELS :", whereAppelOffre);

    // =========================
    // 🔹 Requêtes parallèles
    // =========================
    const [
        offresEmploi,
        amis,
        consultations,
        recrutements
    ] = await Promise.all([

        OffreEmploi.findAll({
            where: whereOffres,
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),

        AppelOffreAmi.findAll({
            where: whereAppelOffre,
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),

        AppelOffreConsultation.findAll({
            where: whereAppelOffre,
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        }),

        AppelOffreRecrutementConsultant.findAll({
            where: whereAppelOffre,
            order: [["createdAt", "DESC"]],
            limit: LIMIT,
            offset
        })
    ]);

    return {
        offresEmploi,
        amis,
        consultations,
        recrutements
    };
}




function normalizeNiveauEtude(niveau) {
    const n = niveau.toLowerCase();

    const keywords = new Set();

    if (n.includes("master")) {
        keywords.add("master");
    }

    if (n.includes("bac")) {
        keywords.add("bac");
    }

    if (n.includes("bac +4") || n.includes("bac+4") || n.includes("4")) {
        keywords.add("bac+4");
        keywords.add("bac 4");
        keywords.add("m1");
    }

    return Array.from(keywords);
}

async function formatResultTab(result) {
    const {
        offresEmploi = [],
        amis = [],
        consultations = [],
        recrutements = []
    } = result;

    // 🔹 1. Normalisation Offres d'emploi
    const formattedOffresEmploi = await Promise.all(
        offresEmploi.map(async (offre, index) => ({
            id: `emploi-${index}`,
            user_info: await getEntrepriseInfo(offre.user_id),
            user_id: offre.user_id,
            post_id: offre.post_id,
            type: "emploi",
            objet: offre.objet,
            categorie: offre.categorie,
            description: offre.description,
            lieu: offre.lieu,
            date_publication: offre.date_publication,
            date_limite: offre.expiration || offre.date_limite || null,
            date_ouverture: null,
            visibilite: offre.visibilite,
            statut: offre.statut,
            budget: offre.salaire || null,
            countryCode: offre.countryCode,
            createdAt: offre.createdAt
        }))
    );

    // 🔹 2. Fonction générique pour AMI / CONSULTATION / RECRUTEMENT
    const formatAutresOffres = async (offres, typeLabel) =>
        Promise.all(
            offres.map(async (offre, index) => ({
                id: `${typeLabel}-${index}`,
                user_info: await getEntrepriseInfo(offre.user_id),
                user_id: offre.user_id,
                post_id: offre.post_id,
                type: typeLabel,
                objet: offre.objet,
                categorie: offre.categorie || null,
                description: offre.description || '',
                lieu: offre.lieu,
                date_publication: offre.date_publication,
                date_limite: offre.date_limite || null,
                date_ouverture: offre.date_ouverture || null,
                visibilite: offre.visibilite,
                statut: offre.statut,
                budget: offre.budget || null,
                countryCode: offre.countryCode,
                createdAt: offre.createdAt
            }))
        );

    const formattedAmis = await formatAutresOffres(amis, "ami");
    const formattedConsultations = await formatAutresOffres(consultations, "consultation");
    const formattedRecrutements = await formatAutresOffres(recrutements, "recrutement");

    // 🔹 3. Fusionner tous les tableaux
    let combinedOffres = [
        ...formattedOffresEmploi,
        ...formattedAmis,
        ...formattedConsultations,
        ...formattedRecrutements
    ];

    // 🔹 4. Trier par date (plus récent en premier)
    combinedOffres.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return combinedOffres;
}


const get_nbr_candidature = (post_id) => {
    // Ici tu pourrais faire une requête SQL ou Sequelize pour compter les candidatures
    return 9; // Valeur par défaut pour l'exemple
};

async function getScoreMoyenByOffreId(offreId) {
    // TODO: calcul réel plus tard
    return 9;
}

async function getNombreCandidatsByOffreId(offreId) {
    // TODO: compter les candidats liés à l'offre
    return 0;
}

const getCandidat = async (candidatCode) => {
    // Exemple : SELECT email, nom FROM candidats WHERE code = candidatCode
    return {
        email: "candidat@email.com",
        nom: "Jean Dupont"
    };
};


const getCandidatinfo = async (user_id) => {

    if (!user_id) {
        return 'indisponible'
    }


    try {

        const user_info = await User.findOne({
            where: { id: user_id },
            attributes: ["nom", "email", "role"],
            raw: true
        })

        return user_info;

    } catch (err) {
        console.error("Erreur saveAppelOffre:", err);
        throw err;
    }


};

function formatNom(nomComplet) {
    if (!nomComplet) return "";

    const parts = nomComplet.trim().split(/\s+/); // découpe sur espaces
    if (parts.length === 1) {
        return parts[0]; // un seul mot → on renvoie tel quel
    }

    const firstInitial = parts[0][0].toUpperCase() + "."; // première initiale
    const rest = parts.slice(1).join(" "); // reste du nom
    return `${firstInitial} ${rest}`;
}


function buildProfilPhrase(criteres, nom = "K.L") {
    const parts = [];
    // 👉 Intro
    parts.push(`Je suis ${formatNom(nom)}`);

    // 👉 Niveau d’étude
    const niveau = criteres.niveauEtude?.[0];
    if (niveau) {
        if (niveau === "Sans diplôme") {
            parts.push("je n’ai pas de diplôme");
        } else if (["CEP", "BEP / CAP"].includes(niveau)) {
            parts.push(`j’ai un ${niveau}`);
        } else if (niveau === "Baccalauréat") {
            parts.push("j’ai le Baccalauréat");
        } else if (niveau.startsWith("Licence")) {
            parts.push("j’ai une Licence");
        } else if (niveau.startsWith("Master")) {
            parts.push("j’ai un Master");
        } else if (niveau.includes("Doctorat")) {
            parts.push("j’ai un Doctorat");
        }
    }

    // 👉 Localisation et villes disponibles
    const villes = criteres.villes || [];
    if (villes.length > 0) {
        // Ville principale
        const principale = villes[0];
        const autres = villes.slice(1);

        let villePhrase = `je vis à ${principale}`;
        if (autres.length > 0) {
            villePhrase += ` et je peux travailler à ${autres.join(", ")}`;
        }
        parts.push(villePhrase);
    }

    // 👉 Disponibilité
    const dispo = criteres.disponibilite?.find(d => d !== "Toutes");
    if (dispo) {
        if (dispo === "Immédiate") {
            parts.push("je suis disponible immédiatement");
        } else if (dispo === "Sous 1 semaine") {
            parts.push("je suis disponible sous une semaine");
        } else if (dispo === "Sous 1 mois") {
            parts.push("je suis disponible sous un mois");
        }
    }

    // 👉 Construction finale
    return parts.join(", ") + ".";
}

const getEntrepriseInfo = async (user_id) => {

    if (!user_id) {
        return 'indisponible'
    }


    try {

        const user_info = await User.findOne({
            where: { id: user_id },
            raw: true
        })

        return user_info.nom;

    } catch (err) {
        console.error("Erreur saveAppelOffre:", err);
        throw err;
    }
}


const getEntrepriseIDbyAnnonceID = async (annonces_id) => {

    if (!annonces_id) {
        return null;
    }

    let annonce = null;
    let source = null;

    try {
        // 🔹 OFF → Offre d’emploi
        if (annonces_id.startsWith("OFF-")) {
            annonce = await OffreEmploi.findOne({
                where: { post_id: annonces_id },
                attributes: ["user_id", "objet"],
            });
            source = "OffreEmploi";
        }

        // 🔹 AOF → Appels d’offres (toutes variantes)
        else if (annonces_id.startsWith("AOF-")) {
            const tables = [
                { model: AppelOffre, name: "AppelOffre" },
                { model: AppelOffreAmi, name: "AppelOffreAmi" },
                { model: AppelOffreConsultation, name: "AppelOffreConsultation" },
                { model: AppelOffreRecrutementConsultant, name: "AppelOffreRecrutementConsultant" },
            ];

            for (const t of tables) {
                annonce = await t.model.findOne({
                    where: { post_id: annonces_id },
                    attributes: ["user_id", "objet"],
                });

                if (annonce) {
                    source = t.name;
                    break; // 🛑 trouvé
                }
            }
        }

        if (!annonce) {
            return null;
        }

        return {
            entreprise_id: annonce.user_id,
            title: annonce.objet,
            source,
        };

    } catch (err) {
        console.error("Erreur getEntrepriseIDbyAnnonceID:", err);
        throw err;
    }
}
async function getPosterProfile(user_id) {
    if (!user_id) return false;

    const profile = await PresentationPublic.findOne({
        where: { user_id },
        attributes: ["id"], // optimisation : on ne charge rien d’autre
    });

    return !!profile; // true si trouvé, false sinon
}
const formatDateHeure = (date, heure) => {
    const [year, month, day] = date.split("-");
    const [h, m] = heure.split(":");

    return `${day}/${month}/${year} à ${h}h${m}`;
};

async function searchCandidatesByKeywords(criteres, page = 1) {
    const LIMIT = 12;
    const offset = (page - 1) * LIMIT;

    const keywords = extractKeywordsFromCriteres(criteres);


    if (keywords.length === 0) return [];

    const likeConditions = keywords.map(keyword => ({
        [Op.like]: `%${keyword}%`
    }));


    // 🔍 Recherche parallèle
    const [savedResultsRaw, profilResultsRaw, emploiRechercherRaw] = await Promise.all([
        SavedSearches.findAll({
            where: {
                [Op.or]: likeConditions.map(c => ({ resume: c }))
            },
            order: [["createdAt", "DESC"]],
        }),

        candidatCvProfil.findAll({
            where: {
                [Op.or]: likeConditions.map(c => ({ profil: c }))
            },
            order: [["createdAt", "DESC"]],
        }),

        candidatCvInformationPersonelle.findAll({
            where: {
                [Op.or]: likeConditions.map(c => ({ emploi_rechercher: c }))
            },
            order: [["createdAt", "DESC"]],
        }),

    ]);

    // ✅ ICI : transformation Sequelize → plain object


    const savedResults = savedResultsRaw.map(r => r.get({ plain: true }));
    const profilResults = profilResultsRaw.map(r => r.get({ plain: true }));
    const emploiRechercher = emploiRechercherRaw.map(r => r.get({ plain: true }));



    // 🔗 Fusion + suppression doublons par user_id
    const mergedMap = new Map();

    for (const item of [...savedResults, ...profilResults, ...emploiRechercher]) {
        if (item.user_id && !mergedMap.has(item.user_id)) {
            mergedMap.set(item.user_id, item);
        }
    }

    const mergedResults = Array.from(mergedMap.values());

    // 📄 Pagination après fusion
    return mergedResults.slice(offset, offset + LIMIT);
}


function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function splitKeywords(keywords) {
    return keywords.flatMap(k =>
        normalize(k).split(/\s+/)
    );
}


function formatResult(result) {


    return {
        offresEmploi: result.offresEmploi.map(r => r.get({ plain: true })),
        amis: result.amis.map(r => r.get({ plain: true })),
        consultations: result.consultations.map(r => r.get({ plain: true })),
        recrutements: result.recrutements.map(r => r.get({ plain: true })),
    };
}

function extractKeywordsFromCriteres(criteres) {
    const keywords = [];

    // 🔹 mots-clés directs (prioritaires)
    if (Array.isArray(criteres.keywords)) {
        keywords.push(...criteres.keywords);
    }


    return [
        ...new Set(
            keywords
                .map(k => k.toLowerCase().trim())
                .filter(k => k.length > 1)
        )
    ];
}

async function enrichCandidatesWithSavedSearch(candidates, searchCriteres) {

    const userIds = candidates.map(c => c.user_id);

    // 🔍 Saved searches
    const savedSearchesRaw = await SavedSearches.findAll({
        where: {
            user_id: { [Op.in]: userIds }
        }
    });

    // 🌍 Pays utilisateur
    const countryRaw = await User.findAll({
        where: {
            id: { [Op.in]: userIds } // ✅ ICI la vraie correction
        },
        attributes: ["id", "pays"]
    });

    // 🔁 Map user_id → savedSearch
    const savedMap = new Map(
        savedSearchesRaw.map(s => [
            s.user_id,
            s.get({ plain: true })
        ])
    );

    // 🔁 Map user_id → pays
    const countryMap = new Map(
        countryRaw.map(u => [
            u.id,
            u.pays
        ])
    );

    // 🧠 Enrichissement final
    return candidates.map(candidat => {
        const saved = savedMap.get(candidat.user_id);
        const pays = countryMap.get(candidat.user_id) || null;

        const match = checkMatch(saved, searchCriteres);

        return {
            ...candidat,
            pays, // 👈 maintenant dispo côté frontend
            resume: saved?.resume || null,
            disponibiliteMatch: match.disponibilite,
            villeMatch: match.ville
        };
    });
}


function checkMatch(savedSearch, searchCriteres) {



    const result = {
        disponibilite: false,
        ville: false
    };

    if (!savedSearch || !savedSearch.criteres_json) {
        return result;
    }

    const c = JSON.parse(savedSearch.criteres_json);


    // ✅ Disponibilité
    if (
        searchCriteres.disponibilite &&
        c.disponibilite &&
        c.disponibilite.some(d =>
            searchCriteres.disponibilite.includes(d)
        )
    ) {
        result.disponibilite = true;
    }



    // ✅ Ville
    if (
        searchCriteres.villes &&
        c.villes &&
        c.villes.some(v =>
            searchCriteres.villes.includes(v)
        )
    ) {
        result.ville = true;
    }

    return result;
}

