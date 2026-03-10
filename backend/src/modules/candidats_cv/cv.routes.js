const express = require("express");
const router = express.Router();
const controller = require("./cv.controller");
const auth = require("../../middlewares/auth.middleware");
const { upload, convertToWebP } = require("../../middlewares/upload.middleware");


// Routes
//router.get("/", controller.getAllUsers);
//router.get("/:id", controller.getUserById);
//router.put("/:id", upload.single("avatar"), controller.updateUser);
router.post("/cand_envoie_cv",
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
    }, controller.cand_envoie_cv);



router.get("/get_cand_envoie_cv", auth, controller.get_cand_envoie_cv);



module.exports = router;
