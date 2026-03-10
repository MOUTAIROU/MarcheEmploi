import React, { useEffect, useState, useMemo } from "react";
import "./styles.css";

type AnnonceEvent = {
    meta: {
        is_read: boolean;
        createdAt: string;

        annonce_id?: string;
        candidat_id?: string;
        annonce_reference?: string;

        system?: boolean;
    };

    type: string;

    action: string;

    title: string;

    message?: string;

    created_at?: string;

    actor?: {
        id: string;
        name?: string;
    };

    receiver?: {
        id: string;
        name?: string;
    };

    object?: {
        id: string;
        type: string;
        label?: string;
    };

    is_read: boolean; // ⚠️ cohérent avec meta.is_read
};

type ModalProps = {
    title: string;
    isOpen: boolean;
    tabAnnonce: AnnonceEvent[];
    onClose: () => void;
    onConfirm: (newStatus?: string) => void;
    confirmLabel?: string;
    actionType?: "notification" | "delete";
};

const ITEMS_PER_PAGE = 1;


const ActionCandidatModal: React.FC<ModalProps> = ({
    title,
    isOpen,
    tabAnnonce,
    onClose,
    onConfirm,
    confirmLabel = "Confirmer",
    actionType = "notification",
}) => {
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);



    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    useEffect(() => {
        setCurrentPage(1);
    }, [isOpen]);


    const reversedNotifications = useMemo(() => {
        return [...tabAnnonce].sort((a, b) => {
            const dateA = new Date(a.created_at ?? 0).getTime();
            const dateB = new Date(b.created_at ?? 0).getTime();
            return dateB - dateA; // plus récent en premier
        });
    }, [tabAnnonce]);

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

    const totalPages = Math.ceil(tabAnnonce.length / ITEMS_PER_PAGE);

    const paginatedNotifications = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return reversedNotifications.slice(start, start + ITEMS_PER_PAGE);
    }, [reversedNotifications, currentPage]);

    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <h2 className="popup-title">
                    {title}
                    {actionType === "notification" && (
                        <span className="notif-count">
                            ({tabAnnonce.length})
                        </span>
                    )}
                </h2>

                <div className="popup-body">
                    {/* ================= NOTIFICATIONS ================= */}
                    {actionType === "notification" && (
                        <>
                            {paginatedNotifications.map((notif: any, index) => (
                                <div
                                    key={notif.id}
                                    className={`notif-item ${notif.is_read ? "read" : "unread"}`}
                                >
                                    <div className="notif-header">
                                        <strong>{notif.message_type}</strong>
                                        <span>{!notif.is_read && <span className="badge-unread">● Non lu</span>}</span>
                                        <span className="notif-date">
                                            {new Date(notif.created_at).toLocaleString()}
                                        </span>

                                    </div>

                                    <p className="notif-message">
                                        {reverse_treatment_msg(notif.message)}
                                    </p>

                                    {notif.action_type !== "NONE" && notif.action_link && (
                                        <a
                                            href={notif.action_link}
                                            className="notif-action"
                                        >
                                            👉 Voir l’action
                                        </a>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                    >
                                        ◀
                                    </button>

                                    <span>
                                        Page {currentPage} / {totalPages}
                                    </span>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                    >
                                        ▶
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* ================= DELETE ================= */}
                    {actionType === "delete" && (
                        <p className="delete-confirmation">
                            Êtes-vous sûr de vouloir supprimer ces notifications ?
                        </p>
                    )}
                </div>

                <div className="popup-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Annuler
                    </button>

                    <button
                        className="btn confirm"
                        onClick={() => onConfirm()}
                    >
                        {confirmLabel}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ActionCandidatModal;
