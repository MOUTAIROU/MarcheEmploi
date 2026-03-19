const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const CandParametre = sequelize.define(
  "cand_parametre",
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

    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    tel: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    photo_profil: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    activite: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    infos: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    specialisation: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "actif",
    }
  },
  {
    tableName: "cand_parametres",
    timestamps: true,


  }
);

module.exports = CandParametre;