const OffreEmploi = require("../models/offreEmploi");
const AppelOffre = require("../models/appelOffre");
const ExamenQcm = require("../models/ExamenQcm");
const EntretienCandidat = require("../models/EntretienCandidat");
const NotesEntretien = require("../models/notesEntretie");
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
const { associer_offre_qcm } = require("../entreprise_get/entreprise.repository")

const { STATUS_NOTIFICATION_MAP, MODEL_BY_SOURCE } = require('../../../utils/helper')
const { createOrUpdateNotification } = require("../notification/notification.service");


const sequelize = require("../../config/database");
const { cp } = require("fs");

const crypto = require("crypto");



// 4️⃣ Repository
module.exports = {

    saveOffre: async (
        user_id,
        data
    ) => {

        console.log(data)
        const { titre, ...autre } = data
        console.log(titre)
        try {
            // Vérifie si l'offre existe déjà pour cet utilisateur
            /* const existing = await OffreEmploi.findOne({
                 where: { user_id, titre }
             });
 
             if (existing) {
                 // Mise à jour
                 await existing.update(data);
 
                 return { status: "updated", message: "Offre mise à jour avec succès." };
             }*/

            // Sinon création
            await OffreEmploi.create(data);

            return { status: "created", message: "Nouvelle offre créée." };

        } catch (err) {
            console.error("Erreur saveOrUpdateOffre:", err);
            throw err;
        }
    },
    saveAppelOffre: async (
        user_id,
        data
    ) => {

        console.log(data)
        const { titre, ...autre } = data
        console.log(titre)
        try {

            // Sinon création
            await AppelOffre.create(data);

            return { status: "created", message: "Nouvelle appel offre créée." };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    saveAmiAppelOffre: async (
        user_id,
        data
    ) => {

        try {
            // Vérifie si l'offre existe déjà pour cet utilisateur

            // Sinon création
            await AppelOffreAmi.create(data);
            console.log(user_id)

            return { status: "created", message: "Nouvelle appel offre créée." };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    saveConsultationAppelOffre: async (
        user_id,
        data
    ) => {

        console.log(user_id)
        try {
            // Vérifie si l'offre existe déjà pour cet utilisateur
            /* const existing = await OffreEmploi.findOne({
                 where: { user_id, titre }
             });
 
             if (existing) {
                 // Mise à jour
                 await existing.update(data);
 
                 return { status: "updated", message: "Offre mise à jour avec succès." };
             }*/

            console.log(user_id)
            // Sinon création
            await AppelOffreConsultation.create(data);
            console.log(user_id)

            return { status: "created", message: "Nouvelle appel offre créée." };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    saveRecrutementConsultantAppelOffre: async (
        user_id,
        data
    ) => {

        console.log(user_id)
        try {
            // Vérifie si l'offre existe déjà pour cet utilisateur
            /* const existing = await OffreEmploi.findOne({
                 where: { user_id, titre }
             });
 
             if (existing) {
                 // Mise à jour
                 await existing.update(data);
 
                 return { status: "updated", message: "Offre mise à jour avec succès." };
             }*/

            // Sinon création
            await AppelOffreRecrutementConsultant.create(data);
            console.log(user_id)

            return { status: "created", message: "Nouvelle appel offre créée." };

        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    modifer_colaborateur: async (data) => {
        try {
            if (!data) {
                return { status: "error", message: "Aucune donnée fournie" };
            }

            let { user_id, email, payload } = data;

            // normalisation
            email = email?.toLowerCase().trim();
            payload = payload?.toLowerCase().trim();

            if (!user_id || !email || !payload) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // 🔎 vérifier existence
            const collaborateur = await AjouterCollaborateur.findOne({
                where: { user_id, email },
                raw: true
            });

            if (!collaborateur) {
                return {
                    status: "error",
                    message: "Collaborateur introuvable",
                };
            }

            // 🎯 déterminer modification
            let updateData = {};

            if (payload === "suspendre") {
                updateData = {
                    accepted: false,
                    status: "suspendu",
                };
            } else if (payload === "admin" || payload === "recruteur") {
                updateData = {
                    role: payload,
                    accepted: collaborateur.password ? true : false,
                    status: collaborateur.password ? null : "invite"

                };
            } else {
                return {
                    status: "error",
                    message: "Action inconnue",
                };
            }

            // 🔄 update
            await AjouterCollaborateur.update(updateData, {
                where: { user_id, email },
            });

            return {
                status: "success",
                message:
                    payload === "suspendre"
                        ? "Collaborateur suspendu avec succès"
                        : "Rôle du collaborateur mis à jour",
            };
        } catch (err) {
            console.error("Erreur modifer_colaborateur:", err);
            throw err;
        }
    },
    detele_colaborateur: async (data) => {

        try {


            if (!data) {
                return { status: "error", message: "Aucune donnée fournie" };
            }

            let { user_id, email } = data;

            // normalisation
            email = email?.toLowerCase().trim();

            if (!user_id || !email) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // 🔎 vérifier existence
            const collaborateur = await AjouterCollaborateur.findOne({
                where: { user_id, email },
                raw: true
            });

            console.log(collaborateur)
            if (!collaborateur) {
                return {
                    status: "error",
                    message: "Collaborateur introuvable",
                };
            }


            // 🗑 suppression logique
            await AjouterCollaborateur.update(
                { status: "supprime", accepted: false },
                { where: { user_id, email } }
            );

            return {
                status: "success",
                message: "Collaborateur supprimé avec succès",
            };


        } catch (err) {
            console.error("Erreur ExamenQcm:", err);
            throw err;
        }
    },

    delete_collaborateurs_groupe: async (data) => {
        try {
            if (!data) {
                return { status: "error", message: "Aucune donnée fournie" };
            }

            let { user_id, email } = data;

            if (!user_id || !email) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // 🔎 transformer string emails → tableau
            const emails = email
                .split(",")
                .map(e => e.toLowerCase().trim())
                .filter(Boolean);

            if (emails.length === 0) {
                return {
                    status: "error",
                    message: "Aucun email valide",
                };
            }

            // 🔎 vérifier existence
            const collaborateurs = await AjouterCollaborateur.findAll({
                where: {
                    user_id,
                    email: emails,
                },
            });

            if (!collaborateurs || collaborateurs.length === 0) {
                return {
                    status: "error",
                    message: "Aucun collaborateur trouvé",
                };
            }

            // 🗑 suppression logique groupée
            await AjouterCollaborateur.update(
                { status: "supprime", accepted: false },
                {
                    where: {
                        user_id,
                        email: emails,
                    },
                }
            );

            return {
                status: "success",
                message: `${emails.length} collaborateur(s) supprimé(s) avec succès`,
            };
        } catch (err) {
            console.error("Erreur delete_collaborateurs_groupe:", err);
            throw err;
        }
    },


    saveExamenQcm: async (user_id, data) => {
        const transaction = await sequelize.transaction();

        try {
            if (!user_id || !data?.post_id) {
                throw new Error("Données QCM invalides");
            }

            // 🔹 1️⃣ Créer le QCM
            const qcm = await ExamenQcm.create(
                {
                    ...data,
                    user_id,
                },
                { transaction }
            );

            // 🔹 2️⃣ Associer les offres si elles existent
            if (data.offreId && data.offreId.trim() !== "") {
                const associationPayload = buildAssocierOffreQcmPayload({
                    ...data,
                    user_id,
                });

                if (associationPayload.payload.length > 0) {
                    await associer_offre_qcm(
                        associationPayload,
                        { transaction }
                    );
                }
            }

            // 🔹 3️⃣ Commit transaction
            await transaction.commit();

            return {
                status: "success",
                message: "QCM créé et associé aux offres avec succès",
                qcm_id: qcm.post_id,
            };

        } catch (err) {
            // ❌ Rollback en cas d’erreur
            await transaction.rollback();

            console.error("Erreur saveExamenQcm:", err);

            return {
                status: "error",
                message: "Erreur lors de la création du QCM",
                error: err.message,
            };
        }
    },

    saveEntretienCandidat: async (user_id, data) => {


        try {

            console.log(data)
            const {
                candidat,
                offre,
                date,
                heure,
                user_id,
                type
            } = data;


            // 🔹 1️⃣ Vérifications de base
            if (!candidat || !offre || !date || !heure || !type) {
                return {
                    status: "error",
                    message: "Champs obligatoires manquants"
                };
            }

            const candidat_info = await getUserByEmail(candidat)

            if (offre.startsWith("OFF-")) {

                await PostulationAnnonceOffreEmploi.update(
                    { statut: "ENTRETIEN_PROGRAMMER" },
                    { where: { user_id: candidat_info.id, annonce_id: offre } }
                );
            }

            if (offre.startsWith("AOF-")) {

                await PostulationAppelOffre.update(
                    { statut: "ENTRETIEN_PROGRAMMER" },
                    { where: { user_id: candidat_info.id, annonce_id: offre } }
                );
            }

            const candidatExiste = await User.findOne({
                where: {
                    email: candidat
                },
                attributes: ["id", "email"],
                raw: true
            });

            if (!candidatExiste) {
                return {
                    status: "error",
                    message: "Aucun candidat trouvé avec cet email"
                };
            }


            const entretienExiste = await EntretienCandidat.findOne({
                where: {
                    candidat,
                    offre,
                    date,
                    heure
                }
            });

            console.log(entretienExiste)

            if (entretienExiste) {
                return {
                    status: "warning",
                    message: "Un entretien est déjà programmé pour ce candidat à cette date"
                };
            }

            const messageNotif = `Bonjour ${candidatExiste.nom || ''} ! 
                                Vous êtes invité(e) à un entretien pour le poste auquel vous avez postulé. 
                                Type d'entretien : ${data.type}
                                Date : ${data.date} à ${data.heure}
                                Lieu / Lien : ${data.lieu || data.lien || 'à vérifier dans votre espace candidat'}
                                Merci de vous connecter à votre espace candidat pour plus de détails.`;


            await EntretienCandidat.create({
                ...data,
                candidat_id: candidatExiste.id,
                message: data.message[0], // Deja corriger adapter si l'erreur se presente a nouveau e
                created_by: user_id
            });


            const senderInfo = await getCandidatinfo(user_id);
            const candInfo = await getCandidatinfo(candidatExiste.id);
            let annonce = await getEntrepriseIDbyAnnonceID(offre)

            const createdAt = new Date().toISOString();
            const annonceTitle = annonce?.title;
            const notification = {
                sender_id: user_id,
                sender_name: senderInfo?.nom || "Entreprise",

                receiver_id: candidatExiste.id,
                receiver_name: candInfo.nom || "Candidat",

                type: "INFO",
                action: "None",

                title: `"Invitation à un entretien pour : ${annonceTitle}`,
                message: messageNotif,

                object_id: data.post_id,
                object_type: "ENTRETIEN",
                object_label: annonceTitle,

                meta: {
                    createdAt,
                    candidat_id: candidatExiste.id,
                    post_id: offre,
                    is_read: false,
                },
            }

            await createOrUpdateNotification(notification);

            return {
                status: "created",
                message: "Entretien programmé avec succès"
            };

        } catch (err) {
            console.error("Erreur saveEntretienCandidat:", err);
            return {
                status: "error",
                message: "Erreur lors de la création de l’entretien"
            };
        }
    },

    saveNotesEntretien: async (data) => {
        try {

            const { user_id, entretienId, commentaire, note, decision } = data;



            if (!entretienId || !user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }




            // Récupérer l'entretien correspondant
            const entretien = await EntretienCandidat.findOne({
                where: { post_id: entretienId },
                raw: true
            });



            if (!entretien) {
                return {
                    status: "error",
                    message: "Entretien introuvable",
                };
            }


            if (entretien.offre.startsWith("OFF-")) {



                await PostulationAnnonceOffreEmploi.update(
                    { statut: decision },
                    { where: { user_id: entretien.candidat_id, annonce_id: entretien.offre } }
                );
            }

            if (entretien.offre.startsWith("AOF-")) {

                await PostulationAppelOffre.update(
                    { statut: decision },
                    { where: { user_id: entretien.candidat_id, annonce_id: entretien.offre } }
                );
            }

            const senderInfo = await getCandidatinfo(user_id);
            const candInfo = await getCandidatinfo(entretien.candidat_id);
            let annonce = await getEntrepriseIDbyAnnonceID(entretien.offre)

            const createdAt = new Date().toISOString();
            const annonceTitle = annonce?.title;

            let messageNotif = "";

            if (decision === "ACCEPTE") {
                messageNotif = `Bonjour ${candInfo.nom || ''},

Suite à votre entretien pour le poste « ${annonceTitle} », nous avons le plaisir de vous informer que votre candidature a été retenue.

Notre équipe vous contactera prochainement pour la suite du processus de recrutement.

Vous pouvez également consulter votre espace candidat pour plus d’informations.

Cordialement,
L’équipe recrutement`;
            }

            else if (decision === "REJETE") {
                messageNotif = `Bonjour ${candInfo.nom || ''},

Suite à votre entretien pour le poste « ${annonceTitle} », nous vous remercions pour l’intérêt porté à notre entreprise.

Après étude de votre candidature, nous regrettons de vous informer que votre profil n’a pas été retenu pour ce poste.

Nous vous souhaitons plein succès dans la poursuite de vos projets professionnels.

Cordialement,
L’équipe recrutement`;
            }

            else { // EN_ATTENTE / PENDING
                messageNotif = `Bonjour ${candInfo.nom || ''},

Suite à votre entretien pour le poste « ${annonceTitle} », votre candidature est actuellement en cours d’évaluation.

Notre équipe vous informera dès qu’une décision finale sera prise.

Vous pouvez consulter votre espace candidat pour suivre l’évolution de votre candidature.

Cordialement,
L’équipe recrutement`;
            }

            const notification = {
                sender_id: user_id,
                sender_name: senderInfo?.nom || "Entreprise",

                receiver_id: entretien.candidat_id,
                receiver_name: candInfo.nom || "Candidat",

                type: "INFO",
                action: "None",

                title: `"Invitation à un entretien pour : ${annonceTitle}`,
                message: messageNotif,

                object_id: entretienId,
                object_type: "ENTRETIEN",
                object_label: annonceTitle,

                meta: {
                    createdAt,
                    candidat_id: entretien.candidat_id,
                    post_id: entretien.offre,
                    is_read: false,
                },
            }


            await createOrUpdateNotification(notification);

            // Vérifie si une note existe déjà pour cet entretien
            const existingNote = await NotesEntretien.findOne({
                where: { entretienId },
            });

            // Mettre à jour le statut de l'entretien à terminé


            await EntretienCandidat.update(
                { status: "DONE", updatedAt: new Date() },
                { where: { post_id: entretienId } }
            );


            if (existingNote) {
                // Mise à jour de la note existante
                await NotesEntretien.update(
                    { commentaire, note, user_id },
                    {
                        where: { entretienId },
                    });

                return {
                    status: "updated",
                    message: "Note de l’entretien mise à jour avec succès.",
                };
            }

            // Sinon création d'une nouvelle note
            await NotesEntretien.create({ entretienId, commentaire, note, user_id });

            return {
                status: "created",
                message: "Note de l’entretien créée avec succès.",
            };

        } catch (err) {
            console.error("Erreur saveNotesEntretien :", err);
            return {
                status: "error",
                message: "Erreur lors de l'enregistrement de la note.",
            };
        }
    }
    ,
    saveEntrepriseInformation: async (user_id, data) => {
        try {
            if (!user_id) {
                return {
                    status: "error",
                    message: "Utilisateur invalide",
                };
            }

            // 📂 Extraction fichiers multer
            const files = data.filenameBase || {};

            const payload = {
                user_id,
                nom_legal: data.nom_legal,
                ifu: data.ifu,
                type_entreprise: data.type_entreprise,
                taille: data.taille,
                domaine: data.domaine,
                pays: data.pays,
                ville: data.ville,
                adresse: data.adresse,
                telephone: data.telephone,
                email: data.email,

                // 📄 fichiers KYC
                rccm_file: files.rccm || null,
                ifu_file: files.ifu_doc || null,
            };

            // 🔎 Vérifier existant
            const existing = await EntrepriseInformation.findOne({
                where: { user_id },
            });

            if (existing) {
                // ⚠️ si nouveaux fichiers → repasse en pending
                if (files.rccm || files.ifu_doc) {
                    payload.kyc_status = "submitted";
                    payload.kyc_submitted_at = new Date();
                }

                await existing.update(payload);

                return {
                    status: "updated",
                    message: "Informations KYC mises à jour.",
                };
            }

            // 🆕 Création
            payload.kyc_status = "submitted";
            payload.kyc_submitted_at = new Date();

            await EntrepriseInformation.create(payload);

            return {
                status: "created",
                message: "Informations KYC créées.",
            };

        } catch (err) {
            console.error("Erreur saveEntrepriseInformation:", err);
            throw err;
        }
    },

    saveNotificationPreference: async (
        user_id,
        data
    ) => {

        console.log(data)
        try {
            // Vérifie si l'offre existe déjà pour cet utilisateur
            const existing = await NotificationPreference.findOne({
                where: { user_id }
            });

            if (existing) {
                // Mise à jour
                await existing.update(data);

                return { status: "updated", message: "Offre mise à jour avec succès." };
            }

            // Sinon création
            await NotificationPreference.create(data);

            return { status: "created", message: "Nouvelle EntrepriseInformation créée." };

        } catch (err) {
            console.error("Erreur ExamenQcm:", err);
            throw err;
        }
    },
    savePresentationPublic: async (
        user_id,
        data
    ) => {


        try {

            // 🔹 Validation
            if (!user_id) {
                return {
                    status: "error",
                    message: "Données invalides",
                };
            }

            // Vérifie si l'offre existe déjà pour cet utilisateur
            const existing = await PresentationPublic.findOne({
                where: { user_id }
            });

            if (existing) {
                // Mise à jour
                await existing.update(data);

                return { status: "updated", message: "Votre presentation publique a été bien mise a jours." };
            }

            // Sinon création
            await PresentationPublic.create(data);

            return { status: "created", message: "Votre presentation publique a été bien créée." };

        } catch (err) {
            console.error("Erreur ExamenQcm:", err);
            throw err;
        }
    },
    saveAjouterCollaborateur: async (
        user_id,
        data
    ) => {

        try {

            // 🔐 génération token invitation
            const inviteToken = crypto.randomBytes(32).toString("hex");

            const collaborateurData = {
                ...data,
                invite_token: inviteToken,
                invite_expire: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48h
                created_by: user_id
            };



            console.log(collaborateurData)



            console.log("CollaborateurData:", collaborateurData);

            // 👉 sauvegarde DB
            await AjouterCollaborateur.create(collaborateurData);

            // 🔎 info entreprise (sender)
            const senderInfo = await getCandidatinfo(user_id);

            // 🔗 lien invitation frontend
            const inviteLink = `${process.env.FRONT_URL}/invitation/${inviteToken}`;

            // ✉️ message email
            const emailMessage = `
                            Bonjour ${data.nom},

                            ${senderInfo?.nom || "Une entreprise"} vous a invité comme collaborateur.

                            Cliquez sur le lien pour activer votre compte :
                            ${inviteLink}

                            Ce lien expire sous 48h.

                            L'équipe
                            `;

            console.log(emailMessage)

            // 📧 envoi email

            /*  await sendEmail({
                  to: data.email,
                  subject: "Invitation collaborateur",
                  text: emailMessage
              });
            */

            //  await AjouterCollaborateur.create(data);
            return { status: "created", message: "Nouvelle Collaborateur créée." };
        } catch (err) {
            // Vérifier si c'est un doublon sur l'email
            if (err.code === "ER_DUP_ENTRY" && err.sqlMessage.includes("for key 'email'")) {
                return { status: "error", message: "⚠ L'email existe déjà." };
            }

            console.error("Erreur ExamenQcm:", err);
            return { status: "error", message: "Une erreur est survenue lors de la création." };
        }
    },
    updateRecrutementConsultant: async (post_id, data) => {
        try {
            // 1️⃣ Récupérer l'offre existante
            const existing = await AppelOffreRecrutementConsultant.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("Appel d’offre introuvable");
            }

            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) {
                    return;
                }

                // ❌ Ignorer undefined
                if (newValue === undefined) {
                    return;
                }

                // ❌ Ignorer les chaînes vides (optionnel, mais recommandé)
                if (typeof newValue === "string" && newValue.trim() === "") {
                    return;
                }

                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });

            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "Appel d’offre mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateRecrutementConsultant :", err);
            throw err;
        }
    },
    updateOffreEmploi: async (post_id, data) => {

        try {
            // 1️⃣ Récupérer l'offre existante
            const existing = await OffreEmploi.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("Appel d’offre introuvable");
            }

            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) {
                    return;
                }

                // ❌ Ignorer undefined
                if (newValue === undefined) {
                    return;
                }

                // ❌ Ignorer les chaînes vides (optionnel, mais recommandé)
                if (typeof newValue === "string" && newValue.trim() === "") {
                    return;
                }

                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });

            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "Appel d’offre mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateOffreEmploi :", err);
            throw err;
        }
    },
    updateAppelOffre: async (post_id, data) => {

        console.log(data)

        try {
            // 1️⃣ Récupérer l'offre existante
            const existing = await AppelOffre.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("Appel d’offre introuvable");
            }


            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) {
                    return;
                }

                // ❌ Ignorer undefined
                if (newValue === undefined) {
                    return;
                }

                // ❌ Ignorer les chaînes vides (optionnel, mais recommandé)
                if (typeof newValue === "string" && newValue.trim() === "") {
                    return;
                }

                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });



            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "Appel d’offre mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateOffreEmploi :", err);
            throw err;
        }
    },
    updateAmi: async (post_id, data) => {

        try {
            // 1️⃣ Récupérer l'offre existante
            const existing = await AppelOffreAmi.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("Appel d’offre introuvable");
            }

            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) {
                    return;
                }

                // ❌ Ignorer undefined
                if (newValue === undefined) {
                    return;
                }

                // ❌ Ignorer les chaînes vides (optionnel, mais recommandé)
                if (typeof newValue === "string" && newValue.trim() === "") {
                    return;
                }

                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });

            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "Appel d’offre mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateOffreEmploi :", err);
            throw err;
        }
    },
    updateConsultation: async (post_id, data) => {


        try {
            // 1️⃣ Récupérer l'offre existante
            const existing = await AppelOffreConsultation.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("Appel d’offre introuvable");
            }

            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) {
                    return;
                }

                // ❌ Ignorer undefined
                if (newValue === undefined) {
                    return;
                }

                // ❌ Ignorer les chaînes vides (optionnel, mais recommandé)
                if (typeof newValue === "string" && newValue.trim() === "") {
                    return;
                }

                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });

            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "Appel d’offre mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateOffreEmploi :", err);
            throw err;
        }

    },
    updateQcm: async (post_id, data) => {
        try {
            // 1️⃣ Récupérer le QCM existant
            const existing = await ExamenQcm.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("QCM introuvable");
            }

            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) return;

                // ❌ Ignorer undefined ou chaîne vide
                if (newValue === undefined) return;
                if (typeof newValue === "string" && newValue.trim() === "") return;

                // 🔹 Gestion des objets imbriqués (params)
                if (key === "params" && typeof newValue === "object" && newValue !== null) {
                    const paramUpdates = {};
                    Object.keys(newValue).forEach((paramKey) => {
                        if (newValue[paramKey] !== oldValue?.[paramKey]) {
                            paramUpdates[paramKey] = newValue[paramKey];
                        }
                    });
                    if (Object.keys(paramUpdates).length > 0) {
                        updates.params = { ...oldValue, ...paramUpdates };
                    }
                    return;
                }

                // 🔹 Gestion des questions (tableau)
                if (key === "questions" && Array.isArray(newValue)) {
                    // On compare JSON.stringify pour simplifier
                    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                        updates.questions = newValue;
                    }
                    return;
                }

                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });

            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "QCM mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateQcm :", err);
            throw err;
        }
    },
    updateEntretien: async (post_id, data) => {
        try {

            console.log(data)
            // 1️⃣ Récupérer le QCM existant
            const existing = await EntretienCandidat.findOne({
                where: { post_id }
            });

            if (!existing) {
                throw new Error("QCM introuvable");
            }

            // 2️⃣ Construire l'objet des champs à mettre à jour
            const updates = {};

            Object.keys(data).forEach((key) => {
                const newValue = data[key];
                const oldValue = existing[key];

                // ⚠️ Ne pas modifier filenameBase si undefined
                if (key === "filenameBase" && newValue === undefined) return;

                // ❌ Ignorer undefined ou chaîne vide
                if (newValue === undefined) return;
                if (typeof newValue === "string" && newValue.trim() === "") return;



                // ✅ Mettre à jour seulement si la valeur a changé
                if (newValue !== oldValue) {
                    updates[key] = newValue;
                }
            });

            // 3️⃣ S’il n’y a rien à modifier
            if (Object.keys(updates).length === 0) {
                return {
                    status: "no_change",
                    message: "Aucune modification détectée."
                };
            }

            // 4️⃣ Mise à jour
            await existing.update(updates);

            return {
                status: "updated",
                message: "QCM mis à jour avec succès.",
                updatedFields: Object.keys(updates)
            };

        } catch (err) {
            console.error("Erreur updateQcm :", err);
            throw err;
        }
    },







};

const buildAssocierOffreQcmPayload = (qcm) => {
    if (!qcm || !qcm.post_id || !qcm.user_id) {
        throw new Error("QCM invalide");
    }

    // 🔹 Sécuriser offreId (string → array)
    const offres = typeof qcm.offreId === "string" && qcm.offreId.trim() !== ""
        ? qcm.offreId.split(",").map(o => o.trim())
        : [];

    return {
        user_id: qcm.user_id,
        post_id: qcm.post_id,
        payload: offres,
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


const getEntrepriseIDbyAnnonceID = async (annonces_id) => {
    if (!annonces_id) return null;

    let annonce = null;
    let source = null;

    try {
        if (annonces_id.startsWith("OFF-")) {
            annonce = await OffreEmploi.findOne({
                where: { post_id: annonces_id },
                attributes: ["user_id", "objet"],
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

function generateInviteToken() {
    return crypto.randomBytes(32).toString("hex"); // token 64 caractères
}