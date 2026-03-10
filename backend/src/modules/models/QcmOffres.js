const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const QcmOffres = sequelize.define(
    "qcm_offres",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        qcm_id: {
            type: DataTypes.STRING(50), // ex: QCM-BJ-2026-20260129-1005
            allowNull: false,
        },
        offre_id: {
            type:DataTypes.STRING(50), // ex: OFF-BJ-2026-20260129-1002
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "qcm_offres",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["qcm_id", "offre_id"], // 🔐 évite doublons
            },
        ],
    }
);

module.exports = QcmOffres;
