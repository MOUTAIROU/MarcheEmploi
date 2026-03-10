'use client';
import './style.css';
import Header from '@/components/header/page';
import Sidebar from "@/components/Sidebar/page";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("parametre");

  // Form state
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Gestion des changements de champ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation simple
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.oldPassword) newErrors.oldPassword = "Ancien mot de passe requis";
    if (!formData.newPassword) newErrors.newPassword = "Nouveau mot de passe requis";
    if (formData.newPassword && formData.newPassword.length < 6)
      newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission via Axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Préparer les données pour Axios
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      console.log("Payload avant envoi :", payload); // 🔹 vérification

      const response = await axios.post("/api/change-password", payload);
      setMessage(response.data.message || "Mot de passe mis à jour avec succès !");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <div className="container-dashbord">
          <Sidebar />
          <div className="mainContent">
            <div className="container-ctn">
              <div className="tabs">
                <Link
                  href={`${process.env.LOCAL_HOST}/emploi/dashboard/parametres`}
                  className={`tab active`}
                >
                  Parametre
                </Link>
                <button
                  className={`tab ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  Mots de passe
                </button>
              </div>

              <form className='form' onSubmit={handleSubmit}>
                <label>Ancien mot de passe</label>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Ancien mot de passe"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}

                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && <p className="error">{errors.newPassword}</p>}

                <label>Confirmer mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                <button type="submit" className="button" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>

                {message && <p className="message">{message}</p>}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
