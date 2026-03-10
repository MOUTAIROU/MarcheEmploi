const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PostulationAppelOffre = sequelize.define(
    "postulation_appel_offre",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // 🔑 Candidat (peut être un compte ou un invité)
        user_id: {
            type: DataTypes.STRING(50), // ✅ IMPORTANT,
            allowNull: false,
        },

        // 📄 Identifiant de l'appel d'offre
        annonce_id: {
            type: DataTypes.STRING(50), // ✅ IMPORTANT,
            allowNull: false,
        },

        // 🏢 Nom ou raison sociale
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // 📧 Email professionnel
        email: {
            type: DataTypes.STRING,
            allowNull: false,
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
            defaultValue: "APPLIED"
            // envoye | vu | shortlist | refuse | accepte
        },

        // 📞 Téléphone
        telephone: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // 📝 Lettre de motivation / proposition
        lettre_motivation: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },

        // 📎 Fichier PDF (optionnel)
        fichier_pdf: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // tab de notification
        tab_notification: {
            type: DataTypes.JSON,
            allowNull: false,
        },

        // 🧩 Métadonnées (IP, navigateur, source, etc.)
        metadata: {
            type: DataTypes.JSON,
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
        tableName: "postulation_appel_offre",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "annonce_id"], // 🚫 empêche double postulation
            },
        ],
    }
);

module.exports = PostulationAppelOffre;
