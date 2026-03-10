const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const NotesEntretien = sequelize.define(
    "notes_entretien",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // L'utilisateur (recruteur) qui dépose la note
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        // Entretien concerné
        entretienId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // Note (sur 20 ou autre)
        note: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
                max: 20, // tu peux changer
            },
        },

        // Commentaire en texte libre
        commentaire: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "notes_entretien",
        timestamps: false,
    }
);

module.exports = NotesEntretien;
