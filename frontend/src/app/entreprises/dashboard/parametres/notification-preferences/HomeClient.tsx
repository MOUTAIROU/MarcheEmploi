"use client";

import React, { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";
import { countryNumberCode, country, countryCode } from "@/utils/types";
// Types
type NotificationChannel = "email" | "sms" | "internal";
type RecipientOption = "email_rh" | "email_recruteur" | "all_collaborators";
type NotificationFrequency = "immediate" | "daily" | "silent";
type NotificationType =
  | "candidat_postule"
  | "qcm_termine"
  | "entretien_programme"
  | "rappel_entretien"
  | "offre_expiree"
  | "facture";

type NotificationConfigBase = {
  channels: NotificationChannel[];
  recipients: RecipientOption[];
  frequency: NotificationFrequency;
};

type NotificationConfigWithReminder = NotificationConfigBase & {
  reminderMinutes: number;
};

type NotificationSettings = Record<
  NotificationType,
  NotificationConfigBase | NotificationConfigWithReminder
>;

// Initial settings
const initialSettings: NotificationSettings = {
  candidat_postule: { channels: ["email", "internal"], recipients: ["email_rh"], frequency: "immediate" },
  qcm_termine: { channels: ["email", "internal"], recipients: ["email_rh"], frequency: "immediate" },
  entretien_programme: { channels: ["email", "internal"], recipients: ["email_rh"], frequency: "immediate" },
  rappel_entretien: { channels: ["email", "internal"], recipients: ["email_rh"], frequency: "immediate", reminderMinutes: 15 },
  offre_expiree: { channels: ["email"], recipients: ["email_rh"], frequency: "daily" },
  facture: { channels: ["email"], recipients: ["email_rh"], frequency: "immediate" },
};

export default function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getOffres();
  }, []);

  async function getOffres() {
    try {
      const response = await api.get("entreprise_get/get_notification_preference");
      const entreprise = response.data?.data;
      if (!entreprise) return;

      console.log("📦 Données entreprise :", entreprise);

      // Pré-remplir les settings avec les données reçues
      const prefilledSettings: NotificationSettings = {
        candidat_postule: entreprise.candidat_postule || initialSettings.candidat_postule,
        qcm_termine: entreprise.qcm_termine || initialSettings.qcm_termine,
        entretien_programme: entreprise.entretien_programme || initialSettings.entretien_programme,
        rappel_entretien: entreprise.rappel_entretien || initialSettings.rappel_entretien,
        offre_expiree: entreprise.offre_expiree || initialSettings.offre_expiree,
        facture: entreprise.facture || initialSettings.facture,
      };

      setSettings(prefilledSettings);
    } catch (error) {
      console.error("❌ Erreur récupération entreprise :", error);
    }
  }


  const handleChannelChange = (type: NotificationType, channel: NotificationChannel, checked: boolean) => {
    const current = settings[type];
    const channels = checked ? [...current.channels, channel] : current.channels.filter(c => c !== channel);
    setSettings({ ...settings, [type]: { ...current, channels } });
  };

  const handleRecipientChange = (type: NotificationType, recipient: RecipientOption, checked: boolean) => {
    const current = settings[type];
    const recipients = checked ? [...current.recipients, recipient] : current.recipients.filter(r => r !== recipient);
    setSettings({ ...settings, [type]: { ...current, recipients } });
  };

  const handleFrequencyChange = (type: NotificationType, frequency: NotificationFrequency) => {
    const current = settings[type];
    setSettings({ ...settings, [type]: { ...current, frequency } });
  };

  const handleReminderChange = (type: NotificationType, minutes: number) => {
    const current = settings[type] as NotificationConfigWithReminder;
    setSettings({ ...settings, [type]: { ...current, reminderMinutes: minutes } });
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      settings: {
        ...settings,
        countryCode: countryCode, // ⬅️ ajouté ici
      }
    };



    // Envoi vers le serveur
    try {
      const response = await submitOffre(JSON.stringify(payload));
      console.log("✅ Réponse serveur :", response);
    } catch (err: any) {
      console.error("❌ Erreur lors de l'envoi :", err);
    }



    // Fonction d'envoi
    async function submitOffre(payload: any) {
      // ⚠️ Exemple avec axios
      const response = await api.post("/entreprise/notification_preference", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    }
  };
  return (
    <div>
      <main>
        <div className="container-dashbord">
          <Sidebar />
          <div className="mainContent">
            <div className="notification-form">
              <h2>Préférences de notification</h2>

              {Object.entries(settings).map(([type, config]) => (
                <div key={type} className="notification-item">
                  <h3>{type.replace(/_/g, " ")}</h3>

                  <div>
                    <label>Canaux :</label>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.channels.includes("email")}
                        onChange={(e) => handleChannelChange(type as NotificationType, "email", e.target.checked)}
                      />
                      Email
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.channels.includes("sms")}
                        onChange={(e) => handleChannelChange(type as NotificationType, "sms", e.target.checked)}
                      />
                      SMS
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.channels.includes("internal")}
                        onChange={(e) => handleChannelChange(type as NotificationType, "internal", e.target.checked)}
                      />
                      Notifications internes
                    </label>
                  </div>

                  <div>
                    <label>Destinataires :</label>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.recipients.includes("email_rh")}
                        onChange={(e) => handleRecipientChange(type as NotificationType, "email_rh", e.target.checked)}
                      />
                      Email principal RH
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.recipients.includes("email_recruteur")}
                        onChange={(e) => handleRecipientChange(type as NotificationType, "email_recruteur", e.target.checked)}
                      />
                      Email du recruteur
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.recipients.includes("all_collaborators")}
                        onChange={(e) => handleRecipientChange(type as NotificationType, "all_collaborators", e.target.checked)}
                      />
                      Tous les collaborateurs
                    </label>
                  </div>

                  <div>
                    <label>Fréquence :</label>
                    <select
                      value={config.frequency}
                      onChange={(e) =>
                        handleFrequencyChange(type as NotificationType, e.target.value as NotificationFrequency)
                      }
                    >
                      <option value="immediate">Immédiate</option>
                      <option value="daily">Regroupée chaque matin</option>
                      <option value="silent">Silencieux</option>
                    </select>
                  </div>

                  {"reminderMinutes" in config && (
                    <div>
                      <label>Rappel avant entretien (minutes) :</label>
                      <input
                        type="number"
                        value={(config as NotificationConfigWithReminder).reminderMinutes}
                        onChange={(e) => handleReminderChange(type as NotificationType, Number(e.target.value))}
                        min={1}
                      />
                    </div>
                  )}

                  <hr />
                </div>
              ))}

              <button className="btn save" onClick={handleSave}>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
