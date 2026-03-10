const { cp } = require("fs");
const repository = require("./user.repository");
const path = require("path");
module.exports = {
    cand_profile: async ({ username, nom, prenom, tel, email, filenameBase, user_id,activite,infos,specialisation }) => {


      
       const {photo_profil} = filenameBase
   

        const profileData = {
            user_id: user_id,
            username: username,
            nom: nom,
            prenom: prenom,
            email: email,
            activite:activite,
            infos:infos,
            specialisation:specialisation,
            tel: tel,
            filenameBase: formatFilenameBase(photo_profil),
        };

        

        const trouver_profile = await repository.foundProfil(user_id)


        if (trouver_profile) {

            console.log('update')

            const newUser = await repository.updateProfile(profileData);

            return {
                newUser,
            };

        } else {
            // Création de l'utilisateur
            const newUser = await repository.createProfile(profileData);

            return {
                newUser,
            };

        }


    },
    cand_preferences: async ({user_id, settings}) => {
        


        const profileData = {
            user_id: user_id,
            settings
        };

    

        const trouver_profile = await repository.foundPreferences(user_id)

  

        if (trouver_profile) {

            const newUser = await repository.updatePreferences(profileData);

            return {
                newUser,
            };

        } else {
            // Création de l'utilisateur
            const newUser = await repository.createPreferences(profileData);

            return {
                newUser,
            };

        }

    },
    cand_profile_settings: async ({user_id, visibleProfil, contactDirect, publicProfil, displayBio, displaySkills, displayExperience, showCV, openToWork  }) => {


        const profileData = {
            user_id: user_id,
            visibleProfil: visibleProfil,
            contactDirect: contactDirect,
            publicProfil: publicProfil,
            displayBio: displayBio,
            displaySkills: displaySkills,
            displayExperience: displayExperience,
            showCV: showCV,
            openToWork: openToWork
        };


        const trouver_profile = await repository.foundPreferencesSettings(user_id)



        if (trouver_profile) {

            const newUser = await repository.updatePreferencesSettings(profileData);

            return {
                newUser,
            };

        } else {
            // Création de l'utilisateur
            const newUser = await repository.createPreferencesSettings(profileData);

            return {
                newUser,
            };

        }

    },
    get_cand_profile: async ({ user_id })=>{

        return await repository.getCandProfile(user_id)
    },
    get_cand_preferences: async ({ user_id })=>{

        return await repository.get_cand_preferences(user_id)
    },
    get_cand_profile_settings: async ({ user_id })=>{

        return await repository.get_cand_profile_settings(user_id)
    },

   get_presentatation_public: async ({ user_id })=>{

        return await repository.get_presentatation_public(user_id)
    },

    
};


function formatFilenameBase(originalBase) {
    // On récupère le nom sans extension
    const nameWithoutExt = path.parse(originalBase).name;
    // On ajoute l'extension .webp
    return `${nameWithoutExt}.webp`;
}