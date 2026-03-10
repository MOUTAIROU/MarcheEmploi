const { cp } = require("fs");
const repository = require("./cv.repository");
const path = require("path");
module.exports = {
    /*cand_envoie_cv: async ({ cvObj, filenameBase, user_id }) => {


        await repository.saveCVJson(user_id, { filenameBase, cv:JSON.parse(cvObj) });
        let CV_Obj = JSON.parse(cvObj)
      
        // Extraction des différentes sections dans des variabl
        // es
        const informationsPersonnelles = CV_Obj['Informations personnelles'];
        const profil = CV_Obj.Profil;
        const formation = CV_Obj.Formation;
        const experiencePro = CV_Obj['Expérience professionnelle'];
        const competences = CV_Obj.Compétences;
        const langues = CV_Obj.Langue;
        const certificats = CV_Obj.Certificats;
        const realisations = CV_Obj['Réalisations'];
        const rubriquesPersonnalisees = CV_Obj['Rubrique personnalisée'];
       
        const informations = {
            user_id: user_id,
            nom: informationsPersonnelles['Prénom'] || "",
            permon: informationsPersonnelles['Nom de famille'] || "",
            emploi_rechercher: informationsPersonnelles['Emploi recherché'] || "",
            ville: informationsPersonnelles['Cotonou'] || "",
            Adresse: informationsPersonnelles['Apkapka'] || ""
        }

        let success = []
        const candidat_infos = await repository.foundCandidatInfo(user_id)
        if (candidat_infos) {

            await repository.updateCandidatInfo(informations);

            success.push('succes candidat_infos')

        } else {
            // Création de l'utilisateur
            await repository.createCandidatInfo(informations);

            success.push('succes candidat_infos')


        }

        
        if (profil.length > 0) {

            const data = {
                user_id: user_id,
                profil: profil || ""
            }


            const candidat_infos = await repository.foundCandidatProfil(user_id)
            if (candidat_infos) {
                console.log('update')

                await repository.updateCandidatProfil(data);

                success.push('succes candidat_profil')

            } else {
                // Création de l'utilisateur
                await repository.createCandidatProfil(data);

                success.push('succes candidat_profil')


            }

        }



        if (formation.length > 0) {

            await repository.saveFormations(user_id, formation)


        }

        if (experiencePro.length > 0) {

            await repository.saveExperiencePro(user_id, experiencePro)


        }
        if (competences.length > 0) {

            await repository.saveCompetences(user_id, competences)


        }


        if (langues.length > 0) {
            await repository.saveLangues(user_id, langues)
        }

        if (certificats.length > 0) {
            await repository.saveCertificats(user_id, certificats)
        }

        if (realisations.length > 0) {
            await repository.saveRealisations(user_id, realisations)
        }

         if (rubriquesPersonnalisees.length > 0) {
            await repository.saveRubriquesPersonnalisees(user_id, rubriquesPersonnalisees)
        }

                

       
    },*/
    cand_envoie_cv: async ({ cvObj, filenameBase, user_id }) => {
        try {
            if (!cvObj || !user_id) {
                return {
                    status: "error",
                    message: "Paramètres manquants",
                };
            }

            // 🔹 Parse sécurisé
            let CV_Obj;
            try {
                CV_Obj = JSON.parse(cvObj);
            } catch (err) {
                return {
                    status: "error",
                    message: "CV invalide (JSON incorrect)",
                };
            }

            // 🔹 Sauvegarde CV brut
            await repository.saveCVJson(user_id, {
                filenameBase,
                cv: CV_Obj,
            });

            // =========================
            // 🔹 EXTRACTION DES DONNÉES
            // =========================
            const informationsPersonnelles = CV_Obj["Informations personnelles"] || {};
            const profil = CV_Obj.Profil || "";
            const formation = CV_Obj.Formation || [];
            const experiencePro = CV_Obj["Expérience professionnelle"] || [];
            const competences = CV_Obj.Compétences || [];
            const langues = CV_Obj.Langue || [];
            const certificats = CV_Obj.Certificats || [];
            const realisations = CV_Obj["Réalisations"] || [];
            const rubriquesPersonnalisees = CV_Obj["Rubrique personnalisée"] || [];

            // =========================
            // 🔹 INFOS CANDIDAT
            // =========================
            const informations = {
                user_id,
                prenom: informationsPersonnelles["Prénom"] || "",
                pernom: informationsPersonnelles["Nom de famille"] || "",
                emploi_rechercher: informationsPersonnelles["Emploi recherché"] || "",
                ville: informationsPersonnelles["Ville"] || "",
                adresse: informationsPersonnelles["Adresse"] || "",
            };

            const resultats = [];

            const candidatInfos = await repository.foundCandidatInfo(user_id);
            if (candidatInfos) {
                await repository.updateCandidatInfo(informations);
            } else {
                await repository.createCandidatInfo(informations);
            }
            resultats.push("informations_personnelles");

            // =========================
            // 🔹 PROFIL
            // =========================
            if (profil && profil.length > 0) {
                const dataProfil = { user_id, profil };

                const profilExistant = await repository.foundCandidatProfil(user_id);
                if (profilExistant) {
                    await repository.updateCandidatProfil(dataProfil);
                } else {
                    await repository.createCandidatProfil(dataProfil);
                }
                resultats.push("profil");
            }

            // =========================
            // 🔹 AUTRES RUBRIQUES
            // =========================
            if (formation.length > 0) {
                await repository.saveFormations(user_id, formation);
                resultats.push("formation");
            }

            if (experiencePro.length > 0) {
                await repository.saveExperiencePro(user_id, experiencePro);
                resultats.push("experience_pro");
            }

            if (competences.length > 0) {
                await repository.saveCompetences(user_id, competences);
                resultats.push("competences");
            }

            if (langues.length > 0) {
                await repository.saveLangues(user_id, langues);
                resultats.push("langues");
            }

            if (certificats.length > 0) {
                await repository.saveCertificats(user_id, certificats);
                resultats.push("certificats");
            }

            if (realisations.length > 0) {
                await repository.saveRealisations(user_id, realisations);
                resultats.push("realisations");
            }

            if (rubriquesPersonnalisees.length > 0) {
                await repository.saveRubriquesPersonnalisees(
                    user_id,
                    rubriquesPersonnalisees
                );
                resultats.push("rubriques_personnalisees");
            }

            // =========================
            // ✅ RETOUR FRONTEND
            // =========================
            return {
                status: "success",
                message: "CV traité et enregistré avec succès",
                data: {
                    user_id,
                    sections_enregistrees: resultats,
                },
            };

        } catch (error) {
            console.error("Erreur cand_envoie_cv:", error);

            return {
                status: "error",
                message: "Erreur serveur lors du traitement du CV",
            };
        }
    },

    get_cand_envoie_cv: async ({ user_id }) => {
        return await repository.get_cand_envoie_cv(user_id)
    },

};


function formatFilenameBase(originalBase) {
    // On récupère le nom sans extension
    const nameWithoutExt = path.parse(originalBase).name;
    // On ajoute l'extension .webp
    return `${nameWithoutExt}.webp`;
}