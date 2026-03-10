const { cp } = require("fs");
const repository = require("./frontend.repository");
const { Json } = require("sequelize/lib/utils");

module.exports = {
    appels_offres: async (data) => {

        const { codeContry } = data


        return await repository.appelsOffres(codeContry)

    },
    annonces: async (data) => {


        const { annonces_id } = data

        return await repository.annonces(annonces_id)

    },
    invitation: async (data) => {



        return await repository.invitation(data)

    },
    invitation_accept: async (data) => {



        return await repository.invitation_accept(data)

    },

    postuler_annonce_appel_offre: async (data) => {


        return await repository.postuler_annonce_appel_offre(data)

    },
    save_annonce: async (data) => {

        return await repository.save_annonce(data)

    },
    signaler_annonce: async (data) => {

        return await repository.signaler_annonce(data)

    },
    entreprise_info: async (data) => {

        const { entreprise_id } = data

        return await repository.entreprise_info(entreprise_id)

    },
    check_postulant: async (data) => {

        const { user_id } = data

        return await repository.check_postulant(user_id)

    },
    entreprise_info_data: async (data) => {

        console.log(data)

        const { user_id } = data



        return await repository.entreprise_info_data(user_id)

    },
    postuler_annonce: async (data) => {

        const { user_id, annonce_id, lettre_motivation } = data

        console.log(user_id, annonce_id, lettre_motivation)

        return await repository.postuler_annonce(user_id, annonce_id, lettre_motivation)

    },

    appels_offres_by_page: async (data) => {

        const { pays, page, search } = data

        return await repository.appels_offres_by_page(pays, page, JSON.parse(search))

    },
    appels_offres_enregistrer: async (data) => {

        const { userId, user_id } = data

        return await repository.appels_offres_enregistrer(user_id, userId)
    },
    entreprise_save_candidats: async (data) => {



        const { userId, user_id } = data

        return await repository.entreprise_save_candidats(user_id, userId)
    },



    appels_offres_recherche: async (data) => {

        return await repository.appels_offres_recherche(data)

    },
    entreprises_candidats_recherche: async (data) => {

        return await repository.entreprises_candidats_recherche(data)

    },
    candidat_recherche_emploi_save: async (data) => {

        return await repository.candidat_recherche_emploi_save(data)

    },

    candidat_recherche_emploi: async (data) => {

        return await repository.candidat_recherche_emploi(data)

    },


    candidat_recherche_emploi_by_page: async (data) => {


        const { criteres, user_id } = data;

        const page = criteres.page

        const critere = criteres.params


        let new_data = {
            user_id,
            criteres: JSON.parse(critere)
        }


        return await repository.candidat_recherche_emploi(new_data, Number(page))



    },

    appels_offres_recherche_by_page: async (data) => {

        const { page, params } = data

        return await repository.appels_offres_recherche(JSON.parse(params), Number(page))

    },






};


