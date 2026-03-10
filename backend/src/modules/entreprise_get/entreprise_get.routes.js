const express = require("express");
const router = express.Router();
const controller = require("./entreprise.controller");
const auth = require("../../middlewares/auth.middleware");
const { upload, convertToWebP } = require("../../middlewares/upload.middleware");

const uploadPDF = require("../../middlewares/uploadPDF.middleware");

// Routes
//router.get("/", userController.getAllUsers);
//router.get("/:id", userController.getUserById);
//router.put("/:id", upload.single("avatar"), userController.updateUser);


router.get("/offres",
    auth, controller.offres);




router.get("/information_offres",
    auth, controller.information_offres);

router.get("/dashbord_starts",
    auth, controller.dashbord_starts);


router.get("/get_utilisateurs",
    auth, controller.get_utilisateurs);

router.get("/mes_condidatures",
    auth, controller.mes_condidatures);

router.get("/get_notification",
    auth, controller.get_notification);


router.get("/get_notification_preference",
    auth, controller.get_notification_preference);


router.get("/get_presentation_public",
    auth, controller.get_presentation_public);

router.post("/valider_note_question",
    auth, controller.valider_note_question);




router.get("/all_qcm",
    auth, controller.all_qcm);

router.get("/get_qcm_by_post_id/:params",
    auth, controller.get_qcm_by_post_id);


router.get("/search_offres", auth, controller.search_offres);


router.get("/get_offre_by_post_id/:params",
    auth, controller.get_offre_by_post_id);

router.get("/qcm_candidats_exame_detail/:userid/:qcmid",
    auth, controller.qcm_candidats_exame_detail);




router.get("/user_infomation/:params",
    auth, controller.user_infomation);


router.get("/entretiens",
    auth, controller.entretiens);

router.get("/get_entretiens_by_post_id/:params",
    auth, controller.get_entretiens_by_post_id);


router.get("/ami_offres_by_post_id/:params",
    auth, controller.ami_offres_by_post_id);

router.get("/appel_offres_by_post_id/:params",
    auth, controller.appel_offres_by_post_id);

router.get("/consultation_offres_by_post_id/:params",
    auth, controller.consultation_offres_by_post_id);

router.get("/emploi_offres_by_post_id/:params",
    auth, controller.emploi_offres_by_post_id);

router.get("/annonce_post_id",
    auth, controller.annonce_post_id);

router.get("/annonce_post_id_emploi_search_candidats",
    auth, controller.annonce_post_id_emploi_search_candidats);

router.get("/annonce_post_id_search_candidats",
    auth, controller.annonce_post_id_search_candidats);



router.get("/annonce_post_id_emploi",
    auth, controller.annonce_post_id_emploi);

router.get("/recrutement_offres_by_post_id/:params",
    auth, controller.recrutement_offres_by_post_id);

router.get("/get_lettre_motivation/:post_id/:offreId",
    auth, controller.get_lettre_motivation);

router.get("/get_cv_candidat/:post_id/:offreId",
    auth, controller.get_cv_candidat);

router.get("/get_cv_candidat_user_id/:post_id",
    auth, controller.get_cv_candidat_user_id);

router.get("/qcm_candidats_all/:post_id",
    auth, controller.qcm_candidats_all);




router.get("/mes_appel_offre_save",
    auth, controller.mes_appel_offre_save);

router.get("/mes_candidats_save",
    auth, controller.mes_candidats_save);

router.delete("/delete_offres/:params",
    auth, controller.delete_offres);

router.delete("/delete_offres_mes_candidature/:params",
    auth, controller.delete_offres_mes_candidature);


router.delete("/delete_offres_save/:params",
    auth, controller.delete_offres_save);

router.delete("/delete_candidats_save/:params",
    auth, controller.delete_candidats_save);






router.patch("/offres_status/:params/status",
    auth, controller.offres_status);

router.patch("/send_candidat_notification/:params",
    auth, controller.send_candidat_notification);

router.patch("/send_candidat_notification_emploi/:params",
    auth, controller.send_candidat_notification_emploi);

router.patch("/send_candidat_notification_emploi_contact/:params",
    auth, controller.send_candidat_notification_emploi_contact);

router.patch("/notifications_mark_as_read",
    auth, controller.notifications_mark_as_read);

router.post("/ajouter_offre_qcm/",
    auth, controller.ajouter_offre_qcm);

router.post("/retirer_offre_qcm/",
    auth, controller.retirer_offre_qcm);



router.delete("/delete_offres_groupe/:params",
    auth, controller.delete_offres_groupe);

router.delete("/delete_offres_mes_candidature_group/:params",
    auth, controller.delete_offres_mes_candidature_group);



router.delete("/delete_offres_save_groupe/:params",
    auth, controller.delete_offres_save_groupe);

router.delete("/delete_candidats_save_groupe/:params",
    auth, controller.delete_candidats_save_groupe);



router.patch("/offres_status_groupe/:params/status",
    auth, controller.offres_status_groupe);

router.patch("/send_candidat_changer_status/:params",
    auth, controller.send_candidat_changer_status);

router.patch("/send_candidat_changer_status_emploi/:params",
    auth, controller.send_candidat_changer_status_emploi);


router.patch("/send_candidat_changer_status_group/:params",
    auth, controller.send_candidat_changer_status_group);



router.patch("/send_candidat_changer_status_group_emploi/:params",
    auth, controller.send_candidat_changer_status_group_emploi);

router.patch("/associer_offre_qcm/:params",
    auth, controller.associer_offre_qcm);

router.patch("/associer_candidat_qcm/:params",
    auth, controller.associer_candidat_qcm);

router.delete("/send_candidat_delete_offres/:params",
    auth, controller.send_candidat_delete_offres);

router.delete("/detete_qcm/:params",
    auth, controller.detete_qcm);

router.delete("/detete_qcm_groupe/:params",
    auth, controller.detete_qcm_groupe);

router.delete("/send_candidat_delete_offresemploi/:params",
    auth, controller.send_candidat_delete_offresemploi);

router.patch("/detete_qcm_by_candidats/:params",
    auth, controller.detete_qcm_by_candidats);

router.patch("/detete_qcm_by_candidats_groupe/:params",
    auth, controller.detete_qcm_by_candidats_groupe);

router.patch("/entretien_notification/:params",
    auth, controller.entretien_notification);

router.patch("/entretien_notification_groupe/:params",
    auth, controller.entretien_notification_groupe);


router.delete("/send_candidat_delete_offres_group/:params",
    auth, controller.send_candidat_delete_offres_group);


router.delete("/detele_entretien/:params",
    auth, controller.detele_entretien);

router.delete("/detele_entretien_groupe/:params",
    auth, controller.detele_entretien_groupe);



router.delete("/send_candidat_delete_offres_emploi_groupe/:params",
    auth, controller.send_candidat_delete_offres_emploi_groupe);

router.patch("/by_candidats_send_msg/:params",
    auth, controller.send_qcm_by_candidats_notication);

router.patch("/send_candidat_notification_group/:params",
    auth, controller.send_candidat_notification_group);





router.patch("/send_candidat_notification_group_emploi/:params",
    auth, controller.send_candidat_notification_group_emploi);





module.exports = router;

