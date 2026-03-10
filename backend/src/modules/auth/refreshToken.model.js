const RefreshToken = require("../models/RefreshToken.js");

// 4️⃣ Repository
module.exports = {
    create: async (userToken) => {

        try {
            const user = await RefreshToken.create(userToken);
            console.log("✅ token token:", userToken.token);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    }
};