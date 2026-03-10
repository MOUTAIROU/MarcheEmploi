const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const QcmCandidats = sequelize.define(
    "qcm_examens_candidats",
    {

        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        qcm_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        reponses: {
            type: DataTypes.JSON,
            allowNull: false,
        },

        antiFraudeLogs: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        totalTimeSeconds: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        raisonFinale: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        statut: {
            type: DataTypes.STRING(30),
            defaultValue: "COMPLETED"
        },
        assigned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

    },
    {
        tableName: "qcm_examens_candidats",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["qcm_id", "user_id"]
            }
        ]

    }
);




module.exports = QcmCandidats;
