const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// 1️⃣ Connexion à la base
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false //Pour true => console.log // active le logging pour voir les requêtes SQL
    }
);

// 2️⃣ Définition du modèle User
const User = sequelize.define("User", {
    id: { type: DataTypes.STRING, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("candidat", "entreprise", "freelance"), allowNull: false },
    pays: { type: DataTypes.STRING, allowNull: false },
    codePays: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: "users",
    timestamps: true
});

// 3️⃣ Tester la connexion et la création de table
(async () => {
    try {
        await sequelize.authenticate(); // test de connexion
        console.log("✅ MySQL connection established successfully.");

        await sequelize.sync({ alter: true }); // création ou mise à jour table
        console.log("✅ Table 'users' synced successfully.");
    } catch (err) {
        console.error("❌ Unable to connect to the database:", err);
    }
})();

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

        console.log("findUserByEmail:", email)
        try {
            const user = await User.findOne({ where: { email } });
            if (user) console.log("✅ User found:", user.email);
            else console.log("⚠️ User not found:", email);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    }
};
