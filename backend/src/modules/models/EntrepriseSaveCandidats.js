const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const EntrepriseSaveCandidats = sequelize.define(
  "entreprise_save_candidats",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // L'entreprise qui enregistre le candidat
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // Le candidat enregistré
    candidate_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "entreprise_save_candidats",
    timestamps: false,
  }
);

module.exports = EntrepriseSaveCandidats;
