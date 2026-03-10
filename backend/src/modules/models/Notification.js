const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Notification = sequelize.define(
  "notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true, // contiendra type, message, titre, etc.
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
    tableName: "notifications",
    timestamps: true,
    indexes: [
      {
        fields: ["receiver_id"],
      },
    ],
  }
);

module.exports = Notification;
