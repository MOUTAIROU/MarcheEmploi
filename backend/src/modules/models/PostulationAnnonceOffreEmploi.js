const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PostulationAnnonceOffreEmploi = sequelize.define(
    "postulation_annonces_offre_emploi",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.STRING(50), // ✅ IMPORTANT,
            allowNull: false,
        },

        annonce_id: {
            type: DataTypes.STRING(50), // ✅ IMPORTANT
            allowNull: false,
        },

        lettre_motivation: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },


        statut: {
            type: DataTypes.ENUM(
                "APPLIED",            // viens de postuler
                "WAITING_EXAM",       // QCM assigné
                "DELETED_BY_COMPANY", // supprimé par l'entreprise
                "DELETED_BY_CANDIDAT", // supprimé par le candidat
                "COMPLETED",          // QCM terminé
                "ENTRETIEN_PROGRAMME", // entretien programmé
                "PENDING",            // en attente de décision
                "ACCEPTE",            // candidat retenu
                "REJETE",            // candidat non retenu
                "OFFER_PAUSED",     // "Annonce temporairement suspendue"
                "OFFER_REPUBLISHED",  // Annonce de nouveau active
                "OFFER_CLOSED",    // Annonce clôturée
                "delete", // supprimer
                "expire" // annnonce expirer
                
            ),
            defaultValue: "APPLIED",
        },

        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            // ex: { cv: true, pdf: true, source: "web" }
        },

        // tab de notification
        tab_notification: {
            type: DataTypes.JSON,
            allowNull: false,
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
        tableName: "postulation_annonces_offre_emploi",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "annonce_id"], // 🔒 anti double postulation
            },
        ],
    }
);

module.exports = PostulationAnnonceOffreEmploi;
