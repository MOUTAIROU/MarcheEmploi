const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCvRebriquesPersonnalisees = sequelize.define(
    "cand_cv_rebriques_personnalisees",
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
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        lien: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_rebriques_personnalisees",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCvRebriquesPersonnalisees;
