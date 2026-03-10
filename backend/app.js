const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const http = require("http"); // 🔥 Il manquait cette ligne !

const corsMiddleware = require("./src/modules/cors/cors.middleware");
const { initSocket } = require("./socket/socketServer");
const path = require("path");

const {update_offres_status} = require("./src/modules/entreprise_get/entreprise.repository")


dotenv.config();

const app = express();
const server = http.createServer(app); // ✔️ maintenant http existe

app.use(helmet());
app.use(express.json());
app.use(corsMiddleware);

app.use("/uploads", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"), {
        maxAge: "1d",
        index: false,
    })
);

// Initialiser le socket
initSocket(server);

(async () => {
  console.log("🕒 Démarrage du service de renouvellement automatique...");
  await update_offres_status(); // Premier appel immédiat

  // ➤ toutes les 5 minutes
  setInterval(update_offres_status, 5 * 60 * 1000);
})();

// Routes Modules
app.use("/auth", require("./src/modules/auth/auth.routes"));
app.use("/users", require("./src/modules/users/user.routes"));
app.use("/candidats_cv", require("./src/modules/candidats_cv/cv.routes"));
app.use("/entreprise", require("./src/modules/entreprise/entreprise.routes"));
app.use("/frontend", require("./src/modules/frontend/frontend.routes"));
app.use("/entreprise_get", require("./src/modules/entreprise_get/entreprise_get.routes"));
app.use("/candidats", require("./src/modules/candidats/candidats.routes"));


module.exports = server;
