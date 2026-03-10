const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCvInformationPersonelle = sequelize.define(
    "cand_cv_profil",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
             type: DataTypes.STRING(50)
         },
        profil: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_profil",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCvInformationPersonelle;
