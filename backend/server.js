// ⚠️ importer les modèles et les associations avant de sync
require("./src/modules/models/associations"); // <-- ici

const app = require("./app.js");

const sequelize = require("./src/config/database");



(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ MySQL connected");

        // Synchronisation avec ALTER pour mettre à jour la table sans supprimer les données
        await sequelize.sync({ alter: true });
        console.log("✅ Models synced (alter:true)");

    } catch (err) {
        console.error("❌ Database error:", err);
    }
})();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
