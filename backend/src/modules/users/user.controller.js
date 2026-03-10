const service = require("./user.service");



exports.cand_profile = async (req, res) => {
    try {
       
        
        const { username, nom, prenom, tel, email, filenameBase,activite,infos,specialisation } = req.body

        const result = await service.cand_profile({ user_id: req.userId, username, nom, prenom, tel, email, filenameBase,activite,infos,specialisation  });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.cand_preferences = async (req, res) => {
    try {

        console.log(req.body)

        const { settings  } = req.body

        const result = await service.cand_preferences({ user_id: req.userId, settings});

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


