const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCvInformationPersonelle = sequelize.define(
    "cand_cv_certificats",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
            type: DataTypes.STRING(50)
        },
        titre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mois: {
            type: DataTypes.STRING,
            allowNull: true
        },
        annee: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        enCours: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_certificats",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCvInformationPersonelle;
