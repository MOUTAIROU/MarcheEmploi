const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const EntrepriseInformation = sequelize.define(
    "entreprise_information",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        nom_legal: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        ifu: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        type_entreprise: DataTypes.STRING,
        taille: DataTypes.STRING,
        domaine: DataTypes.STRING,
        pays: DataTypes.STRING,
        ville: DataTypes.STRING,
        adresse: DataTypes.STRING,
        telephone: DataTypes.STRING,

        email: {
            type: DataTypes.STRING,
            validate: { isEmail: true },
        },

        /* =====================
           KYC DOCUMENTS
        ===================== */
        rccm_file: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        ifu_file: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        /* =====================
           KYC STATUS
        ===================== */
        kyc_status: {
            type: DataTypes.ENUM(
                "not_submitted",
                "pending",
                "approved",
                "rejected",
                "submitted"
            ),
            defaultValue: "pending",
        },

        kyc_submitted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        kyc_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        kyc_reject_reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        /* =====================
           PARAMETRES ENTREPRISE
        ===================== */
        rh_nom: DataTypes.STRING,
        rh_email: DataTypes.STRING,
        rh_tel: DataTypes.STRING,

        fuseau: DataTypes.STRING,
        langue: DataTypes.STRING,

        enable2FA: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        ip_autorisees: DataTypes.JSON,
        planning: DataTypes.JSON,
        countryCode: DataTypes.STRING,

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "entreprise_information",
        timestamps: false,
    }
);

module.exports = EntrepriseInformation;
