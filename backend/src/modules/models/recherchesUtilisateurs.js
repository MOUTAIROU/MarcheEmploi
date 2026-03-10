const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RechercheUtilisateur = sequelize.define(
    "recherches_utilisateurs",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // 🔑 Utilisateur (ou anonyme plus tard)
        user_id: {
            type: DataTypes.STRING(50), // 👈 LIMITER LA TAILLE
            allowNull: false,
        },

        // 🔍 Critères de recherche (JSON.stringify)
        criteres: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
            comment: "Critères de recherche en JSON",
        },

        // 🧠 Hash pour unicité logique (optionnel mais recommandé)
        criteres_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            comment: "Hash des critères pour éviter doublons",
        },

        // ⭐ Dernière recherche = priorité SEO
        est_active_seo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: "Indique la recherche la plus récente pour le SEO",
        },

        // 🔁 Nombre de fois utilisée
        nb_recherches: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },

        // 📅 Dernière utilisation
        derniere_utilisation: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        // ⏳ Expiration SEO (6 mois)
        date_expiration: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "Date d'expiration SEO (6 mois)",
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
        tableName: "recherches_utilisateurs",
        timestamps: false,
        indexes: [
            {
                fields: ["user_id"],
            },
            {
                fields: ["criteres_hash"],
            },
        ],
    }
);

module.exports = RechercheUtilisateur;
