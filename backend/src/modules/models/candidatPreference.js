const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const candidatPreference = sequelize.define(
    "preference_cand",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
            type: DataTypes.STRING(50)
        },
        // 🔥 NOUVEAU : toutes les préférences ici
       
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        email: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        internal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "preference_cand",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatPreference;
