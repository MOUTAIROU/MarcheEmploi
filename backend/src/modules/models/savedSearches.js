const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SavedSearches = sequelize.define(
    "saved_searches",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // Utilisateur propriétaire de la recherche
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        // Critères de recherche (snapshot JSON)
        criteres_json: {
            type: DataTypes.JSON,
            allowNull: false,
        },

        // Phrase lisible / résumé automatique (optionnel)
        resume: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "saved_searches",
        timestamps: false, // on gère createdAt / updatedAt manuellement
    }
);

module.exports = SavedSearches;
