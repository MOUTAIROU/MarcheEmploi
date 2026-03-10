// models/EntretienCandidat.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const EntretienCandidat = sequelize.define(
  "entretiens_candidats",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    post_id: {             // ID généré : ENT-FR-2025-1209-1000
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: false,
    },

    type: {                // "entretien" ou sous-type si besoin (ex: "entretien-telephonique")
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {             // utilisateur / recruteur qui crée l'entretien
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: true
    },

    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    candidat_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    candidat: {            // id du candidat (string / uuid selon ton modèle)
      type: DataTypes.STRING,
      allowNull: false,
    },

    offre: {               // id de l'offre associée (string)
      type: DataTypes.STRING,
      allowNull: true,
    },

    date: {                // date de l'entretien (YYYY-MM-DD)
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    heure: {               // heure prévue (HH:MM:SS) ou string
      type: DataTypes.TIME,
      allowNull: true,
    },

    duree: {               // durée en minutes
      type: DataTypes.STRING
    },

    responsable: {         // personne en charge (id ou nom)
      type: DataTypes.STRING,
      allowNull: true,
    },

    lien: {                // lien visioconf (zoom, meet...)
      type: DataTypes.STRING,
      allowNull: true,
    },

    lieu: {                // lieu physique ou adresse
      type: DataTypes.STRING,
      allowNull: true,
    },

    message: {             // message/notes pour le candidat
      type: DataTypes.TEXT("long"),
      allowNull: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },

    status: {             // message/notes pour le candidat
      type: DataTypes.ENUM(
        "PLANNED",   // Entretien programmé (invitation envoyée)
        "DONE",
        "REMOVED_BY_COMPANY",
        "REMOVED_BY_CANDIDAT",
        "CANDIDAT_CONFIRME",
        "CANDIDAT_REFUSE"    // Entretien terminé (effectué ou clos)
      ),
      defaultValue: "PLANNED",
    },

    filenameBase: {        // pièce jointe associée (ex: convocation.pdf)
      type: DataTypes.STRING,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "entretiens_candidats",
    timestamps: false, // on gère createdAt manuellement
  }
);

module.exports = EntretienCandidat;
