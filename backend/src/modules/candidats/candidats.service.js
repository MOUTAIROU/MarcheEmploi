const { cp } = require("fs");
const repository = require("./candidats.repository");
const path = require("path");
const generateUniqueId = require("../IdGeneres/services.generateUniqueId");
module.exports = {
    annonce_post_id: async (data) => {

        return await repository.annonce_post_id(data)

    },

    annonce_post_id_search: async (data) => {

        return await repository.annonce_post_id_search(data)

    },
    entretien: async (data) => {

        return await repository.entretien(data)

    },
    dashbord_starts: async ({ user_id }) => {

        return await repository.dashbord_starts(user_id)

    },

    all_qcm: async (data) => {

        return await repository.all_qcm(data)

    },
    all_qcm_search: async (data) => {

        return await repository.all_qcm_search(data)

    },
    entretien_status: async (data) => {

        return await repository.entretien_status(data)

    },
    entretien_status_groupe: async (data) => {

        return await repository.entretien_status_groupe(data)

    },

    delete_entretien: async (data) => {

        return await repository.delete_entretien(data)

    },
    delete_entretien_groupe: async (data) => {

        return await repository.delete_entretien_groupe(data)

    },



    get_qcm_by_post_id: async (data) => {

        return await repository.get_qcm_by_post_id(data)

    },
    qcm_examin_exercice: async (data) => {

        return await repository.qcm_examin_exercice(data)

    },
    set_notification_read: async (data) => {

        return await repository.set_notification_read(data)

    },

    entretien_detail: async (data) => {

        return await repository.entretien_detail(data)

    },

    se_retirer_offre: async (data) => {

        return await repository.se_retirer_offre(data)

    },

    detete_qcm_groupe: async (data) => {

        return await repository.detete_qcm_groupe(data)

    },


    candidats_detete_qcm: async (data) => {

        return await repository.candidats_detete_qcm(data)

    },

    se_retirer_offre_group: async (data) => {

        return await repository.se_retirer_offre_group(data)

    },

    mes_appel_offre_save: async (data) => {

        return await repository.mes_appel_offre_save(data)

    },

    mes_appel_offre_save_search: async (data) => {

        return await repository.mes_appel_offre_save_search(data)

    },






};


