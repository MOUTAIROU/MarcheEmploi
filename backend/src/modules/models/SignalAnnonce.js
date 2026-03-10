const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SignalAnnonce = sequelize.define(
    "signal_annonces",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // Annonce signalée
        annonce_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        // Utilisateur qui signale
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        // Message / motif du signalement
        message: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "signal_annonces",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["annonce_id", "user_id"], // ⛔ doublon interdit
            },
        ],
    }
);

module.exports = SignalAnnonce;
