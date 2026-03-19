"use client";

import React, { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";

import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'


type NotificationSettings = {
    enabled: boolean;
    email: boolean;
    internal: boolean;
};

const initialSettings: NotificationSettings = {
    enabled: true,
    email: true,
    internal: true
};

export default function NotificationPreferences() {

    const [settings, setSettings] = useState<NotificationSettings>(initialSettings);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        getNotificationSettings();
    }, []);

    // 🔹 récupérer les préférences
    async function getNotificationSettings() {
        try {

            const response = await api.get("entreprise_get/get_notification_preference");



            const data = response.data?.data;

            if (!data) return;

            setSettings({
                enabled: data.enabled ?? true,
                email: data.email ?? true,
                internal: data.internal ?? true
            });

        } catch (error) {
            console.error("Erreur récupération notifications:", error);
        }
    }

    // 🔹 modification
    const handleToggle = (field: keyof NotificationSettings, value: boolean) => {

        setSettings(prev => ({
            ...prev,
            [field]: value
        }));

    };

    // 🔹 sauvegarde
    const handleSave = async () => {

        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {

            const payload = {
                settings
            };

            const response = await api.post(
                "/entreprise/notification_preference",
                payload
            );

            if (response.status == 201) {

                setSuccessMsg("Préférences enregistrées avec succès");
                setShowSuccess(true);

            }


        } catch (error: any) {

            console.error(error);
            setErrorMsg("Erreur lors de l'enregistrement");

            setShowSuccess(true);

        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <main>

                <div className="container-dashbord">

                    <Sidebar />

                    {showError && (
                        <PopupError
                            isOpen={showError}
                            title="Erreur"
                            message={errorMsg}
                            onClose={() => setShowError(false)}
                        />
                    )}

                    {showSuccess && (
                        <PopupSuccess
                            isOpen={showSuccess}
                            title="Success"
                            message={successMsg}
                            onClose={() => setShowSuccess(false)}
                        />
                    )}

                    <div className="mainContent">

                        <div className="notification-form">

                            <h2>Préférences de notification</h2>

                            {/* Activer notifications */}
                            <div className="notification-item">

                                <label>

                                    <input
                                        type="checkbox"
                                        checked={settings.enabled}
                                        onChange={(e) =>
                                            handleToggle("enabled", e.target.checked)
                                        }
                                    />

                                    Activer les notifications

                                </label>

                            </div>

                            {/* Options */}
                            {settings.enabled && (

                                <div className="notification-options">

                                    <label>

                                        <input
                                            type="checkbox"
                                            checked={settings.email}
                                            onChange={(e) =>
                                                handleToggle("email", e.target.checked)
                                            }
                                        />

                                        Notifications par Email

                                    </label>

                                    <label>

                                        <input
                                            type="checkbox"
                                            checked={settings.internal}
                                            onChange={(e) =>
                                                handleToggle("internal", e.target.checked)
                                            }
                                        />

                                        Notifications internes

                                    </label>

                                </div>

                            )}

                            <button
                                className="btn save"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Enregistrement..." : "Sauvegarder"}
                            </button>


                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
}