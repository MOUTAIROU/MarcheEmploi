const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCvRealisation = sequelize.define(
    "cand_cv_realisation",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
            type: DataTypes.STRING(50)
        },
        texte: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_realisation",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCvRealisation;
