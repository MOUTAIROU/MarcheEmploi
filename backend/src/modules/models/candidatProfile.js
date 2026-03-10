const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ProfileCand = sequelize.define(
    "profile_cand",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,  // OBLIGATOIRE
        },
        user_id: {
            type: DataTypes.STRING(50)
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activite: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        infos: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        specialisation: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },

        filenameBase: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "profile_cand",
        timestamps: false, // si tu veux gérer createdAt manuellement
    }
);

module.exports = ProfileCand;
