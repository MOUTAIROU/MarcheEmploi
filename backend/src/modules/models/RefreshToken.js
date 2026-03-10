const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RefreshToken = sequelize.define("RefreshToken", {
  token: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, { tableName: "refresh_tokens", timestamps: true });

module.exports = RefreshToken;