const service = require("./entreprise.service");



exports.create_offre_emploi = async (req, res) => {
    try {


        const { objet, description, date_publication, categorie, lieu, visibilite, experience, expiration, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase } = req.body

        const result = await service.create_offre_emploi({ user_id: req.userId, objet, categorie, description, expiration, date_publication, lieu, visibilite, experience, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.create_recrutement_consultant = async (req, res) => {
    try {

        const { objet, lieu, date_publication, date_limite, categorie, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase } = req.body

        const result = await service.create_recrutement_consultant({ user_id: req.userId, objet, lieu, categorie, date_publication, date_limite, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.create_consultation = async (req, res) => {
    try {


        const { objet, lieu, date_publication, date_limite, date_ouverture, visibilite, categorie, description, conditions, documents_requis, countryCode, filenameBase } = req.body

        const result = await service.create_consultation({ user_id: req.userId, objet, lieu, categorie, date_publication, date_limite, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.create_ami = async (req, res) => {
    try {


        const { objet, lieu, date_publication, date_limite, date_ouverture, visibilite, description, categorie, conditions, documents_requis, countryCode, filenameBase } = req.body

        console.log('tototototo')
        const result = await service.create_ami({ user_id: req.userId, objet, lieu, date_publication, categorie, date_limite, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.create_appel_offre = async (req, res) => {
    try {

        const {
            objet,
            lieu,
            date_publication,
            date_ouverture,
            date_limite,
            categorie,
            visibilite,
            budget,
            description,
            conditions_de_participation,
            documents_requis,
            filenameBase,
            countryCode
        } = req.body;

        const result = await service.create_appel_offre({
            user_id: req.userId,
            objet,
            lieu,
            categorie,
            date_publication,
            date_ouverture,
            date_limite,
            visibilite,
            budget,
            description,
            conditions_de_participation,
            documents_requis,
            filenameBase,
            countryCode
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.update_offre_emploi = async (req, res) => {
    try {


        const { objet, description, date_publication, categorie, post_id, lieu, visibilite, experience, expiration, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase } = req.body

        const result = await service.update_offre_emploi({ user_id: req.userId, objet, post_id, categorie, description, expiration, date_publication, lieu, visibilite, experience, typeContrat, typeContratAutre, niveauEtudes, salaire, conditions, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.update_recrutement_consultant = async (req, res) => {
    try {


        const { post_id, objet, lieu, date_publication, date_limite, categorie, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase } = req.body

        const result = await service.update_recrutement_consultant({ user_id: req.userId, objet, post_id, lieu, categorie, date_publication, date_limite, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.update_consultation = async (req, res) => {
    try {

        const { objet, lieu, date_publication, post_id, date_limite, date_ouverture, visibilite, categorie, description, conditions, documents_requis, countryCode, filenameBase } = req.body

        const result = await service.update_consultation({ user_id: req.userId, objet, post_id, lieu, categorie, date_publication, date_limite, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.update_ami = async (req, res) => {
    try {


        const { objet, lieu, date_publication, date_limite, date_ouverture, post_id, visibilite, description, categorie, conditions, documents_requis, countryCode, filenameBase } = req.body


        const result = await service.update_ami({ user_id: req.userId, objet, lieu, post_id, date_publication, categorie, date_limite, date_ouverture, visibilite, description, conditions, documents_requis, countryCode, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.update_appel_offre = async (req, res) => {
    try {


        console.log(req.body)

        const { objet, lieu, date_publication, date_ouverture, date_limite, categorie, post_id, visibilite, budget, description, conditions_de_participation, documents_requis, filenameBase, countryCode } = req.body;

        const result = await service.update_appel_offre({ user_id: req.userId, objet, lieu, categorie, date_publication, date_ouverture, date_limite, post_id, visibilite, budget, description, conditions_de_participation, documents_requis, filenameBase, countryCode });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.update_qcm = async (req, res) => {
    try {


        try {


            const { post_id, titre, categorie, description, duree, noteMin, mode, tentatives, niveauGlobal, afficherResultat, countryCode, reponsesAleatoires, params, questions } = req.body;


            const result = await service.update_qcm({ user_id: req.userId, post_id, titre, categorie, description, duree, noteMin, mode, tentatives, niveauGlobal, afficherResultat, countryCode, reponsesAleatoires, params, questions });

            res.status(201).json(result);

        } catch (error) {
            res.status(500).json({ error: "Erreur interne" });
        }

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

        console.log(message)

        const result = await service.create_entretien({ user_id: req.userId, candidat, countryCode, offre, heure, type, date, duree, responsable, lien, lieu, message, filenameBase });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.modifer_colaborateur = async (req, res) => {

    try {

        const { params } = req.params
        const { payload } = req.body
        const result = await service.modifer_colaborateur({ user_id: req.userId, email: params, payload });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }


};



exports.detele_colaborateur = async (req, res) => {

    try {

        console.log(req.params)

        const { params } = req.params
        const result = await service.detele_colaborateur({ user_id: req.userId, email: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }


};

exports.delete_collaborateurs_groupe = async (req, res) => {

    try {

        console.log(req.params)

        const { params } = req.params
        const result = await service.delete_collaborateurs_groupe({ user_id: req.userId, email: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }


};




exports.create_note_entretien = async (req, res) => {

    try {


        const { entretienId, commentaire, note, decision } = req.body;

        const result = await service.create_note_entretien({ user_id: req.userId, entretienId, commentaire, note, decision });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.create_information = async (req, res) => {

    try {

        const { nom_legal, ifu, type_entreprise, taille, domaine, pays, ville, adresse, telephone, email, files } = req.body;


        const result = await service.create_information({ user_id: req.userId, nom_legal, ifu, type_entreprise, taille, domaine, pays, ville, adresse, telephone, email, filenameBase: files });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.notification_preference = async (req, res) => {

    try {

        const { enabled, email, internal } = req.body.settings;

        const result = await service.notification_preference({ user_id: req.userId, enabled, email, internal });

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


exports.update_entretien = async (req, res) => {
    try {



        const { post_id, candidat, offre, heure, type, date, duree, responsable, lien, lieu, message, filenameBase, countryCode } = req.body;

        const result = await service.update_entretien({ user_id: req.userId, post_id, candidat, offre, heure, type, date, duree, responsable, lien, lieu, message: message[0], filenameBase, countryCode });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }


};

