const Notification = require("../models/Notification");
const NotificationPreference = require("../models/notificationPreference");


module.exports = {
    createOrUpdateNotification: async ({
        sender_id,
        receiver_id,
        sender_name,
        receiver_name,  // <-- ajout du nom du receveur

        type,
        action,
        title,
        message,

        object_id,
        object_type,
        object_label = null,
        meta = {},
    }) => {
        try {

            if (!sender_id || !receiver_id || !receiver_name || !sender_name || !type || !action || !title || !message) {
                throw new Error("Paramètres de notification manquants");
            }


            let notication = await  notification_parametre(receiver_id)

         

            // 🔍 Recherche STRICTE dans le même sens
            const conversation = await Notification.findOne({
                where: {
                    sender_id,
                    receiver_id
                }
            });

            const newMessage = {
                type,
                action,
                title,
                message,
                actor: {
                    id: sender_id,
                    name: sender_name || "Système",
                },

                receiver: {
                    id: receiver_id,
                    name: receiver_name || "Utilisateur",
                },

                object: {
                    id: object_id,
                    type: object_type,
                    label: object_label,
                },

                meta,
                is_read: false,
            };



            // ✅ UPDATE si existe
            if (conversation) {
                const data = conversation.data || {};
                const messages = data.messages || [];




                messages.push(newMessage);



                await Notification.update(
                    {
                        data: {
                            ...data,
                            messages
                        },
                        is_read: false
                    },
                    {
                        where: {
                            sender_id,
                            receiver_id
                        }
                    }
                );

                return {
                    status: "success",
                    message: "Message ajouté à la conversation"
                };
            }
            // 🆕 CREATE sinon
            await Notification.create({
                sender_id,
                receiver_id,
                is_read: false,
                data: {
                    messages: [newMessage]
                }
            });

            return {
                status: "success",
                message: "Conversation créée"
            };




        } catch (err) {
            console.error("❌ Erreur sendNotification :", err);
            return {
                status: "error",
                message: "Erreur lors de l'envoi de la notification",
            };
        }
    }
}


async function notification_parametre(user_id) {
              console.log(user_id)

    const get_offre = await NotificationPreference.findOne({
        where: { user_id },
        raw: true
    })
    return get_offre
}