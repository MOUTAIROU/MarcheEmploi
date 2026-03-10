const { Op } = require("sequelize");

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
const { title } = require("process");
const { STATUS_NOTIFICATION_MAP } = require('../../../utils/helper')



const MODEL_BY_SOURCE = {
    OffreEmploi: OffreEmploi,
    AppelOffre: AppelOffre,
    AppelOffreAmi: AppelOffreAmi,
    AppelOffreConsultation: AppelOffreConsultation,
    AppelOffreRecrutementConsultant: AppelOffreRecrutementConsultant,
};

const excludedStatus = ["delete", "expire"];

// 4️⃣ Repository
module.exports = {

    // Récupérer toutes les offres d'un utilisateur
    annonce_post_id: async (user_id) => {
        try {
            if (!user_id) throw new Error("user_id manquant");


            // 1️⃣ Récupérer toutes les postulations
            const postulationsOffres = await PostulationAnnonceOffreEmploi.findAll({
                where: {
                    user_id,
                    statut: {
                        [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT"]
                    }
                },
                raw: true,
            });

            const postulationsAppels = await PostulationAppelOffre.findAll({
                where: {
                    user_id,
                    statut: {
                        [Op.notIn]: ["DELETED_BY_COMPANY", "DELETED_BY_CANDIDAT"]
                    }
                },
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
            console.error("Erreur annonce_post_id:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    set_notification_read: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            let annonceModel = null;

            if (post_id.startsWith("OFF-")) {
                annonceModel = PostulationAnnonceOffreEmploi;
            }
            else if (post_id.startsWith("AOF-")) {
                annonceModel = PostulationAppelOffre;
            }
            else {
                return {
                    status: "error",
                    message: "Type d’annonce non reconnu",
                };
            }

            const annonce = await annonceModel.findOne({
                where: { user_id, annonce_id: post_id },
            });

            if (!annonce) {
                return {
                    status: "error",
                    message: "Aucune postulation trouvée",
                };
            }

            const notifications = annonce.tab_notification || [];

            // ✅ Mapper et marquer comme lues
            const updatedNotifications = notifications.map((notif) => ({
                ...notif,
                is_read: true,
            }));

            // ✅ Sauvegarde
            annonce.tab_notification = updatedNotifications;
            await annonce.save();

            return {
                status: "success",
                message: "Notifications marquées comme lues",
                total: updatedNotifications.length,
            };

        } catch (err) {
            console.error("Erreur set_notification_read:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    se_retirer_offre: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            let annonceModel = null;

            if (post_id.startsWith("OFF-")) {
                annonceModel = PostulationAnnonceOffreEmploi;
            } else if (post_id.startsWith("AOF-")) {
                annonceModel = PostulationAppelOffre;
            } else {
                return {
                    status: "error",
                    message: "Type d’annonce non reconnu",
                };
            }

            const annonce = await annonceModel.findOne({
                where: { user_id, annonce_id: post_id },
            });

            if (!annonce) {
                return {
                    status: "error",
                    message: "Aucune postulation trouvée",
                };
            }

            // ================= 1️⃣ UPDATE STATUS =================
            annonce.statut = "DELETED_BY_CANDIDAT";
            await annonce.save();

            const cand_info = await getCandidatinfo(user_id);

            // ================= 2️⃣ NOTIFICATION SYSTEM =================
            const notificationConfig = STATUS_NOTIFICATION_MAP.DELETED_BY_CANDIDAT;



            await createOrUpdateNotification({
                sender_id: `SYSTEM_${Date.now()}`,   // ID système
                sender_name: "Système",
                receiver_id: user_id,
                receiver_name: cand_info.name || "Candidat",

                type: notificationConfig.type,
                action: notificationConfig.action_type,

                title: notificationConfig.title,
                message: notificationConfig.message,

                object_id: annonce.annonce_id,
                object_type: "ANNONCE",
                object_label: annonce.title || null,

                meta: {
                    status: "DELETED_BY_CANDIDAT",
                    annonce_id: annonce.annonce_id,
                    is_read: false,
                    created_at: new Date().toISOString(),
                },
            });

            return {
                status: "success",
                message: "Candidature retirée avec succès",
            };

        } catch (err) {
            console.error("Erreur se_retirer_offre:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },


    se_retirer_offre_group: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Transformer "OFF-1,OFF-2" → ["OFF-1", "OFF-2"]
            const post_ids = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (post_ids.length === 0) {
                return {
                    status: "error",
                    message: "Aucune annonce valide",
                };
            }

            const cand_info = await getCandidatinfo(user_id);
            const notificationConfig = STATUS_NOTIFICATION_MAP.DELETED_BY_CANDIDAT;

            let totalUpdated = 0;

            // 2️⃣ Boucle sur chaque annonce
            for (const annonce_id of post_ids) {

                let annonceModel = null;

                if (annonce_id.startsWith("OFF-")) {
                    annonceModel = PostulationAnnonceOffreEmploi;
                } else if (annonce_id.startsWith("AOF-")) {
                    annonceModel = PostulationAppelOffre;
                } else {
                    continue; // on ignore les ids invalides
                }

                const annonce = await annonceModel.findOne({
                    where: { user_id, annonce_id },
                });

                if (!annonce) {
                    continue;
                }

                // ================= 1️⃣ UPDATE STATUS =================
                annonce.statut = "DELETED_BY_CANDIDAT";
                await annonce.save();
                totalUpdated++;

                // ================= 2️⃣ NOTIFICATION SYSTEM =================
                await createOrUpdateNotification({
                    sender_id: `SYSTEM_${Date.now()}`,
                    sender_name: "Système",

                    receiver_id: user_id,
                    receiver_name: cand_info?.name || "Candidat",

                    type: notificationConfig.type,
                    action: notificationConfig.action_type,

                    title: notificationConfig.title,
                    message: notificationConfig.message,

                    object_id: annonce.annonce_id,
                    object_type: "ANNONCE",
                    object_label: annonce.title || null,

                    meta: {
                        status: "DELETED_BY_CANDIDAT",
                        annonce_id: annonce.annonce_id,
                        is_read: false,
                        created_at: new Date().toISOString(),
                    },
                });
            }

            return {
                status: "success",
                message: `${totalUpdated} candidature(s) retirée(s) avec succès`,
                total: totalUpdated,
            };

        } catch (err) {
            console.error("Erreur se_retirer_offre_group:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },



    mes_appel_offre_save: async (data) => {
        try {
            const { user_id } = data;

            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Récupérer toutes les annonces sauvegardées par l'utilisateur
            const annonces = await SaveAnnonce.findAll({
                where: { user_id },
                order: [["createdAt", "DESC"]],
            });

            // 2️⃣ Aucune annonce sauvegardée
            if (!annonces || annonces.length === 0) {
                return {
                    status: "info",
                    data: [],
                    message: "Aucune annonce enregistrée",
                };
            }

            console.log(annonces)

            // 3️⃣ Succès
            return {
                status: "success",
                data: annonces,
                total: annonces.length,
                message: "Annonces enregistrées récupérées avec succès",
            };

        } catch (err) {
            console.error("Erreur mes_appel_offre_save:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },
    all_qcm: async (data) => {
        try {
            const { user_id } = data;

            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 1️⃣ Récupérer tous les QCM assignés à ce candidat
            const qcmCandidats = await QcmCandidats.findAll({
                where: {
                    candidat_id: user_id,
                    status: {
                        [Op.notIn]: ["DELETED_BY_CANDIDAT", "REMOVED_BY_COMPANY"]
                    }
                },
                order: [["assigned_at", "DESC"]],
                raw: true,
            });

            // 🔹 2️⃣ Aucun QCM
            if (!qcmCandidats || qcmCandidats.length === 0) {
                return {
                    status: "info",
                    data: [],
                    message: "Aucun QCM assigné pour le moment",
                };
            }

            const results = [];

            // 🔹 3️⃣ Boucle sur chaque QCM
            for (const qcmCandidat of qcmCandidats) {

                // 👉 Récupérer l’examen
                const examen = await ExamenQcm.findOne({
                    where: {
                        post_id: qcmCandidat.qcm_id,
                    },
                    raw: true,
                });

                if (!examen) continue;

                // 🔒 Supprimer bonnesReponses
                const questionsSanitized = Array.isArray(examen.questions)
                    ? examen.questions.map(({ bonnesReponses, ...rest }) => rest)
                    : [];


                // 👉 Récupérer le recruteur (créateur du QCM)
                const recruteurInfo = await getCandidatinfo(examen.user_id);





                results.push({
                    qcm_id: qcmCandidat.qcm_id,
                    statut: qcmCandidat.status,
                    statut_label: formatQcmStatus(qcmCandidat.status),
                    startDate: qcmCandidat.startDate,
                    endDate: qcmCandidat.endDate,

                    assigned_at: qcmCandidat.assigned_at,

                    // 📘 Examen nettoyé
                    examen: {
                        id: examen.id,
                        post_id: examen.post_id,
                        titre: examen.titre,
                        description: examen.description,
                        duree: examen.duree,
                        noteMin: examen.noteMin,
                        mode: examen.mode,
                        date_ouverture: new Date(),
                        params: examen.params,
                        questions: questionsSanitized, // ✅ sans bonnesReponses
                    },

                    // 👤 Recruteur
                    recruteur: {
                        user_id: examen.user_id,
                        name: recruteurInfo?.nom || "Recruteur",
                    },
                });
            }


            return {
                status: "success",
                data: results,
                total: results.length,
                message: "Liste des QCM récupérée avec succès",
            };

        } catch (err) {
            console.error("Erreur all_qcm:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },
    candidats_detete_qcm: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔍 1️⃣ Vérifier si le QCM existe pour ce candidat
            const qcmCandidat = await QcmCandidats.findOne({
                where: {
                    candidat_id: user_id,
                    qcm_id: post_id,
                },
            });

            if (!qcmCandidat) {
                return {
                    status: "error",
                    message: "Aucun QCM trouvé pour ce candidat",
                };
            }

            // 🚫 2️⃣ Si déjà retiré, éviter les doubles actions
            if (qcmCandidat.statut === "DELETED_BY_CANDIDAT") {
                return {
                    status: "info",
                    message: "Ce QCM a déjà été retiré",
                };
            }

            // ✅ 3️⃣ Mise à jour du statut (désistement candidat)
            qcmCandidat.status = "DELETED_BY_CANDIDAT";
            qcmCandidat.removed_at = new Date(); // optionnel mais recommandé
            await qcmCandidat.save();

            return {
                status: "success",
                message: "Vous vous êtes désisté avec succès de ce QCM",
                data: {
                    qcm_id: qcmCandidat.qcm_id,
                    statut: qcmCandidat.status,
                },
            };

        } catch (err) {
            console.error("Erreur candidats_detete_qcm:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    detete_qcm_groupe: async (data) => {
        try {
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Transformer "QCM-1,QCM-2" → ["QCM-1", "QCM-2"]
            const post_ids = String(post_id)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);

            if (post_ids.length === 0) {
                return {
                    status: "error",
                    message: "Aucun QCM valide fourni",
                };
            }

            // 2️⃣ Récupérer tous les QCM du candidat concernés
            const qcmCandidats = await QcmCandidats.findAll({
                where: {
                    candidat_id: user_id,
                    qcm_id: post_ids,
                },
            });

            if (!qcmCandidats || qcmCandidats.length === 0) {
                return {
                    status: "error",
                    message: "Aucun QCM trouvé pour ce candidat",
                };
            }

            let updatedCount = 0;

            // 3️⃣ Mise à jour statut (désistement candidat)
            for (const qcm of qcmCandidats) {

                // 🚫 ignorer ceux déjà retirés
                if (qcm.status === "DELETED_BY_CANDIDAT") {
                    continue;
                }

                qcm.status = "DELETED_BY_CANDIDAT";
                qcm.removed_at = new Date(); // ✅ recommandé
                await qcm.save();

                updatedCount++;
            }

            return {
                status: "success",
                message: "Désistement effectué avec succès",
                data: {
                    total_requested: post_ids.length,
                    total_updated: updatedCount,
                    qcm_ids: qcmCandidats.map(q => q.qcm_id),
                },
            };

        } catch (err) {
            console.error("Erreur detete_qcm_groupe:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },
    get_qcm_by_post_id: async (data) => {
        try {

            console.log(data, 'toto')
            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔍 Récupération du QCM
            const qcm = await ExamenQcm.findOne({
                where: {
                    post_id,   // ou post_id selon ton schéma
                },
                raw: true
            });

            //  nettoyer les questions (supprimer bonnesReponses)
            const questionsSanitized = qcm.questions.map(q => {
                const { bonnesReponses, ...rest } = q;
                return rest;
            });

            if (!qcm) {
                return {
                    status: "error",
                    message: "Examen introuvable",
                };
            }

            return {
                status: "success",
                data: {
                    ...qcm,
                    questions: questionsSanitized,
                },
            };

        } catch (err) {
            console.error("Erreur get_qcm_by_post_id:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    qcm_examin_exercice: async (data) => {
        try {

            const { user_id, post_id } = data;
            const { qcmId, reponses, antiFraudeLogs, raisonFinale, totalTimeSeconds } = post_id;

            if (!user_id || !qcmId) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            const offre_id = await QcmOffres.findOne({
                where: {
                    qcm_id: qcmId
                },
                raw: true
            });

            console.log(offre_id.offre_id)


            // 🔎 Vérifier si déjà soumis
            const dejaPasse = await QcmExamensCandidats.findOne({
                where: {
                    user_id,
                    qcm_id: qcmId
                }
            });

            if (dejaPasse) {
                return {
                    status: "error",
                    message: "Examen déjà soumis",
                };
            }

            // 🔹 Récupérer QCM
            const qcmData = await ExamenQcm.findOne({
                where: { post_id: qcmId },
                attributes: ["questions"],
                raw: true
            });

            if (!qcmData || !qcmData.questions) {
                return {
                    status: "error",
                    message: "QCM introuvable"
                };
            }

            const questions = typeof qcmData.questions === "string"
                ? JSON.parse(qcmData.questions)
                : qcmData.questions;

            let scoreTotal = 0;
            let totalPoints = 0;

            const details = [];

            questions.forEach((question, index) => {

                totalPoints += question.points;

                const numero = index + 1;
                const questionNumber = numero.toString();
                const reponseCandidat = reponses?.[questionNumber] ?? null;

                let points_obtenue = 0;

                if (reponseCandidat !== null && question.bonnesReponses) {

                    if (Array.isArray(reponseCandidat)) {

                        const correct =
                            JSON.stringify([...reponseCandidat].sort()) ===
                            JSON.stringify([...question.bonnesReponses].sort());

                        if (correct) {
                            points_obtenue = question.points;
                        }

                    } else {

                        if (question.bonnesReponses.includes(reponseCandidat)) {
                            points_obtenue = question.points;
                        }
                    }
                }

                scoreTotal += points_obtenue;


                details.push({
                    questionId: numero,
                    type: question.type,
                    niveau: question.niveau,
                    options: question.options,
                    optionTexte: question.optionTexte,
                    justification: question.justification,
                    intitule: question.intitule,
                    reponseCandidat,
                    bonnesReponses: question.bonnesReponses ?? [],
                    points: question.points,
                    points_obtenue
                });

            });

            const pourcentage = Math.round((scoreTotal / totalPoints) * 100);

            // 🧠 Nouvelle architecture
            const resultatStructure = {
                details,
                scoreTotal,
                totalPoints,
                pourcentage
            };


            // 💾 Enregistrer
            await QcmExamensCandidats.create({
                qcm_id: qcmId,
                user_id,
                reponses: JSON.stringify(resultatStructure), // ✅ nouveau champ
                antiFraudeLogs,
                score: pourcentage,
                totalTimeSeconds,
                raisonFinale,
                statut: "COMPLETED"
            });

            await QcmCandidats.update(
                { status: "COMPLETED" },
                {
                    where: {
                        qcm_id: qcmId,
                        candidat_id: user_id
                    }
                }
            );

            const offreID = offre_id.offre_id

            if (offreID.startsWith("OFF-")) {

                await PostulationAnnonceOffreEmploi.update(
                    { statut: "COMPLETED" },
                    {
                        where: {
                            annonce_id: offreID,
                            user_id
                        }
                    }
                );
            }

            if (offreID.startsWith("AOF-")) {

                await PostulationAppelOffre.update(
                    { statut: "COMPLETED" },
                    {
                        where: {
                            annonce_id: offreID,
                            user_id
                        }
                    }
                );
            }


            return {
                status: "success",
                message: "Examen enregistré avec nouvelle architecture",
                score: pourcentage
            };

        } catch (err) {
            console.error("Erreur qcm_examin_exercice:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    entretien: async (user_id) => {
        try {


            if (!user_id) throw new Error("user_id manquant");
            console.log("Récupération des offres pour l'utilisateur :", user_id);

            const enretien = await EntretienCandidat.findAll({
                where: { candidat_id: user_id },
                order: [["createdAt", "DESC"]],
                raw: true
            });


            const entretiensFormates = await Promise.all(
                enretien.map(async (item) => {

                    const candidatInfo = await getCandidatinfo(item.user_id);

                    const offre_info = await getEntrepriseIDbyAnnonceID(item.offre);

                    return {
                        id: item.id,
                        nom: candidatInfo.nom,
                        candidat_id: item.candidat_id,
                        offre: item.offre,
                        title: offre_info.title,
                        entreprise_id: offre_info.entreprise_id,
                        date_entretien: formatDateHeure(item.date, item.heure),
                        duree: item.duree || null,
                        responsable: item.responsable,
                        message: item.message,
                        lieu: item.lieu,
                        status: item.status,
                        filenameBase: item.filenameBase || null,
                        lien: item.lien,
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
            console.error("Erreur annonce_post_id:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },
    entretien_status: async (data) => {
        try {

            const { user_id, entretien, newStatus } = data;

            if (!user_id || !entretien || !newStatus) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Récupérer l’entretien
            const entretienData = await EntretienCandidat.findOne({
                where: {
                    candidat_id: user_id,
                    post_id: entretien
                },
                raw: true
            });

            if (!entretienData) {
                return {
                    status: "error",
                    message: "Entretien introuvable",
                };
            }

            // 2️⃣ Mapper le status
            const mappedStatus = mapActionToStatus(newStatus);

            // 3️⃣ Update status
            await EntretienCandidat.update(
                { status: mappedStatus },
                {
                    where: {
                        candidat_id: user_id,
                        post_id: entretien
                    }
                }
            );

            // 4️⃣ Préparer message notification entreprise
            let notificationTitle = "";
            let notificationMessage = "";

            const cand_info = await getCandidatinfo(user_id);

            switch (mappedStatus) {
                case "CANDIDAT_CONFIRME":
                    notificationTitle = "Entretien confirmé";
                    notificationMessage = `Le candidat ${cand_info.nom} a confirmé sa présence à l’entretien prévu le ${entretienData.date_entretien}.`;
                    break;

                case "CANDIDAT_REFUSE":
                    notificationTitle = "Entretien refusé";
                    notificationMessage = `Le candidat ${cand_info.nom} a refusé l’entretien prévu le ${entretienData.date_entretien}.`;
                    break;

                default:
                    notificationTitle = "Mise à jour entretien";
                    notificationMessage = "Le statut de l’entretien a été modifié.";
            }


            const entrepriseInfo = await getCandidatinfo(entretienData.user_id);


            const offre_info = await getEntrepriseIDbyAnnonceID(entretienData.offre);



            // 5️⃣ Notification envoyée à l’entreprise
            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: cand_info.nom || "Candidat",

                receiver_id: entretienData.user_id,
                receiver_name: entrepriseInfo.nom || "Entreprise",

                type: "ENTRETIEN_UPDATE",
                action: mappedStatus,

                title: notificationTitle,
                message: notificationMessage,

                object_id: entretien,
                object_type: "ENTRETIEN",
                object_label: offre_info.title || null,

                meta: {
                    entretien_id: entretien,
                    status: mappedStatus,
                    is_read: false,
                    created_at: new Date().toISOString(),
                },
            });

            return {
                status: "success",
                message: "Statut de l’entretien mis à jour avec succès",
            };

        } catch (err) {
            console.error("Erreur entretien_status:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    entretien_status_groupe: async (data) => {
        try {

            const { user_id, entretien, newStatus } = data;

            if (!user_id || !entretien || !newStatus) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Transformer la string en tableau
            const entretienIds = entretien.split(",").map(id => id.trim());

            if (entretienIds.length === 0) {
                return {
                    status: "error",
                    message: "Aucun entretien valide",
                };
            }

            // 2️⃣ Mapper le status
            const mappedStatus = mapActionToStatus(newStatus);

            // 3️⃣ Récupérer tous les entretiens concernés
            const entretiens = await EntretienCandidat.findAll({
                where: {
                    candidat_id: user_id,
                    post_id: entretienIds
                },
                raw: true
            });

            if (!entretiens.length) {
                return {
                    status: "error",
                    message: "Entretiens introuvables",
                };
            }

            // 4️⃣ Update groupé
            await EntretienCandidat.update(
                { status: mappedStatus },
                {
                    where: {
                        candidat_id: user_id,
                        post_id: entretienIds
                    }
                }
            );

            const cand_info = await getCandidatinfo(user_id);


            // 5️⃣ Envoyer notification pour chaque entretien
            for (const entretienData of entretiens) {


                const entrepriseInfo = await getCandidatinfo(entretienData.user_id);


                const offre_info = await getEntrepriseIDbyAnnonceID(entretienData.offre);
                let notificationTitle = "";
                let notificationMessage = "";

                switch (mappedStatus) {
                    case "CANDIDAT_CONFIRME":
                        notificationTitle = "Entretien confirmé";
                        notificationMessage = `Le candidat ${cand_info?.nom || ""} a confirmé sa présence à l’entretien prévu le ${entretienData.date_entretien}.`;
                        break;

                    case "CANDIDAT_REFUSE":
                        notificationTitle = "Entretien refusé";
                        notificationMessage = `Le candidat ${cand_info?.nom || ""} a refusé l’entretien prévu le ${entretienData.date_entretien}.`;
                        break;

                    default:
                        notificationTitle = "Mise à jour entretien";
                        notificationMessage = "Le statut de l’entretien a été modifié.";
                }


                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: cand_info?.nom || "Candidat",

                    receiver_id: entretienData.user_id,
                    receiver_name: entrepriseInfo.nom || "Entreprise",

                    type: "ENTRETIEN_UPDATE",
                    action: mappedStatus,

                    title: notificationTitle,
                    message: notificationMessage,

                    object_id: entretienData.post_id,
                    object_type: "ENTRETIEN",
                    object_label: offre_info.title || null,

                    meta: {
                        entretien_id: entretienData.post_id,
                        status: mappedStatus,
                        is_read: false,
                        created_at: new Date().toISOString(),
                    },
                });

            }

            return {
                status: "success",
                message: `${entretiens.length} entretien(s) mis à jour avec succès`,
            };

        } catch (err) {
            console.error("Erreur entretien_status_groupe:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    delete_entretien: async (data) => {
        try {

            const { user_id, entretien } = data;

            if (!user_id || !entretien) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Vérifier que l’entretien existe
            const entretienData = await EntretienCandidat.findOne({
                where: {
                    candidat_id: user_id,
                    post_id: entretien
                },
                raw: true
            });

            if (!entretienData) {
                return {
                    status: "error",
                    message: "Entretien introuvable",
                };
            }

            // 2️⃣ Update status (pas suppression réelle)
            const newStatus = "CANDIDAT_REFUSE";

            await EntretienCandidat.update(
                { status: newStatus },
                {
                    where: {
                        candidat_id: user_id,
                        post_id: entretien
                    }
                }
            );

            // 3️⃣ Récupération infos
            const cand_info = await getCandidatinfo(user_id);
            const entrepriseInfo = await getCandidatinfo(entretienData.user_id);
            const offre_info = await getEntrepriseIDbyAnnonceID(entretienData.offre);



            // 4️⃣ Préparer notification
            const notificationTitle = "Entretien annulé par le candidat";
            const notificationMessage = `
Le candidat ${cand_info?.nom || ""} a annulé l’entretien prévu le ${entretienData.date_entretien}.
    `;

            // 5️⃣ Envoyer notification à l’entreprise


            await createOrUpdateNotification({
                sender_id: user_id,
                sender_name: cand_info?.nom || "Candidat",

                receiver_id: entretienData.user_id,
                receiver_name: entrepriseInfo?.nom || "Entreprise",

                type: "ENTRETIEN_UPDATE",
                action: newStatus,

                title: notificationTitle,
                message: notificationMessage,

                object_id: entretien,
                object_type: "ENTRETIEN",
                object_label: offre_info.title || null,

                meta: {
                    entretien_id: entretien,
                    status: newStatus,
                    is_read: false,
                    created_at: new Date().toISOString(),
                },
            });

            return {
                status: "success",
                message: "Entretien annulé avec succès",
            };

        } catch (err) {
            console.error("Erreur delete_entretien:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    delete_entretien_groupe: async (data) => {
        try {

            const { user_id, entretien } = data;

            if (!user_id || !entretien) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Transformer string en tableau
            const entretienIds = entretien.split(",").map(id => id.trim());

            if (!entretienIds.length) {
                return {
                    status: "error",
                    message: "Aucun entretien valide",
                };
            }

            // 2️⃣ Récupérer tous les entretiens
            const entretiens = await EntretienCandidat.findAll({
                where: {
                    candidat_id: user_id,
                    post_id: entretienIds
                },
                raw: true
            });

            if (!entretiens.length) {
                return {
                    status: "error",
                    message: "Entretiens introuvables",
                };
            }

            const newStatus = "CANDIDAT_REFUSE";

            // 3️⃣ Update groupé
            await EntretienCandidat.update(
                { status: newStatus },
                {
                    where: {
                        candidat_id: user_id,
                        post_id: entretienIds
                    }
                }
            );

            const cand_info = await getCandidatinfo(user_id);

            // 4️⃣ Notification pour chaque entretien
            for (const entretienData of entretiens) {

                const entrepriseInfo = await getCandidatinfo(entretienData.user_id);

                const offre_info = await getEntrepriseIDbyAnnonceID(entretienData.offre);

                const notificationTitle = "Entretien annulé par le candidat";
                const notificationMessage = `
Le candidat ${cand_info?.nom || ""} a annulé l’entretien prévu le ${entretienData.date_entretien}.
      `;




                await createOrUpdateNotification({
                    sender_id: user_id,
                    sender_name: cand_info?.nom || "Candidat",
                    receiver_id: entretienData.user_id,
                    receiver_name: entrepriseInfo.nom || "Entreprise",
                    type: "ENTRETIEN_UPDATE",
                    action: newStatus,
                    title: notificationTitle,
                    message: notificationMessage,
                    object_id: entretienData.post_id,
                    object_type: "ENTRETIEN",
                    object_label: offre_info.title || null,
                    meta: {
                        entretien_id: entretienData.post_id,
                        status: newStatus,
                        is_read: false,
                        created_at: new Date().toISOString(),
                    },
                });

            }

            return {
                status: "success",
                message: `${entretiens.length} entretien(s) annulé(s) avec succès`,
            };

        } catch (err) {
            console.error("Erreur delete_entretien_groupe:", err);
            return {
                status: "error",
                message: err.message,
            };
        }
    },

    entretien_detail: async (data) => {
        try {


            const { user_id, post_id } = data;

            if (!user_id || !post_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 1️⃣ Récupérer l’entretien
            const entretienData = await EntretienCandidat.findOne({
                where: {
                    candidat_id: user_id,
                    post_id   // ⚠️ utiliser entr_id si c’est ton ID métier
                },
                raw: true
            });


            const entrepriseInfo = await getCandidatinfo(entretienData.user_id);

            const candidatoInfo = await getCandidatinfo(user_id);


            const offre_info = await getEntrepriseIDbyAnnonceID(entretienData.offre);




            const dataComplete = {
                ...entretienData,
                entreprise: entrepriseInfo || null,
                offre_details: offre_info || null,
                candidato_info: candidatoInfo || null


            };



            if (!dataComplete) {
                return {
                    status: "error",
                    message: "Entretien introuvable",
                };
            }

            // 2️⃣ Retourner les données
            return {
                status: "success",
                data: dataComplete
            };

        } catch (err) {
            console.error("Erreur entretien_detail:", err);
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
                        [Op.ne]: "delete",
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
                            [Op.ne]: "delete",
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

        return candidats;

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
                    [Op.ne]: "delete",
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
                [Op.ne]: "delete",
            },
        }
    });

    return count;

};

async function getScoreMoyenByOffreId(offreId) {
    // TODO: calcul réel plus tard
    return 9;
}

async function getNombreCandidatsByOffreId(offreId) {
    // TODO: compter les candidats liés à l'offre
    return 0;
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


const formatQcmStatus = (statut) => {
    switch (statut) {

        case "ASSIGNED":
            return "📩 Assigné";

        case "IN_PROGRESS":
            return "📝 En cours";

        case "COMPLETED":
            return "✅ Terminé";

        case "REMOVED_BY_COMPANY":
            return "❌ Retiré par l’entreprise";

        default:
            return "⏳ Statut inconnu";
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


function mapActionToStatus(action) {
    switch (action) {
        case "Accepter":
            return "CANDIDAT_CONFIRME";

        case "Refuser":
            return "CANDIDAT_REFUSE";
        // ⚠️ Si c’est le candidat qui refuse,

        default:
            throw new Error("Action inconnue");
    }
}