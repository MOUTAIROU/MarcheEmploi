const service = require("./candidats.service");


exports.annonce_post_id = async (req, res) => {
    try {

        console.log("xxx", req.userId)

        const result = await service.annonce_post_id({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.entretien = async (req, res) => {
    try {

        console.log("xxx", req.userId)

        const result = await service.entretien({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.delete_entretien = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.delete_entretien({ user_id: req.userId, entretien: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.delete_entretien_groupe = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.delete_entretien_groupe({ user_id: req.userId, entretien: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};
exports.entretien_status = async (req, res) => {
    try {


        const { params } = req.params

        const { candidat_id, newStatus } = req.body

        const result = await service.entretien_status({ user_id: req.userId, entretien: params, candidat_id, newStatus });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.entretien_status_groupe = async (req, res) => {
    try {

        console.log(req.params)

        console.log(req.body)

        const { params } = req.params

        const { newStatus } = req.body

        const result = await service.entretien_status_groupe({ user_id: req.userId, entretien: params, newStatus });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.all_qcm = async (req, res) => {
    try {

        console.log("xxx", req.userId)

        const result = await service.all_qcm({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_qcm_by_post_id = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.get_qcm_by_post_id({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.qcm_examin_exercice = async (req, res) => {
    try {

        const { payload } = req.body;

        const result = await service.qcm_examin_exercice({ user_id: req.userId, post_id: payload });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.set_notification_read = async (req, res) => {
    try {

        const { params } = req.params;

        console.log({ user_id: req.userId, post_id: params })

        const result = await service.set_notification_read({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.entretien_detail = async (req, res) => {
    try {

        const { params } = req.params;

        console.log({ user_id: req.userId, post_id: params })

        const result = await service.entretien_detail({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.mes_appel_offre_save = async (req, res) => {
    try {

        const { params } = req.params;

        console.log({ user_id: req.userId })

        const result = await service.mes_appel_offre_save({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.se_retirer_offre = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.se_retirer_offre({ user_id: req.userId, post_id: params });

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


exports.candidats_detete_qcm = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.candidats_detete_qcm({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.se_retirer_offre_group = async (req, res) => {
    try {

        const { params } = req.params;

        const result = await service.se_retirer_offre_group({ user_id: req.userId, post_id: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

