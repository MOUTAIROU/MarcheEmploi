const service = require("./user.service");



exports.cand_profile = async (req, res) => {
    try {


        const { username, nom, prenom, tel, email, filenameBase, activite, infos, specialisation } = req.body

        const result = await service.cand_profile({ user_id: req.userId, username, nom, prenom, tel, email, filenameBase, activite, infos, specialisation });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_user_data = async (req, res) => {
    try {



        const result = await service.get_user_data({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.delete_user = async (req, res) => {
    try {


        const {userName,userID} = req.body

         const result = await service.delete_user({ user_id: req.userId,userName,userID });

          res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.cand_parametre_info = async (req, res) => {
    try {


        const { username, nom, prenom, tel, email, filenameBase, activite, infos, specialisation } = req.body

        const result = await service.cand_parametre_info({ user_id: req.userId, username, nom, prenom, tel, email, filenameBase, activite, infos, specialisation });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.cand_preferences = async (req, res) => {
    try {


        const { settings } = req.body

        console.log('aa')

        const result = await service.cand_preferences({ user_id: req.userId, settings });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.cand_profile_settings = async (req, res) => {
    try {

        const { visibleProfil, contactDirect, publicProfil, displayBio, displaySkills, displayExperience, showCV, openToWork } = req.body


        const result = await service.cand_profile_settings({ user_id: req.userId, visibleProfil, contactDirect, publicProfil, displayBio, displaySkills, displayExperience, showCV, openToWork });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.get_cand_profile = async (req, res) => {
    try {


        const result = await service.get_cand_profile({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_cand_parametre_info = async (req, res) => {
    try {

        console.log('toto1', req.userId)

        const result = await service.get_cand_parametre_info({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.get_cand_preferences = async (req, res) => {
    try {


        const result = await service.get_cand_preferences({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.get_cand_profile_settings = async (req, res) => {
    try {


        const result = await service.get_cand_profile_settings({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_presentatation_public = async (req, res) => {
    try {

        const result = await service.get_presentatation_public({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


