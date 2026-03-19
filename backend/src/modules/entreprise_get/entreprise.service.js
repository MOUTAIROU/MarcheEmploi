const { cp } = require("fs");
const repository = require("./entreprise.repository");
const path = require("path");
const generateUniqueId = require("../IdGeneres/services.generateUniqueId");
module.exports = {
    offres: async (data) => {

        return await repository.getOffre(data)

    },
    information_offres: async ({ user_id }) => {

        return await repository.information_offres(user_id)
    },
    dashbord_starts: async ({ user_id }) => {

        return await repository.dashbord_starts(user_id)
    },
    mes_appel_offre_save: async (data) => {

        return await repository.mes_appel_offre_save(data)

    },
    mes_candidats_save: async (data) => {

        return await repository.mes_candidats_save(data)

    },
    mes_candidats_save_search: async (data) => {

        return await repository.mes_candidats_save_search(data)

    },
   
    get_notification: async (data) => {

        return await repository.get_notification(data)

    },
    user_infomation: async (data) => {



        return await repository.user_infomation(data)

    },

    get_presentation_public: async ({ user_id }) => {

        return await repository.get_presentation_public(user_id)

    },
    send_candidat_notification: async (data) => {

        return await repository.send_candidat_notification(data)

    },

    send_candidat_notification_emploi: async (data) => {

        return await repository.send_candidat_notification_emploi(data)

    },

    send_candidat_notification_emploi_contact: async (data) => {

        return await repository.send_candidat_notification_emploi_contact(data)

    },

    notifications_mark_as_read: async (data) => {

        return await repository.notifications_mark_as_read(data)

    },


    mes_condidatures: async (data) => {
        return await repository.mes_condidatures(data)
    },
    get_notification_preference: async (data) => {
        return await repository.get_notification_preference(data)
    },

    send_candidat_changer_status: async (data) => {
        return await repository.send_candidat_changer_status_appel_offre(data)
    },


    send_candidat_changer_status_emploi: async (data) => {
        return await repository.send_candidat_changer_status_emploi(data)
    },


    send_candidat_delete_offres_emploi_groupe: async (data) => {
        return await repository.send_candidat_delete_offres_emploi_groupe(data)
    },

    send_candidat_changer_status_group_emploi: async (data) => {
        return await repository.send_candidat_changer_status_emploi_groupe(data)
    },
    send_candidat_changer_status_group: async (data) => {
        return await repository.send_candidat_changer_status_appel_offre_groupe(data)
    },
    send_candidat_delete_offres_group: async (data) => {

        return await repository.send_candidat_delete_offres_emploi_groupe(data)
    },
    associer_candidat_qcm: async (data) => {
        return await repository.associer_candidat_qcm(data)
    },
    associer_offre_qcm: async (data) => {
        return await repository.associer_offre_qcm(data)
    },

    send_candidat_notification_group: async (data) => {
        return await repository.send_candidat_notification_group(data)
    },

    send_candidat_notification_group_emploi: async (data) => {
        return await repository.send_candidat_notification_group_emploi(data)
    },


    send_candidat_delete_offres: async (data) => {
        return await repository.send_candidat_delete_offres(data)
    },
    detete_qcm: async (data) => {
        return await repository.detete_qcm(data)
    },

    detete_qcm_groupe: async (data) => {
        return await repository.detete_qcm_groupe(data)
    },



    send_candidat_delete_offres_emploi: async (data) => {
        return await repository.send_candidat_delete_offres_emploi(data)
    },

    get_lettre_motivation: async (data) => {
        return await repository.get_lettre_motivation(data)
    },

    get_cv_candidat: async (data) => {
        return await repository.get_cv_candidat(data)
    },

    get_cv_candidat_user_id: async (data) => {
        return await repository.get_cv_candidat_user_id(data)
    },



    all_qcm: async (data) => {

        return await repository.all_qcm(data)

    },
    all_qcm_search: async (data) => {

        return await repository.all_qcm_search(data)

    },
    ami_offres_by_post_id: async ({ user_id, params }) => {

        const data = {
            user_id, params
        }

        return await repository.ami_offres_by_post_id(user_id, data)


    },
    appel_offres_by_post_id: async ({ user_id, params }) => {


        const data = {
            user_id, params
        }

        return await repository.appel_offres_by_post_id(user_id, data)


    },
    consultation_offres_by_post_id: async ({ user_id, params }) => {


        const data = {
            user_id, params
        }

        return await repository.consultation_offres_by_post_id(user_id, data)


    },
    emploi_offres_by_post_id: async ({ user_id, params }) => {


        const data = {
            user_id, params
        }

        return await repository.emploi_offres_by_post_id(user_id, data)


    },
    recrutement_offres_by_post_id: async ({ user_id, params }) => {


        const data = {
            user_id, params
        }

        return await repository.recrutement_offres_by_post_id(user_id, data)


    },
    get_qcm_by_post_id: async ({ user_id, params }) => {

        const data = {
            user_id, params
        }


        return await repository.get_qcm_by_post_id(user_id, data)

    },
    entretiens: async (data) => {

        return await repository.entretiens(data)

    },
    entretiens_search: async (data) => {

        return await repository.entretiens_search(data)

    },
    get_entretiens_by_post_id: async ({ user_id, params }) => {

        const data = {
            user_id, params
        }


        return await repository.get_entretiens_by_post_id(user_id, data)

    },
    get_utilisateurs: async (data) => {

        return await repository.get_utilisateurs(data)

    },
    get_utilisateurs_search: async (data) => {

        return await repository.get_utilisateurs_search(data)

    },
    delete_offres: async (data) => {

        return await repository.delete_offres(data)

    },
    delete_offres_mes_candidature: async (data) => {

        return await repository.delete_offres_mes_candidature(data)

    },

    get_offre_by_post_id: async (data) => {

        return await repository.get_offre_by_post_id(data)

    },
    get_offre_by_post_id_search: async (data) => {

        return await repository.get_offre_by_post_id_search(data)

    },

    search_offres: async (data) => {

        return await repository.search_offres(data)

    },
    mes_condidatures_search_offres: async (data) => {

        return await repository.mes_condidatures_search_offres(data)

    },
    mes_appel_offre_save_search: async (data) => {

        return await repository.mes_appel_offre_save_search(data)

    },
    ajouter_offre_qcm: async (data) => {

        return await repository.ajouter_offre_qcm(data)

    },
    retirer_offre_qcm: async (data) => {

        return await repository.retirer_offre_qcm(data)

    },

    delete_offres_save: async (data) => {

        return await repository.delete_offres_save(data)

    },
    qcm_candidats_all: async (data) => {

        return await repository.qcm_candidats_all(data)

    },
    qcm_candidats_all_search: async (data) => {

        return await repository.qcm_candidats_all_search(data)

    },
    detete_qcm_by_candidats: async (data) => {

        return await repository.detete_qcm_by_candidats(data)

    },
    detete_qcm_by_candidats_groupe: async (data) => {



        return await repository.detete_qcm_by_candidats_groupe(data)

    },
    entretien_notification: async (data) => {



        return await repository.entretien_notification(data)

    },

    detele_entretien: async (data) => {

        return await repository.detele_entretien(data)

    },
    detele_entretien_groupe: async (data) => {

        return await repository.detele_entretien_groupe(data)

    },
    entretien_notification_groupe: async (data) => {

        return await repository.entretien_notification_groupe(data)

    },
    send_qcm_by_candidats_notication: async (data) => {

        return await repository.send_qcm_by_candidats_notication(data)

    },
    delete_candidats_save: async (data) => {

        return await repository.delete_candidats_save(data)

    },



    qcm_candidats_exame_detail: async (data) => {

        return await repository.qcm_candidats_exame_detail(data)

    },

    valider_note_question: async (data) => {

        return await repository.valider_note_question(data)

    },


    offres_status: async (data) => {

        return await repository.offres_status(data)

    },

    delete_offres_groupe: async (data) => {

        return await repository.delete_offres_groupe(data)

    },

    delete_offres_mes_candidature_group: async (data) => {

        return await repository.delete_offres_mes_candidature_group(data)

    },



    delete_offres_save_groupe: async (data) => {

        console.log(data)

        return await repository.delete_offres_save_groupe(data)

    },

    delete_candidats_save_groupe: async (data) => {

        return await repository.delete_candidats_save_groupe(data)

    },



    offres_status_groupe: async (data) => {

        return await repository.offres_status_groupe(data)

    },
    annonce_post_id: async (data) => {

        return await repository.annonce_post_id(data)

    },
    annonce_post_id_emploi: async (data) => {

        return await repository.annonce_post_id_emploi(data)

    },
    annonce_post_id_emploi_search_candidats: async (data) => {

        return await repository.annonce_post_id_emploi_search_candidats(data)

    },

    annonce_post_id_search_candidats: async (data) => {

        return await repository.annonce_post_id_search_candidats(data)

    },







};


