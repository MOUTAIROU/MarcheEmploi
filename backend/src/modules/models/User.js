const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const User = sequelize.define("User", {
    id: { type: DataTypes.STRING(50), primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("candidat", "entreprise", "recruteur", "freelance"), allowNull: false },
    pays: { type: DataTypes.STRING, allowNull: false },
    status: {
        type: DataTypes.ENUM("active", "delete_by_user", "desativer_by_systeme"),
        defaultValue: "active"
    },
    candidate_type: {
        type: DataTypes.ENUM("simple", "consultant","entreprise"),
        allowNull: false,
        defaultValue: "simple", // ← valeur par défaut pour éviter les erreurs
    },
    codePays: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: "users",
    timestamps: true
});

module.exports = User;
