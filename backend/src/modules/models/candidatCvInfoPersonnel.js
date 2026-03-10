const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCvInformationPersonelle = sequelize.define(
    "cand_cv_perso_info",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
             type: DataTypes.STRING(50),
         },
        nom: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        permon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emploi_rechercher: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ville: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Adresse: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_perso_info",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCvInformationPersonelle;
