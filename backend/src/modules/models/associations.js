const User = require("./User");
const PostulationAnnonceOffreEmploi = require("./PostulationAnnonceOffreEmploi");
const PostulationAppelOffre = require("./PostulationAppelOffre");

// 🔹 Configuration commune pour user_id
const userForeignKey = {
    name: "user_id",
    allowNull: false
};

const associationOptions = {
    foreignKey: userForeignKey,
    constraints: false
};

// 🔹 Relations belongsTo (candidature -> utilisateur)
PostulationAnnonceOffreEmploi.belongsTo(User, {
    ...associationOptions,
    targetKey: "id"
});

PostulationAppelOffre.belongsTo(User, {
    ...associationOptions,
    targetKey: "id"
});

// 🔹 Relations hasMany (utilisateur -> candidatures)
User.hasMany(PostulationAnnonceOffreEmploi, {
    ...associationOptions,
    sourceKey: "id"
});

User.hasMany(PostulationAppelOffre, {
    ...associationOptions,
    sourceKey: "id"
});

module.exports = {
    User,
    PostulationAnnonceOffreEmploi,
    PostulationAppelOffre
};