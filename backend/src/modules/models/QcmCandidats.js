const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const QcmCandidats = sequelize.define(
    "qcm_candidats",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        qcm_id: {
            type: DataTypes.STRING(50), // QCM-BJ-2026-...
            allowNull: false,
        },
        candidat_id: {
            type: DataTypes.STRING(50), // ID candidature ou candidat
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("ASSIGNED", "IN_PROGRESS", "COMPLETED", "REMOVED_BY_COMPANY", "DELETED_BY_CANDIDAT"),
            defaultValue: "ASSIGNED",
        },

        startDate: {
            type: DataTypes.DATE,
        },

        endDate: {
            type: DataTypes.DATE,
        },

        removed_at: {
            type: DataTypes.DATE,
        },
        assigned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "qcm_candidats",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["qcm_id", "candidat_id"], // 🔐 pas de doublon
            },
        ],
    }
);




module.exports = QcmCandidats;
