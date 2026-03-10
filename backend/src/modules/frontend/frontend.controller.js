const service = require("./frontend.service");

exports.appels_offres = async (req, res) => {
    try {

        const { params } = req.params


        const result = await service.appels_offres({ codeContry: params });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.entreprises_candidats_recherche = async (req, res) => {
    try {

        const result = await service.entreprises_candidats_recherche({ criteres: req.body, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.candidat_recherche_emploi_save = async (req, res) => {
    try {

        const { criteres, nom } = req.body

        const result = await service.candidat_recherche_emploi_save({ criteres, nom, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.candidat_recherche_emploi = async (req, res) => {
    try {

        const result = await service.candidat_recherche_emploi({ criteres: req.body, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.candidat_recherche_emploi_by_page = async (req, res) => {
    try {


        const result = await service.candidat_recherche_emploi_by_page({ criteres: req.body, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.annonces = async (req, res) => {
    try {

        const { annonces_id } = req.params


        const result = await service.annonces({ annonces_id: annonces_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.invitation = async (req, res) => {
    try {



        const { token } = req.params


        const result = await service.invitation(token);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.invitation_accept = async (req, res) => {
    try {

       
        const { password } = req.body
        const { token } = req.params


         const result = await service.invitation_accept({token,password});

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.entreprise_info = async (req, res) => {
    try {

        const { entreprise_id } = req.params


        const result = await service.entreprise_info({ entreprise_id: entreprise_id });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.entreprise_save_candidats = async (req, res) => {
    try {

        console.log(req.body)

        const { userId } = req.body

        const result = await service.entreprise_save_candidats({ userId: userId, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.appels_offres_enregistrer = async (req, res) => {
    try {

        const { criteres, nom } = req.body

        const result = await service.appels_offres_enregistrer({ criteres: criteres, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.postuler_annonce_appel_offre = async (req, res) => {
    try {


        console.log(req.body)

        const { annonce_id, nom, email, telephone, message, filenameBase } = req.body



        const result = await service.postuler_annonce_appel_offre({ user_id: req.userId, annonce_id, nom, email, telephone, message, filenameBase });


        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.postuler_annonce = async (req, res) => {
    try {

        const { annonce_id, lettre_motivation } = req.body

        const result = await service.postuler_annonce({ annonce_id, lettre_motivation, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};


exports.check_postulant = async (req, res) => {
    try {



        const result = await service.check_postulant({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.entreprise_info_data = async (req, res) => {
    try {

        console.log('tototototo')

        const result = await service.entreprise_info_data({ user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.appels_offres_by_page = async (req, res) => {
    try {

        const { pays, page, search } = req.params

        const result = await service.appels_offres_by_page({ pays: pays, page: page, search: search });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.appels_offres_recherche = async (req, res) => {
    try {

        const result = await service.appels_offres_recherche(req.body);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




exports.save_annonce = async (req, res) => {
    try {


        const { id, titre, type, user_info } = req.body

        const result = await service.save_annonce({ user_id: req.userId, id, titre, type, user_info });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};

exports.signaler_annonce = async (req, res) => {
    try {


        const { annonce_id, lettre_motivation } = req.body

        const result = await service.signaler_annonce({ annonce_id, lettre_motivation, user_id: req.userId });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};



exports.appels_offres_recherche_by_page = async (req, res) => {
    try {

        const result = await service.appels_offres_recherche_by_page(req.body);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: "Erreur interne" });
    }
};




