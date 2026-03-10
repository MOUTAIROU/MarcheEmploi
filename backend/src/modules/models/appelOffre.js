const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const AppelOffre = sequelize.define(
    "appel_offres",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        post_id: {                // ID généré (AOF-BJ-2025-1209-1000)
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },

        type: {                  // "appel_offre"
            type: DataTypes.STRING,
            allowNull: false
        },

        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        categorie: {
            type: DataTypes.STRING,
            allowNull: false
        },

        countryCode: {
            type: DataTypes.STRING,
            allowNull: true
        },

        objet: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },

        lieu: {
            type: DataTypes.STRING,
            allowNull: true
        },

        expiration: {
            type: DataTypes.STRING,
            allowNull: true
        },

        visibilite: {
            type: DataTypes.STRING,
            allowNull: true
        },

        date_limite: {
            type: DataTypes.STRING,
            allowNull: true
        },

        budget: {
            type: DataTypes.STRING,
            allowNull: true
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
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },


        filenameBase: {
            type: DataTypes.TEXT("long"),
            allowNull: true
        },
        // 🆕 Date de publication (datetime)
        date_publication: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // 🆕 Date d'ouverture des offres (datetime)
        date_ouverture: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: "appel_offres",
        timestamps: false
    }
);

module.exports = AppelOffre;
