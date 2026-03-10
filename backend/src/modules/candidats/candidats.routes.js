const express = require("express");
const router = express.Router();
const controller = require("./candidats.controller");
const auth = require("../../middlewares/auth.middleware");



router.get("/annonce_post_id",
    auth, controller.annonce_post_id);

router.get("/entretien",
    auth, controller.entretien);



router.get("/all_qcm",
    auth, controller.all_qcm);

router.get("/get_qcm_by_post_id/:params",
    auth, controller.get_qcm_by_post_id);

router.patch("/entretien_status/:params",
    auth, controller.entretien_status);

router.patch("/entretien_status_groupe/:params",
    auth, controller.entretien_status_groupe);




router.post("/qcm_examin_exercice",
    auth, controller.qcm_examin_exercice);

router.get("/set_notification_read/:params",
    auth, controller.set_notification_read);

router.get("/mes_appel_offre_save/",
    auth, controller.mes_appel_offre_save);

router.get("/all_qcm/",
    auth, controller.all_qcm);

router.get("/entretien_detail/:params",
    auth, controller.entretien_detail);



router.delete("/detete_qcm_groupe/:params",
    auth, controller.detete_qcm_groupe);




router.delete("/se_retirer_offre/:params",
    auth, controller.se_retirer_offre);

router.delete("/candidats_detete_qcm/:params",
    auth, controller.candidats_detete_qcm);

router.delete("/se_retirer_offre_group/:params",
    auth, controller.se_retirer_offre_group);

router.delete("/delete_entretien/:params",
    auth, controller.delete_entretien);

router.delete("/delete_entretien_groupe/:params",
    auth, controller.delete_entretien_groupe);


module.exports = router;
