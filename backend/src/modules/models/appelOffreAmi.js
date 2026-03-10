const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const AppelOffre = sequelize.define(
    "appel_offres_ami",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        categorie: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {                  // "appel_offre"
            type: DataTypes.STRING,
            allowNull: false
        },

        objet: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        lieu: {
            type: DataTypes.STRING,
            allowNull: false,
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

        countryCode: {
            type: DataTypes.STRING(5),
            allowNull: false,
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
        tableName: "appel_offres_ami",
        timestamps: false
    }
);

module.exports = AppelOffre;

