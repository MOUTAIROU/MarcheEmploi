const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const AppelOffre = sequelize.define(
    "appel_offres_recrutement_consultant",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        post_id: {                    // Ex: CONS-BJ-2025-20251212-1000
            type: DataTypes.STRING,
            allowNull: false,
        },
        categorie: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        type: {                       // "recrutement_consultant"
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "recrutement_consultant",
        },

        objet: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        lieu: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        date_publication: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        date_limite: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        date_ouverture: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        visibilite: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },

        conditions: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },

        documents_requis: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },

        countryCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        filenameBase: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        statut: {
            type: DataTypes.ENUM("en_ligne", "expire", "delete", "hors_ligne"),
            defaultValue: "en_ligne",
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "appel_offres_recrutement_consultant",
        timestamps: false
    }
);

module.exports = AppelOffre;

