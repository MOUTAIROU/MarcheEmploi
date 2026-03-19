const { cp } = require("fs");
const repository = require("./entreprise.repository");
const path = require("path");
const generateUniqueId = require("../IdGeneres/services.generateUniqueId");

module.exports = {
    create_offre_emploi: async ({ user_id, objet, description, date_publication, lieu, categorie, expiration, visibilite, experience, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase }) => {

        const id1 = await generateUniqueId("offre_emploi", countryCode);

        const data = {
            post_id: id1, type: "offre_emploi", user_id, objet, description, categorie, date_publication, lieu, expiration, visibilite, experience, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase
        }

        return await repository.saveOffre(user_id, data)

    },
    create_appel_offre: async ({ user_id, objet, lieu, date_publication, date_ouverture, categorie, date_limite, visibilite, budget, description, conditions_de_participation, documents_requis, filenameBase, countryCode }) => {

        const id2 = await generateUniqueId("appel_offre", countryCode);



        const data = {
            post_id: id2, type: "appel_offre", user_id, objet, lieu, date_publication, categorie, date_ouverture, date_limite, visibilite, budget, description, conditions_de_participation, documents_requis, filenameBase, countryCode
        }

        return await repository.saveAppelOffre(user_id, data)


    },
    create_ami: async ({ user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase }) => {


        const id2 = await generateUniqueId("appel_offre", countryCode);

        const data = {
            post_id: id2, type: "ami", user_id, objet, lieu, date_publication, date_limite, categorie, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase
        }

        return await repository.saveAmiAppelOffre(user_id, data)

    },
    create_consultation: async ({ user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase }) => {

        const id2 = await generateUniqueId("appel_offre", countryCode);

        const data = {
            post_id: id2, type: "consultation", user_id, objet, lieu, date_publication, date_limite, categorie, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase
        }

        return await repository.saveConsultationAppelOffre(user_id, data)

    },
    create_recrutement_consultant: async ({ user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase }) => {
        const id2 = await generateUniqueId("appel_offre", countryCode);

        const data = {
            post_id: id2, type: "recrutement_consultant", user_id, objet, lieu, date_publication, date_limite, categorie, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase
        }

        return await repository.saveRecrutementConsultantAppelOffre(user_id, data)
    },
    update_recrutement_consultant: async ({ user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase, post_id }) => {

        const data = {
            user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase, post_id
        }
        return await repository.updateRecrutementConsultant(post_id, data)
    },
    update_consultation: async ({ user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase, post_id }) => {
        const data = {
            user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase, post_id
        }
        return await repository.updateConsultation(post_id, data)
    },
    update_entretien: async ({ user_id, post_id, candidat, offre, heure, type, date, duree, responsable, lien, lieu, message, filenameBase, countryCode }) => {

        const data = {
            user_id, post_id, candidat, offre, heure, type, date, duree, responsable, lien, lieu, message, filenameBase, countryCode
        }
        return await repository.updateEntretien(post_id, data)

    },
    update_ami: async ({ user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase, post_id }) => {
        const data = {
            user_id, objet, lieu, date_publication, date_limite, date_ouverture, categorie, visibilite, description, conditions, documents_requis, countryCode, filenameBase, post_id
        }
        return await repository.updateAmi(post_id, data)
    },
    update_qcm: async ({ user_id, post_id, titre, categorie, description, duree, noteMin, mode, tentatives, niveauGlobal, afficherResultat, countryCode, reponsesAleatoires, params, questions }) => {

        const data = {
            user_id, post_id, titre, categorie, description, duree, noteMin, mode, tentatives, niveauGlobal, afficherResultat, countryCode, reponsesAleatoires, params, questions
        }

        return await repository.updateQcm(post_id, data)
    },
    update_appel_offre: async ({ user_id, objet, lieu, date_publication, date_ouverture, categorie, date_limite, visibilite, budget, description, conditions_de_participation, documents_requis, filenameBase, countryCode, post_id }) => {
        const data = {
            user_id, objet, lieu, date_publication, date_ouverture, categorie, date_limite, visibilite, budget, description, conditions_de_participation, documents_requis, filenameBase, countryCode, post_id
        }

        console.log(data)

        return await repository.updateAppelOffre(post_id, data)
    },
    update_offre_emploi: async ({ user_id, objet, description, date_publication, lieu, categorie, expiration, visibilite, experience, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase, post_id }) => {

        const data = {
            user_id, objet, description, date_publication, lieu, categorie, expiration, visibilite, experience, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase, post_id
        }
        return await repository.updateOffreEmploi(post_id, data)
    },
    associer_qcm_offre: async ({ user_id, offreId, countryCode, titre, categorie, description, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat }) => {

        const id4 = await generateUniqueId("examen_qcm", countryCode)

        const data = {
            post_id: id4, type: "examen_qcm", user_id, offreId, titre, categorie, countryCode, description, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat
        }

        return await repository.saveExamenQcm(user_id, data)
    },
    entretien_candidat: async ({ user_id, candidat, offre, heure, countryCode, type, date, duree, responsable, lien, lieu, message, filenameBase }) => {

        const id3 = await generateUniqueId("entretien", "FR")

        const data = {
            post_id: id3, user_id, candidat, offre, heure, type, date, duree, countryCode, responsable, lien, lieu, message, filenameBase
        }

        return await repository.saveEntretienCandidat(user_id, data)


    },
    create_qcm: async ({ user_id, titre, categorie, description, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat, countryCode }) => {

        const id4 = await generateUniqueId("examen_qcm", countryCode)


        const data = {
            post_id: id4, type: "examen_qcm", offreId: null, user_id, titre, categorie, description, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat, countryCode
        }

        return await repository.saveExamenQcm(user_id, data)
    },

    create_entretien: async ({ user_id, candidat, offre, heure, type, date, duree, countryCode, responsable, lien, lieu, message, filenameBase }) => {

        let msg = message[0]

        const id3 = await generateUniqueId("entretien", "FR")


        const data = {
            post_id: id3, user_id, candidat, offre, heure, type, date, duree, countryCode, responsable, lien, lieu, msg, filenameBase
        }


        return await repository.saveEntretienCandidat(user_id, data)
    },
    create_note_entretien: async ({ user_id, entretienId, commentaire, note, decision }) => {


        const data = {
            user_id, entretienId, commentaire, note, decision
        }

        return await repository.saveNotesEntretien(data)



    },
    create_information: async ({ user_id, nom_legal, ifu, type_entreprise, taille, domaine, pays, ville, adresse, telephone, email, filenameBase }) => {



        const data = {
            user_id, nom_legal, ifu, type_entreprise, taille, domaine, pays, ville, adresse, telephone, email, filenameBase
        }

        return await repository.saveEntrepriseInformation(user_id, data)

    },
    notification_preference: async (data) => {


       

        return await repository.saveNotificationPreference(data)


    },
    presentation_public: async ({ user_id, nom, secteur, site, adresse, countryCode, presentation, mission, valeurs, filenameBase }) => {



        const data = { user_id, nom, secteur, site, adresse, presentation, countryCode, mission, valeurs, filenameBase }

        return await repository.savePresentationPublic(user_id, data)

    },
    ajouter_colloborateur: async ({ user_id, nom, email, countryCode, role }) => {


        const data = {
            user_id, nom, email, role, countryCode, accepted: false
        }

        return await repository.saveAjouterCollaborateur(user_id, data)


    },

    modifer_colaborateur: async (data) => {

        return await repository.modifer_colaborateur( data)


    },
    detele_colaborateur: async (data) => {

        return await repository.detele_colaborateur( data)


    },
    delete_collaborateurs_groupe: async (data) => {

        return await repository.delete_collaborateurs_groupe( data)


    },
    

    
    

};


