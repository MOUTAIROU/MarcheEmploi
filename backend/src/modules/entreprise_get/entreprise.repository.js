const { Op, where } = require("sequelize");
const { Sequelize } = require('sequelize'); // si Node.js CommonJS

const OffreEmploi = require("../models/offreEmploi");
const AppelOffre = require("../models/appelOffre");
const ExamenQcm = require("../models/ExamenQcm");
const EntretienCandidat = require("../models/EntretienCandidat");
const NotesEntretien = require("../models/notesEntretie");
const EntrepriseSaveCandidats = require("../models/EntrepriseSaveCandidats");
const EntrepriseInformation = require("../models/entrepriseInformation");
const NotificationPreference = require("../models/notificationPreference");
const PresentationPublic = require("../models/presentationPublic");
const AjouterCollaborateur = require("../models/ajouterCollaborateur");
const AppelOffreAmi = require("../models/appelOffreAmi");
const AppelOffreConsultation = require("../models/appelOffreConsultation");
const AppelOffreRecrutementConsultant = require("../models/appelOffreRecrutementConsultant");
const PostulationAnnonceOffreEmploi = require("../models/PostulationAnnonceOffreEmploi");
const PostulationAppelOffre = require("../models/PostulationAppelOffre");
const User = require("../models/User");
const CandidatCv = require("../models/candidatCv");
const SaveAnnonce = require("../models/saveAnnonce");
const QcmOffres = require("../models/QcmOffres");
const QcmCandidats = require("../models/QcmCandidats");
const Notification = require("../models/Notification");
const QcmExamensCandidats = require("../models/QcmExamensCandidats");

const { createOrUpdateNotification } = require("../notification/notification.service");
const { title, constrainedMemory } = require("process");

const { STATUS_NOTIFICATION_MAP, MODEL_BY_SOURCE } = require('../../../utils/helper');
const { cp } = require("fs");


const excludedStatus = ["delete"];

