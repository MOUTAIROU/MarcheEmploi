const Candidat = require("../models/candidatProfile");

const CandidatPreference = require("../models/candidatPreference");

const CandidatPreferenceSettings = require("../models/candidatPreferenceSettings");

const CandidatCv = require("../models/candidatCv");

// 4️⃣ Repository
module.exports = {
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

        console.log("findUserByID:", user_id)
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


            console.log(get_offre)

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




