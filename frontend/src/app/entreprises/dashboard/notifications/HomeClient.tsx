'use client';
import './style.css';
import { useState, useEffect } from "react";
import Sidebar from "@/components/SidebarEntreprises/page";
import MessagesModal from '@/components/modale/NotificationMessageModal/page'
import api from "@/lib/axiosInstance";
import Pagination from "@/components/PaginationTap/Pagination";

type NotificationMessage = {
    id: number;
    type: string;              // APPLICATION, INTERVIEW, QCM…
    action: string;            // APPLIED, INVITED, DONE…
    title: string;
    message?: string;

    actor: {
        id: string;
        name?: string;
    };
    receiver: {
        id: string;
        name?: string;
    };

    meta?: Record<string, any>;
    is_read: boolean;
    createdAt: string;
};

type NotificationData = {
    messages: NotificationMessage[];
};

type NotificationItem = {
    id: number;

    sender_id: string;
    receiver_id: string;

    is_read: boolean;

    data: NotificationData;

    createdAt: string;
    updatedAt: string;
};



export default function NotificationsEntreprise() {

    const [received, setReceived] = useState<NotificationItem[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
    const [sent, setSent] = useState<NotificationItem[]>([]);
    const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState<NotificationMessage[] | null>(null);

    const [pageReceived, setPageReceived] = useState(1);
    const [pageSend, setPageSend] = useState(1);
    const [totalReceived, setTotalReceived] = useState(0);
    const [totalSend, setTotalSend] = useState(0);
    const limit = 10;

    useEffect(() => {
        getNotifications();
    }, []);

    useEffect(() => {

        getNotifications(activeTab === "received" ? pageReceived : pageSend, limit);

    }, [pageReceived,pageSend]);
    const markGroupAsRead = async (notificationId: number) => {



        try {
            await api.patch("/entreprise_get/notifications_mark_as_read", {
                notification_id: notificationId,
            });
        } catch (error) {
            console.error("Erreur mark as read", error);
        }
    };

    // ✅ Compter les notifications non lues
    const countUnread = (notifications: NotificationItem[]) => {
        return notifications.reduce((acc, notif) => {
            // Si tu veux utiliser le flag global de la notification
            if (!notif.is_read) return acc + 1;

            // OU si tu veux vérifier chaque message dans data.messages
            // const unreadMessages = notif.data?.messages?.filter(msg => !msg.meta?.is_read)?.length ?? 0;
            // return acc + (unreadMessages > 0 ? 1 : 0);

            return acc;
        }, 0);
    };


    async function getNotifications(pageNumber: number = 1, limit: number = 10) {
        try {
            setLoading(true);
            const response = await api.get("/entreprise_get/get_notification", {
                params: {
                    page: pageNumber,
                    limit: 10
                }
            });

            if (response.status === 201 && response.data?.data) {
                setReceived(response.data.data.received.rows ?? []);
                setSent(response.data.data.sent.rows ?? []);
                setTotalReceived(response.data.data.received.total ?? 0)
                setTotalSend(response.data.data.sent.total ?? 0)
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des notifications");
        } finally {
            setLoading(false);
        }
    }

    const toggleExpanded = (groupId: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId] // true → false ou false → true
        }));
    };


    const getLastMessage = (messages: NotificationMessage[]) => {
        if (!Array.isArray(messages) || messages.length === 0) return null;
        return messages[messages.length - 1];
    };



    const normalizeNotifications = (list: NotificationItem[]) => {
      
        return list.map(item => ({
            ...item,
            data: {
                messages: Array.isArray(item.data?.messages)
                    ? item.data.messages
                    : []
            }
        }));
    };

    function decodeHTML(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function reverse_treatment_msg(msg: string): string {
        if (!msg) return "";

        let result = msg
            .replace(/&nbsp;/g, " ")
            .replace(/<br\s*\/?>/gi, "\n") // gère les retours à la ligne
            .replace(/''/g, "'");

        // Décodage profond via DOM
        result = decodeHTML(result);
        result = decodeHTML(result); // une seconde passe si nécessaire
        result = decodeHTML(result); // une seconde passe si nécessaire
        result = decodeHTML(result); // une seconde passe si nécessaire
        result = decodeHTML(result); // une seconde passe si nécessaire

        return result;
    }

    const getFirstLinePreview = (text?: string) => {
        if (!text) return "";

        // découpe par ligne
        const lines = text.trim().split("\n");

        // retourne uniquement la première ligne
        return lines[0];
    };

    const currentList = activeTab === "received" ? received : sent;
    const groupedMessages = normalizeNotifications(currentList);
    const displayedMessages = showAll ? groupedMessages : groupedMessages.slice(0, 5);



    return (
        <div className="container-dashbord">
            <Sidebar />

            <div className="mainContent">

                <MessagesModal
                    isOpen={!!selectedMessages}
                    messages={selectedMessages || []}
                    onClose={() => setSelectedMessages(null)}
                    pageSize={1} // tu peux changer le nombre de messages par page
                />
                <h3 className="page-title">📨 Notifications</h3>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === "received" ? "active" : ""}`}
                        onClick={() => setActiveTab("received")}
                    >
                        Reçus <span className="tab-count">{countUnread(received)}</span>
                    </button>

                    <button
                        className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
                        onClick={() => setActiveTab("sent")}
                    >
                        Envoyés <span className="tab-count">{countUnread(sent)}</span>
                    </button>
                </div>


                {/* États */}
                {loading && <p>Chargement...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && displayedMessages.length === 0 && (
                    <p className="empty">Aucune notification</p>
                )}

                {/* Liste */}
                <div className="notification-list">
                    {displayedMessages.map((group, index) => {

                        const messages = group.data?.messages ?? [];
                        const lastMessage = getLastMessage(messages);
                        const totalMessages = messages.length;

                        if (!lastMessage) return null;


                        const isExpanded = expandedGroups[group.id ?? index] || false;

                        // Formater la date
                        const createdAt = new Date(lastMessage.meta?.createdAt);
                        const formattedDate = createdAt.toLocaleDateString('fr-FR');
                        const formattedTime = createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });


                        return (
                            <div key={group.id ?? index} className="notification-item">

                                {/* 🧾 Titre */}
                                <h4>{lastMessage.title}</h4>

                                {/* ⚠️ VRAI MESSAGE (NON AFFICHÉ ICI)
                    <p className="notification-message">
                                    {reverse_treatment_msg(lastMessage.message || " ")}
                                </p>

                            */}

                                {/* 💬 APERÇU (FAUX TEXTE UX) */}


                                <p
                                    className={`notification-message preview ${isExpanded ? "expanded" : ""}`}
                                >

                                    {isExpanded ? lastMessage.message : getFirstLinePreview(lastMessage.message)}

                                    <span
                                        className="inline-see-more"
                                        onClick={() => {
                                            toggleExpanded(group.id ?? index); // bascule entre aperçu / complet
                                            if (!group.is_read && !isExpanded && activeTab == "received") {

                                                markGroupAsRead(group.id);

                                                // marque comme lu seulement quand on ouvre
                                            }
                                        }}
                                    >
                                        {" "}{isExpanded ? "...voir moins" : "...voir plus"}
                                    </span>
                                </p>



                                {/* 👤 Expéditeur et 🕒 Date/heure */}
                                <div className="notification-meta">

                                    <span className="sender-name">
                                        De : {lastMessage.actor?.name || "Système"} → A :{" "}
                                        {lastMessage.receiver?.name || "Système"}
                                    </span>

                                    <span className="send-time">{formattedDate} {formattedTime}</span>
                                    {!lastMessage.is_read && (
                                        <span className="badge-unread">● Non lu</span>
                                    )}
                                </div>

                                {/* 👀 Voir tout */}
                                {totalMessages > 1 && (
                                    <button
                                        className="btn-see-all"
                                        onClick={() => setSelectedMessages(messages)}
                                    >
                                        Voir tous les messages ({totalMessages})
                                    </button>
                                )}
                            </div>
                        );
                    })}


                </div>


                <Pagination
                    page={activeTab === "received" ? pageReceived : pageSend}
                    setPage={activeTab === "received" ? setPageReceived : setPageSend}
                    total={activeTab === "received" ? totalReceived : totalSend}
                    limit={limit}
                />

                {/* Voir tout */}
                {groupedMessages.length > 5 && (
                    <div className="see-all">
                        <button onClick={() => setShowAll(!showAll)}>
                            {showAll ? "Afficher moins" : "Voir tout"}
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
}