// 4️⃣ Repository
module.exports = {

    getOffre: async (data) => {
        try {


            const { user_id, page = 1, limit = 10 } = data;

            const [
                offresEmploi,
                appelsOffres,
                amis,
                consultations,
                recrutements
            ] = await Promise.all([

                OffreEmploi.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffre.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffreAmi.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffreConsultation.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),

                AppelOffreRecrutementConsultant.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
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


            // Transformation du tableau
            const filteredOffresEmploi = await Promise.all(

                allOffresEmploi
                    .filter(o => !excludedStatus.includes(o.statut) && isNotExpired(o.expiration))
                    .map(async (offre, index) => ({
                        id: index,
                        user_id: offre.user_id,
                        post_id: offre.post_id,
                        type: offre.type,
                        objet: offre.objet,
                        lieu: offre.lieu,
                        date_publication: offre.date_publication,
                        expiration: offre.expiration,
                        statut: offre.statut,
                        nbr_candidat: await get_nbr_candidature(offre.post_id),
                        createdAt: offre.createdAt
                    }))
            )

            // Transformation du tableau
            const filteredOffres = await Promise.all(

                allOffres
                    .filter(o => !excludedStatus.includes(o.statut) && isNotExpired(o.date_limite))
                    .map(async (offre, index) => ({
                        id: index,
                        user_id: offre.user_id,
                        post_id: offre.post_id,
                        type: offre.type,
                        objet: offre.objet,
                        lieu: offre.lieu,
                        date_publication: offre.date_publication,
                        date_limite: offre.date_limite,
                        date_ouverture: offre.date_ouverture,
                        statut: offre.statut,
                        nbr_candidat: await get_nbr_candidature(offre.post_id),
                        createdAt: offre.createdAt
                    }))
            )

            // Combiner les deux tableaux
            let combinedOffres = [...filteredOffresEmploi, ...filteredOffres];


            // Trier par date de création décroissante (le plus récent en premier)
            combinedOffres.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Réassigner les id : le dernier créé aura id = 0
            combinedOffres = combinedOffres.map((offre, index) => ({
                ...offre,
                id: index // index 0 = plus récent
            }));

            const total = combinedOffres.length; // total pour pagination

            const start = (Number(page) - 1) * Number(limit);
            const end = start + Number(limit);
            const paginatedOffres = combinedOffres.slice(start, end);



            if (!combinedOffres) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total,
                    data: paginatedOffres,
                };
            }


        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    update_offres_status: async () => {
        try {

            const now = new Date();

            await Promise.all([

                OffreEmploi.update(
                    { statut: "expire" },
                    {
                        where: {
                            statut: { [Op.notIn]: ["expire", "delete", "hors_ligne"] },
                            expiration: { [Op.lt]: now }
                        }
                    }
                ),

                AppelOffre.update(
                    { statut: "expire" },
                    {
                        where: {
                            statut: { [Op.notIn]: ["expire", "delete", "hors_ligne"] },
                            date_limite: { [Op.lt]: now }
                        }
                    }
                ),

                AppelOffreAmi.update(
                    { statut: "expire" },
                    {
                        where: {
                            statut: { [Op.notIn]: ["expire", "delete", "hors_ligne"] },
                            date_limite: { [Op.lt]: now }
                        }
                    }
                ),

                AppelOffreConsultation.update(
                    { statut: "expire" },
                    {
                        where: {
                            statut: { [Op.notIn]: ["expire", "delete", "hors_ligne"] },
                            date_limite: { [Op.lt]: now }
                        }
                    }
                ),

                AppelOffreRecrutementConsultant.update(
                    { statut: "expire" },
                    {
                        where: {
                            statut: { [Op.notIn]: ["expire", "delete", "hors_ligne"] },
                            date_limite: { [Op.lt]: now }
                        }
                    }
                )

            ]);

            console.log("✔ Toutes les offres expirées ont été mises à jour");

        } catch (err) {
            console.error("Erreur update_offres_status:", err);
            throw err;
        }
    },
    search_offres: async (data) => {
        try {

            const { user_id, search, filter, page = 1, limit = 10 } = data;

            // Récupérer toutes les offres existantes
            const [
                offresEmploi,
                appelsOffres,
                amis,
                consultations,
                recrutements
            ] = await Promise.all([
                OffreEmploi.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffre.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffreAmi.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffreConsultation.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),
                AppelOffreRecrutementConsultant.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete"] } },
                    order: [["createdAt", "DESC"]],
                }),
            ]);

            // Fusionner les offres pour recherche globale
            let allOffres = [
                ...appelsOffres.map(o => o.dataValues),
                ...amis.map(o => o.dataValues),
                ...consultations.map(o => o.dataValues),
                ...recrutements.map(o => o.dataValues),
            ];

            let allOffresEmploi = [...offresEmploi.map(o => o.dataValues)];



            const refPattern = /^(AOF|OFF)-/;
            // --- Filtrage texte / référence ---
            const searchTrimmed = search?.trim();


            const isSearchRef = refPattern.test(searchTrimmed);
            const isSearchText = !isSearchRef;

            const applySearch = (offre) => {

                if (!searchTrimmed) return true; // pas de recherche

                if (isSearchText) {
                    return (
                        (offre.objet?.toLowerCase().includes(searchTrimmed.toLowerCase())) ||
                        (offre.lieu?.toLowerCase().includes(searchTrimmed.toLowerCase()))
                    );
                }

                if (isSearchRef) {
                    return offre.post_id?.toUpperCase().includes(searchTrimmed);
                }

                return true;
            };

            // --- Filtrage par statut ---
            const applyFilter = (offre) => {

                if (!filter || filter === "Filtre" || filter === "Toutes") {
                    return offre.statut !== "delete";
                }

                if (filter === "Actives") {
                    return offre.statut === "en_ligne";
                }

                if (filter === "Expirées") {
                    return offre.statut === "expire";
                }

                return true;
            };

            // --- Transformation et filtrage des offres emploi ---
            let filteredOffresEmploi = await Promise.all(
                allOffresEmploi
                    .filter(o => !excludedStatus.includes(o.statut) && isNotExpired(o.expiration))
                    .filter(applySearch)
                    .filter(applyFilter)
                    .map(async (offre, index) => ({
                        id: index,
                        user_id: offre.user_id,
                        post_id: offre.post_id,
                        type: offre.type,
                        objet: offre.objet,
                        lieu: offre.lieu,
                        date_publication: offre.date_publication,
                        expiration: offre.expiration,
                        statut: offre.statut,
                        nbr_candidat: await get_nbr_candidature(offre.post_id),
                        createdAt: offre.createdAt
                    }))
            );

            // --- Transformation et filtrage des autres offres ---
            let filteredOffres = await Promise.all(
                allOffres
                    .filter(o => !excludedStatus.includes(o.statut) && isNotExpired(o.date_limite))
                    .filter(applySearch)
                    .filter(applyFilter)
                    .map(async (offre, index) => ({
                        id: index,
                        user_id: offre.user_id,
                        post_id: offre.post_id,
                        type: offre.type,
                        objet: offre.objet,
                        lieu: offre.lieu,
                        date_publication: offre.date_publication,
                        date_limite: offre.date_limite,
                        date_ouverture: offre.date_ouverture,
                        statut: offre.statut,
                        nbr_candidat: await get_nbr_candidature(offre.post_id),
                        createdAt: offre.createdAt
                    }))
            );

            // --- Combinaison et tri ---
            let combinedOffres = [...filteredOffresEmploi, ...filteredOffres];
            combinedOffres.sort(
                (a, b) =>
                    new Date(b.date_publication || b.date_limite).getTime() -
                    new Date(a.date_publication || a.date_limite).getTime()
            );

            // --- Pagination ---
            const start = (Number(page) - 1) * Number(limit);
            const end = start + Number(limit);
            const paginated = combinedOffres.slice(start, end);

            return {
                status: "success",
                total: combinedOffres.length,
                data: paginated,
            };

        } catch (err) {
            console.error("Erreur search_offres:", err);
            throw err;
        }
    },
    dashbord_starts: async (user_id) => {
        try {

            console.log(user_id)
            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants"
                };
            }

            // ======================
            // 📊 OFFRES PUBLIÉES
            // ======================
          
            const results = await Promise.all([
                OffreEmploi.findAll({ attributes: ["post_id"], where: { user_id, statut: { [Op.notIn]: ["delete"] } }, raw: true }),
                AppelOffre.findAll({ attributes: ["post_id"], where: { user_id, statut: { [Op.notIn]: ["delete"] } }, raw: true }),
                AppelOffreAmi.findAll({ attributes: ["post_id"], where: { user_id, statut: { [Op.notIn]: ["delete"] } }, raw: true }),
                AppelOffreConsultation.findAll({ attributes: ["post_id"], where: { user_id, statut: { [Op.notIn]: ["delete"] } }, raw: true }),
                AppelOffreRecrutementConsultant.findAll({ attributes: ["post_id"], where: { user_id, statut: { [Op.notIn]: ["delete"] } }, raw: true })
            ]);

            const postIds = [...new Set(results.flat().map(r => r.post_id))];

           

            // ======================
            // 📄 CANDIDATURES
            // ======================

            // supprimer les doublons
            const uniquePostIds = [...new Set(postIds)];


            const whereClause = {
                annonce_id: { [Op.in]: uniquePostIds },
                statut: { [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete"] }
            };

            const [countOffreEmploi, countAppelOffre] = await Promise.all([
                PostulationAnnonceOffreEmploi.count({
                    where: whereClause
                }),

                PostulationAppelOffre.count({
                    where: whereClause
                })
            ]);


            const totalCandidatures = countOffreEmploi + countAppelOffre;



            // ======================
            // 🧪 QCM
            // ======================
            const totalQcm = await ExamenQcm.count({
                where: { user_id }
            });

            // ======================
            // 🔔 NOTIFICATIONS
            // ======================
            const [totalNonLus, derniersMessages] = await Promise.all([
                Notification.count({
                    where: { receiver_id: user_id, is_read: 0 }
                }),
                Notification.findAll({
                    where: { receiver_id: user_id },
                    order: [["createdAt", "DESC"]],
                    limit: 5,
                    raw: true
                })
            ]);


            const get_info = await PresentationPublic.findOne({
                where: { user_id },
                attributes: ['filenameBase'],
                raw: true
            });


            const user_info = await getCandidatinfo(user_id)

            const messages = derniersMessages.map(n => ({
                id: n.id,
                sender_id: n.sender_id,
                is_read: n.is_read,
                message: n.data?.messages?.slice(-1)[0] || null,
                date: n.createdAt
            }));

            // ======================
            // ✅ RESPONSE FRONTEND
            // ======================

            return {
                status: "success",
                data: {
                    profile: {
                        logo: get_info?.filenameBase?.photo_profil || null,
                        nom: user_info.nom
                    },
                    stats: {
                        offres_total: postIds?.length || 0,
                        candidatures_total: totalCandidatures || 0,
                        qcm_total: totalQcm || 0,
                        notifications_non_lues: totalNonLus || 0
                    },
                    derniers_messages: messages
                }
            };

        } catch (err) {
            console.error("Erreur dashboard:", err);
            return {
                status: "error",
                message: "Erreur serveur"
            };
        }
    },

    ami_offres_by_post_id: async (
        user_id,
        data
    ) => {



        const { params } = data

        try {

            const get_offre = await AppelOffreAmi.findOne({
                where: { user_id, post_id: params },
                raw: true
            })



            return {
                status: "success",
                total: get_offre.length,
                data: get_offre,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },

    appel_offres_by_post_id: async (
        user_id,
        data
    ) => {



        const { params } = data

        try {

            const get_offre = await AppelOffre.findOne({
                where: { user_id, post_id: params },
                raw: true
            })



            return {
                status: "success",
                total: get_offre.length,
                data: get_offre,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    consultation_offres_by_post_id: async (
        user_id,
        data
    ) => {



        const { params } = data

        try {

            const get_offre = await AppelOffreConsultation.findOne({
                where: { user_id, post_id: params },
                raw: true
            })



            return {
                status: "success",
                total: get_offre.length,
                data: get_offre,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    emploi_offres_by_post_id: async (
        user_id,
        data
    ) => {



        const { params } = data

        try {

            const get_offre = await OffreEmploi.findOne({
                where: { user_id, post_id: params },
                raw: true
            })



            return {
                status: "success",
                total: get_offre.length,
                data: get_offre,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    user_infomation: async (
        data
    ) => {



        const { entreprise_id } = data



        try {

            const get_offre = await PresentationPublic.findOne({
                where: { user_id: entreprise_id },
                raw: true
            })



            if (!get_offre) {
                return {
                    status: "error",
                    data: null,
                    message: "Nous n'avons pas trouver de presentation lier a cette utilisateur",
                };
            }

            return {
                status: "success",
                total: get_offre.length,
                data: get_offre,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    recrutement_offres_by_post_id: async (
        user_id,
        data
    ) => {



        const { params } = data

        try {

            const get_offre = await AppelOffreRecrutementConsultant.findOne({
                where: { user_id, post_id: params },
                raw: true
            })



            return {
                status: "success",
                total: get_offre.length,
                data: get_offre,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    send_candidat_notification: async (data) => {

        try {

            const { user_id, post_id, statut } = data; // ici statut = message libre


            // 🔹 1️⃣ Récupérer la postulation
            const postulation = await PostulationAppelOffre.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (!postulation) {
                return {
                    status: "error",
                    message: "Candidature introuvable",
                };
            }

            // 🔹 2️⃣ Créer la notification
            const newNotification = {
                id: `notif_${Date.now()}`,
                status: "NEW_MESSAGE",          // ici on peut mettre NEW_MESSAGE ou SYSTEM
                message_type: "INFO",           // type générique pour message libre
                message: statut,                // contenu envoyé dans "statut"
                action_type: "NONE",            // aucune action par défaut
                action_link: null,
                is_read: false,
                created_at: new Date(),
            };

            // 🔹 3️⃣ Ajouter à l’historique existant
            const notifications = Array.isArray(postulation.tab_notification)
                ? postulation.tab_notification
                : [];
            notifications.push(newNotification);

            // 🔹 4️⃣ Mettre à jour les notifications dans la base
            await PostulationAnnonceOffreEmploi.update(
                { tab_notification: notifications },
                { where: { id: post_id } }
            );

            // 🔹 5️⃣ Créer notification globale (optionnel, ex: socket / tableau notifications)

            const candidat_info = await getCandidatsByPostulationId(post_id);

            let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

            let info_entreprise = await getEntrepriseInfo(user_id)

            let user_info = await getCandidatinfo(user_id)

            let cand_info = await getCandidatinfo(candidat_info.user_id)




            console.log("a", candidat_info)

            console.log("b", annonce)

            console.log("c", info_entreprise)

            console.log("d", user_info)

            console.log("e", cand_info)



            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur
                receiver_id: candidat_info.user_id,
                receiver_name: cand_info.nom,     // nom du candidat

                type: "NEW MESSAGE",
                action: "SENT",

                title: "Nouvelle message reçue",
                message: statut,

                object_id: candidat_info.annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: candidat_info.user_id,
                    annonce_id: candidat_info.annonce_id,
                    annonce_reference: post_id || null,
                    is_read: false

                },

            });


            return {
                status: "success",
                message: "Notification ajoutée au candidat",
            };

        } catch (error) {
            console.error("send_candidat_notification_emploi error:", error);
            throw error;
        }






    },
    send_candidat_notification_emploi: async (data) => {

        try {



            const { user_id, post_id, statut } = data; // ici statut = message libre


            // 🔹 1️⃣ Récupérer la postulation
            const postulation = await PostulationAnnonceOffreEmploi.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (!postulation) {
                return {
                    status: "error",
                    message: "Candidature introuvable",
                };
            }

            // 🔹 2️⃣ Créer la notification
            const newNotification = {
                id: `notif_${Date.now()}`,
                status: "NEW_MESSAGE",          // ici on peut mettre NEW_MESSAGE ou SYSTEM
                message_type: "INFO",           // type générique pour message libre
                message: statut,                // contenu envoyé dans "statut"
                action_type: "NONE",            // aucune action par défaut
                action_link: null,
                is_read: false,
                created_at: new Date(),
            };

            // 🔹 3️⃣ Ajouter à l’historique existant
            const notifications = Array.isArray(postulation.tab_notification)
                ? postulation.tab_notification
                : [];
            notifications.push(newNotification);

            // 🔹 4️⃣ Mettre à jour les notifications dans la base
            await PostulationAnnonceOffreEmploi.update(
                { tab_notification: notifications },
                { where: { id: post_id } }
            );

            // 🔹 5️⃣ Créer notification globale (optionnel, ex: socket / tableau notifications)

            const candidat_info = await getCandidatsByPostulationId(post_id);

            let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

            let info_entreprise = await getEntrepriseInfo(user_id)

            let user_info = await getCandidatinfo(user_id)

            let cand_info = await getCandidatinfo(candidat_info.user_id)




            console.log("a", candidat_info)

            console.log("b", annonce)

            console.log("c", info_entreprise)

            console.log("d", user_info)

            console.log("e", cand_info)



            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur
                receiver_id: candidat_info.user_id,
                receiver_name: cand_info.nom,     // nom du candidat

                type: "NEW MESSAGE",
                action: "SENT",

                title: "Nouvelle message reçue",
                message: statut,

                object_id: candidat_info.annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: candidat_info.user_id,
                    annonce_id: candidat_info.annonce_id,
                    annonce_reference: post_id || null,
                    is_read: false

                },

            });


            return {
                status: "success",
                message: "Notification ajoutée au candidat",
            };

        } catch (error) {
            console.error("send_candidat_notification_emploi error:", error);
            throw error;
        }
    },

    send_candidat_notification_emploi_contact: async (
        data
    ) => {

        const { user_id, post_id, statut } = data


        /*
            | "NEW_CANDIDATURE"
            | "STATUS_UPDATE"
            | "NEW_MESSAGE"
            | "SYSTEM"  
        */




        const notification = {
            receiver_id: post_id,
            sender_id: user_id,
            newData: {
                annonce_id: "null",
                postulation_id: "null",
                type: "CONTACT_MESSAGE",
                titre: "Nouvelle message reçue",
                message: statut,
                is_read: false
            }
        }



        await createOrUpdateNotification(notification);



    },
    send_candidat_notification_group: async (data) => {
        try {
            const { user_id, post_id, statut } = data; // statut = message libre

            if (!user_id || !post_id || !statut) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ CSV → Array
            const postulationIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postulationIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune postulation fournie",
                };
            }

            let sentCount = 0;

            // 2️⃣ Infos entreprise (1 seule fois)
            const entrepriseInfo = await getEntrepriseInfo(user_id);
            const senderName = entrepriseInfo?.nom || "Entreprise";

            // 3️⃣ Parcours des postulations
            for (const id of postulationIds) {

                // 🔹 Récupérer la postulation (OFF ou AOF)
                const postulation = await getCandidatsByPostulationId(id);
                if (!postulation) continue;

                const {
                    user_id: candidatId,
                    annonce_id,
                    tab_notification
                } = postulation;

                // 🔹 Notification historique (tab_notification)
                const newTabNotif = [
                    ...(Array.isArray(tab_notification) ? tab_notification : []),
                    {
                        id: `notif_${Date.now()}_${id}`,
                        status: "NEW_MESSAGE",
                        message_type: "INFO",
                        message: statut,
                        action_type: "NONE",
                        action_link: null,
                        is_read: false,
                        created_at: new Date(),
                    },
                ];

                // 🔹 Mise à jour selon le type de postulation
                if (annonce_id?.startsWith("OFF-")) {
                    await PostulationAnnonceOffreEmploi.update(
                        { tab_notification: newTabNotif },
                        { where: { id } }
                    );
                } else if (annonce_id?.startsWith("AOF-")) {
                    await PostulationAppelOffre.update(
                        { tab_notification: newTabNotif },
                        { where: { id } }
                    );
                }

                // 🔹 Infos candidat & annonce
                const cand_info = await getCandidatinfo(candidatId);
                const annonceInfo = await getEntrepriseIDbyAnnonceID(annonce_id);

                // 🔔 Notification globale
                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: senderName,

                    receiver_id: candidatId,
                    receiver_name: cand_info?.nom || "Candidat",

                    type: "NEW_MESSAGE",
                    action: "SENT",

                    title: "Nouveau message reçu",
                    message: statut,

                    object_id: annonce_id,
                    object_type: "ANNONCE",
                    object_label: annonceInfo?.title || "Annonce",

                    meta: {
                        createdAt: new Date().toISOString(),
                        postulation_id: id,
                        annonce_id,
                        is_read: false,
                    },
                });

                sentCount++;
            }

            return {
                status: "success",
                message: `${sentCount} notification(s) envoyée(s) avec succès`,
            };

        } catch (error) {
            console.error("send_candidat_notification_group error:", error);
            throw error;
        }
    },

    send_candidat_notification_group_emploi: async (data) => {
        try {
            const { user_id, post_id, statut } = data; // statut = message libre



            // 1️⃣ Transformer "9,8" → ["9", "8"]
            const postulationIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postulationIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune postulation fournie",
                };
            }

            let notificationsSent = 0;

            // 2️⃣ Parcourir chaque postulation
            for (const id of postulationIds) {

                // 🔹 Récupérer la postulation
                const postulation = await PostulationAnnonceOffreEmploi.findOne({
                    where: { id },
                    attributes: ["id", "annonce_id", "user_id", "tab_notification"],
                });

                if (!postulation) {
                    console.warn(`Postulation introuvable pour id=${id}`);
                    continue;
                }


                // 🔹 Créer la notification à ajouter au tab_notification
                const newNotification = {
                    id: `notif_${Date.now()}`,
                    status: "NEW_MESSAGE",
                    message_type: "INFO",
                    message: statut,
                    action_type: "NONE",
                    action_link: null,
                    is_read: false,
                    created_at: new Date(),
                };

                const notifications = Array.isArray(postulation.tab_notification)
                    ? postulation.tab_notification
                    : [];
                notifications.push(newNotification);

                // 🔹 Mettre à jour tab_notification dans la DB
                await PostulationAnnonceOffreEmploi.update(
                    { tab_notification: notifications },
                    { where: { id } }
                );

                // 🔹 Créer notification globale (ex: socket / tableau notifications)


                const candidat_info = await getCandidatsByPostulationId(id);

                let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

                let info_entreprise = await getEntrepriseInfo(user_id)

                let user_info = await getCandidatinfo(user_id)

                let cand_info = await getCandidatinfo(candidat_info.user_id)




                console.log("a", candidat_info)

                console.log("b", annonce)

                console.log("c", info_entreprise)

                console.log("d", user_info)

                console.log("e", cand_info)



                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: user_info.nom,      // nom de l'envoyeur
                    receiver_id: candidat_info.user_id,
                    receiver_name: cand_info.nom,     // nom du candidat

                    type: "NEW MESSAGE",
                    action: "SENT",

                    title: "Nouvelle candidature reçue",
                    message: statut,

                    object_id: candidat_info.annonce_id,
                    object_type: "ANNONCE",
                    object_label: annonce.title,

                    meta: {
                        createdAt: new Date().toISOString(),
                        candidat_id: candidat_info.user_id,
                        annonce_id: candidat_info.annonce_id,
                        annonce_reference: post_id || null,
                        is_read: false

                    },

                });


                notificationsSent++;
            }

            if (notificationsSent === 0) {
                return {
                    status: "error",
                    message: "Aucune notification envoyée",
                };
            }

            return {
                status: "success",
                message: `${notificationsSent} notification(s) envoyée(s)`,
            };

        } catch (error) {
            console.error("send_candidat_notification_group_emploi error:", error);
            throw error;
        }
    },

    send_candidat_changer_status_emploi: async (data) => {
        try {
            const { user_id, post_id, statut } = data;

            // 🔹 1️⃣ Récupérer la postulation
            const postulation = await PostulationAnnonceOffreEmploi.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (!postulation) {
                return {
                    status: "error", STATUS_NOTIFICATION_MAP,
                    message: "Candidature introuvable",
                };
            }

            // 🔹 2️⃣ Préparer la notification selon le statut
            const notifConfig = STATUS_NOTIFICATION_MAP[statut];
            if (!notifConfig) {
                throw new Error("Statut non géré pour notification");
            }

            const newNotification = {
                id: `notif_${Date.now()}`,
                status: statut,
                message_type: notifConfig.message_type,
                title: notifConfig.title,
                message: notifConfig.message,
                action_type: notifConfig.action_type,
                action_link:
                    statut === "WAITING_EXAM"
                        ? `/qcm/${postulation.id}`
                        : null,
                is_read: false,
                created_at: new Date(),
            };

            // 🔹 3️⃣ Ajouter à l’historique existant
            const notifications = Array.isArray(postulation.tab_notification)
                ? postulation.tab_notification
                : [];
            notifications.push(newNotification);


            const candidat_info = await getCandidatsByPostulationId(post_id);

            let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

            let info_entreprise = await getEntrepriseInfo(user_id)

            let user_info = await getCandidatinfo(user_id)

            let cand_info = await getCandidatinfo(candidat_info.user_id)


            console.log("a", candidat_info)

            console.log("b", annonce)

            console.log("c", info_entreprise)

            console.log("d", user_info)

            console.log("e", cand_info)

            console.log(notifConfig)


            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur

                receiver_id: candidat_info.user_id,
                receiver_name: cand_info.nom,     // nom du candidat

                type: notifConfig.type,
                action: notifConfig.action_type,

                title: notifConfig.title,
                message: notifConfig.message,

                object_id: candidat_info.annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: candidat_info.user_id,
                    annonce_id: candidat_info.annonce_id,
                    annonce_reference: post_id || null,
                    is_read: false

                },

            });


            // 🔹 4️⃣ Mettre à jour le statut et les notifications en une seule fois
            await PostulationAnnonceOffreEmploi.update(
                {
                    statut,
                    tab_notification: notifications
                },
                { where: { id: post_id } }
            );

            return {
                status: "success",
                message: "Statut mis à jour et notification ajoutée",
            };

        } catch (error) {
            console.error("send_candidat_changer_status_emploi error:", error);
            throw error;
        }
    },

    send_candidat_changer_status_appel_offre: async (data) => {
        try {

            const { user_id, post_id, statut } = data;
            let affectedRows = 0;
            let annonce_id = null;



            // 🔹 2️⃣ Préparer la notification selon le statut
            const notifConfig = STATUS_NOTIFICATION_MAP[statut];
            if (!notifConfig) {
                throw new Error("Statut non géré pour notification");
            }
            // 🔹 2️⃣ APPEL D’OFFRE

            const aof = await PostulationAppelOffre.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id"],
                raw: true,
            });


            if (aof) {
                const result = await PostulationAppelOffre.update(
                    { statut },
                    { where: { id: post_id } }
                );
                affectedRows = result[0];
                annonce_id = aof.annonce_id;
            }


            // ❌ Aucune postulation trouvée
            if (affectedRows === 0) {
                return {
                    status: "error",
                    message: "Candidature introuvable ou non modifiée",
                };
            }

            // 🔹 3️⃣ Récupérer le candidat
            const annonce = await getCandidatsByPostulationId(post_id);

            if (!annonce) {
                return {
                    status: "error",
                    message: "Candidat introuvable",
                };
            }




            const candidat_info = await getCandidatsByPostulationId(post_id);

            let annonce_info = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

            let info_entreprise = await getEntrepriseInfo(user_id)

            let user_info = await getCandidatinfo(user_id)

            let cand_info = await getCandidatinfo(candidat_info.user_id)


            console.log("a", candidat_info)

            console.log("b", annonce)

            console.log("c", info_entreprise)

            console.log("d", user_info)

            console.log("e", cand_info)

            console.log(notifConfig)


            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur

                receiver_id: candidat_info.user_id,
                receiver_name: cand_info.nom,     // nom du candidat

                type: notifConfig.type,
                action: notifConfig.action_type,

                title: notifConfig.title,
                message: notifConfig.message,

                object_id: candidat_info.annonce_id,
                object_type: "ANNONCE",
                object_label: annonce_info.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: candidat_info.user_id,
                    annonce_id: candidat_info.annonce_id,
                    annonce_reference: post_id || null,
                    is_read: false

                },

            });


            return {
                status: "success",
                message: "Statut mis à jour et notification envoyée",
            };

        } catch (error) {
            console.error("send_candidat_changer_status error:", error);
            throw error;
        }
    },

    send_candidat_changer_status_appel_offre_groupe: async (data) => {
        try {
            const { user_id, post_id, statut } = data;

            if (!user_id || !post_id || !statut) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 1️⃣ Vérifier config notification
            const notifConfig = STATUS_NOTIFICATION_MAP[statut];
            if (!notifConfig) {
                throw new Error("Statut non géré pour notification");
            }

            // 🔹 2️⃣ CSV → Array
            const postulationIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postulationIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune postulation fournie",
                };
            }

            let updatedCount = 0;

            // 🔹 Infos entreprise (1 seule fois)
            const info_entreprise = await getEntrepriseInfo(user_id);
            const senderName = info_entreprise?.nom || "Entreprise";

            // 🔹 3️⃣ Parcours des postulations
            for (const id of postulationIds) {

                // 🔹 Récupérer la postulation AOF
                const aof = await PostulationAppelOffre.findOne({
                    where: { id },
                    attributes: ["id", "annonce_id", "user_id"],
                    raw: true,
                });

                if (!aof) {
                    console.warn(`AOF introuvable pour id=${id}`);
                    continue;
                }

                // 🔹 Mettre à jour le statut
                const result = await PostulationAppelOffre.update(
                    { statut },
                    { where: { id } }
                );

                if (result[0] === 0) continue;

                updatedCount++;

                // 🔹 Infos annonce & candidat
                const annonce_info = await getEntrepriseIDbyAnnonceID(aof.annonce_id);
                const cand_info = await getCandidatinfo(aof.user_id);

                // 🔔 Notification globale
                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: senderName,

                    receiver_id: aof.user_id,
                    receiver_name: cand_info?.nom || "Candidat",

                    type: notifConfig.type,
                    action: notifConfig.action_type,

                    title: notifConfig.title,
                    message: notifConfig.message,

                    object_id: aof.annonce_id,
                    object_type: "ANNONCE",
                    object_label: annonce_info?.title || "Annonce",

                    meta: {
                        createdAt: new Date().toISOString(),
                        candidat_id: aof.user_id,
                        annonce_id: aof.annonce_id,
                        annonce_reference: id,
                        is_read: false,
                    },
                });
            }

            if (updatedCount === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature mise à jour",
                };
            }

            return {
                status: "success",
                message: `${updatedCount} candidature(s) mise(s) à jour et notifiée(s)`,
            };

        } catch (error) {
            console.error("send_candidat_changer_status_appel_offre_groupe error:", error);
            throw error;
        }
    },

    send_candidat_changer_status_emploi_groupe: async (data) => {
        try {
            const { user_id, post_id, statut } = data;



            // 1️⃣ Transformer "9,8" → ["9", "8"]
            const postulationIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postulationIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune postulation fournie",
                };
            }

            let updatedCount = 0;

            // 2️⃣ Traiter chaque postulation
            for (const id of postulationIds) {

                // 🔹 Récupérer la postulation
                const postulation = await PostulationAnnonceOffreEmploi.findOne({
                    where: { id },
                    attributes: ["id", "annonce_id", "user_id", "tab_notification"],
                });

                if (!postulation) {
                    console.warn(`Postulation introuvable pour id=${id}`);
                    continue;
                }

                // 🔹 Préparer la notification selon le statut
                const notifConfig = STATUS_NOTIFICATION_MAP[statut] || {
                    message_type: "INFO",
                    action_type: "NONE",
                    message: `Votre candidature est passée au statut : ${statut}`
                };

                const newNotification = {
                    id: `notif_${Date.now()}`,
                    status: statut,
                    message_type: notifConfig.message_type,
                    title: notifConfig.title,
                    message: notifConfig.message,
                    action_type: notifConfig.action_type,
                    action_link:
                        statut === "WAITING_EXAM"
                            ? `/qcm/${postulation.id}`
                            : null,
                    is_read: false,
                    created_at: new Date(),
                };

                // 🔹 Ajouter à l’historique existant
                const notifications = Array.isArray(postulation.tab_notification)
                    ? postulation.tab_notification
                    : [];
                notifications.push(newNotification);

                // 🔹 Mettre à jour le statut et les notifications en une seule fois
                const result = await PostulationAnnonceOffreEmploi.update(
                    {
                        statut,
                        tab_notification: notifications
                    },
                    { where: { id } }
                );

                if (result[0] > 0) updatedCount++;

                // 🔹 Créer notification globale (ex: socket / tableau notifications)

                const candidat_info = await getCandidatsByPostulationId(id);

                let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

                let info_entreprise = await getEntrepriseInfo(user_id)

                let user_info = await getCandidatinfo(user_id)

                let cand_info = await getCandidatinfo(candidat_info.user_id)


                console.log("a", candidat_info)

                console.log("b", annonce)

                console.log("c", info_entreprise)

                console.log("d", user_info)

                console.log("e", cand_info)

                console.log(notifConfig)


                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: user_info.nom,      // nom de l'envoyeur

                    receiver_id: candidat_info.user_id,
                    receiver_name: cand_info.nom,     // nom du candidat

                    type: notifConfig.type,
                    action: notifConfig.action_type,

                    title: notifConfig.title,
                    message: notifConfig.message,

                    object_id: candidat_info.annonce_id,
                    object_type: "ANNONCE",
                    object_label: annonce.title,

                    meta: {
                        createdAt: new Date().toISOString(),
                        candidat_id: candidat_info.user_id,
                        annonce_id: candidat_info.annonce_id,
                        annonce_reference: post_id || null,
                        is_read: false

                    },

                });

            }



            if (updatedCount === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature mise à jour",
                };
            }

            return {
                status: "success",
                message: `${updatedCount} candidature(s) mise(s) à jour et notifiée(s)`,
            };

        } catch (error) {
            console.error("send_candidat_changer_status_emploi_groupe error:", error);
            throw error;
        }
    },

    send_candidat_changer_status_offre_emploi: async (data) => {
        try {

            const { user_id, post_id, statut } = data;
            let affectedRows = 0;
            let annonce_id = null;

            // 🔹 1️⃣ OFFRE D’EMPLOI
            const off = await PostulationAnnonceOffreEmploi.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id"],
                raw: true,
            });


            if (off) {
                const result = await PostulationAnnonceOffreEmploi.update(
                    { statut },
                    { where: { id: post_id } }
                );
                affectedRows = result[0];
                annonce_id = off.annonce_id;
            }

            // 🔹 2️⃣ APPEL D’OFFRE
            if (!off) {
                const aof = await PostulationAppelOffre.findOne({
                    where: { id: post_id },
                    attributes: ["id", "annonce_id", "user_id"],
                    raw: true,
                });



                if (aof) {
                    const result = await PostulationAppelOffre.update(
                        { statut },
                        { where: { id: post_id } }
                    );
                    affectedRows = result[0];
                    annonce_id = aof.annonce_id;
                }
            }

            // ❌ Aucune postulation trouvée
            if (affectedRows === 0) {
                return {
                    status: "error",
                    message: "Candidature introuvable ou non modifiée",
                };
            }

            // 🔹 3️⃣ Récupérer le candidat
            const annonce = await getCandidatsByPostulationId(post_id);



            if (!annonce) {
                return {
                    status: "error",
                    message: "Candidat introuvable",
                };
            }




            // 🔔 4️⃣ Notification
            const notification = {
                receiver_id: annonce.user_id,                // candidat
                sender_id: user_id,          // entreprise
                newData: {
                    annonce_id: annonce.annonce_id,
                    postulation_id: annonce.user_id,
                    type: "STATUS_UPDATE",
                    titre: "Statut de candidature mis à jour",
                    message: `Votre candidature est passée au statut : ${statut}`,
                    is_read: false,
                }
            };



            await createOrUpdateNotification(notification);

            return {
                status: "success",
                message: "Statut mis à jour et notification envoyée",
            };

        } catch (error) {
            console.error("send_candidat_changer_status error:", error);
            throw error;
        }
    },

    mes_condidatures: async (
        data
    ) => {

        const { user_id } = data

        try {
            if (!user_id) throw new Error("user_id manquant");


            const candidat_info = await getCandidatByUserId(user_id)


            // 1️⃣ Récupérer toutes les postulations
            const postulationsOffres = await PostulationAnnonceOffreEmploi.findAll({
                where: { user_id },
                raw: true,
            });

            const postulationsAppels = await PostulationAppelOffre.findAll({
                where: { user_id },
                raw: true,
            });

            const allOffers = [...postulationsOffres, ...postulationsAppels];

            // 2️⃣ Enrichir chaque annonce
            const enrichedOffers = await Promise.all(
                allOffers.map(async (postulation) => {

                    const annonce_id = postulation.annonce_id;

                    // 🔹 Infos annonce
                    const annonce_info = await getEntrepriseIDbyAnnonceID(annonce_id);

                    if (!annonce_info) return null;

                    // 🔹 Infos entreprise
                    const entreprise_info = await getCandidatinfo(annonce_info.entreprise_id);

                    // 🔹 Compter les annonces non lues dans tab_annonce
                    const tabAnnonce = Array.isArray(postulation.tab_notification)
                        ? postulation.tab_notification
                        : [];

                    const unread_count = tabAnnonce.filter(
                        (item) => item.is_read === false
                    ).length;

                    return {
                        postulation_id: postulation.id,
                        createdAt: postulation.createdAt,
                        ville: annonce_info.ville,
                        type: annonce_info.source,
                        annonce_id,
                        tabAnnonce,
                        statut: postulation.statut,
                        unread_annonce_count: unread_count,
                        offre_title: annonce_info.title,
                        entreprise_nom: entreprise_info.nom,
                        user_email: candidat_info.email
                    };
                })
            );


            // Nettoyer les null (au cas où une annonce a été supprimée)
            const cleanData = enrichedOffers.filter(Boolean);


            return {
                status: "success",
                total: cleanData.length,
                data: cleanData,
            };
        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    all_qcm: async (user_id) => {
        try {

            const qcms = await ExamenQcm.findAll({
                where: {
                    user_id,
                    statut: {
                        [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT"]   // 👈 exclure ce statut
                    }
                },
                attributes: ["id", "categorie", "offreId", "duree", "questions", "post_id"],
                order: [["createdAt", "DESC"]],
                raw: true
            });

            const result = await Promise.all(
                qcms.map(async (qcm) => ({
                    id: qcm.id,
                    post_id: qcm.post_id,
                    categorie: qcm.categorie,
                    offreId: qcm.offreId,
                    duree: qcm.duree,
                    nombreQuestions: Array.isArray(qcm.questions) ? qcm.questions.length : 0,
                    scoreMoyen: await getScoreMoyenByOffreId(qcm.post_id),
                    nombreCandidats: await getNombreCandidatsByOffreId(qcm.post_id),
                    nombreOffresByQcmId: await getNombreOffresByQcmId(qcm.post_id),

                }))
            );


            if (!result) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: result.length,
                    data: result,
                };
            }




        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    get_qcm_by_post_id: async (user_id, data) => {
        try {


            const { params } = data


            if (!user_id || !params) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }


            const qcms = await ExamenQcm.findOne({
                where: { user_id, post_id: params },
                raw: true
            });


            return {
                status: "success",
                total: qcms.length,
                data: qcms,
            };

        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    qcm_candidats_exame_detail: async (data) => {
        try {


            const { user_id, candidat_id, qcmid } = data;

            if (!user_id || !candidat_id || !qcmid) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 1️⃣ Infos candidat
            const candidatInfo = await getCandidatinfo(candidat_id);

            // 🔹 2️⃣ Résultat candidat
            const examenCandidat = await QcmExamensCandidats.findOne({
                where: {
                    qcm_id: qcmid,
                    user_id: candidat_id
                },
                raw: true,
            });


            if (!examenCandidat) {
                return {
                    status: "error",
                    message: "Aucun résultat trouvé",
                };
            }

            // 🔹 3️⃣ Parser resultat_json
            const resultat = typeof examenCandidat.reponses === "string"
                ? JSON.parse(examenCandidat.reponses)
                : examenCandidat.reponses;

            if (!resultat || !resultat.details) {
                return {
                    status: "error",
                    message: "Résultat invalide"
                };
            }

            // 🔹 4️⃣ QCM (juste pour titre)
            const qcmData = await ExamenQcm.findOne({
                where: { post_id: qcmid },
                attributes: ["titre"],
                raw: true
            });

            // 🔹 5️⃣ Réponse finale
            return {
                status: "success",
                data: {
                    candidat: {
                        user_id: candidat_id,
                        nom: candidatInfo?.nom ?? null,
                        email: candidatInfo?.email ?? null,
                    },
                    examen: {
                        qcm_id: qcmid,
                        titre: qcmData?.titre ?? null,
                    },
                    resultat: {
                        score: resultat.scoreTotal,
                        totalPoints: resultat.totalPoints,
                        pourcentage: resultat.pourcentage,
                        temps_total: examenCandidat.totalTimeSeconds,
                        antiFraudeLogs: examenCandidat.antiFraudeLogs,
                        statut: examenCandidat.statut ?? null,
                    },
                    questions_detail: resultat.details // ✅ direct depuis JSON
                }
            };

        } catch (err) {
            console.error("Erreur qcm_candidats_exame_detail:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },
    get_offre_by_post_id: async (data) => {
        try {


            const { user_id, params } = data;

            if (!user_id || !params) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }


            //  const candidats = await getCandidatsByAnnonceId(post_id);

            // 1️⃣ Offres liées directement au QCM
            const offresDirect = await ExamenQcm.findAll({
                where: { post_id: params },
                attributes: ["offreId"],
                raw: true
            });


            // 2️⃣ Offres liées via table de liaison
            const offresViaTable = await QcmOffres.findAll({
                where: { qcm_id: params },
                attributes: ["offre_id"],
                raw: true
            });


            // 3️⃣ Fusionner
            const allOffreIds = [
                ...offresDirect.map(o => o.offreId),
                ...offresViaTable.map(o => o.offre_id)
            ];



            // 4️⃣ Supprimer doublons
            const uniqueOffreIds = [
                ...new Set(
                    allOffreIds
                        .filter(Boolean)                // enlève null / undefined / ""
                        .flatMap(str => str.split(",")) // éclate les chaînes multiples
                        .map(str => str.trim())         // enlève espaces invisibles
                        .filter(Boolean)                // enlève chaînes vides éventuelles
                )
            ];


            // 4️⃣ Mapper chaque offre pour récupérer le titre et les candidats
            const offresAvecTitre = await Promise.all(
                uniqueOffreIds.map(async (post_id) => {

                    // Récupérer les candidats liés
                    const candidats = await getEntrepriseIDbyAnnonceID(post_id);

                    console.log(candidats?.title)

                    return {
                        post_id,
                        titre: candidats?.title || "Titre non trouvé",
                    };
                })
            )


            const [
                offresEmploi,
                appelsOffres,
                amis,
                consultations,
                recrutements
            ] = await Promise.all([
                OffreEmploi.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete", "expire"] } },
                    attributes: ["post_id", "objet"],
                    order: [["createdAt", "DESC"]], // optionnel : trier par date
                    raw: true
                }),
                AppelOffre.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete", "expire"] } },
                    attributes: ["post_id", "objet"],
                    order: [["createdAt", "DESC"]],
                    raw: true
                }),
                AppelOffreAmi.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete", "expire"] } },
                    attributes: ["post_id", "objet"],
                    order: [["createdAt", "DESC"]],
                    raw: true
                }),
                AppelOffreConsultation.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete", "expire"] } },
                    attributes: ["post_id", "objet"],
                    order: [["createdAt", "DESC"]],
                    raw: true
                }),
                AppelOffreRecrutementConsultant.findAll({
                    where: { user_id, statut: { [Op.notIn]: ["delete", "expire"] } },
                    attributes: ["post_id", "objet"],
                    order: [["createdAt", "DESC"]],
                    raw: true
                }),
            ]);



            // Supposons que ce sont tes tableaux
            const allTables = [
                offresEmploi,
                appelsOffres,
                amis,
                consultations,
                recrutements
            ];

            // 1️⃣ Fusionner tous les tableaux
            let toutesOffres = allTables.flat();

            // 2️⃣ Supprimer doublons par post_id
            const seen = new Set();
            toutesOffres = toutesOffres.filter(offre => {
                // si offre n'a pas de post_id, ignore
                if (!offre.post_id) return false;

                if (seen.has(offre.post_id)) {
                    return false; // doublon
                } else {
                    seen.add(offre.post_id);
                    return true; // premier rencontré
                }
            });

            // 3️⃣ Facultatif : renommer "objet" en "titre"
            toutesOffres = toutesOffres.map(offre => ({
                post_id: offre.post_id,
                titre: offre.objet || offre.titre || "Titre non trouvé"
            }));



            return {
                status: "success",
                data: {
                    toutesOffres: toutesOffres,
                    offresAvecTitre: offresAvecTitre
                }
            };




        } catch (err) {
            console.error("Erreur qcm_candidats_exame_detail:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },


    valider_note_question: async (data) => {
        try {

            const { user_id, candidat_id, qcm_id, question_id, note } = data;

            if (!user_id || !candidat_id || !qcm_id || !question_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants"
                };
            }

            // 🔹 1️⃣ Récupérer examen candidat
            const examenCandidat = await QcmExamensCandidats.findOne({
                where: {
                    qcm_id: qcm_id,
                    user_id: candidat_id
                }
            });

            if (!examenCandidat) {
                return {
                    status: "error",
                    message: "Examen introuvable"
                };
            }

            // 🔹 2️⃣ Parser resultat_json
            let resultat = typeof examenCandidat.reponses === "string"
                ? JSON.parse(examenCandidat.reponses)
                : examenCandidat.reponses;

            if (!resultat || !resultat.details) {
                return {
                    status: "error",
                    message: "Structure résultat invalide"
                };
            }

            // 🔹 3️⃣ Modifier la note dans le tableau
            const questionIndex = resultat.details.findIndex(
                q => Number(q.questionId) === Number(question_id)
            );

            if (questionIndex === -1) {
                return {
                    status: "error",
                    message: "Question introuvable"
                };
            }

            // ✅ Modifier directement la note
            resultat.details[questionIndex].points_obtenue = Number(note) || 0;

            // 🔹 4️⃣ Recalculer score total
            let nouveauScoreTotal = 0;

            resultat.details.forEach(q => {
                nouveauScoreTotal += Number(q.points_obtenue) || 0;
            });

            resultat.scoreTotal = nouveauScoreTotal;

            // 🔹 5️⃣ Recalcul pourcentage
            const totalPoints = resultat.totalPoints || 1; // éviter division par 0
            resultat.pourcentage = Math.round((nouveauScoreTotal / totalPoints) * 100);


            // 🔹 6️⃣ Mise à jour base de données
            await QcmExamensCandidats.update(
                {
                    reponses: JSON.stringify(resultat),
                    score: resultat.pourcentage
                },
                {
                    where: {
                        qcm_id: qcm_id,
                        user_id: candidat_id
                    }
                }
            );

            return {
                status: "success",
                message: "Note modifiée avec succès",
                nouveau_score_total: nouveauScoreTotal,
                nouveau_pourcentage: resultat.pourcentage
            };

        } catch (err) {
            console.error("Erreur valider_note_question:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    entretiens: async (user_id) => {
        try {



            const enretien = await EntretienCandidat.findAll({
                where: { user_id },
                order: [["createdAt", "DESC"]],
                raw: true
            });


            const entretiensFormates = await Promise.all(
                enretien.map(async (item) => {

                    const candidatInfo = await getCandidatinfo(item.candidat_id);

                    return {
                        id: item.id,
                        nom: candidatInfo.nom,
                        candidat_id: item.candidat_id,
                        email: candidatInfo.email,
                        offre: item.offre,
                        date_entretien: formatDateHeure(item.date, item.heure),
                        duree: item.duree || null,
                        responsable: item.responsable,
                        status: item.status,
                        entr_id: item.post_id,
                        type: item.type,
                    };
                })
            );

            if (!entretiensFormates) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: entretiensFormates.length,
                    data: entretiensFormates,
                }

            }





        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    get_entretiens_by_post_id: async (user_id, data) => {
        try {


            const { params } = data

            console.log(params)

            const entretien = await EntretienCandidat.findOne({
                where: { user_id, post_id: params },
                raw: true
            });

            console.log(entretien)

            return {
                status: "success",
                data: entretien,
            };

        } catch (err) {
            console.error("Erreur getOffre:", err);
            throw err;
        }
    },
    information_offres: async (user_id) => {



        try {

            const get_offre = await EntrepriseInformation.findOne({
                where: { user_id },
                raw: true
            })


            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: get_offre,
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }

    },
    mes_appel_offre_save: async (user_id, page = 1) => {
        try {
            const limit = 12;
            const offset = (page - 1) * limit;

            const get_offre = await SaveAnnonce.findAll({
                where: { user_id },
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                raw: true
            });

            if (!get_offre || get_offre.length === 0) {
                return {
                    status: "success",
                    total: 0,
                    data: [],
                };
            }

            // 🔹 Parcours du tableau + ajout de la ville
            const data = await Promise.all(
                get_offre.map(async (item) => {
                    const villeInfo = await getVilleByAnnonceID(item.post_id);

                    return {
                        ...item,
                        ville: villeInfo?.ville || null,
                    };
                })
            );

            return {
                status: "success",
                total: data.length,
                data,
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },

    mes_candidats_save: async (user_id, page = 1) => {
        try {
            const limit = 12;
            const offset = (page - 1) * limit;

            const savedCandidats = await EntrepriseSaveCandidats.findAll({
                where: { user_id },
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                raw: true
            });

            if (!savedCandidats || savedCandidats.length === 0) {
                return {
                    status: "success",
                    total: 0,
                    data: [],
                };
            }

            // 🔹 Mapper chaque candidat et récupérer ses infos
            const data = await Promise.all(
                savedCandidats.map(async (item) => {
                    const candidatInfo = await getCandidatinfo(item.candidate_id, user_id);

                    return {
                        ...item,
                        ...candidatInfo
                    };
                })
            );



            return {
                status: "success",
                total: data.length,
                data,
            };

        } catch (err) {
            console.error("Erreur mes_candidats_save:", err);
            throw err;
        }
    },

    get_notification_preference: async (user_id) => {
        try {

            const get_offre = await NotificationPreference.findOne({
                where: { user_id },
                raw: true
            })



            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: get_offre,
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    get_notification: async (user_id) => {
        try {
            if (!user_id) {
                return {
                    status: "error",
                    message: "User ID manquant",
                };
            }

            // 📥 Notifications reçues
            const received = await Notification.findAll({
                where: { receiver_id: user_id },
                order: [["createdAt", "DESC"]],
                raw: true,
            });

            // 📤 Notifications envoyées
            const sent = await Notification.findAll({
                where: { sender_id: user_id },
                order: [["createdAt", "DESC"]],
                raw: true,
            });

            return {
                status: "success",
                data: {
                    received, // notifications reçues
                    sent,     // notifications envoyées
                },
            };

        } catch (err) {
            console.error("Erreur get_notification:", err);
            return {
                status: "error",
                message: "Erreur lors de la récupération des notifications",
            };
        }
    },
    get_presentation_public: async (user_id) => {
        try {

            const get_offre = await PresentationPublic.findOne({
                where: { user_id },
                raw: true
            })

            const user = await User.findOne({
                where: { id: user_id },
                attributes: ["nom"],
                raw: true
            })

            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: { ...get_offre, entreprise_nom: user.nom },
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    get_utilisateurs: async (user_id) => {
        try {

            const get_offre = await AjouterCollaborateur.findAll({
                where: {
                    user_id,
                    status: { [Op.ne]: "supprime" }   // 🚫 exclure supprimés
                },
                attributes: ["id", "nom", "role", "email", "accepted"],
                order: [["createdAt", "DESC"]],
                raw: true
            })



            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: get_offre,
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    delete_offres: async (data) => {
        try {

            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }

            // 1️⃣ Trouver infos annonce
            const annonceInfo = await getEntrepriseIDbyAnnonceID(post_id);
            if (!annonceInfo) {
                return { status: "error", message: "Annonce introuvable" };
            }

            // 2️⃣ Sécurité
            if (annonceInfo.entreprise_id !== user_id) {
                return { status: "error", message: "Accès refusé" };
            }

            // 3️⃣ Modèle annonce
            const Model = MODEL_BY_SOURCE[annonceInfo.source];
            if (!Model) throw new Error("Source inconnue");

            // 4️⃣ Mettre à jour le statut des candidats
            await updateCandidatsStatusByAnnonceId(post_id, "OFFER_CLOSED");

            // 5️⃣ Récupérer tous les candidats
            let candidatures = await PostulationAnnonceOffreEmploi.findAll({
                where: { annonce_id: post_id },
                attributes: ["id", "user_id", "tab_notification"],
            });

            if (!candidatures || candidatures.length === 0) {
                candidatures = await PostulationAppelOffre.findAll({
                    where: { annonce_id: post_id },
                    attributes: ["id", "user_id", "tab_notification"],
                });
            }

            // 6️⃣ Notification système
            const notifTemplate = STATUS_NOTIFICATION_MAP["OFFER_CLOSED"];
            const entrepriseInfo = await getEntrepriseInfo(user_id);

            for (const c of candidatures) {
                // 🔹 Ajout dans tab_notification (historique candidature)
                const newTabNotif = [
                    ...(c.tab_notification || []),
                    {
                        id: `notif_${Date.now()}`,
                        status: "OFFER_CLOSED",
                        title: notifTemplate.title,
                        message_type: notifTemplate.type,
                        message: notifTemplate.message,
                        action_type: notifTemplate.action_type,
                        date: new Date().toISOString(),
                        action_link: null,
                        is_read: false,
                        created_at: new Date(),
                    },
                ];



                await c.update({ tab_notification: newTabNotif });

                const candidat_info = await getCandidatsByPostulationId(post_id);

                let annonce = await getEntrepriseIDbyAnnonceID(post_id)

                let info_entreprise = await getEntrepriseInfo(user_id)

                let user_info = await getCandidatinfo(user_id)

                let cand_info = await getCandidatinfo(c.user_id)


                console.log("a", candidat_info)

                console.log("b", annonce)

                console.log("c", info_entreprise)

                console.log("d", user_info)

                console.log("e", cand_info)



                // 🔔 Notification globale
                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: user_info?.nom || "Entreprise",

                    receiver_id: c.user_id,
                    receiver_name: cand_info?.nom || "Candidat",

                    type: notifTemplate.type,
                    action: "OFFER_CLOSED",

                    title: notifTemplate.title,
                    message: notifTemplate.message,

                    object_id: post_id,
                    object_type: "ANNONCE",
                    object_label: annonceInfo.title,

                    meta: {
                        createdAt: new Date().toISOString(),
                        annonce_id: post_id,
                        is_read: false,
                        system: true,
                    },
                });
            }

            // 7️⃣ Suppression logique de l’annonce


            await Model.update(
                { statut: "delete" },
                { where: { post_id } }
            );

            return {
                status: "success",
                message: "Annonce supprimée et candidats notifiés",
            };

        } catch (err) {
            console.error("Erreur delete_offres:", err);
            throw err;
        }
    },
    delete_offres_groupe: async (data) => {
        try {
            console.log(data);

            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Transformer "id1,id2,id3" → ["id1", "id2", "id3"]
            const postIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune annonce fournie",
                };
            }

            const notifTemplate = STATUS_NOTIFICATION_MAP["OFFER_CLOSED"];
            const entrepriseInfo = await getEntrepriseInfo(user_id);

            let processed = 0;

            // 2️⃣ Boucle sur chaque annonce
            for (const currentPostId of postIds) {

                // 🔍 Infos annonce
                const annonceInfo = await getEntrepriseIDbyAnnonceID(currentPostId);
                if (!annonceInfo) continue;

                // 🔐 Sécurité
                if (annonceInfo.entreprise_id !== user_id) continue;

                const Model = MODEL_BY_SOURCE[annonceInfo.source];
                if (!Model) continue;

                // 3️⃣ Update statut candidats
                await updateCandidatsStatusByAnnonceId(currentPostId, "OFFER_CLOSED");

                // 4️⃣ Récupérer candidatures
                let candidatures = await PostulationAnnonceOffreEmploi.findAll({
                    where: { annonce_id: currentPostId },
                    attributes: ["id", "user_id", "tab_notification"],
                });

                if (!candidatures || candidatures.length === 0) {
                    candidatures = await PostulationAppelOffre.findAll({
                        where: { annonce_id: currentPostId },
                        attributes: ["id", "user_id", "tab_notification"],
                    });
                }

                // 5️⃣ Notifier chaque candidat
                for (const c of candidatures) {

                    const newTabNotif = [
                        ...(c.tab_notification || []),
                        {
                            id: `notif_${Date.now()}_${currentPostId}`,
                            status: "OFFER_CLOSED",
                            title: notifTemplate.title,
                            message_type: notifTemplate.type,
                            message: notifTemplate.message,
                            action_type: notifTemplate.action_type,
                            date: new Date().toISOString(),
                            action_link: null,
                            is_read: false,
                            created_at: new Date(),
                        },
                    ];

                    await c.update({ tab_notification: newTabNotif });

                    const candidatInfo = await getCandidatinfo(c.user_id);



                    await createOrUpdateNotification({
                        sender_id: user_id,
                        sender_name: entrepriseInfo?.nom || "Entreprise",

                        receiver_id: c.user_id,
                        receiver_name: candidatInfo?.nom || "Candidat",

                        type: notifTemplate.type,
                        action: "OFFER_CLOSED",

                        title: notifTemplate.title,
                        message: notifTemplate.message,

                        object_id: currentPostId,
                        object_type: "ANNONCE",
                        object_label: annonceInfo.title,

                        meta: {
                            createdAt: new Date().toISOString(),
                            annonce_id: currentPostId,
                            is_read: false,
                            system: true,
                        },
                    });
                }

                // 6️⃣ Suppression logique annonce
                await Model.update(
                    { statut: "delete" },
                    { where: { post_id: currentPostId } }
                );
                processed++;
            }

            return {
                status: "success",
                message: `${processed} annonce(s) supprimée(s) et candidats notifiés`,
            };

        } catch (err) {
            console.error("delete_offres_groupe error:", err);
            throw err;
        }
    },



    delete_offres_mes_candidature: async (data) => {
        try {

            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            let affectedRows = 0;

            // =========================
            // 🔹 OFFRE D’EMPLOI
            // =========================
            const offResult = await PostulationAnnonceOffreEmploi.update(
                { statut: "DELETED_BY_CANDIDAT" },
                { where: { annonce_id: post_id, user_id } }
            );

            // =========================
            // 🔹 APPEL D’OFFRE
            // =========================
            const aofResult = await PostulationAppelOffre.update(
                { statut: "DELETED_BY_CANDIDAT" },
                { where: { annonce_id: post_id, user_id } }
            );

            // Sequelize retourne [affectedRows]
            affectedRows = (offResult[0] || 0) + (aofResult[0] || 0);




            // ❌ Aucune mise à jour
            if (affectedRows === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature trouvée pour cette annonce",
                };
            }

            return {
                status: "success",
                message: `${affectedRows} candidature(s) supprimée(s) avec succès`,
            };


        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    delete_offres_mes_candidature_group: async (data) => {
        try {


            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Transformer "9,8" → ["9", "8"]
            const postulationIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postulationIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature fournie",
                };
            }

            let affectedRows = 0;

            // =========================
            // 🔹 OFFRE D’EMPLOI (groupe)
            // =========================


            const offResult = await PostulationAnnonceOffreEmploi.update(
                { statut: "DELETED_BY_CANDIDAT" },
                {
                    where: {
                        annonce_id: postulationIds,
                        user_id
                    },
                }
            );

            // =========================
            // 🔹 APPEL D’OFFRE (groupe)
            // =========================
            const aofResult = await PostulationAppelOffre.update(
                { statut: "DELETED_BY_CANDIDAT" },
                {
                    where: {
                        annonce_id: postulationIds,
                        user_id
                    },
                }
            );

            // Sequelize retourne [affectedRows]
            affectedRows = (offResult[0] || 0) + (aofResult[0] || 0);

            // ❌ Aucune mise à jour
            if (affectedRows === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature supprimée",
                };
            }

            return {
                status: "success",
                message: `${affectedRows} candidature(s) supprimée(s) avec succès`,
            };

        } catch (err) {
            console.error("send_candidat_delete_offres_groupe error:", err);
            throw err;
        }
    },
    delete_candidats_save: async (data) => {
        try {

            const { user_id, post_id } = data;

            // 🔐 Vérification minimale
            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🗑️ Suppression dans SaveAnnonce
            const deletedRows = await EntrepriseSaveCandidats.destroy({
                where: {
                    user_id,
                    candidate_id: post_id,
                }
            });

            if (deletedRows === 0) {
                return {
                    status: "error",
                    message: "Offre enregistrée introuvable",
                };
            }

            return {
                status: "success",
                message: "Offre supprimée des enregistrements",
            };

        } catch (err) {
            console.error("Erreur delete_offres_save:", err);
            throw err;
        }
    },

    delete_offres_save: async (data) => {
        try {

            const { user_id, post_id } = data;

            // 🔐 Vérification minimale
            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🗑️ Suppression dans SaveAnnonce
            const deletedRows = await SaveAnnonce.destroy({
                where: {
                    user_id,
                    post_id,
                }
            });

            if (deletedRows === 0) {
                return {
                    status: "error",
                    message: "Offre enregistrée introuvable",
                };
            }

            return {
                status: "success",
                message: "Offre supprimée des enregistrements",
            };

        } catch (err) {
            console.error("Erreur delete_offres_save:", err);
            throw err;
        }
    },

    send_candidat_delete_offres: async (data) => {
        try {


            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            let affectedRows = 0;

            const notifConfig = STATUS_NOTIFICATION_MAP["DELETED_BY_COMPANY"]


            // =========================
            // 🔹 Traitement OFFRE D’EMPLOI
            // =========================


            const postulation = await PostulationAnnonceOffreEmploi.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (postulation) {
                // 🔹 Préparer la notification DELETED_BY_COMPANY
                const newNotification = {
                    id: `notif_${Date.now()}`,
                    status: "DELETED_BY_COMPANY",
                    title: notifConfig.title,
                    message_type: notifConfig.type,
                    message: notifConfig.message,
                    action_type: notifConfig.action_type,
                    action_link: null,
                    is_read: false,
                    created_at: new Date(),
                };

                const notifications = Array.isArray(postulation.tab_notification)
                    ? postulation.tab_notification
                    : [];
                notifications.push(newNotification);

                // 🔹 Mettre à jour le statut et les notifications en une seule fois
                const result = await PostulationAnnonceOffreEmploi.update(
                    {
                        statut: "DELETED_BY_COMPANY",
                        tab_notification: notifications
                    },
                    { where: { id: post_id } }
                );

                if (result[0] > 0) affectedRows++;
            }

            // =========================
            // 🔹 Traitement APPEL D’OFFRE (AOF)
            // =========================
            const aof = await PostulationAppelOffre.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (aof) {
                const newNotification = {
                    id: `notif_${Date.now()}`,
                    title: notifConfig.title,
                    message_type: notifConfig.type,
                    message: notifConfig.message,
                    action_type: notifConfig.action_type,
                    action_link: null,
                    is_read: false,
                    created_at: new Date(),
                };

                const notifications = Array.isArray(aof.tab_notification)
                    ? aof.tab_notification
                    : [];
                notifications.push(newNotification);


                const resultAOF = await PostulationAppelOffre.update(
                    {
                        statut: "DELETED_BY_COMPANY",
                        tab_notification: notifications
                    },
                    { where: { id: post_id } }
                );

                if (resultAOF[0] > 0) affectedRows++;

            }


            const candidat_info = await getCandidatsByPostulationId(post_id);

            let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

            let info_entreprise = await getEntrepriseInfo(user_id)

            let user_info = await getCandidatinfo(user_id)

            let cand_info = await getCandidatinfo(candidat_info.user_id)


            console.log("a", candidat_info)

            console.log("b", annonce)

            console.log("c", info_entreprise)

            console.log("d", user_info)

            console.log("e", cand_info)

            console.log(notifConfig)


            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: user_info.nom,      // nom de l'envoyeur

                receiver_id: candidat_info.user_id,
                receiver_name: cand_info.nom,     // nom du candidat

                type: notifConfig.type,
                action: notifConfig.action_type,

                title: notifConfig.title,
                message: notifConfig.message,

                object_id: candidat_info.annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title,

                meta: {
                    createdAt: new Date().toISOString(),
                    candidat_id: candidat_info.user_id,
                    annonce_id: candidat_info.annonce_id,
                    annonce_reference: post_id || null,
                    is_read: false

                },

            });

            // ❌ Aucune mise à jour
            if (affectedRows === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature trouvée pour cette annonce",
                };
            }

            return {
                status: "success",
                message: `${affectedRows} candidature(s) clôturée(s) avec succès`,
            };

        } catch (err) {
            console.error("send_candidat_delete_offres_emploi error:", err);
            throw err;
        }
    },

    get_lettre_motivation: async (data) => {
        try {
            // 1️⃣ Validation des données
            if (!data || typeof data !== "object") {
                return { status: "error", message: "Données invalides" };
            }



            const { user_id, post_id, offreId } = data;

            if (!user_id || !post_id || !offreId) {
                return {
                    status: "error",
                    message: "Paramètres manquants (user_id, post_id, offreId)",
                };
            }


            const candidature_info = await getUserByEmail(post_id)

            let candidature = null;

            // 2️⃣ Détection OFF / AOF
            if (offreId.startsWith("OFF-")) {
                candidature = await PostulationAnnonceOffreEmploi.findOne({
                    where: {
                        user_id: candidature_info.id,
                        annonce_id: offreId,
                    },
                    attributes: ["lettre_motivation", "user_id"],
                    raw: true,
                });
            }
            else if (offreId.startsWith("AOF-")) {
                console.log('otot')
                candidature = await PostulationAppelOffre.findOne({
                    where: {
                        user_id: candidature_info.id,
                        annonce_id: offreId,
                    },
                    attributes: ["lettre_motivation", "user_id", "telephone"],
                    raw: true,
                });

                console.log(candidature)
            }


            // 3️⃣ Aucun résultat
            if (!candidature) {
                return {
                    status: "error",
                    message: "Aucune candidature trouvée pour cette offre",
                };
            }

            // 4️⃣ Sécurité minimale
            if (!candidature.user_id) {
                return {
                    status: "error",
                    message: "Candidature invalide",
                };
            }

            // ⚠️ Optionnel : contrôle d’accès
            // if (user_id !== candidature.user_id && !isEntrepriseOwner(user_id, offreId)) {
            //     return { status: "error", message: "Accès non autorisé" };
            // }

            // 5️⃣ Infos candidat
            const user_info = await getCandidatinfo(candidature.user_id);
            if (!user_info) {
                return {
                    status: "error",
                    message: "Informations du candidat introuvables",
                };
            }

            // 6️⃣ Succès
            return {
                status: "success",
                data: {
                    lettre_motivation: candidature.lettre_motivation || "",
                    telephone: candidature.telephone || "",
                    candidat: user_info,
                },
            };

        } catch (err) {
            console.error("get_lettre_motivation error:", err);
            return {
                status: "error",
                message: "Erreur interne du serveur",
            };
        }
    },


    get_cv_candidat: async (data) => {
        try {


            // 1️⃣ Validation des données entrantes
            if (!data || typeof data !== "object") {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            const { user_id, post_id, offreId } = data;

            if (!user_id || !post_id || !offreId) {
                return {
                    status: "error",
                    message: "Paramètres manquants (user_id, post_id, offreId)",
                };
            }

            const candidature_info = await getUserByEmail(post_id)

            // 2️⃣ Recherche de la candidature
            const candidats = await PostulationAnnonceOffreEmploi.findOne({
                where: {
                    annonce_id: offreId,
                    user_id: candidature_info.id,
                },
                attributes: ["lettre_motivation", "user_id"],
                order: [["createdAt", "DESC"]],
                raw: true,
            });

            // 3️⃣ Aucun résultat trouvé
            if (!candidats) {
                return {
                    status: "error",
                    message: "Aucune candidature trouvée pour cette offre",
                };
            }

            // 4️⃣ Sécurité user_id
            if (!candidats.user_id) {
                return {
                    status: "error",
                    message: "Candidat invalide ou incomplet",
                };
            }

            // 5️⃣ Infos candidat
            const user_info = await getCandidatinfo(candidats.user_id);


            // 2️⃣ Recherche de la candidature
            const user_cv = await CandidatCv.findOne({
                where: {
                    user_id: candidats.user_id
                },
                raw: true,
            });

            if (!user_cv) {
                return {
                    status: "error",
                    message: "Informations du candidat introuvables",
                };
            }

            // 6️⃣ Succès
            return {
                status: "success",
                data: {
                    cv: user_cv ?? "",
                    ...user_info,
                },
            };

        } catch (err) {
            console.error("get_lettre_motivation error:", err);

            return {
                status: "error",
                message: "Erreur interne du serveur",
            };
        }
    },

    get_cv_candidat_user_id: async (data) => {
        try {


            // 1️⃣ Validation des données entrantes
            if (!data || typeof data !== "object") {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            const { user_id, post_id } = data;


            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants (user_id, post_id, offreId)",
                };
            }


            // 5️⃣ Infos candidat
            const user_info = await getCandidatinfo(post_id);


            // 2️⃣ Recherche de la candidature
            const user_cv = await CandidatCv.findOne({
                where: {
                    user_id: post_id
                },
                raw: true,
            });

            if (!user_cv) {
                return {
                    status: "error",
                    message: "Informations du candidat introuvables",
                };
            }

            // 6️⃣ Succès
            return {
                status: "success",
                data: {
                    cv: user_cv ?? "",
                    ...user_info,
                },
            };


        } catch (err) {
            console.error("get_lettre_motivation error:", err);

            return {
                status: "error",
                message: "Erreur interne du serveur",
            };
        }
    },

    send_candidat_delete_offres_emploi: async (data) => {
        try {


            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            let affectedRows = 0;

            // =========================
            // 🔹 Traitement OFFRE D’EMPLOI
            // =========================
            const postulation = await PostulationAnnonceOffreEmploi.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (postulation) {
                // 🔹 Préparer la notification DELETED_BY_COMPANY
                const newNotification = {
                    id: `notif_${Date.now()}`,
                    status: "DELETED_BY_COMPANY",
                    message_type: "ALERT",
                    message: "Votre candidature n'a pas pu être poursuivie et a été clôturée par l'entreprise.",
                    action_type: "NONE",
                    action_link: null,
                    is_read: false,
                    created_at: new Date(),
                };

                const notifications = Array.isArray(postulation.tab_notification)
                    ? postulation.tab_notification
                    : [];
                notifications.push(newNotification);

                // 🔹 Mettre à jour le statut et les notifications en une seule fois
                const result = await PostulationAnnonceOffreEmploi.update(
                    {
                        statut: "DELETED_BY_COMPANY",
                        tab_notification: notifications
                    },
                    { where: { id: post_id } }
                );

                if (result[0] > 0) affectedRows++;
            }

            // =========================
            // 🔹 Traitement APPEL D’OFFRE (AOF)
            // =========================
            const aof = await PostulationAppelOffre.findOne({
                where: { id: post_id },
                attributes: ["id", "annonce_id", "user_id", "tab_notification"],
            });

            if (aof) {
                const newNotification = {
                    id: `notif_${Date.now()}`,
                    status: "DELETED_BY_COMPANY",
                    message_type: "ALERT",
                    message: "Votre candidature n'a pas pu être poursuivie et a été clôturée par l'entreprise.",
                    action_type: "NONE",
                    action_link: null,
                    is_read: false,
                    created_at: new Date(),
                };

                const notifications = Array.isArray(aof.tab_notification)
                    ? aof.tab_notification
                    : [];
                notifications.push(newNotification);

                const resultAOF = await PostulationAppelOffre.update(
                    {
                        statut: "DELETED_BY_COMPANY",
                        tab_notification: notifications
                    },
                    { where: { id: post_id } }
                );

                if (resultAOF[0] > 0) affectedRows++;
            }

            // ❌ Aucune mise à jour
            if (affectedRows === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature trouvée pour cette annonce",
                };
            }

            return {
                status: "success",
                message: `${affectedRows} candidature(s) clôturée(s) avec succès`,
            };

        } catch (err) {
            console.error("send_candidat_delete_offres_emploi error:", err);
            throw err;
        }
    },


    send_candidat_delete_offres_emploi_groupe: async (data) => {
        try {
            const { user_id, post_id } = data;

            console.log(post_id)

            // 1️⃣ Transformer "9,8" → ["9", "8"]
            const postulationIds = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postulationIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune postulation fournie",
                };
            }

            let affectedCount = 0;

            for (const id of postulationIds) {
                // 🔹 Récupérer postulation OFF
                let postulation = await PostulationAnnonceOffreEmploi.findOne({
                    where: { id },
                    attributes: ["id", "annonce_id", "user_id", "tab_notification"],
                });

                // 🔹 Si pas trouvé, essayer AOF
                if (!postulation) {
                    postulation = await PostulationAppelOffre.findOne({
                        where: { id },
                        attributes: ["id", "annonce_id", "user_id", "tab_notification"],
                    });
                }

                if (!postulation) {
                    console.warn(`Postulation introuvable pour id=${id}`);
                    continue;
                }

                // 🔹 Préparer la notification DELETED_BY_COMPANY
                const notifConfig = STATUS_NOTIFICATION_MAP["DELETED_BY_COMPANY"];
                const newNotification = {
                    id: `notif_${Date.now()}`,
                    status: "DELETED_BY_COMPANY",
                    message_type: notifConfig.message_type,
                    title: notifConfig.title,
                    message: notifConfig.message,
                    action_type: notifConfig.action_type,
                    action_link: null,
                    is_read: false,
                    created_at: new Date(),
                };

                const notifications = Array.isArray(postulation.tab_notification)
                    ? postulation.tab_notification
                    : [];
                notifications.push(newNotification);

                // 🔹 Mettre à jour statut et notifications
                const Model = postulation instanceof PostulationAnnonceOffreEmploi
                    ? PostulationAnnonceOffreEmploi
                    : PostulationAppelOffre;


                const result = await Model.update(
                    {
                        statut: "DELETED_BY_COMPANY",
                        tab_notification: notifications
                    },
                    { where: { id } }
                );

                if (result[0] > 0) affectedCount++;


                // 🔹 Créer notification globale (socket / tableau notifications)
                const candidat_info = await getCandidatsByPostulationId(id);

                let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

                let info_entreprise = await getEntrepriseInfo(user_id)

                let user_info = await getCandidatinfo(user_id)

                let cand_info = await getCandidatinfo(candidat_info.user_id)

                console.log("a", candidat_info)

                console.log("b", annonce)

                console.log("c", info_entreprise)

                console.log("d", user_info)

                console.log("e", cand_info)

                console.log(notifConfig)

                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: user_info.nom,      // nom de l'envoyeur

                    receiver_id: candidat_info.user_id,
                    receiver_name: cand_info.nom,     // nom du candidat

                    type: notifConfig.type,
                    action: notifConfig.action_type,

                    title: notifConfig.title,
                    message: notifConfig.message,

                    object_id: candidat_info.annonce_id,
                    object_type: "ANNONCE",
                    object_label: annonce.title,

                    meta: {
                        createdAt: new Date().toISOString(),
                        candidat_id: candidat_info.user_id,
                        annonce_id: candidat_info.annonce_id,
                        annonce_reference: post_id || null,
                        is_read: false

                    },

                });
            }


            if (affectedCount === 0) {
                return {
                    status: "error",
                    message: "Aucune candidature trouvée pour cette annonce",
                };
            }

            return {
                status: "success",
                message: `${affectedCount} candidature(s) clôturée(s) avec succès`,
            };

        } catch (err) {
            console.error("send_candidat_delete_offres_emploi_groupe error:", err);
            throw err;
        }
    },


    offres_status: async (data) => {
        try {
            console.log(data);

            const { user_id, post_id, statut } = data;

            if (!user_id || !post_id || !statut) {
                throw new Error("Paramètres manquants");
            }

            // 1️⃣ Trouver les infos de l'annonce
            const annonceInfo = await getEntrepriseIDbyAnnonceID(post_id);
            if (!annonceInfo) {
                return { status: "error", message: "Annonce introuvable" };
            }

            // 2️⃣ Sécurité : vérifier propriétaire
            if (annonceInfo.entreprise_id !== user_id) {
                return { status: "error", message: "Accès refusé" };
            }

            // 3️⃣ Déterminer le modèle
            const Model = MODEL_BY_SOURCE[annonceInfo.source];
            if (!Model) throw new Error("Source inconnue");

            // 4️⃣ Mettre à jour le statut de l'annonce
            await Model.update({ statut }, { where: { post_id } });

            // 5️⃣ Mapper le statut annonce → notification
            let notifStatus;
            if (statut === "hors_ligne") {
                notifStatus = "OFFER_PAUSED";
            } else if (statut === "en_ligne") {
                notifStatus = "OFFER_REPUBLISHED";
            } else {
                notifStatus = null;
            }

            if (notifStatus) {
                // 6️⃣ Récupérer tous les candidats ayant postulé
                let candidatures = await PostulationAnnonceOffreEmploi.findAll({
                    where: { annonce_id: post_id },
                    attributes: ["user_id", "id"],
                });

                // 🔹 Si aucun, essayer AOF
                if (!candidatures || candidatures.length === 0) {
                    candidatures = await PostulationAppelOffre.findAll({
                        where: { annonce_id: post_id },
                        attributes: ["user_id", "id"],
                    });
                }

                // 7️⃣ Envoyer la notification à chaque candidat
                const notifTemplate = STATUS_NOTIFICATION_MAP[notifStatus];

                console.log(candidatures)

                console.log(notifTemplate)

                for (const c of candidatures) {

                    console.log(c.user_id)
                    console.log(c.id)


                    const candidat_info = await getCandidatsByPostulationId(c.id);

                    let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

                    let info_entreprise = await getEntrepriseInfo(user_id)

                    let user_info = await getCandidatinfo(user_id)

                    let cand_info = await getCandidatinfo(candidat_info.user_id)

                    console.log("a", candidat_info)

                    console.log("b", annonce)

                    console.log("c", info_entreprise)

                    console.log("d", user_info)

                    console.log("e", cand_info)


                    await createOrUpdateNotification({
                        sender_id: user_id,
                        sender_name: user_info.nom || "Entreprise",
                        receiver_id: c.user_id,
                        receiver_name: cand_info.nom || "Candidat", // si disponible

                        type: notifTemplate.type,
                        action: notifTemplate.action_type,

                        title: notifTemplate.title,
                        message: notifTemplate.message,

                        object_id: post_id,
                        object_type: "ANNONCE",
                        object_label: annonceInfo.title || "Annonce",

                        meta: {
                            createdAt: new Date().toISOString(),
                            postulation_id: c.id,
                            annonce_id: post_id,
                            is_read: false,
                        },
                    });
                }
            }

            return {
                status: "success",
                message: "Statut mis à jour et notifications envoyées",
            };
        } catch (err) {
            console.error("Erreur offres_status:", err);
            throw err;
        }
    },



    offres_status_groupe: async (data) => {
        try {
            const { user_id, post_id, statut } = data;

            // hors_ligne | en_ligne
            if (!user_id || !post_id || !statut) {
                return { status: "error", message: "Paramètres manquants" };
            }

            // 1️⃣ Mapper statut annonce → notification
            let notifStatus = null;
            if (statut === "hors_ligne") notifStatus = "OFFER_PAUSED";
            if (statut === "en_ligne") notifStatus = "OFFER_REPUBLISHED";

            const notifTemplate = notifStatus
                ? STATUS_NOTIFICATION_MAP[notifStatus]
                : null;

            // 2️⃣ CSV → Array
            const postIds = post_id
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postIds.length === 0) {
                return { status: "error", message: "Aucune annonce sélectionnée" };
            }

            // 3️⃣ Regrouper par source
            const groupedBySource = {};
            const annonceInfos = {};

            for (const pid of postIds) {
                const info = await getEntrepriseIDbyAnnonceID(pid);
                if (!info) continue;
                if (info.entreprise_id !== user_id) continue;

                annonceInfos[pid] = info;

                if (!groupedBySource[info.source]) {
                    groupedBySource[info.source] = [];
                }
                groupedBySource[info.source].push(pid);
            }

            if (Object.keys(groupedBySource).length === 0) {
                return { status: "error", message: "Aucune annonce valide" };
            }

            // 4️⃣ Mise à jour des annonces
            let totalUpdated = 0;

            for (const source of Object.keys(groupedBySource)) {
                const Model = MODEL_BY_SOURCE[source];
                if (!Model) continue;

                const ids = groupedBySource[source];


                const [affectedRows] = await Model.update(
                    { statut },
                    { where: { post_id: ids } }
                );

                totalUpdated += affectedRows;

            }

            // 5️⃣ Notifications candidats (si nécessaire)
            if (notifTemplate) {
                const entrepriseInfo = await getEntrepriseInfo(user_id);
                const senderName = entrepriseInfo?.nom || "Entreprise";

                for (const pid of Object.keys(annonceInfos)) {
                    // récupérer les candidatures OFF
                    let candidatures = await PostulationAnnonceOffreEmploi.findAll({
                        where: { annonce_id: pid },
                        attributes: ["id", "user_id"],
                    });

                    // fallback AOF
                    if (!candidatures || candidatures.length === 0) {
                        candidatures = await PostulationAppelOffre.findAll({
                            where: { annonce_id: pid },
                            attributes: ["id", "user_id"],
                        });
                    }

                    if (!candidatures || candidatures.length === 0) continue;

                    for (const c of candidatures) {
                        const candInfo = await getCandidatinfo(c.user_id);

                        console.log({
                            sender_id: user_id,
                            sender_name: senderName,

                            receiver_id: c.user_id,
                            receiver_name: candInfo?.nom || "Candidat",

                            type: notifTemplate.type,
                            action: notifStatus,

                            title: notifTemplate.title,
                            message: notifTemplate.message,

                            object_id: pid,
                            object_type: "ANNONCE",
                            object_label: annonceInfos[pid].title || "Annonce",

                            meta: {
                                createdAt: new Date().toISOString(),
                                postulation_id: c.id,
                                annonce_id: pid,
                                annonce_status: statut,
                                is_read: false,
                            },
                        })

                        await createOrUpdateNotification({
                            sender_id: user_id,
                            sender_name: senderName,

                            receiver_id: c.user_id,
                            receiver_name: candInfo?.nom || "Candidat",

                            type: notifTemplate.type,
                            action: notifStatus,

                            title: notifTemplate.title,
                            message: notifTemplate.message,

                            object_id: pid,
                            object_type: "ANNONCE",
                            object_label: annonceInfos[pid].title || "Annonce",

                            meta: {
                                createdAt: new Date().toISOString(),
                                postulation_id: c.id,
                                annonce_id: pid,
                                annonce_status: statut,
                                is_read: false,
                            },
                        });
                    }
                }
            }

            return {
                status: "success",
                message: `${totalUpdated} annonce(s) mises à jour et notifications envoyées`,
            };

        } catch (err) {
            console.error("Erreur offres_status_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la mise à jour groupée",
            };
        }
    },


    delete_offres_save_groupe: async (data) => {
        try {


            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 Transformer la chaîne en tableau
            const postIds = post_id
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune offre à supprimer",
                };
            }

            // 🗑️ Suppression groupée
            const deletedRows = await SaveAnnonce.destroy({
                where: {
                    user_id,
                    post_id: postIds, // IN (...)
                }
            });

            return {
                status: "success",
                total_deleted: deletedRows,
                message: "Offres supprimées des enregistrements",
            };

        } catch (err) {
            console.error("Erreur delete_offres_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la suppression en groupe",
            };
        }
    },

    delete_candidats_save_groupe: async (data) => {
        try {

            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 Transformer la chaîne en tableau
            const postIds = post_id
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (postIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucune offre à supprimer",
                };
            }

            // 🗑️ Suppression groupée
            const deletedRows = await EntrepriseSaveCandidats.destroy({
                where: {
                    user_id,
                    candidate_id: postIds, // IN (...)
                }
            });

            return {
                status: "success",
                total_deleted: deletedRows,
                message: "Offres supprimées des enregistrements",
            };

        } catch (err) {
            console.error("Erreur delete_offres_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la suppression en groupe",
            };
        }
    },

    associer_candidat_qcm: async (data) => {
        try {
            const { user_id, post_id, payload } = data;


            console.log("--------------")
            console.log(user_id, post_id)
            console.log(payload)
            console.log("--------------")

            if (!post_id || !payload || !payload.target) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            let rows = [];
            let notified = [];


            // 🔹 CAS 1 : tous les candidats
            if (payload.target === "ALL") {
                // 1️⃣ Récupérer les offres associées
                const offresAssociees = await QcmOffres.findAll({
                    where: { qcm_id: post_id },
                    attributes: ["offre_id"],
                });

                if (!offresAssociees || offresAssociees.length === 0) {
                    return {
                        status: "error",
                        message: "Aucune offre n'est associée à ce QCM",
                    };
                }

                const offreIds = offresAssociees.map(o => o.offre_id);


                // 2️⃣ Séparer les offres OFF et AOF
                const offresOFF = offreIds.filter(id => id.startsWith("OFF-"));
                const offresAOF = offreIds.filter(id => id.startsWith("AOF-"));


                // ici QcmCandidats on verifie esque la candidat a un qcm active 

                let candidats = [];

                // 3️⃣ Récupérer candidats OFF
                if (offresOFF.length > 0) {
                    const candidatsOFF = await PostulationAnnonceOffreEmploi.findAll({
                        where: {
                            annonce_id: offresOFF,
                            statut: ["APPLIED", "WAITING"],
                        },
                        attributes: ["id", "user_id", "annonce_id"],
                    });
                    candidats = candidats.concat(candidatsOFF);
                }

                // 4️⃣ Récupérer candidats AOF
                if (offresAOF.length > 0) {
                    const candidatsAOF = await PostulationAppelOffre.findAll({
                        where: {
                            annonce_id: offresAOF,
                            statut: ["APPLIED", "WAITING"],
                        },
                        attributes: ["id", "user_id", "annonce_id"],
                    });
                    candidats = candidats.concat(candidatsAOF);
                }





                if (candidats.length === 0) {
                    return {
                        status: "error",
                        message: "Aucun candidat avec le statut APPLIED ou WAITING trouvé pour ces offres",
                    };
                }


                // 5️⃣ Préparer insertions dans QcmCandidats et notifications
                const rows = [];
                const notified = [];

                for (const candidat of candidats) {

                    const qcmActif = await QcmCandidats.findOne({
                        where: {
                            qcm_id: post_id,
                            candidat_id: candidat.user_id,
                            status: ["ASSIGNED", "IN_PROGRESS"]
                        }
                    });

                    if (qcmActif) {
                        continue; // ⛔ on saute si déjà actif
                    }


                    if (candidat.annonce_id.startsWith("OFF-")) {

                        await PostulationAnnonceOffreEmploi.update(
                            { statut: "WAITING_EXAM" },
                            { where: { id: candidat.id, annonce_id: offresOFF } }
                        );
                    }

                    if (candidat.annonce_id.startsWith("AOF-")) {

                        await PostulationAppelOffre.update(
                            { statut: "WAITING_EXAM" },
                            { where: { id: candidat.id, annonce_id: offresOFF } }
                        );
                    }

                    // Ajouter au QCM_Candidats
                    rows.push({
                        qcm_id: post_id,
                        candidat_id: candidat.user_id,
                        startDate: payload.startDate,
                        endDate: payload.endDate
                    });


                    // Mettre à jour le statut du candidat à WAITING_EXAM
                    candidat.statut = "WAITING_EXAM";
                    await candidat.save();

                    // Créer notification


                    const candidat_info = await getCandidatsByPostulationId(candidat.id);

                    let annonce = await getEntrepriseIDbyAnnonceID(candidat_info.annonce_id)

                    let info_entreprise = await getEntrepriseInfo(user_id)

                    let user_info = await getCandidatinfo(user_id)

                    let cand_info = await getCandidatinfo(candidat_info.user_id)



                    await createOrUpdateNotification({
                        sender_id: user_id,
                        sender_name: user_info.nom || "Entreprise",
                        receiver_id: candidat_info.user_id,
                        receiver_name: cand_info.nom || "Candidat", // si disponible

                        type: "OPEN_QCM",
                        action: `/qcm/${post_id}`,

                        title: "Invitation à un test de sélection",
                        message: `"Votre candidature pour l’offre « ${annonce.title} » a été retenue.\n\n" +
                                 "Vous êtes invité(e) à passer un test de sélection (QCM) afin de poursuivre le processus.\n\n" +
                             "👉 Connectez-vous à votre espace candidat pour démarrer le test."`,

                        object_id: post_id,
                        object_type: "ANNONCE",
                        object_label: annonce.title || "Annonce",

                        meta: {
                            createdAt: new Date().toISOString(),
                            candidat_id: candidat_info.user_id,
                            postulation_id: post_id,
                            annonce_id: candidat_info.annonce_id,
                            is_read: false,
                        },
                    });

                    await updatePostulationNotification(candidat, post_id);

                    notified.push(candidat.user_id);
                }


                // 6️⃣ Insertion massive dans QcmCandidats
                await QcmCandidats.bulkCreate(rows, { ignoreDuplicates: true });

                return {
                    status: "success",
                    message: "Tous les candidats des offres associées ont été assignés au QCM",
                    assigned: rows.length,
                    notified,
                };
            }


            if (payload.target === "SELECTED") {
                const rows = [];
                const notified = [];

                // 1️⃣ Récupérer les offres associées
                const offresAssociees = await QcmOffres.findAll({
                    where: { qcm_id: post_id },
                    attributes: ["offre_id"],
                });

                const offreIds = offresAssociees.map(o => o.offre_id);
                const offresOFF = offreIds.filter(id => id.startsWith("OFF-"));
                const offresAOF = offreIds.filter(id => id.startsWith("AOF-"));
                const hasOffres = offreIds.length > 0;

                for (const email of payload.emails) {
                    // 🔹 Vérifier si le candidat existe
                    const candidat = await User.findOne({
                        where: { email },
                        attributes: ["id"],
                    });
                    if (!candidat) continue;

                    console.log(post_id)

                    console.log(candidat.id)


                    // 🔎 🔥 VÉRIFICATION QCM ACTIF
                    const qcmActif = await QcmCandidats.findOne({
                        where: {
                            qcm_id: post_id,
                            candidat_id: candidat.id,
                            status: ["ASSIGNED", "IN_PROGRESS"]
                        }
                    });

                    if (qcmActif) {
                        console.log("QCM déjà actif pour ce candidat");
                        continue; // ⛔ on saute
                    }

                    let assigned = false;

                    if (hasOffres) {
                        // 🔹 Vérifier postulation OFF
                        if (offresOFF.length > 0) {
                            const postulationOFF = await PostulationAnnonceOffreEmploi.findOne({
                                where: { annonce_id: offresOFF, user_id: candidat.id },
                                attributes: ["id", "annonce_id", "statut", "tab_notification"],
                            });
                            if (postulationOFF) {
                                assigned = true;

                                const newNotification = {
                                    id: `notif_${Date.now()}`,
                                    status: "WAITING_EXAM",
                                    message_type: "INFO",
                                    message: `Vous avez été sélectionné pour passer le QCM ${post_id}`,
                                    action_type: "OPEN_QCM",
                                    action_link: `/qcm/${post_id}`,
                                    is_read: false,
                                    created_at: new Date(),
                                };

                                const notifications = Array.isArray(postulationOFF.tab_notification)
                                    ? postulationOFF.tab_notification
                                    : [];
                                notifications.push(newNotification);

                                await PostulationAnnonceOffreEmploi.update(
                                    { statut: "WAITING_EXAM", tab_notification: notifications },
                                    { where: { id: postulationOFF.id, annonce_id: offresOFF } }
                                );


                                rows.push({
                                    qcm_id: post_id,
                                    candidat_id: candidat.id,
                                    startDate: payload.startDate,
                                    endDate: payload.endDate

                                });
                            }
                        }

                        // 🔹 Vérifier postulation AOF
                        if (!assigned && offresAOF.length > 0) {
                            const postulationAOF = await PostulationAppelOffre.findOne({
                                where: { annonce_id: offresAOF, user_id: candidat.id },
                                attributes: ["id", "annonce_id", "statut", "tab_notification"],
                            });
                            if (postulationAOF) {
                                assigned = true;

                                const newNotification = {
                                    id: `notif_${Date.now()}`,
                                    status: "WAITING_EXAM",
                                    message_type: "INFO",
                                    message: `Vous avez été sélectionné pour passer le QCM ${post_id}`,
                                    action_type: "OPEN_QCM",
                                    action_link: `/qcm/${post_id}`,
                                    is_read: false,
                                    created_at: new Date(),
                                };

                                const notifications = Array.isArray(postulationAOF.tab_notification)
                                    ? postulationAOF.tab_notification
                                    : [];
                                notifications.push(newNotification);

                                await PostulationAppelOffre.update(
                                    { statut: "WAITING_EXAM", tab_notification: notifications },
                                    { where: { id: postulationAOF.id } }
                                );

                                rows.push({
                                    qcm_id: post_id,
                                    candidat_id: candidat.id,
                                    startDate: payload.startDate,
                                    endDate: payload.endDate
                                });
                            }
                        }
                    }



                    // 🔹 Envoyer notification générale même si le candidat n’a pas postulé


                    let info_entreprise = await getEntrepriseInfo(user_id)

                    let user_info = await getCandidatinfo(user_id)

                    let cand_info = await getCandidatinfo(candidat.id)


                    await createOrUpdateNotification({
                        sender_id: user_id,
                        sender_name: user_info.nom || "Entreprise",
                        receiver_id: candidat.id,
                        receiver_name: cand_info.nom || "Candidat", // si disponible

                        type: "OPEN_QCM",
                        action: `/qcm/${post_id}`,

                        title: "Invitation à un test de sélection",
                        message: `Votre candidature a été retenue.\n\n` +
                            `Vous êtes invité(e) à passer un test de sélection (QCM) afin de poursuivre le processus.\n\n` +
                            `👉 Connectez-vous à votre espace candidat pour démarrer le test.`,

                        object_id: post_id,
                        object_type: "ANNONCE",
                        object_label: "Annonce",

                        meta: {
                            createdAt: new Date().toISOString(),
                            candidat_id: candidat.id,
                            postulation_id: post_id,
                            is_read: false,
                        },
                    });

                    notified.push(email);
                }

                // 🔹 Insertion massive dans QcmCandidats pour ceux qui ont postulé
                if (rows.length > 0) {
                    await QcmCandidats.bulkCreate(rows, { ignoreDuplicates: true });
                }

                return {
                    status: "success",
                    message: "Les candidats sélectionnés ont été notifiés et assignés au QCM si applicable.",
                    assigned: rows.length,
                    notified,
                };
            }


            if (rows.length === 0) {
                return {
                    status: "error",
                    message: "Aucun candidat valide trouvé",
                };
            }

            await QcmCandidats.bulkCreate(rows, {
                ignoreDuplicates: true,
            });

            return {
                status: "success",
                message: "QCM assigné aux candidats",
                assigned: rows.length,
                notified,
            };

        } catch (err) {
            console.error("Erreur associer_candidat_qcm:", err);
            return {
                status: "error",
                message: "Erreur lors de l’assignation des candidats au QCM",
            };
        }
    },

    ajouter_offre_qcm: async (data) => {
        try {


            const { user_id, qcm_id, post_id } = data;

            if (!user_id || !qcm_id || post_id === 0) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // Vérifier si déjà associé
            const check = await QcmOffres.findOne({
                where: {
                    qcm_id,
                    offre_id: post_id,
                },
            });


            if (check) {
                return {
                    status: "error",
                    message: "Offre déjà associée au QCM",
                };
            }


            // ✅ insertion simple
            await QcmOffres.create({
                qcm_id,
                offre_id: post_id,
            });

            return {
                status: "success",
                message: "Offre associée au QCM",
            };





        } catch (err) {
            console.error("Erreur associer_offre_qcm:", err);
            return {
                status: "error",
                message: "Erreur lors de l’association des offres au QCM",
            };
        }
    },

    retirer_offre_qcm: async (data) => {
        try {


            const { user_id, qcm_id, post_id } = data;

            if (!user_id || !qcm_id || post_id === 0) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            const check = await QcmOffres.findOne({
                where: {
                    qcm_id,
                    offre_id: post_id,
                },
            });

            if (!check) {
                return {
                    status: "error",
                    message: "Offre n'exist pas",
                };
            }

            // ✅ suppression
            const deleted = await QcmOffres.destroy({
                where: {
                    qcm_id,
                    offre_id: post_id,
                },
            });

            if (deleted === 0) {
                return {
                    status: "error",
                    message: "Association non trouvée",
                };
            }

            return {
                status: "success",
                message: "Offre retirée du QCM",
            };



        } catch (err) {
            console.error("Erreur associer_offre_qcm:", err);
            return {
                status: "error",
                message: "Erreur lors de l’association des offres au QCM",
            };
        }
    },
    associer_offre_qcm: async (data) => {
        try {
            const { user_id, post_id, payload } = data;

            if (!post_id || !Array.isArray(payload) || payload.length === 0) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            const rows = [];
            const invalidOffres = [];

            // 🔍 vérification une par une
            for (const offre_id of payload) {
                const exists = await getEntrepriseIDbyAnnonceID(offre_id);

                if (exists) {
                    rows.push({
                        qcm_id: post_id,
                        offre_id,
                    });
                } else {
                    invalidOffres.push(offre_id);
                }
            }

            if (rows.length === 0) {
                return {
                    status: "error",
                    message: "Aucune offre valide trouvée",
                };
            }


            // ✅ insertion (ignore doublons si index unique)
            await QcmOffres.bulkCreate(rows, {
                ignoreDuplicates: true,
            });

            return {
                status: "success",
                message: "Offres associées au QCM avec succès",
                inserted: rows.length,
                ignored: invalidOffres, // utile pour logs/debug
            };

        } catch (err) {
            console.error("Erreur associer_offre_qcm:", err);
            return {
                status: "error",
                message: "Erreur lors de l’association des offres au QCM",
            };
        }
    },

    detete_qcm: async (data) => {
        try {



            const { user_id, post_id } = data;

            // 🔹 Validation des données
            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // 🔹 Vérifier que le QCM existe et appartient au recruteur
            const qcm = await ExamenQcm.findOne({
                where: {
                    post_id,
                    user_id // ⚠️ adapte le champ si besoin
                },
                attributes: ["id", "statut"],
            });



            if (!qcm) {
                return {
                    status: "error",
                    message: "QCM introuvable ou accès non autorisé",
                };
            }

            console.log(qcm.statut)
            // 🔹 Éviter une double suppression
            if (qcm.statut === "DELETED_BY_COMPANY") {
                return {
                    status: "warning",
                    message: "Ce QCM est déjà supprimé",
                };
            }

            // 🔹  Récupérer tous les candidats assignés à ce QCM
            const candidats = await QcmCandidats.findAll({
                where: { qcm_id: post_id },
                attributes: ["candidat_id"],
                raw: true,
            });

            if (candidats.length > 0) {
                const idsCandidats = candidats.map(c => c.candidat_id);

                await QcmCandidats.update(
                    { status: "REMOVED_BY_COMPANY", updatedAt: new Date() },
                    { where: { qcm_id: post_id, candidat_id: idsCandidats } }
                );

                // 🔹  Envoyer notification à chaque candidat
                for (const c of candidats) {


                    let user_info = await getCandidatinfo(c.candidat_id)

                    let cand_info = await getCandidatinfo(c.candidat_id)

                    await createOrUpdateNotification({
                        sender_id: user_id,
                        sender_name: user_info.nom || "Entreprise",

                        receiver_id: c.candidat_id,
                        receiver_name: cand_info.nom || "Candidat", // si disponible

                        type: "INFO",
                        action: "NONE",

                        title: "Mise à jour de votre candidature",
                        message:
                            `Le test de sélection précédemment associé à votre candidature a été retiré.\n\n` +
                            `Votre candidature reste toutefois active et sera étudiée par notre équipe.\n\n` +
                            `👉 Vous serez informé(e) en cas de prochaine étape.`,

                        object_id: post_id,
                        object_type: "QCM",
                        object_label: "Test de sélection",

                        meta: {
                            createdAt: new Date().toISOString(),
                            candidat_id: c.candidat_id,
                            qcm_id: post_id,
                            is_read: false,
                        },
                    });
                }
            }


            // 🔹 Soft delete
            await ExamenQcm.update(
                {
                    statut: "DELETED_BY_COMPANY",
                    updatedAt: new Date(), // optionnel mais recommandé
                },
                {
                    where: { post_id },
                }
            );

            return {
                status: "success",
                message: "Le QCM a été supprimé avec succès",
            };



        } catch (err) {
            console.error("Erreur delete_offres_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la suppression en groupe",
            };
        }

    },

    detete_qcm_by_candidats: async (data) => {
        try {

            const { user_id, qcm_id, candidat_id } = data;

            // 🔹 1️⃣ Validation des données
            if (!user_id || !qcm_id || !candidat_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 2️⃣ Vérifier que le QCM existe et appartient au recruteur
            const qcm = await ExamenQcm.findOne({
                where: {
                    post_id: qcm_id,
                    user_id,
                },
                attributes: ["post_id", "statut"],
                raw: true,
            });

            if (!qcm) {
                return {
                    status: "error",
                    message: "QCM introuvable ou accès non autorisé",
                };
            }

            // 🔹 3️⃣ Vérifier que le candidat est bien assigné à ce QCM

            const qcmCandidat = await QcmCandidats.findOne({
                where: {
                    qcm_id,
                    candidat_id,
                },
                raw: true,
            });

            if (!qcmCandidat) {
                return {
                    status: "warning",
                    message: "Ce candidat n’est pas assigné à ce QCM",
                };
            }

            // 🔹 4️⃣ Retirer le QCM (soft action)
            await QcmCandidats.update(
                {
                    status: "REMOVED_BY_COMPANY",
                    updatedAt: new Date(),
                },
                {
                    where: {
                        qcm_id,
                        candidat_id,
                    },
                }
            );

            // 🔹 5️⃣ Notification douce au candidat

            const senderInfo = await getEntrepriseInfo(user_id);

            const createdAt = new Date().toISOString();
            const candInfo = await getCandidatinfo(candidat_id);

            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: senderInfo?.nom || "Entreprise",

                receiver_id: candidat_id,
                receiver_name: candInfo.nom || "Candidat",

                type: "INFO",
                action: "None",

                title: "Mise à jour de votre candidature",
                message:
                    `Le test de sélection précédemment associé à votre candidature a été retiré.\n\n` +
                    `Votre candidature reste toutefois active et sera étudiée par notre équipe.\n\n` +
                    `👉 Vous serez informé(e) en cas de prochaine étape.`,

                object_id: qcm_id,
                object_type: "QCM",
                object_label: "Test de sélection",

                meta: {
                    createdAt,
                    candidat_id: candidat_id,
                    qcm_id: qcm_id,
                    is_read: false,
                },
            });

            return {
                status: "success",
                message: "QCM retiré du candidat avec succès",
            };

        } catch (err) {
            console.error("Erreur detete_qcm_by_candidats:", err);
            return {
                status: "error",
                message: "Erreur lors du retrait du QCM au candidat",
            };
        }
    },


    detete_qcm_by_candidats_groupe: async (data) => {
        try {
            const { user_id, qcm_id, candidat_id } = data;

            // 🔹 1️⃣ Validation
            if (!user_id || !qcm_id || !candidat_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 2️⃣ Transformer la liste des candidats
            const candidatIds = Array.isArray(candidat_id)
                ? candidat_id
                : candidat_id.split(",").map(id => id.trim()).filter(Boolean);

            if (candidatIds.length === 0) {
                return {
                    status: "warning",
                    message: "Aucun candidat valide fourni",
                };
            }

            // 🔹 3️⃣ Vérifier que le QCM appartient bien au recruteur
            const qcm = await ExamenQcm.findOne({
                where: {
                    post_id: qcm_id,
                    user_id,
                },
                attributes: ["post_id"],
                raw: true,
            });

            if (!qcm) {
                return {
                    status: "error",
                    message: "QCM introuvable ou accès non autorisé",
                };
            }

            // 🔹 4️⃣ Récupérer uniquement les candidats réellement assignés
            const candidatsAssignes = await QcmCandidats.findAll({
                where: {
                    qcm_id,
                    candidat_id: candidatIds,
                    status: { [Op.ne]: "REMOVED_BY_COMPANY" },
                },
                attributes: ["candidat_id"],
                raw: true,
            });

            if (candidatsAssignes.length === 0) {
                return {
                    status: "warning",
                    message: "Aucun des candidats sélectionnés n’est assigné à ce QCM",
                };
            }

            const candidatsValidesIds = candidatsAssignes.map(c => c.candidat_id);

            // 🔹 5️⃣ Retirer le QCM (soft delete)
            await QcmCandidats.update(
                {
                    status: "REMOVED_BY_COMPANY",
                    updatedAt: new Date(),
                },
                {
                    where: {
                        qcm_id,
                        candidat_id: candidatsValidesIds,
                    },
                }
            );

            // 🔹 6️⃣ Notifications (une par candidat)

            const senderInfo = await getEntrepriseInfo(user_id);

            const createdAt = new Date().toISOString();

            await Promise.all(
                candidatsValidesIds.map(async (candidatId) => {
                    // 1️⃣ Infos candidat
                    const candInfo = await getCandidatinfo(candidatId);

                    if (!candInfo) {
                        console.warn(`Candidat introuvable : ${candidatId}`);
                        return;
                    }




                    // 2️⃣ Notification
                    await createOrUpdateNotification({
                        sender_id: user_id,
                        sender_name: senderInfo?.nom || "Entreprise",

                        receiver_id: candidatId,
                        receiver_name: candInfo.nom || "Candidat",

                        type: "INFO",
                        action: "NONE",

                        title: "Mise à jour de votre candidature",
                        message:
                            `Le test de sélection précédemment associé à votre candidature a été retiré.\n\n` +
                            `Votre candidature reste toutefois active et sera étudiée par notre équipe.\n\n` +
                            `👉 Vous serez informé(e) en cas de prochaine étape.`,

                        object_id: qcm_id,
                        object_type: "QCM",
                        object_label: "Test de sélection",

                        meta: {
                            createdAt,
                            candidat_id: candidatId,
                            qcm_id,
                            is_read: false,
                        },
                    });
                })
            );


            return {
                status: "success",
                message: "QCM retiré pour les candidats sélectionnés",
                removed_count: candidatsValidesIds.length,
                candidats: candidatsValidesIds,
            };

        } catch (err) {
            console.error("Erreur detete_qcm_by_candidats_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors du retrait du QCM aux candidats",
            };
        }
    },
    entretien_notification: async (data) => {

        const { user_id, candidat_id, msg } = data;


        // 🔹 1️⃣ Validation
        if (!user_id || !msg || !candidat_id) {
            return {
                status: "error",
                message: "Paramètres manquants",
            };
        }


        let message = msg.msg,
            entr_id = msg.entr_id,
            entr_info = msg.entr_info


        const senderInfo = await getCandidatinfo(user_id);



        const createdAt = new Date().toISOString();
        const candInfo = await getCandidatinfo(candidat_id);


        let annonce = await getEntrepriseIDbyAnnonceID(entr_info)


        const annonceTitle = annonce?.title;
        const notification = {
            sender_id: user_id,
            sender_name: senderInfo?.nom || "Entreprise",

            receiver_id: candidat_id,
            receiver_name: candInfo.nom || "Candidat",

            type: "INFO",
            action: "None",

            title: `Mise à jour de votre candidature pour : ${annonceTitle}`,
            message: message,

            object_id: entr_id,
            object_type: "ENTRETIEN",
            object_label: annonce.title,

            meta: {
                createdAt,
                candidat_id: candidat_id,
                post_id: entr_id,
                is_read: false,
            },
        }

        await createOrUpdateNotification(notification);

        return {
            status: "success",
            message: "Notification envoyer avec succès",
        };
    },
    entretien_notification_groupe: async (data) => {
        try {

            console.log("DATA:", data);

            const { user_id, msg } = data;

            // 🔹 Validation
            if (!user_id || !msg?.msg || !Array.isArray(msg?.entr_infos)) {
                return {
                    status: "error",
                    message: "Paramètres invalides",
                };
            }

            const senderInfo = await getCandidatinfo(user_id);
            const createdAt = new Date().toISOString();

            // 🔹 Boucle sur chaque entretien
            for (const info of msg.entr_infos) {

                const { candidat_id, offre, entr_id } = info;

                if (!candidat_id || !offre || !entr_id) continue;

                // infos candidat
                const candInfo = await getCandidatinfo(candidat_id);

                // infos annonce
                const annonce = await getEntrepriseIDbyAnnonceID(offre);
                const annonceTitle = annonce?.title || "Offre";

                const notification = {
                    sender_id: user_id,
                    sender_name: senderInfo?.nom || "Entreprise",

                    receiver_id: candidat_id,
                    receiver_name: candInfo?.nom || "Candidat",

                    type: "INFO",
                    action: "NONE",

                    title: `Mise à jour de votre candidature pour : ${annonceTitle}`,
                    message: msg.msg,

                    object_id: entr_id,
                    object_type: "ENTRETIEN",
                    object_label: annonceTitle,

                    meta: {
                        createdAt,
                        candidat_id,
                        post_id: offre,
                        is_read: false,
                    },
                };
                await createOrUpdateNotification(notification);

                // 🔔 socket optionnel
                // socket.to(`user_${candidat_id}`).emit("notification", notification);
            }

            return {
                status: "success",
                message: "Notifications groupées envoyées",
            };

        } catch (error) {
            console.error("Erreur entretien_notification_groupe :", error);

            return {
                status: "error",
                message: "Erreur envoi notifications groupées",
            };
        }
    },




    detele_entretien: async (data) => {
        try {


            console.log(data)
            const { user_id, post_id } = data;

            // 🔹 Validation des données
            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            console.log(post_id)

            // 🔹 Vérifier que le QCM existe et appartient au recruteur
            const qcm = await EntretienCandidat.findOne({
                where: {
                    post_id,
                    user_id // ⚠️ adapte le champ si besoin
                },
                attributes: ["id", "status", "candidat_id", "offre"],
                raw: true
            });

            console.log(qcm.candidat_id)


            if (!qcm) {
                return {
                    status: "error",
                    message: "QCM introuvable ou accès non autorisé",
                };
            }



            // 🔹 Éviter une double suppression
            if (qcm.status === "REMOVED_BY_COMPANY") {
                return {
                    status: "warning",
                    message: "Ce QCM est déjà supprimé",
                };
            }



            // 🔹 Soft delete


            await EntretienCandidat.update(
                {
                    status: "REMOVED_BY_COMPANY",
                    updatedAt: new Date(), // optionnel mais recommandé
                },
                {
                    where: { post_id },
                }
            );


            const senderInfo = await getCandidatinfo(user_id);

            const createdAt = new Date().toISOString();
            const candInfo = await getCandidatinfo(qcm.candidat_id);




            let annonce = await getEntrepriseIDbyAnnonceID(qcm.offre)


            const annonceTitle = annonce?.title;
            const notification = {
                sender_id: user_id,
                sender_name: senderInfo?.nom || "Entreprise",

                receiver_id: qcm.candidat_id,
                receiver_name: candInfo.nom || "Candidat",

                type: "INFO",
                action: "None",

                title: `Mise à jour de votre candidature pour : ${annonceTitle}`,
                message: "L’entretien associé à votre candidature a été annulé par le recruteur. Votre candidature reste toutefois active et continue d’être prise en considération.",

                object_id: post_id,
                object_type: "ENTRETIEN",
                object_label: annonceTitle,

                meta: {
                    createdAt,
                    candidat_id: qcm.candidat_id,
                    post_id: qcm.offre,
                    is_read: false,
                },
            }


            await createOrUpdateNotification(notification);

            return {
                status: "success",
                message: "Le QCM a été supprimé avec succès",
            };



        } catch (err) {
            console.error("Erreur delete_offres_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la suppression en groupe",
            };
        }

    },

    detele_entretien_groupe: async (data) => {
        try {
            console.log(data);

            const { user_id, post_id } = data;

            // 🔹 1️⃣ Validation
            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // 🔹 2️⃣ Transformation post_id → tableau
            const postIds = post_id.split(",");

            // 🔹 3️⃣ Récupération des entretiens concernés
            const entretiens = await EntretienCandidat.findAll({
                where: {
                    post_id: postIds,
                    user_id
                },
                attributes: ["post_id", "status", "candidat_id", "offre"],
                raw: true
            });

            if (!entretiens.length) {
                return {
                    status: "error",
                    message: "Aucun entretien trouvé ou accès non autorisé",
                };
            }

            // 🔹 4️⃣ Soft delete (bulk)

            await EntretienCandidat.update(
                {
                    status: "REMOVED_BY_COMPANY",
                    updatedAt: new Date(),
                },
                {
                    where: {
                        post_id: postIds,
                        user_id,
                        status: { [Op.ne]: "REMOVED_BY_COMPANY" }
                    },
                }
            );


            // 🔹 5️⃣ Notifications (1 candidat ↔ 1 entretien)
            for (const entretien of entretiens) {


                const senderInfo = await getCandidatinfo(user_id);

                const createdAt = new Date().toISOString();
                const candInfo = await getCandidatinfo(entretien.candidat_id);
                let annonce = await getEntrepriseIDbyAnnonceID(entretien.offre)


                const annonceTitle = annonce?.title;
                const notification = {
                    sender_id: user_id,
                    sender_name: senderInfo?.nom || "Entreprise",

                    receiver_id: entretien.candidat_id,
                    receiver_name: candInfo.nom || "Candidat",

                    type: "INFO",
                    action: "None",

                    title: `Mise à jour de votre candidature pour : ${annonceTitle}`,
                    message: "L’entretien associé à votre candidature a été annulé par le recruteur. Votre candidature reste toutefois active et continue d’être prise en considération.",

                    object_id: post_id,
                    object_type: "ENTRETIEN",
                    object_label: annonceTitle,

                    meta: {
                        createdAt,
                        candidat_id: entretien.candidat_id,
                        post_id: entretien.offre,
                        is_read: false,
                    },
                }

                console.log(notification)

                await createOrUpdateNotification(notification);



                // 🔔 optionnel socket
                // socket.to(`user_${entretien.candidat_id}`).emit("notification", {...});
            }

            return {
                status: "success",
                message: "Entretiens supprimés avec succès",
            };

        } catch (err) {
            console.error("Erreur detele_entretien_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la suppression en groupe",
            };
        }
    },

    detete_qcm_groupe: async (data) => {
        try {


            const { user_id, post_id } = data;

            // 🔹 Validation
            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // 🔹 Normaliser post_id (array ou string)
            const postIds = Array.isArray(post_id)
                ? post_id
                : String(post_id).split(",");

            if (postIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucun QCM sélectionné",
                };
            }

            // 🔹 Récupérer les QCM appartenant au recruteur
            const qcms = await ExamenQcm.findAll({
                where: {
                    post_id: postIds,
                    user_id,
                },
                attributes: ["post_id", "statut"],
            });

            if (!qcms || qcms.length === 0) {
                return {
                    status: "error",
                    message: "Aucun QCM trouvé ou accès non autorisé",
                };
            }

            // 🔹 Filtrer ceux déjà supprimés
            const qcmsToDelete = qcms.filter(
                qcm => qcm.statut !== "DELETED_BY_COMPANY"
            );

            if (qcmsToDelete.length === 0) {
                return {
                    status: "warning",
                    message: "Tous les QCM sélectionnés sont déjà supprimés",
                };
            }

            const idsToDelete = qcmsToDelete.map(qcm => qcm.post_id);

            for (const qcmId of idsToDelete) {
                const candidats = await QcmCandidats.findAll({
                    where: { qcm_id: qcmId },
                    attributes: ["candidat_id"],
                    raw: true,
                });

                if (candidats.length > 0) {
                    const idsCandidats = candidats.map(c => c.candidat_id);

                    // Soft delete candidats
                    await QcmCandidats.update(
                        { status: "REMOVED_BY_COMPANY", updatedAt: new Date() },
                        { where: { qcm_id: qcmId, candidat_id: idsCandidats } }
                    );

                    // Notifications parallèles pour accélérer
                    // 1️⃣ Récupérer UNE seule fois l’entreprise (sender)
                    const senderInfo = await getEntrepriseInfo(user_id);

                    const createdAt = new Date().toISOString();

                    await Promise.all(
                        candidats.map(async (c) => {
                            // 2️⃣ Récupérer les infos du candidat


                            const candInfo = await getCandidatinfo(c.candidat_id);

                            if (!candInfo) {
                                console.warn(`Infos candidat introuvables: ${c.candidat_id}`);
                                return;
                            }



                            // 3️⃣ Envoyer la notification
                            await createOrUpdateNotification({
                                sender_id: user_id,
                                sender_name: senderInfo?.nom || "Entreprise",

                                receiver_id: c.candidat_id,
                                receiver_name: candInfo.nom || "Candidat",

                                type: "INFO",
                                action: "None",

                                title: "Mise à jour de votre candidature",
                                message:
                                    `Le test de sélection précédemment associé à votre candidature a été retiré.\n\n` +
                                    `Votre candidature reste toutefois active et sera étudiée par notre équipe.\n\n` +
                                    `👉 Vous serez informé(e) en cas de prochaine étape.`,

                                object_id: qcmId,
                                object_type: "QCM",
                                object_label: "Test de sélection",

                                meta: {
                                    createdAt,
                                    candidat_id: c.candidat_id,
                                    qcm_id: qcmId,
                                    is_read: false,
                                },
                            });
                        })
                    );

                }
            }

            // 🔹 Soft delete groupé
            await ExamenQcm.update(
                {
                    statut: "DELETED_BY_COMPANY",
                    updatedAt: new Date(),
                },
                {
                    where: {
                        post_id: idsToDelete,
                        user_id,
                    },
                }
            );

            return {
                status: "success",
                message: "QCM supprimés avec succès",
                deleted_count: idsToDelete.length,
                deleted_qcms: idsToDelete,
            };


        } catch (err) {
            console.error("Erreur delete_offres_groupe:", err);
            return {
                status: "error",
                message: "Erreur lors de la suppression en groupe",
            };
        }

    },

    annonce_post_id: async (data) => {
        try {


            console.log(data)
            // hors_ligne,en_ligne 
            const { user_id, post_id, page, limit } = data;


            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }

            // 🔹 Récupérer l’annonce et sa source
            const annonceInfo = await getEntrepriseIDbyAnnonceID(post_id);
            if (!annonceInfo) return { status: "error", message: "Annonce introuvable" };




            const candidats = await getCandidatsByAnnonceId(post_id);




            // 🔹 Transformer les candidats (si traitement futur)
            const candidats_liste = await Promise.all(
                candidats.data.map(async (item) => {
                    return item;
                })
            );




            const total = candidats.data.length;

            const start = (Number(page) - 1) * Number(limit);
            const end = start + Number(limit);

            const paginatedCandidats = candidats_liste.slice(start, end);

            return { status: "success", total, data: { annonce: annonceInfo, candidats: paginatedCandidats } };


        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    annonce_post_id_emploi: async (data) => {
        try {

            // hors_ligne,en_ligne 

            const { user_id, post_id, page = 1, limit = 10 } = data;

            if (!user_id || !post_id) {

                throw new Error("Paramètres manquants");
            }

            // 🔹 Récupérer l’annonce et sa source
            const annonceInfo = await getEntrepriseIDbyAnnonceID(post_id);
            if (!annonceInfo) return { status: "error", message: "Annonce introuvable" };


            const candidats = await getCandidatsByAnnonceId(post_id);


            const candidats_liste = await Promise.all(
                candidats.data.map(async (item) => {


                    const candidatInfo = await getCandidatinfo(item.user_id);

                    // ✅ Vérifie le QCM
                    const qcmResult = await checkQCM(item.annonce_id, item.user_id);

                    const getAnnonce_objet = await getEntrepriseIDbyAnnonceID(item.annonce_id)

                    // ✅ Vérifie si la lettre de motivation existe
                    const hasLettreMotivation =
                        typeof item.lettre_motivation === "string" &&
                        item.lettre_motivation.trim().length > 0;


                    return {
                        id: item.id,
                        user_id: item.user_id,
                        titre: getAnnonce_objet.title,
                        annonce_id: item.annonce_id,
                        email: candidatInfo.email,
                        nom: candidatInfo.nom,
                        status: item.statut,
                        lettre_motivation: hasLettreMotivation,
                        qcmResult: qcmResult,
                        createdAt: item.createdAt
                    };
                })
            );


            // 🔹 Trier par date (plus récent en premier)
            const candidats_final = candidats_liste.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            const total = candidats_final.length;



            const start = (Number(page) - 1) * Number(limit);
            const end = start + Number(limit);


            const paginatedCandidats = candidats_final.slice(start, end);




            if (!candidats_final) {
                return {
                    status: "success",
                    total: 0,
                    data: null
                };
            }

            return {
                status: "success",
                total,
                data: { annonce: paginatedCandidats, candidats }
            };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },

    annonce_post_id_emploi_search_candidats: async (data) => {
        try {



            const { user_id, post_id, search = "", filter, page = 1, limit = 10 } = data;

            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }

            const offset = (page - 1) * limit;


            const whereCandidats = {
                annonce_id: post_id,
                statut: {
                    [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete", "expire"],
                    ...(filter && filter.length > 0 ? { [Op.in]: filter } : {})
                }
            };

            const { rows, count } = await PostulationAnnonceOffreEmploi.findAndCountAll({
                where: whereCandidats,
                include: [
                    {
                        model: User,
                        attributes: ["nom", "email"],
                        where: search
                            ? { nom: { [Op.like]: `%${search}%` } }
                            : undefined
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]]
            });

            const candidats = rows.map((item) => ({
                id: item.id,
                user_id: item.user_id,
                nom: item.User.nom,
                email: item.User.email,
                status: item.statut,
                createdAt: item.createdAt
            }));

            return {
                status: "success",
                total: count,
                data: { annonce: candidats }
            };

        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    annonce_post_id_search_candidats: async (data) => {
        try {


            console.log(data)
            const { user_id, post_id, search = "", filter, page = 1, limit = 10 } = data;

            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }

            const offset = (page - 1) * limit;


            const whereCandidats = {
                annonce_id: post_id,
                statut: {
                    [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete", "expire"],
                    ...(filter && filter.length > 0 ? { [Op.in]: filter } : {})
                }
            };

            const { rows, count } = await PostulationAppelOffre.findAndCountAll({
                where: whereCandidats,
                include: [
                    {
                        model: User,
                        attributes: ["nom", "email"],
                        where: search
                            ? { nom: { [Op.like]: `%${search}%` } }
                            : undefined
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]]
            });



            const candidats = rows.map((item) => ({
                id: item.id,
                annonce_id: item.annonce_id,
                createdAt: item.createdAt,
                email: item.User.email,
                fichier_pdf: item.fichier_pdf,
                lettre_motivation: item.lettre_motivation,
                nom: item.User.nom,
                statut: item.statut,
                tab_notification: item.tab_notification,
                telephone: item.telephone,
                updatedAt: item.updatedAt,
                user_id: item.user_id
            }));

            return {
                status: "success",
                total: count,
                data: { annonce: candidats }
            };


        } catch (err) {
            console.error(err);
            throw err;
        }
    },


    qcm_candidats_all: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }



            // 🔹 1️⃣ Récupérer tous les candidats assignés
            const candidatsQcm = await QcmCandidats.findAll({
                where: {
                    qcm_id: post_id,
                    status: {
                        [Op.notIn]: ["DELETED_BY_CANDIDAT", "REMOVED_BY_COMPANY"]
                    }
                },
                attributes: ["candidat_id", "status"],
                raw: true,
            });


            if (!candidatsQcm.length) {
                return {
                    status: "success",
                    data: [],
                };
            }

            // 🔹 2️⃣ Extraire tous les IDs
            const userIds = candidatsQcm.map(item => item.candidat_id);

            // 🔹 3️⃣ Récupérer tous les examens en UNE requête
            const examens = await QcmExamensCandidats.findAll({
                where: {
                    qcm_id: post_id,
                    user_id: userIds
                },
                attributes: ["user_id", "totalTimeSeconds", "score", "antiFraudeLogs"],
                raw: true,
            });

            // 🔹 4️⃣ Transformer en Map pour accès rapide O(1)
            const examensMap = new Map(
                examens.map(exam => [exam.user_id, exam])
            );

            // 🔹 5️⃣ Construire la réponse finale
            const candidats_liste = await Promise.all(
                candidatsQcm.map(async (item) => {



                    const candidatInfo = await getCandidatinfo(item.candidat_id);
                    const exam = examensMap.get(item.candidat_id);

                    const offreID = await QcmOffres.findOne({
                        where: {
                            qcm_id: post_id
                        },
                        attributes: ["offre_id"],
                        raw: true
                    });

                    const { offre_id } = offreID

                    // Gestion sécurisée antiFraudeLogs
                    let antiFraudeCount = 0;

                    if (exam?.antiFraudeLogs) {
                        if (Array.isArray(exam.antiFraudeLogs)) {
                            antiFraudeCount = exam.antiFraudeLogs.length;
                        } else {
                            try {
                                const parsed = JSON.parse(exam.antiFraudeLogs);
                                antiFraudeCount = Array.isArray(parsed) ? parsed.length : 0;
                            } catch {
                                antiFraudeCount = 0;
                            }
                        }
                    }

                    return {
                        user_id: item.candidat_id,
                        offre_id,
                        email: candidatInfo?.email ?? null,
                        nom: candidatInfo?.nom ?? null,
                        status: item.status,
                        score: exam?.score ?? null,
                        tmp: exam?.totalTimeSeconds ?? 0,
                        antiFraudeLogs: antiFraudeCount
                    };
                })
            );

            return {
                status: "success",
                data: candidats_liste,
            };

        } catch (err) {
            console.error("Erreur qcm_candidats_all:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    send_qcm_by_candidats_notication: async (data) => {
        try {

            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }



        } catch (err) {
            console.error("Erreur qcm_candidats_all:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    notifications_mark_as_read: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                throw new Error("Paramètres manquants");
            }

            // 🔍 Récupération de la conversation par ID
            const conversation = await Notification.findOne({
                where: { id: post_id }
            });

            if (!conversation) {
                throw new Error("Conversation introuvable");
            }

            // 📝 Récupérer les messages et mettre is_read à true uniquement pour l'utilisateur concerné
            const messages = conversation.data?.messages?.map((msg) => {

                // Si tu veux marquer tous les messages de cette conversation comme lus, on ignore l'expéditeur
                return {
                    ...msg,
                    is_read: true,
                    meta: {
                        ...msg.meta,
                        is_read: true
                    }
                };
            }) ?? [];

            // 🔄 Mettre à jour la conversation
            await Notification.update(
                {
                    data: { ...conversation.data, messages },
                    is_read: true // si tu veux aussi marquer la notification principale comme lue
                },
                { where: { id: post_id } }
            );

            return {
                status: "success",
                message: "Tous les messages de la conversation ont été marqués comme lus",
            };

        } catch (err) {
            console.error("Erreur notifications_mark_as_read:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    }





};


const getCandidatsByAnnonceId = async (post_id) => {
    if (!post_id) return [];

    try {
        let candidats = [];



        // Cas OFF- → Offre d’emploi
        if (post_id.startsWith("OFF-")) {
            candidats = await PostulationAnnonceOffreEmploi.findAll({
                where: {
                    annonce_id: post_id,
                    statut: {
                        [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete"],
                    },
                },
                order: [["createdAt", "DESC"]],
                raw: true, // retourne directement un tableau d’objets
            });
        }
        // Cas AOF- → Appel d’offre
        else if (post_id.startsWith("AOF-")) {
            // On peut avoir plusieurs tables pour différents types d’AOF
            const tables = [
                PostulationAppelOffre
            ];

            for (const table of tables) {
                const result = await table.findAll({
                    where: {
                        annonce_id: post_id,
                        statut: {
                            [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete"],
                        }
                    },
                    order: [["createdAt", "DESC"]],
                    raw: true,
                });

                if (result.length > 0) {
                    candidats = result;
                    break; // on récupère depuis la première table trouvée
                }
            }
        }


        return {
            status: "success",
            data: candidats
        };

    } catch (err) {
        console.error("Erreur getCandidatsByAnnonceId:", err);
        throw err;
    }
};


const getCandidatsByUserId = async (user_id) => {
    if (!user_id) return [];

    try {
        const offresEmploi = await PostulationAnnonceOffreEmploi.findAll({
            where: { user_id },
            attributes: ["annonce_id", "statut", "createdAt"],
            raw: true,
        });

        const appelsOffres = await PostulationAppelOffre.findAll({
            where: { user_id },
            attributes: ["annonce_id", "statut", "createdAt"],
            raw: true,
        });

        const candidaturesBrutes = [
            ...offresEmploi.map(i => ({ ...i, type: "OFFRE_EMPLOI" })),
            ...appelsOffres.map(i => ({ ...i, type: "APPEL_OFFRE" })),
        ];

        const candidatures = await Promise.all(
            candidaturesBrutes.map(async (item) => {
                // const annonce = await getAnnonceByIdSafe(item.annonce_id);
                const entreprise = await getEntrepriseIDbyAnnonceID(item.annonce_id);
                const notification = await geNotificationByIdSafe(item.annonce_id);
                const enntreprisName = await getEntrepriseInfo(entreprise.entreprise_id)

                return {
                    ...item,
                    objet: entreprise.title || null,
                    ville: entreprise.ville || null,
                    entreprise_id: entreprise.entreprise_id || 0,
                    enntrepris_nom: enntreprisName,
                    source: entreprise.source || null,
                    notification: notification.source || 0,
                };
            })
        );

        candidatures.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return candidatures;

    } catch (err) {
        console.error("Erreur getCandidatsByUserId:", err);
        throw err;
    }
};

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

const getCandidatByUserId = async (user_id) => {

    if (!user_id) {
        return 'indisponible'
    }


    try {

        const user_info = await User.findOne({
            where: { id: user_id },
            raw: true
        })

        return user_info

    } catch (err) {
        console.error("Erreur saveAppelOffre:", err);
        throw err;
    }
}

const geNotificationByIdSafe = async (annonce_id) => {

    return 0
}

const get_nbr_candidature = async (post_id) => {

    // Ici tu pourrais faire une requête SQL ou Sequelize pour compter les candidatures


    // Cas OFF- → Offre d’emploi
    if (post_id.startsWith("OFF-")) {
        const count = await PostulationAnnonceOffreEmploi.count({
            where: {
                annonce_id: post_id,
                statut: {
                    [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete"],
                },
            }
        });



        return count;
    }

    // Cas AOF- → Appel d’offre
    const count = await PostulationAppelOffre.count({
        where: {
            annonce_id: post_id,
            statut: {
                [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT", "delete"],
            },
        }
    });

    return count;

};

async function getScoreMoyenByOffreId(qcm_id) {
    if (!qcm_id) return 0;

    const result = await QcmExamensCandidats.findOne({
        where: { qcm_id },
        attributes: [
            [Sequelize.fn('AVG', Sequelize.col('score')), 'avgScore']
        ],
        raw: true
    });

    const avg = Number(result?.avgScore || 0);

    return avg;
}



async function getNombreCandidatsByOffreId(qcmId) {

    if (!qcmId) return 0;

    const count = await QcmCandidats.count({
        where: {
            qcm_id: qcmId,
            status: {
                [Op.notIn]: ["DELETED_BY_CANDIDAT", "REMOVED_BY_COMPANY"]
            }
        }
    });

    console.log(qcmId, count)
    return count;
}



async function getNombreOffresByQcmId(qcmId) {
    if (!qcmId) return 0;

    // 1️⃣ Offres liées directement au QCM
    const offresDirect = await ExamenQcm.findAll({
        where: { post_id: qcmId },
        attributes: ["offreId"],
        raw: true
    });

    // 2️⃣ Offres liées via table de liaison
    const offresViaTable = await QcmOffres.findAll({
        where: { qcm_id: qcmId },
        attributes: ["offre_id"],
        raw: true
    });

    // 3️⃣ Fusionner
    const allOffreIds = [
        ...offresDirect.map(o => o.offreId),
        ...offresViaTable.map(o => o.offre_id)
    ];

    // 4️⃣ Supprimer doublons
    const uniqueOffreIds = [
        ...new Set(
            allOffreIds
                .filter(Boolean)                // enlève null / undefined / ""
                .flatMap(str => str.split(",")) // éclate les chaînes multiples
                .map(str => str.trim())         // enlève espaces invisibles
                .filter(Boolean)                // enlève chaînes vides éventuelles
        )
    ];


    // 5️⃣ Nombre
    return uniqueOffreIds.length;
}


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

const updateCandidatsStatusByAnnonceId = async (post_id, newStatus) => {
    if (!post_id || !newStatus) return 0; // on retourne 0 si params manquants
    try {
        let updatedCount = 0;

        // Cas OFF- → Offre d’emploi
        if (post_id.startsWith("OFF-")) {
            updatedCount = await PostulationAnnonceOffreEmploi.update(
                { statut: newStatus },
                { where: { annonce_id: post_id } }
            ).then(([count]) => count); // count = nombre de lignes mises à jour
        }
        // Cas AOF- → Appel d’offre
        else if (post_id.startsWith("AOF-")) {
            const tables = [PostulationAppelOffre];
            for (const table of tables) {
                const result = await table.update(
                    { statut: newStatus },
                    { where: { annonce_id: post_id } }
                );
                if (result[0] > 0) {
                    updatedCount = result[0];
                    break; // on met à jour depuis la première table trouvée
                }
            }
        }

        return updatedCount; // retourne le nombre de lignes modifiées
    } catch (err) {
        console.error("Erreur updateCandidatsStatusByAnnonceId:", err);
        throw err;
    }
};



async function checkQCM(post_id, user_id) {

    // Exemple : requête DB
    /* const qcm = await ExamenQcm.findOne({
         where: {
             annonce_id: post_id,
             user_id: user_id,
         },
         attributes: ["user_id", "objet"]
     });
 
     if (!qcm) {
         return {
             has_qcm: false,
             passed: false,
             score: null,
         };
     }
   
    return {
        has_qcm: true,
        passed: qcm.statut === "reussi",
        score: qcm.score,
    }; */

    return {
        has_qcm: true,
        passed: "reussi",
        score: "20%",
    };
}



const formatDateHeure = (date, heure) => {
    const [year, month, day] = date.split("-");
    const [h, m] = heure.split(":");

    return `${day}/${month}/${year} à ${h}h${m}`;
};

const getEntrepriseIDbyAnnonceID = async (annonces_id) => {
    if (!annonces_id) return null;

    let annonce = null;
    let source = null;

    try {
        if (annonces_id.startsWith("OFF-")) {
            annonce = await OffreEmploi.findOne({
                where: { post_id: annonces_id },
                attributes: ["user_id", "objet", "lieu"],
            });
            source = "OffreEmploi";
        }
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
                    attributes: ["user_id", "objet", "lieu"],
                });

                if (annonce) {
                    source = t.name;
                    break;
                }
            }
        }

        if (!annonce) return null;


        return {
            entreprise_id: annonce.user_id,
            title: annonce.objet,
            ville: annonce.lieu,
            source,
        };
    } catch (err) {
        console.error("Erreur getEntrepriseIDbyAnnonceID:", err);
        throw err;
    }
};


const getCandidatsByPostulationId = async (id) => {



    if (!id) return null;

    try {
        // 1️⃣ OFFRE D’EMPLOI
        const off = await PostulationAnnonceOffreEmploi.findOne({
            where: { id },
            attributes: ["user_id", "annonce_id"],
            raw: true,
        });

        if (off) {
            return off;
        }

        // 2️⃣ APPEL D’OFFRE
        const aof = await PostulationAppelOffre.findOne({
            where: { id },
            attributes: ["user_id", "annonce_id"],
            raw: true,
        });


        if (aof) {
            return aof;
        }

        // ❌ Aucun résultat
        return null;

    } catch (err) {
        console.error("Erreur getCandidatsByPostulationId:", err);
        throw err;
    }
};

const getUserByEmail = async (email) => {
    if (!email) return null;


    try {


        const candidature_info = await User.findOne({
            where: {
                email,
            },
            raw: true,
        });

        return candidature_info

    } catch (err) {
        console.error("Erreur getVilleByAnnonceID:", err);
        throw err;
    }
};


const getVilleByAnnonceID = async (annonces_id) => {
    if (!annonces_id) return null;

    let annonce = null;
    let source = null;

    try {
        // 🔹 OFFRE D'EMPLOI
        if (annonces_id.startsWith("OFF-")) {
            annonce = await OffreEmploi.findOne({
                where: { post_id: annonces_id },
                attributes: ["lieu"],
                raw: true
            });
            source = "OffreEmploi";
        }

        // 🔹 APPEL D'OFFRE
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
                    attributes: ["lieu"],
                    raw: true
                });

                if (annonce) {
                    source = t.name;
                    break;
                }
            }
        }

        if (!annonce) return null;

        return {
            ville: annonce.lieu,
            source
        };

    } catch (err) {
        console.error("Erreur getVilleByAnnonceID:", err);
        throw err;
    }
};


