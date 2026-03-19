const { Sequelize } = require('sequelize'); // si Node.js CommonJS

const sequelize = require("../../config/database"); // chemin de ton fichier
const Candidat = require("../models/candidatProfile");

const CandidatPreference = require("../models/candidatPreference");

const CandidatPreferenceSettings = require("../models/candidatPreferenceSettings");

const CandidatCv = require("../models/candidatCv");

const CandParametre = require("../models/CandParametre");

const User = require("../models/User");
const { raw } = require('express');



// 4️⃣ Repository
module.exports = {

    get_user_data: async (data) => {
        try {


            const { user_id } = data;

            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants"
                };
            }

            const user = await User.findOne({
                where: { id: user_id },
                attributes: ["id", "nom"],
                raw: true
            });

            // ❌ utilisateur non trouvé
            if (!user) {
                return {
                    status: "error",
                    message: "Utilisateur introuvable"
                };
            }

            // ✅ succès
            return {
                status: "success",
                data: user
            };

        } catch (err) {
            console.error("❌ Error fetching candidat parametre info:", err);

            return {
                status: "error",
                message: "Erreur lors de la récupération des paramètres"
            };
        }
    },

    delete_user: async (data) => {
        try {
            const { user_id } = data;

            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants"
                };
            }

            // 🔍 Vérifier si l'utilisateur existe
            const user = await User.findOne({
                where: { id: user_id },
                attributes: ["id", "nom", "status"],
                raw: true
            });

            if (!user) {
                return {
                    status: "error",
                    message: "Utilisateur introuvable"
                };
            }

            // ⚠️ Déjà supprimé
            if (user.status === "delete_by_user") {
                return {
                    status: "error",
                    message: "Compte déjà désactivé"
                };
            }

            // 🔄 Mise à jour du status (soft delete)
            await User.update(
                { status: "delete_by_user" },
                { where: { id: user_id } }
            );

            // ✅ Réponse
            return {
                status: "success",
                message: "Compte désactivé avec succès",
                data: {
                    id: user.id,
                    nom: user.nom,
                    status: "delete_by_user"
                }
            };

        } catch (err) {
            console.error("❌ Error deleting user:", err);

            return {
                status: "error",
                message: "Erreur lors de la désactivation du compte"
            };
        }
    },

    get_cand_parametre_info: async (data) => {
        try {
            const { user_id } = data;

            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants"
                };
            }

            // 🔹 Requête SQL pour joindre User et CandParametre
            const query = `
                SELECT 
                u.nom,
                u.email,
                c.username,
                c.tel,
                c.photo_profil,
                c.activite,
                c.infos,
                c.specialisation
                FROM users u
                LEFT JOIN cand_parametres c
                ON u.id = c.user_id
                WHERE u.id = :user_id
                LIMIT 1
                `;

            const [results] = await sequelize.query(query, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!results) {
                return {
                    status: "error",
                    message: "Aucun profil trouvé pour cet utilisateur"
                };
            }

            // 🔹 Convertir specialisation JSON si nécessaire
            if (results.specialisation && typeof results.specialisation === "string") {
                try {
                    results.specialisation = JSON.parse(results.specialisation);
                } catch (err) {
                    results.specialisation = [];
                }
            }



            return {
                status: "success",
                data: results
            };

        } catch (err) {
            console.error("❌ Error fetching candidat parametre info:", err);

            return {
                status: "error",
                message: "Erreur lors de la récupération des paramètres"
            };
        }
    },
    cand_parametre_info: async (data) => {
        try {
            const { user_id, username, tel, filenameBase, activite, infos, specialisation } = data;

            if (!user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants"
                };
            }

            // Vérifier si le candidat existe déjà
            const existing = await CandParametre.findOne({ where: { user_id } });

            if (existing) {
                // Mise à jour des infos
                await existing.update({
                    username: username,
                    tel: tel,
                    photo_profil: filenameBase?.photo_profil,
                    activite: activite,
                    infos: infos,
                    specialisation: specialisation ? JSON.parse(specialisation) : null
                });

                return {
                    status: "success",
                    message: "Paramètres du candidat mis à jour avec succès"
                };
            } else {
                // Création d’un nouveau profil
                await CandParametre.create({
                    user_id: user_id,
                    username: username,
                    tel: tel,
                    photo_profil: filenameBase?.photo_profil,
                    activite: activite,
                    infos: infos,
                    specialisation: specialisation ? JSON.parse(specialisation) : null
                });

                return {
                    status: "success",
                    message: "Paramètres du candidat enregistrés avec succès"
                };
            }

        } catch (err) {
            console.error("❌ Error creating/updating candidat parametre:", err);

            return {
                status: "error",
                message: "Erreur lors de l'enregistrement des paramètres"
            };
        }
    },
    cand_preferences: async (data) => {
        try {



        } catch (err) {
            console.error("❌ Error creating/updating candidat parametre:", err);

            return {
                status: "error",
                message: "Erreur lors de l'enregistrement des paramètres"
            };
        }
    },
    createProfile: async (userData) => {
        try {
            const user = await Candidat.create(userData);
            console.log("✅ User created:", user.email);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    },
    foundProfil: async (user_id) => {

        try {
            const user = await Candidat.findOne({ where: { user_id } });
            if (user) console.log("✅ User found:", user.user_id);
            else console.log("⚠️ User not found:", user_id);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    },
    updateProfile: async (profileData) => {
        try {
            const { user_id, ...updates } = profileData;

            if (!user_id) {
                throw new Error("user_id is required for update");
            }

            // Mise à jour
            const [rowsUpdated] = await Candidat.update(updates, {
                where: { user_id }
            });

            // rowsUpdated = nombre de lignes impactées
            if (rowsUpdated === 0) {
                console.log("⚠️ Aucun utilisateur mis à jour. Mauvais user_id ?", user_id);
                return null;
            }

            // Récupérer l'utilisateur mis à jour
            const updatedUser = await Candidat.findOne({ where: { user_id } });

            console.log("✅ Profil mis à jour:", updatedUser.email);

            return updatedUser;

        } catch (err) {
            console.error("❌ Erreur updateProfile:", err);
            throw err;
        }
    },
    foundPreferences: async (user_id) => {

        console.log("findUserByID:", user_id)
        try {
            const user = await CandidatPreference.findOne({ where: { user_id } });
            if (user) console.log("✅ User found:", user.user_id);
            else console.log("⚠️ User not found:", user_id);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    },
    updatePreferences: async (profileData) => {
        try {
            const { user_id, ...updates } = profileData;

            if (!user_id) {
                throw new Error("user_id is required for update");
            }

            // Mise à jour
            const [rowsUpdated] = await CandidatPreference.update(updates, {
                where: { user_id }
            });

            // rowsUpdated = nombre de lignes impactées
            if (rowsUpdated === 0) {
                console.log("⚠️ Aucun utilisateur mis à jour. Mauvais user_id ?", user_id);
                return null;
            }

            // Récupérer l'utilisateur mis à jour
            const updatedUser = await CandidatPreference.findOne({ where: { user_id } });

            console.log("✅ Profil mis à jour:", updatedUser.user_id);

            return updatedUser;

        } catch (err) {
            console.error("❌ Erreur updateProfile:", err);
            throw err;
        }
    },
    createPreferences: async (userData) => {
        try {
            const user = await CandidatPreference.create(userData);
            console.log("✅ Preference created:", user.user_id);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    },
    foundPreferencesSettings: async (user_id) => {

        console.log("findUserByID:", user_id)
        try {
            const user = await CandidatPreferenceSettings.findOne({ where: { user_id } });
            if (user) console.log("✅ User found:", user.user_id);
            else console.log("⚠️ User not found:", user_id);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    },
    updatePreferencesSettings: async (profileData) => {
        try {
            const { user_id, ...updates } = profileData;

            if (!user_id) {
                throw new Error("user_id is required for update");
            }

            // Mise à jour
            const [rowsUpdated] = await CandidatPreferenceSettings.update(updates, {
                where: { user_id }
            });

            // rowsUpdated = nombre de lignes impactées
            if (rowsUpdated === 0) {
                console.log("⚠️ Aucun utilisateur mis à jour. Mauvais user_id ?", user_id);
                return null;
            }

            // Récupérer l'utilisateur mis à jour
            const updatedUser = await CandidatPreferenceSettings.findOne({ where: { user_id } });

            console.log("✅ Profil Settings mis à jour:", updatedUser.user_id);

            return updatedUser;

        } catch (err) {
            console.error("❌ Erreur updateProfile:", err);
            throw err;
        }
    },
    createPreferencesSettings: async (userData) => {
        try {
            const user = await CandidatPreferenceSettings.create(userData);
            console.log("✅ Preference Settings created:", user.user_id);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    },
    getCandProfile: async (user_id) => {
        try {

            const get_offre = await Candidat.findOne({
                where: { user_id },
                raw: true
            })


            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: get_offre,
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    get_cand_preferences: async (user_id) => {
        try {

            const get_offre = await CandidatPreference.findOne({
                where: { user_id },
                raw: true
            })


            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: get_offre,
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    get_cand_profile_settings: async (user_id) => {
        try {

            const get_offre = await CandidatPreferenceSettings.findOne({
                where: { user_id },
                raw: true
            })


            if (!get_offre) {
                return {
                    status: "success",
                    total: 0,
                    data: null,
                };
            } else {
                return {
                    status: "success",
                    total: get_offre.length,
                    data: get_offre,
                };
            }




        } catch (err) {
            console.error("Erreur saveAppelOffre:", err);
            throw err;
        }
    },
    get_presentatation_public: async (user_id) => {
        try {
            const informations = await CandidatCv.findOne({
                where: { user_id },
                raw: true
            });

            if (!informations || !informations.cv) {
                return {
                    status: "success",
                    data: null
                };
            }

            const { filenameBase, cv } = informations;

            const resultat = {
                formation: null,
                informations: {},
                profil: null,
                competences: []
            };

            /* =========================
               1️⃣ FORMATION (1 seule)
            ========================== */
            if (Array.isArray(cv["Formation"]) && cv["Formation"].length > 0) {
                resultat.formation = cv["Formation"][0];
            }

            /* =========================
               2️⃣ INFORMATIONS PERSONNELLES
            ========================== */
            if (cv["Informations personnelles"] && typeof cv["Informations personnelles"] === "object") {
                Object.entries(cv["Informations personnelles"]).forEach(([label, value]) => {
                    if (value) {
                        resultat.informations[label] = value;
                    }
                });
            }

            /* =========================
               3️⃣ PROFIL
            ========================== */
            if (typeof cv["Profil"] === "string" && cv["Profil"].trim() !== "") {
                resultat.profil = cv["Profil"];
            }

            /* =========================
               4️⃣ COMPÉTENCES
            ========================== */
            if (Array.isArray(cv["Compétences"])) {
                resultat.competences = cv["Compétences"];
            }


            return {
                status: "success",
                filenameBase,
                data: resultat
            };

        } catch (err) {
            console.error("Erreur get_presentatation_public:", err);
            throw err;
        }
    }






};




