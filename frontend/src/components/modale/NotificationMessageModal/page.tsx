"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";

export type NotificationMessage = {
    id: number;
    type: string;
    action: string;
    title: string;
    message?: string;
    actor: { id: string; name?: string };
    receiver: { id: string; name?: string };
    meta?: Record<string, any>;
    is_read: boolean;
    createdAt: string;
};

type MessagesModalProps = {
    isOpen: boolean;
    messages: NotificationMessage[];
    onClose: () => void;
    pageSize?: number; // messages per page
};

const FAKE_NOTIFICATION_TEXT = `
Vous avez reçu une nouvelle notification concernant votre activité récente.
Le contenu complet du message est disponible en cliquant sur “Voir plus”.
Veuillez consulter le détail pour prendre connaissance des informations importantes.
`;


const MessagesModal: React.FC<MessagesModalProps> = ({
    isOpen,
    messages,
    onClose,
    pageSize = 5,
}) => {
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

    const totalPages = Math.ceil(messages.length / pageSize);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setCurrentPage(1);
    }, [messages]);

    if (!visible) return null;


    // Messages à afficher pour la page actuelle
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageMessages = messages.slice(startIndex, endIndex);

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


    const toggleExpanded = (groupId: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId] // true → false ou false → true
        }));
    };

    const getFirstLinePreview = (text?: string) => {
        if (!text) return "";

        // découpe par ligne
        const lines = text.trim().split("\n");

        // retourne uniquement la première ligne
        return lines[0];
    };

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">Tous les messages</h2>

                <div className="popup-body">
                    {pageMessages.map((msg, idx) => {

                        console.log(msg)

                        const isExpanded = expandedGroups[msg.id ?? idx] || false;

                        const createdAt = new Date(msg.createdAt ?? msg.meta?.createdAt);
                        const formattedDate = createdAt.toLocaleDateString("fr-FR");
                        const formattedTime = createdAt.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });


                        return (
                            <div key={idx} className="notification-item">
                                <h4>{msg.title}</h4>
                                {/*reverse_treatment_msg(msg.message || " ") */}

                                <p
                                    className={`notification-message preview ${isExpanded ? "expanded" : ""}`}
                                >
                                    {isExpanded ? reverse_treatment_msg(msg.message || " ") : getFirstLinePreview(reverse_treatment_msg(msg.message || " "))}

                                    <span
                                        className="inline-see-more"
                                        onClick={() => {
                                            toggleExpanded(msg.id ?? idx); // bascule entre aperçu / complet
                                            if (!msg.is_read && !isExpanded) {
                                                //  markGroupAsRead(group.id);      // marque comme lu seulement quand on ouvre
                                            }
                                        }}
                                    >
                                        {" "}{isExpanded ? "...voir moins" : "...voir plus"}
                                    </span>
                                </p>
                                <div className="notification-meta">
                                    <span className="sender-name">
                                        De : {msg.actor?.name || "Système"} → A :{" "}
                                        {msg.receiver?.name || "Système"}
                                    </span>
                                    <span className="send-time">
                                        {formattedDate} {formattedTime}
                                    </span>
                                    {!msg.is_read && <span className="badge-unread">● Non lu</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Précédent
                        </button>
                        <span>
                            Page {currentPage} / {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Suivant
                        </button>
                    </div>
                )}

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessagesModal;
