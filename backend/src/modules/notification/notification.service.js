const Notification = require("../models/Notification");
const NotificationPreference = require("../models/notificationPreference");

module.exports = {
    createOrUpdateNotification: async ({
        sender_id,
        receiver_id,
        sender_name,
        receiver_name,
        receiver_email,

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

            if (!receiver_id) {
                throw new Error("receiver_id manquant");
            }

            // 🔹 récupérer préférences
            const pref = await notification_parametre(receiver_id);

            if (!pref || !pref.enabled) {
                return { status: "success", message: "Notifications désactivées" };
            }

            // =========================
            // 📧 EMAIL
            // =========================
            if (pref.email && receiver_email) {

                /*
                await sendEmailNotification(
                    receiver_email,
                    title,
                    message
                );*/

            }

            // =========================
            // 🔔 NOTIFICATION INTERNE
            // =========================
            if (pref.internal) {

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

                // 🔹 UPDATE
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
                            where: { sender_id, receiver_id }
                        }
                    );

                }
                // 🔹 CREATE
                else {

                    await Notification.create({
                        sender_id,
                        receiver_id,
                        is_read: false,
                        data: {
                            messages: [newMessage]
                        }
                    });

                }

            }

            return {
                status: "success",
                message: "Notification envoyée"
            };

        } catch (err) {

            console.error("❌ Notification error:", err);

            return {
                status: "error",
                message: "Erreur notification"
            };

        }
    }
};

async function notification_parametre(user_id) {

    const pref = await NotificationPreference.findOne({
        where: { user_id },
        raw: true
    });

    return pref;
}