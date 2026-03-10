const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const NotificationPreference = sequelize.define(
  "notification_preferences",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
     type: DataTypes.STRING(50),
      allowNull: false,
    },

    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },

    // Chaque bloc de préférence est stocké en JSON
    candidat_postule: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    qcm_termine: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    entretien_programme: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    rappel_entretien: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    offre_expiree: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    facture: {
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
    tableName: "notification_preferences",
    timestamps: true, // permet de gérer createdAt et updatedAt automatiquement
  }
);

module.exports = NotificationPreference;
