const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const OffreEmploi = sequelize.define(
  "offres_emploi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    post_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: false
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    },
    objet: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_publication: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lieu: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiration: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visibilite: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true
    },
    typeContrat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    typeContratAutre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    niveauEtudes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salaire: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    conditions: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    filenameBase: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM("en_ligne", "expire", "delete", "hors_ligne"),
      defaultValue: "en_ligne",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "offres_emploi",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
  }
);


module.exports = OffreEmploi;
