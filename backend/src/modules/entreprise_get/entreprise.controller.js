const service = require("./entreprise.service");


exports.offres = async (req, res) => {
    try {

        const { page, limit } = req.query
        const result = await service.offres({ user_id: req.userId, page, limit });
        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.information_offres = async (req, res) => {
    try {


        const result = await service.information_offres({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.dashbord_starts = async (req, res) => {
    try {

        const result = await service.dashbord_starts({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.mes_appel_offre_save = async (req, res) => {
    try {


        const result = await service.mes_appel_offre_save({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.mes_candidats_save = async (req, res) => {
    try {


        const result = await service.mes_candidats_save({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.delete_offres = async (req, res) => {
    try {


        const { params } = req.params;

        console.log(params)

        const result = await service.delete_offres({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.delete_offres_mes_candidature = async (req, res) => {
    try {


        const { params } = req.params;

        console.log(params)

        const result = await service.delete_offres_mes_candidature({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.delete_candidats_save = async (req, res) => {
    try {


        const { params } = req.params;

        console.log(params)

        const result = await service.delete_candidats_save({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.delete_offres_save = async (req, res) => {
    try {


        const { params } = req.params;

        console.log(params)

        const result = await service.delete_offres_save({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.offres_status = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.offres_status({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.user_infomation = async (req, res) => {
    try {


        const { params } = req.params;


        const result = await service.user_infomation({ user_id: req.userId, entreprise_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.mes_condidatures = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.mes_condidatures({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.send_candidat_notification = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.send_candidat_notification({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.send_candidat_notification_emploi = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.send_candidat_notification_emploi({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.send_candidat_notification_emploi_contact = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.send_candidat_notification_emploi_contact({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.notifications_mark_as_read = async (req, res) => {
    try {

        const { notification_id } = req.body;

        const result = await service.notifications_mark_as_read({ user_id: req.userId, post_id: notification_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.send_candidat_changer_status = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;

        console.log(params, statut)

        const result = await service.send_candidat_changer_status({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.send_candidat_changer_status_emploi = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;

        console.log(params, statut)

        const result = await service.send_candidat_changer_status_emploi({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.send_candidat_changer_status_group = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.send_candidat_changer_status_group({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.send_candidat_changer_status_group_emploi = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.send_candidat_changer_status_group_emploi({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.associer_candidat_qcm = async (req, res) => {
    try {


        const { params } = req.params;
        const { payload } = req.body;


        const result = await service.associer_candidat_qcm({ user_id: req.userId, post_id: params, payload });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.associer_offre_qcm = async (req, res) => {
    try {


        const { params } = req.params;
        const { payload } = req.body;


        const result = await service.associer_offre_qcm({ user_id: req.userId, post_id: params, payload });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.send_candidat_notification_group = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;

        const result = await service.send_candidat_notification_group({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.send_candidat_notification_group_emploi = async (req, res) => {
    try {

        const { params } = req.params;
        const { statut } = req.body;

        const result = await service.send_candidat_notification_group_emploi({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};





exports.send_candidat_delete_offres = async (req, res) => {
    try {



        const { params } = req.params;

        const result = await service.send_candidat_delete_offres({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};



exports.detete_qcm = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.detete_qcm({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};

exports.detete_qcm_groupe = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.detete_qcm_groupe({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};

exports.detete_qcm_by_candidats = async (req, res) => {
    try {


        const { params } = req.params;
        const { offresID } = req.body;

        const result = await service.detete_qcm_by_candidats({ user_id: req.userId, candidat_id: params, qcm_id: offresID });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.entretien_notification = async (req, res) => {
    try {

        const { params } = req.params;
        const { payload } = req.body;

        const result = await service.entretien_notification({ user_id: req.userId, candidat_id: params, msg: payload });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.entretien_notification_groupe = async (req, res) => {
    try {

        const { params } = req.params;
        const { payload } = req.body;

        console.log(req.params, payload)

        const result = await service.entretien_notification_groupe({ user_id: req.userId, candidat_id: params, msg: payload });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.detete_qcm_by_candidats_groupe = async (req, res) => {
    try {

        const { params } = req.params;
        const { offresID } = req.body;

        console.log(params, offresID)

        const result = await service.detete_qcm_by_candidats_groupe({ user_id: req.userId, candidat_id: params, qcm_id: offresID });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.send_qcm_by_candidats_notication = async (req, res) => {
    try {

        console.log(params)
        console.log(offresID)

        const { params } = req.params;
        const { offresID } = req.body;

        const result = await service.send_qcm_by_candidats_notication({ user_id: req.userId, candidat_id: params, msg: offresID });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
}


exports.qcm_candidats_all = async (req, res) => {
    try {


        const { post_id } = req.params;

        const result = await service.qcm_candidats_all({ user_id: req.userId, post_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};



exports.send_candidat_delete_offresemploi = async (req, res) => {
    try {


        console.log(data)


        /* 
         const { params } = req.params;
 
         const result = await service.send_candidat_delete_offres_emploi({ user_id: req.userId, post_id: params });
 
         res.status(201).json(result);
         */

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};

exports.get_lettre_motivation = async (req, res) => {
    try {

        console.log(req.params)

        const { post_id, offreId } = req.params;

        const result = await service.get_lettre_motivation({ user_id: req.userId, post_id, offreId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};



exports.get_cv_candidat = async (req, res) => {
    try {


        const { post_id, offreId } = req.params;

        const result = await service.get_cv_candidat({ user_id: req.userId, post_id, offreId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};



exports.get_cv_candidat_user_id = async (req, res) => {
    try {


        const { post_id } = req.params;

        const result = await service.get_cv_candidat_user_id({ user_id: req.userId, post_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};
exports.send_candidat_delete_offres_group = async (req, res) => {
    try {


        const { params } = req.params;


        const result = await service.send_candidat_delete_offres_group({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};



exports.detele_entretien_groupe = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.detele_entretien_groupe({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};


exports.detele_entretien = async (req, res) => {
    try {

        const { params } = req.params;



        const result = await service.detele_entretien({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};


exports.send_candidat_delete_offres_emploi_groupe = async (req, res) => {
    try {


        const { params } = req.params;

        const result = await service.send_candidat_delete_offres_emploi_groupe({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }

};


exports.delete_offres_groupe = async (req, res) => {
    try {


        const { params } = req.params;

        const result = await service.delete_offres_groupe({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.delete_offres_mes_candidature_group = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.delete_offres_mes_candidature_group({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.delete_offres_save_groupe = async (req, res) => {
    try {


        const { params } = req.params;



        const result = await service.delete_offres_save_groupe({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.delete_candidats_save_groupe = async (req, res) => {
    try {


        const { params } = req.params;

        const result = await service.delete_candidats_save_groupe({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.offres_status_groupe = async (req, res) => {
    try {


        const { params } = req.params;
        const { statut } = req.body;


        const result = await service.offres_status_groupe({ user_id: req.userId, post_id: params, statut });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.get_notification_preference = async (req, res) => {
    try {


        const result = await service.get_notification_preference({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.get_notification = async (req, res) => {
    try {

        const result = await service.get_notification({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_presentation_public = async (req, res) => {
    try {


        const result = await service.get_presentation_public({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_utilisateurs = async (req, res) => {
    try {


        const result = await service.get_utilisateurs({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.all_qcm = async (req, res) => {
    try {


        const result = await service.all_qcm({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.entretiens = async (req, res) => {
    try {


        const result = await service.entretiens({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.get_entretiens_by_post_id = async (req, res) => {
    try {

        const { params } = req.params

        const result = await service.get_entretiens_by_post_id({ user_id: req.userId, params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.get_offre_by_post_id = async (req, res) => {
    try {

        const { params } = req.params

        const result = await service.get_offre_by_post_id({ user_id: req.userId, params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.search_offres = async (req, res) => {
    try {

        const { search, filter, page, limit } = req.query

        const result = await service.search_offres({ user_id: req.userId, search, filter, page, limit });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.ajouter_offre_qcm = async (req, res) => {
    try {



        const { qcm_id, post_id } = req.body

        const result = await service.ajouter_offre_qcm({ user_id: req.userId, qcm_id, post_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.retirer_offre_qcm = async (req, res) => {
    try {

        const { qcm_id, post_id } = req.body

        const result = await service.retirer_offre_qcm({ user_id: req.userId, qcm_id, post_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};





exports.get_qcm_by_post_id = async (req, res) => {
    try {

        const { params } = req.params

        const result = await service.get_qcm_by_post_id({ user_id: req.userId, params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.qcm_candidats_exame_detail = async (req, res) => {
    try {


        const { userid, qcmid } = req.params

        const result = await service.qcm_candidats_exame_detail({ user_id: req.userId, candidat_id: userid, qcmid });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.valider_note_question = async (req, res) => {
    try {


        const { question_id, qcm_id, user_id, note } = req.body


        console.log(question_id, qcm_id, user_id, note)

        const result = await service.valider_note_question({ user_id: req.userId, question_id, qcm_id, candidat_id: user_id, note });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.annonce_post_id = async (req, res) => {
    try {


         const { post_id,page,limit } = req.query

         const result = await service.annonce_post_id({ user_id: req.userId, post_id,page,limit  });

         res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.annonce_post_id_emploi = async (req, res) => {
    try {


        const { post_id ,page,limit } = req.query

        const result = await service.annonce_post_id_emploi({ user_id: req.userId, post_id ,page,limit });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.annonce_post_id_emploi_search_candidats = async (req, res) => {
    try {
 

       const { post_id, search, page, limit } = req.query;

        // 🔹 récupérer le filtre correctement
        let filterValues = [];

        if (Array.isArray(req.query['filter[]'])) {
            filterValues = req.query['filter[]'];
        } else if (typeof req.query['filter[]'] === 'string') {
            filterValues = [req.query['filter[]']];
        }

    

        const result = await service.annonce_post_id_emploi_search_candidats({ user_id: req.userId, post_id ,search,filter:filterValues,page,limit });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.annonce_post_id_search_candidats = async (req, res) => {
    try {
 

       const { post_id, search, page, limit } = req.query;

        // 🔹 récupérer le filtre correctement
        let filterValues = [];

        if (Array.isArray(req.query['filter[]'])) {
            filterValues = req.query['filter[]'];
        } else if (typeof req.query['filter[]'] === 'string') {
            filterValues = [req.query['filter[]']];
        }

    

        const result = await service.annonce_post_id_search_candidats({ user_id: req.userId, post_id ,search,filter:filterValues,page,limit });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.ami_offres_by_post_id = async (req, res) => {
    try {


        const { params } = req.params

        const result = await service.ami_offres_by_post_id({
            user_id: req.userId,
            params,
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.appel_offres_by_post_id = async (req, res) => {
    try {


        const { params } = req.params

        const result = await service.appel_offres_by_post_id({
            user_id: req.userId,
            params,
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.consultation_offres_by_post_id = async (req, res) => {
    try {


        const { params } = req.params

        const result = await service.consultation_offres_by_post_id({
            user_id: req.userId,
            params,
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.emploi_offres_by_post_id = async (req, res) => {
    try {


        const { params } = req.params

        const result = await service.emploi_offres_by_post_id({
            user_id: req.userId,
            params,
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.recrutement_offres_by_post_id = async (req, res) => {
    try {

        const { params } = req.params

        const result = await service.recrutement_offres_by_post_id({
            user_id: req.userId,
            params,
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.associer_qcm_offre = async (req, res) => {

    try {

        const { offreId, titre, categorie, description, countryCode, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat } = req.body;

        const result = await service.associer_qcm_offre({ user_id: req.userId, offreId, countryCode, titre, categorie, description, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.entretien_candidat = async (req, res) => {

    try {

        const { candidat, offre, heure, type, date, duree, responsable, lien, lieu, message, filenameBase, countryCode } = req.body;

        const result = await service.entretien_candidat({ user_id: req.userId, candidat, offre, heure, type, date, duree, countryCode, responsable, lien, lieu, message, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.create_qcm = async (req, res) => {

    try {


        const { titre, categorie, description, duree, noteMin, mode, reponsesAleatoires, countryCode, params, questions, tentatives, niveauGlobal, afficherResultat } = req.body;


        const result = await service.create_qcm({ user_id: req.userId, titre, categorie, countryCode, description, duree, noteMin, mode, reponsesAleatoires, params, questions, tentatives, niveauGlobal, afficherResultat });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.create_entretien = async (req, res) => {

    try {

        const { candidat, offre, heure, type, date, duree, countryCode, responsable, lien, lieu, message, filenameBase } = req.body;

        const result = await service.create_entretien({ user_id: req.userId, candidat, countryCode, offre, heure, type, date, duree, responsable, lien, lieu, message, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.create_note_entretien = async (req, res) => {

    try {


        const { entretienId, commentaire, note } = req.body;

        const result = await service.create_note_entretien({ user_id: req.userId, entretienId, commentaire, note });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.create_information = async (req, res) => {

    try {

        const { nom_legal, ifu, type_entreprise, taille, domaine, pays, ville, adresse, telephone, email, rh_nom, rh_email, rh_tel, fuseau, langue, enable2FA, ip_autorisees, filenameBase, countryCode, planning } = req.body;


        const result = await service.create_information({ user_id: req.userId, nom_legal, ifu, type_entreprise, taille, domaine, pays, ville, adresse, telephone, email, rh_nom, rh_email, rh_tel, countryCode, fuseau, langue, enable2FA, ip_autorisees, filenameBase, planning });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.notification_preference = async (req, res) => {

    try {


        const { candidat_postule, qcm_termine, entretien_programme, countryCode, rappel_entretien, offre_expiree, facture } = req.body.settings;


        const result = await service.notification_preference({ user_id: req.userId, countryCode, candidat_postule, qcm_termine, entretien_programme, rappel_entretien, offre_expiree, facture });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.presentation_public = async (req, res) => {

    try {


        const { nom, secteur, site, adresse, presentation, mission, countryCode, valeurs, filenameBase } = req.body;


        const result = await service.presentation_public({ user_id: req.userId, nom, secteur, countryCode, site, adresse, presentation, mission, valeurs, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.ajouter_colloborateur = async (req, res) => {

    try {

        const { nom, role, email, countryCode } = req.body;


        const result = await service.ajouter_colloborateur({ user_id: req.userId, nom, countryCode, email, role });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


