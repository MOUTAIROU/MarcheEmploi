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

    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    timestamps: true,
  }
);

module.exports = NotificationPreference;