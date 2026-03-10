const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PresentationPublic = sequelize.define(
  "presentation_public",
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

    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    secteur: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    site: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    adresse: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },

    presentation: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },

    mission: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },

    valeurs: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },

    filenameBase: {
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
    tableName: "presentation_public",
    timestamps: true,
  }
);

module.exports = PresentationPublic;
