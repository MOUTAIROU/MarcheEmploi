const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const candidatCv = sequelize.define(
    "cand_cv_json",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        filenameBase: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        cv: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "cand_cv_json",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatCv;
