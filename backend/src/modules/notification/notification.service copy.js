const Notification = require("../models/Notification");
const NotificationOffre = require("../models/NotificationOffre");

module.exports = {
    createNotification: async ({
        user_id,
        type,
        title,
        message,
        data = {},
    }) => {
        try {

            // un workflow ici pourun alert email et par socket 

            return await Notification.create({
                user_id,
                type,
                title,
                message,
                data,
            });
        } catch (err) {
            console.error("Erreur createNotification:", err);
            // on ne bloque PAS le process principal
        }
    },
    createNotificationOffre: async (data) => {

        try {

            const { receiver_id, sender_id, annonce_id, postulation_id, type, titre, message, is_read } = data
            // un workflow ici pourun alert email et par socket 


            return await NotificationOffre.create({
                receiver_id,
                sender_id,
                annonce_id,
                postulation_id,
                type,
                titre,
                message,
                is_read
            });



        } catch (err) {
            console.error("Erreur createNotification:", err);
            // on ne bloque PAS le process principal
        }
    },
    notifierCandidatQcm: async (data) => {

        try {

            const { receiver_id, sender_id, annonce_id, postulation_id, type, titre, message, is_read } = data
            // un workflow ici pourun alert email et par socket 


            return await NotificationOffre.create({
                receiver_id,
                sender_id,
                annonce_id,
                postulation_id,
                type,
                titre,
                message,
                is_read
            });



        } catch (err) {
            console.error("Erreur createNotification:", err);
            // on ne bloque PAS le process principal
        }
    },

};

