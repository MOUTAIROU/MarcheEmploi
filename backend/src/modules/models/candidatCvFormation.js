const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCvInformationPersonelle = sequelize.define(
    "cand_cv_formation",
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
        etablissement: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ville: {
            type: DataTypes.STRING,
            allowNull: true
        },
        debutMois: {
            type: DataTypes.STRING,
            allowNull: true
        },
        debutAnnee: {
            type:
                DataTypes.INTEGER,
            allowNull: true
        },
        finMois: {
            type: DataTypes.STRING,
            allowNull: true
        },
        finAnnee: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        enCours: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_formation",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCvInformationPersonelle;