// Fonction utilitaire : filtrer les offres expirées (> 7 jours)
const isNotExpired = (expirationDate) => {
    if (!expirationDate) return true;
    const now = new Date();
    const diff = (now.getTime() - new Date(expirationDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7; // conserver si expiration <= 7 jours
};


const updatePostulationNotification = async (candidat, post_id) => {
    const Table = candidat.annonce_id.startsWith("OFF-")
        ? PostulationAnnonceOffreEmploi
        : PostulationAppelOffre;

    const postulation = await Table.findOne({
        where: { id: candidat.id },
        attributes: ["id", "annonce_id", "user_id", "tab_notification"],
    });

    if (!postulation) return;

    const newNotification = {
        id: `notif_${Date.now()}`,
        status: "WAITING_EXAM",
        message_type: "INFO",
        message: `Vous avez été sélectionné pour passer le QCM ${post_id}`,
        action_type: "OPEN_QCM",
        action_link: `/qcm/${post_id}`,
        is_read: false,
        created_at: new Date(),
    };

    const notifications = Array.isArray(postulation.tab_notification)
        ? postulation.tab_notification
        : [];
    notifications.push(newNotification);

    await Table.update(
        {
            statut: "WAITING_EXAM",
            tab_notification: notifications,
        },
        { where: { id: candidat.id } }
    );
};
