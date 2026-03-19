const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const auth = require("../../middlewares/auth.middleware"); 
const { upload, convertToWebP } = require("../../middlewares/upload.middleware");


// Routes
//router.get("/", controller.getAllUsers);
//router.get("/:id", controller.getUserById);
//router.put("/:id", upload.single("avatar"), controller.updateUser);
router.post("/cand_profile",
    auth,
    upload,
    async (req, res, next) => {
        try {
            await convertToWebP(req.files,req);
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur conversion image" });
        }
    },auth, controller.cand_profile);

router.post("/cand_parametre_info",
    auth,
    upload,
    async (req, res, next) => {
        try {
            await convertToWebP(req.files,req);
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur conversion image" });
        }
    },auth, controller.cand_parametre_info);

    
router.post("/cand_preferences",auth, controller.cand_preferences);

router.post("/cand_profile_settings",auth, controller.cand_profile_settings);

router.get("/get_cand_profile",auth, controller.get_cand_profile);

router.get("/get_user_data",auth, controller.get_user_data);

router.get("/get_cand_parametre_info",auth, controller.get_cand_parametre_info);

router.post("/delete_user",auth, controller.delete_user);

router.get("/get_cand_preferences",auth, controller.get_cand_preferences);

router.get("/get_cand_profile_settings",auth, controller.get_cand_profile_settings);

router.get("/get_presentatation_public",auth, controller.get_presentatation_public);



module.exports = router;
