const User = require("../models/User");
const AjouterCollaborateur = require("../models/ajouterCollaborateur");

// 4️⃣ Repository
module.exports = {
    createUser: async (userData) => {


        try {
            const user = await User.create(userData);
            console.log("✅ User created:", user.email);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    },
    findUserByEmail: async (email) => {
        try {
            // Normaliser l'email
            const normalizedEmail = email.toLowerCase().trim();

            // 🔎 Chercher dans User
            let user = await User.findOne({ where: { email: normalizedEmail } });
            if (user) {
                console.log("✅ User found in User table:", user.email);
                return { isInvited: false, ...user.dataValues };
            }

            // 🔎 Si non trouvé, chercher dans Recruteur
            user = await AjouterCollaborateur.findOne({ where: { email: normalizedEmail } });
            if (user) {
                console.log("✅ User found in Recruteur table:", user.email);

                return { isInvited: true, ...user.dataValues };
            }

            // ⚠️ Si pas trouvé dans les deux tables
            console.log("⚠️ User not found:", email);
            return null;

        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    },
    findUserByID: async (id) => {

        console.log("findUserByID:", id)
        try {
            const user = await User.findOne({ where: { id } });
            if (user) console.log("✅ User found:", user.email);
            else console.log("⚠️ User not found:", email);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    }
};
