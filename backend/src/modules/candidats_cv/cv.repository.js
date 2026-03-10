const candidatCvInformationPersonelle = require("../models/candidatCvInfoPersonnel");
const candidatCvProfil = require("../models/candidatCvProfil");
const CandidatFormation = require("../models/candidatCvFormation");
const ExperiencePro = require("../models/candidatCvExperiencePro");
const Competence = require("../models/candidatCvCompetence");
const Langues = require("../models/candidatCvLangues");
const Certificat = require("../models/candidatCvCertificat");
const Realisations = require("../models/candidatCvRealisations");
const RebriquesPersonnalisees = require("../models/candidatCvRebriquesPersonnalisees");
const CandidatCv = require("../models/candidatCv");

// 4️⃣ Repository
module.exports = {
    saveCVJson: async (user_id, profileData) => {

       

        try {
            // Supprimer l'ancien CV s'il existe
            await CandidatCv.destroy({ where: { user_id } });

            // Insérer le nouveau
            await CandidatCv.create({
                user_id,
                filenameBase: profileData.filenameBase || "",
                cv: profileData.cv || {},
            });
        } catch (err) {
            console.error("Erreur saveCVJson:", err);
            throw err;
        }
    },
    createCandidatInfo: async (userData) => {
        try {
            const user = await candidatCvInformationPersonelle.create(userData);
            console.log("✅ User created:", user.id);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    },
    foundCandidatInfo: async (user_id) => {

        console.log("findUserByID:", user_id)
        try {
            const user = await candidatCvInformationPersonelle.findOne({ where: { user_id } });
            if (user) console.log("✅ User found:", user.user_id);
            else console.log("⚠️ User not found:", user_id);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    },
    updateCandidatInfo: async (profileData) => {
        try {
            const { user_id, ...updates } = profileData;

            if (!user_id) {
                throw new Error("user_id is required for update");
            }

            // Mise à jour
            const [rowsUpdated] = await candidatCvInformationPersonelle.update(updates, {
                where: { user_id }
            });

            // rowsUpdated = nombre de lignes impactées
            if (rowsUpdated === 0) {
                console.log("⚠️ Aucun utilisateur mis à jour. Mauvais user_id ?", user_id);
                return null;
            }

            // Récupérer l'utilisateur mis à jour
            const updatedUser = await candidatCvInformationPersonelle.findOne({ where: { user_id } });

            console.log("✅ Profil mis à jour:", updatedUser.user_id);

            return updatedUser;

        } catch (err) {
            console.error("❌ Erreur updateProfile:", err);
            throw err;
        }
    },
    createCandidatProfil: async (userData) => {
        try {
            const user = await candidatCvProfil.create(userData);
            console.log("✅ Preference created:", user.user_id);
            return user;
        } catch (err) {
            console.error("❌ Error creating user:", err);
            throw err;
        }
    },
    foundCandidatProfil: async (user_id) => {

        console.log("findUserByID:", user_id)
        try {
            const user = await candidatCvProfil.findOne({ where: { user_id } });
            if (user) console.log("✅ User found:", user.user_id);
            else console.log("⚠️ User not found:", user_id);
            return user;
        } catch (err) {
            console.error("❌ Error finding user:", err);
            throw err;
        }
    },
    updateCandidatProfil: async (profileData) => {
        try {
            const { user_id, ...updates } = profileData;

            if (!user_id) {
                throw new Error("user_id is required for update");
            }

            // Mise à jour
            const [rowsUpdated] = await candidatCvProfil.update(updates, {
                where: { user_id }
            });

            // rowsUpdated = nombre de lignes impactées
            if (rowsUpdated === 0) {
                console.log("⚠️ Aucun utilisateur mis à jour. Mauvais user_id ?", user_id);
                return null;
            }

            // Récupérer l'utilisateur mis à jour
            const updatedUser = await candidatCvProfil.findOne({ where: { user_id } });

            console.log("✅ Profil mis à jour:", updatedUser.user_id);

            return updatedUser;

        } catch (err) {
            console.error("❌ Erreur updateProfile:", err);
            throw err;
        }
    },
    saveFormations: async (user_id, formations = []) => {
        try {

            // 1️⃣ Vérifier si des données existent déjà
            const existing = await CandidatFormation.findAll({ where: { user_id } });

            // 2️⃣ Si oui → supprimer
            if (existing.length > 0) {
                await CandidatFormation.destroy({ where: { user_id } });
                console.log("🗑️ Anciennes formations supprimées");
            }

            // 3️⃣ Insérer les nouvelles formations
            for (const f of formations) {
                await CandidatFormation.create({
                    user_id,
                    titre: f.titre || "",
                    etablissement: f.etablissement || "",
                    ville: f.ville || "",
                    debutMois: f.debutMois || "",
                    debutAnnee: f.debutAnnee || null,
                    finMois: f.finMois || "",
                    finAnnee: f.finAnnee || null,
                    enCours: f.enCours || false,
                    description: f.description || "",
                });
            }

            console.log("✅ Nouvelles formations enregistrées");
            return true;

        } catch (error) {
            console.error("❌ saveFormations error:", error);
            throw error;
        }
    },
    saveExperiencePro: async (user_id, experiences = []) => {
        try {
            // 1️⃣ Supprimer toutes les anciennes expériences
            await ExperiencePro.destroy({ where: { user_id } });

            // 2️⃣ Préparer les nouvelles données
            const records = experiences.map(exp => ({
                user_id,
                titre: exp.titre || "",
                etablissement: exp.etablissement || "",
                ville: exp.ville || "",
                debutMois: exp.debutMois || "",
                debutAnnee: exp.debutAnnee || null,
                finMois: exp.finMois || "",
                finAnnee: exp.finAnnee || null,
                enCours: exp.enCours ?? false,
                description: exp.description || ""
            }));

            // 3️⃣ Insérer en masse
            await ExperiencePro.bulkCreate(records);

            return { success: true };
        } catch (err) {
            console.error("❌ Erreur saveExperiencePro:", err);
            throw err;
        }
    },
    saveCompetences: async (user_id, competences = []) => {
        try {
            // 1️⃣ Supprimer les anciennes compétences
            await Competence.destroy({ where: { user_id } });

            // 2️⃣ Si aucune compétence envoyée → terminer proprement
            if (!Array.isArray(competences) || competences.length === 0) {
                return { success: true };
            }

            // 3️⃣ Préparer les nouvelles compétences
            const records = competences.map(c => ({
                user_id,
                nom: c.nom || "",
                niveau: c.niveau || ""
            }));

            // 4️⃣ Insertion en masse
            await Competence.bulkCreate(records);

            return { success: true };
        } catch (err) {
            console.error("❌ Erreur saveCompetences:", err);
            throw err;
        }
    },
    saveLangues: async (user_id, langues = []) => {

        try {
            // 1️⃣ Supprimer les anciennes compétences
            await Langues.destroy({ where: { user_id } });

            // 2️⃣ Si aucune compétence envoyée → terminer proprement
            if (!Array.isArray(langues) || langues.length === 0) {
                return { success: true };
            }

            // 3️⃣ Préparer les nouvelles compétences
            const records = langues.map(c => ({
                user_id,
                nom: c.nom || "",
                niveau: c.niveau || ""
            }));

            // 4️⃣ Insertion en masse
            await Langues.bulkCreate(records);

            return { success: true };
        } catch (err) {
            console.error("❌ Erreur saveCompetences:", err);
            throw err;
        }
    },
    saveCertificats: async (user_id, certificats = []) => {
        try {
            // 1️⃣ Supprimer les anciens certificats
            await Certificat.destroy({ where: { user_id } });

            // 2️⃣ Si le tableau est vide → stop
            if (!Array.isArray(certificats) || certificats.length === 0) {
                return { success: true };
            }

            // 3️⃣ Préparer les certificats à insérer
            const records = certificats.map(c => ({
                user_id,
                titre: c.titre || "",
                mois: c.mois || "",
                annee: c.annee || "",
                description: c.description || "",
                enCours: c.enCours || false
            }));

            // 4️⃣ Insérer en masse
            await Certificat.bulkCreate(records);

            return { success: true };
        } catch (err) {
            console.error("❌ Erreur saveCertificats:", err);
            throw err;
        }
    },
    saveRealisations: async (user_id, realisations = []) => {
        try {
            // Supprimer les anciennes données
            await Realisations.destroy({ where: { user_id } });

            if (!Array.isArray(realisations)) return;

            for (const r of realisations) {
                // r est une string → on enregistre directement
                await Realisations.create({
                    user_id,
                    texte: r || "",
                });
            }
        } catch (e) {
            console.error("Erreur saveRealisations:", e);
            throw e;
        }
    },
    saveRubriquesPersonnalisees: async (user_id, rubriquesPersonnalisees = []) => {

        try {
            // Supprimer les anciennes données
            await RebriquesPersonnalisees.destroy({ where: { user_id } });

            if (!Array.isArray(rubriquesPersonnalisees)) return;

            for (const item of rubriquesPersonnalisees) {
                await RebriquesPersonnalisees.create({
                    user_id,
                    titre: item.titre || "",
                    description: item.description || "",
                    lien: item.lien || "",
                    date: item.date || ""
                });
            }
        } catch (error) {
            console.error("Erreur saveSavoirFaire:", error);
            throw error;
        }
    },
    get_cand_envoie_cv: async (user_id) => {
            try {
    
                const get_offre = await CandidatCv.findOne({
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



};




