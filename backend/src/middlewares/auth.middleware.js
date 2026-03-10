const jwt = require("jsonwebtoken");
const { JWT_EXPIRES, REFRESH_EXPIRES, JWT_SECRET, REFRESH_SECRET } = require("../../utils/constants");


module.exports = function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token manquant" });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Token invalide ou expiré" });
        }


        // 🔹 Ajouter userId pour le contrôleur et le service
        req.userId = decoded.id || decoded.userId;


        next(); // continuer vers le contrôleur
    } catch (err) {
        return res.status(500).json({ error: "Erreur interne auth" });
    }
};
