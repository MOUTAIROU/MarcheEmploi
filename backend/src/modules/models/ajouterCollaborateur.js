const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Collaborateur = sequelize.define(
  "collaborateur",
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
    status: {
      type: DataTypes.STRING,
      defaultValue: "actif"
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { isEmail: true },
    },

    role: {
      type: DataTypes.ENUM("admin", "recruteur"),
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },

    invite_token: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    invite_expire: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "collaborateurs",
    timestamps: true,

    indexes: [
      {
        name: "uniq_collab_user_email",
        unique: true,
        fields: ["user_id", "email"],
      },
    ],
  }
);

module.exports = Collaborateur;