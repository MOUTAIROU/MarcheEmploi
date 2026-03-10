const express = require("express");
const router = express.Router();
const controller = require("./entreprise.controller");
const auth = require("../../middlewares/auth.middleware");
const { upload, convertToWebP } = require("../../middlewares/upload.middleware");

const uploadPDF = require("../../middlewares/uploadPDF.middleware");
const uploadMultiplePDF = require("../../middlewares/uploadMultiplePDF.middleware");

// Routes
//router.get("/", userController.getAllUsers);
//router.get("/:id", userController.getUserById);
//router.put("/:id", upload.single("avatar"), userController.updateUser);


router.post("/create_offre_emploi",
    auth,
    uploadPDF.single("fichier"), controller.create_offre_emploi);

router.post("/create_recrutement_consultant",
    auth,
    uploadPDF.single("fichier"), controller.create_recrutement_consultant);

router.patch("/modifer_colaborateur/:params",
    auth, controller.modifer_colaborateur);

router.delete("/detele_colaborateur/:params",
    auth, controller.detele_colaborateur);

    router.delete("/delete_collaborateurs_groupe/:params",
    auth, controller.delete_collaborateurs_groupe);

    

router.post("/create_consultation",
    auth,
    uploadPDF.single("fichier"), controller.create_consultation);
router.post("/create_ami",
    auth,
    uploadPDF.single("fichier"), controller.create_ami);


router.post("/create_appel_offre",
    auth,
    uploadPDF.single("fichier"), controller.create_appel_offre);

router.post("/associer_qcm_offre",
    auth,
    uploadPDF.single("fichier"), controller.associer_qcm_offre);

router.post("/entretien_candidat",
    auth,
    uploadPDF.single("fichier"), controller.entretien_candidat);
router.post("/create_qcm",
    auth, controller.create_qcm);

router.post("/update_qcm",
    auth, controller.update_qcm);


router.post("/create_entretien",
    auth,
    uploadPDF.single("fichier"), controller.create_entretien);

router.post("/create_note_entretien",
    auth,
    uploadPDF.single("fichier"), controller.create_note_entretien);




router.post("/create_information",
    auth,
    uploadMultiplePDF.fields([
        { name: "ifu_doc", maxCount: 1 },
        { name: "rccm", maxCount: 1 },
    ]),
    controller.create_information);

router.post("/notification_preference",
    auth, controller.notification_preference);

router.post("/presentation_public",
    auth,
    upload,
    async (req, res, next) => {
        try {
            await convertToWebP(req.files, req);
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur conversion image" });
        }
    },
    controller.presentation_public);

router.post("/ajouter_colloborateur",
    auth, controller.ajouter_colloborateur);


router.post("/update_offre_emploi",
    auth,
    uploadPDF.single("fichier"), controller.update_offre_emploi);

router.post("/update_ami",
    auth,
    uploadPDF.single("fichier"), controller.update_ami);

router.post("/update_appel_offre",
    auth,
    uploadPDF.single("fichier"), controller.update_appel_offre);

router.post("/update_recrutement_consultant",
    auth,
    uploadPDF.single("fichier"), controller.update_recrutement_consultant);

router.post("/update_consultation",
    auth,
    uploadPDF.single("fichier"), controller.update_consultation);
router.post("/update_entretien",
    auth,
    uploadPDF.single("fichier"), controller.update_entretien);











module.exports = router;
