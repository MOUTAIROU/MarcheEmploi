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
        settings: {
            type: DataTypes.JSON, // ou JSONB si PostgreSQL
            allowNull: false,
            defaultValue: {
                emploi: {
                    enabled: true,
                    channels: ["email"],
                    frequency: "immediate",
                },
                actualites: {
                    enabled: true,
                    channels: ["email"],
                    frequency: "daily",
                },
                entretien: {
                    enabled: true,
                    channels: ["email"],
                    frequency: "immediate",
                },
                whatsapp: {
                    enabled: false,
                    channels: ["whatsapp"],
                    frequency: "immediate",
                },
            },
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
