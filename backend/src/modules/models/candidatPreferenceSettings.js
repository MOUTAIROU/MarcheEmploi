const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const candidatPreferenceSettings = sequelize.define(
    "preference_cand_settings",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
             type: DataTypes.STRING(50)
         },
        visibleProfil: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactDirect: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicProfil: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayBio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displaySkills: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayExperience: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        showCV: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        openToWork: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "preference_cand_settings",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = candidatPreferenceSettings;
