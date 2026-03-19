'use client';

import './style.css';
import Header from '@/components/header/page';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/sessionStore"; // adapte le chemin

import Popup from "@/components/Popup/PopupError/page";


export default function Home() {

  const router = useRouter();
  const [role, setRole] = useState("candidat");
  const [popupMessage, setPopupMessage] = useState("");
  const [isOpenpopup, setIsOpenpopup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useSession(); // on récupère juste login pour l'inscription
  const { accessToken } = useSession(); // <- récupère depuis le contexte


  useEffect(() => {
    if (accessToken) {
      router.push(role === "candidat" ? "/emploi/dashboard/" : "/entreprises/dashboard/");
    }
  }, [accessToken, role, router]);


  // 🔹 Gestion des changements de champ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Vérification des champs avant envoi
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "L’e-mail est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L’adresse e-mail n’est pas valide";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Données à envoyer au serveur Node
      const payload = {
        role,
        email: formData.email.trim(),
        password: formData.password,
      };

      // Appel API (ex: /api/login ou ton endpoint Node)

      const response = await axios.post(
        `${process.env.SERVER_HOST}/auth/login/`,
        payload,                 // <-- payload doit être le 2ème argument
        {
          withCredentials: true, // <-- options axios
        }
      );


      // Réponse succès
     



      if (response.status === 201) {
        const { data } = response
         setMessage("Connexion réussie ! Redirection en cours...");

        console.log(data.user.role)

        let userinfo = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user
        };

        setRole(data.user.role)
        login(userinfo);



      }


      // Exemple de redirection après login
      // window.location.href = role === "candidat" ? "/dashboard/candidats" : "/dashboard/entreprises";

    } catch (error: any) {
      console.error("Erreur lors de la connexion :", error);
      //setMessage(error.response?.data?.message || "Échec de la connexion. Vérifiez vos identifiants.");

      setPopupMessage("Échec de la connexion. Vérifiez vos identifiants.")
      setIsOpenpopup(true)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main>
        {isOpenpopup && (
          <Popup
            isOpen={isOpenpopup}
            title="Erreur"
            message={popupMessage}
            onClose={() => setIsOpenpopup(false)}
          />
        )}
        <div className="signup-container-login">
          <div className="form-section-login">
            <div className="form-section-login2">
              <h2>Connexion</h2>

              {/* Sélecteur de rôle */}
              {/*
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={role === "candidat"}
                    onChange={() => setRole("candidat")}
                  />
                  Candidat / Particulier
                </label>
                <label>
                  <input
                    type="radio"
                    checked={role === "entreprise"}
                    onChange={() => setRole("entreprise")}
                  />
                  Entreprise / Recruteur
                </label>
              </div>
               */}

              {/* Formulaire */}
              <form className="signup-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="error">{errors.password}</p>}

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Connexion en cours..." : "Connexion"}
                </button>

                {message && <p className="message">{message}</p>}

                <div className="or">ou</div>

                <div className="social-buttons">
                  <button type="button" className="social-btn google-btn">Google</button>
                  <button type="button" className="social-btn linkedin-btn">LinkedIn</button>
                </div>
              </form>
            </div>
          </div>

          {/* Bloc d’infos dynamique */}
          <div className="info-section-login">
            {role === "candidat" ? (
              <div className="info-section-ctn">
                <h3>Continuez votre parcours professionnel sans interruption</h3>
                <ul>
                  <li>Accédez rapidement à votre tableau de bord</li>
                  <li>Retrouvez vos candidatures, offres et alertes actives</li>
                  <li>Profitez d’une expérience fluide, pensée pour les candidats</li>
                  <li>Suggestions personnalisées basées sur notre intelligence artificielle</li>
                </ul>
              </div>
            ) : (
              <div className="info-section-ctn">
                <h3>Gérez efficacement vos recrutements</h3>
                <ul>
                  <li>Publiez vos offres d’emploi et appels d’offres en un clic</li>
                  <li>Suivez vos candidats depuis un tableau de bord centralisé</li>
                  <li>Optimisez vos processus avec nos outils de QCM et entretiens</li>
                  <li>Analysez vos performances grâce à notre intelligence artificielle</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
