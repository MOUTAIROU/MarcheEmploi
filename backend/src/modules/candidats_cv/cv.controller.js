const service = require("./cv.service");

exports.cand_envoie_cv = async (req, res) => {
    try {


        const { cv, filenameBase } = req.body

        const {photo_profil}= filenameBase


        // Transformer la chaîne JSON en objet
        const cvObj = JSON.parse(cv);

        // Supprimer la photo
        delete cvObj['Informations personnelles'].Photo;


        const result = await service.cand_envoie_cv({ user_id: req.userId, filenameBase:photo_profil, cvObj: JSON.stringify(cvObj) });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.get_cand_envoie_cv = async (req, res) => {
    try {


        const result = await service.get_cand_envoie_cv({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


