const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { UPDATE } = require("sequelize/lib/query-types");

const ExamenQcm = sequelize.define(
    "examen_qcms",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        post_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false    // ID généré (QCM-BJ-2025-1209-1000)
        },

        type: {
            type: DataTypes.STRING,   // "examen_qcm"
            allowNull: false
        },

        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        offreId: {
            type: DataTypes.STRING,   // ID de l'offre d'emploi
            allowNull: true
        },

        titre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        categorie: {
            type: DataTypes.STRING,
            allowNull: true
        },

        countryCode: {
            type: DataTypes.STRING,
            allowNull: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        duree: {
            type: DataTypes.STRING,
            allowNull: true
        },

        noteMin: {
            type: DataTypes.STRING,
            allowNull: true
        },

        mode: {
            type: DataTypes.STRING,
            allowNull: true
        },

        reponsesAleatoires: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        params: {
            type: DataTypes.JSON,    // règles, config
            allowNull: true
        },

        questions: {
            type: DataTypes.JSON,    // tableau des questions
            allowNull: true
        },

        tentatives: {
            type: DataTypes.STRING,
            allowNull: true
        },

        niveauGlobal: {
            type: DataTypes.STRING,
            allowNull: true
        },

        afficherResultat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        statut: {
            type: DataTypes.STRING,
            defaultValue: "APPLIED",
            // envoye | vu | shortlist | refuse | accepte
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "examen_qcms",
        timestamps: false
    }
);

module.exports = ExamenQcm;
