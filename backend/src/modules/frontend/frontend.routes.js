const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const controller = require("./frontend.controller");

const uploadPDF = require("../../middlewares/uploadPDF.middleware");



router.get("/appels_offres/:params", controller.appels_offres);

router.get("/annonces/:annonces_id", controller.annonces);

router.get("/invitation/:token", controller.invitation);

router.patch("/invitation_accept/:token", controller.invitation_accept);


router.get("/entreprise_info/:entreprise_id", controller.entreprise_info);

router.get("/check_postulant", auth, controller.check_postulant);

router.get("/entreprise_info_data", auth, controller.entreprise_info_data);



router.get("/appels_offres_by_page/:pays/:page/:search", controller.appels_offres_by_page);

router.post("/appels_offres_recherche", controller.appels_offres_recherche);

router.post("/entreprises_candidats_recherche", auth, controller.entreprises_candidats_recherche);

router.post("/candidat_recherche_emploi_save", auth, controller.candidat_recherche_emploi_save);

router.post("/candidat_recherche_emploi", auth, controller.candidat_recherche_emploi);


router.post("/appels_offres_enregistrer", auth, controller.appels_offres_enregistrer);

router.post("/appels_offres_recherche_by_page", auth, controller.appels_offres_recherche_by_page);

router.post("/candidat_recherche_emploi_by_page", auth, controller.candidat_recherche_emploi_by_page);

router.post("/postuler_annonce", auth, controller.postuler_annonce);

router.post("/postuler_annonce_appel_offre", auth, uploadPDF.single("fichier"), controller.postuler_annonce_appel_offre);

router.post("/save_annonce", auth, controller.save_annonce);

router.post("/signaler_annonce", auth, controller.signaler_annonce);

router.post("/entreprise_save_candidats", auth, controller.entreprise_save_candidats);





module.exports = router;