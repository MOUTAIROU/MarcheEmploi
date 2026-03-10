const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Annonce = sequelize.define(
    "save_annonces",
    {
        // ID interne (auto)
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // ID public de l'annonce (ex: AOF-BJ-2025-20251213-1006)
        post_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // Utilisateur qui publie l'annonce
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        // Nom / info de l'utilisateur (entreprise, organisation)
        user_info: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // Titre de l'annonce
        titre: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },

        // Type d'annonce : consultation, appel_offre, recrutement, etc.
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "save_annonces",
        timestamps: false,
    }
);

module.exports = Annonce;
