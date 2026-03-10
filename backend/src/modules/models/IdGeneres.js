const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const IdGeneres = sequelize.define(
    "ids_generes",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        type: { // OFF, AOF, ENT
            type: DataTypes.STRING,
            allowNull: false
        },

        code: { // OFF-BJ-2025-1209-1001
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "ids_generes",
        timestamps: false
    }
);

module.exports = IdGeneres;
