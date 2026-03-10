'use client';

import './style.css';
import Image from "next/image";
import Header from '@/components/header/page';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { countryNumberCode, country, countryCode } from "@/utils/types";
import { useSession } from "../../lib/sessionStore"; // adapte le chemin

export default function Home() {
  const [role, setRole] = useState("candidat");
  const router = useRouter();
  const { login } = useSession(); // on récupère juste login pour l'inscription
  const { accessToken } = useSession(); // <- récupère depuis le contexte
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    confirmePassword: "",
    password: "",
    candidate_type: "", // <-- nouveau champ, par défaut simple
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (accessToken) {
      router.push(role === "candidat" ? "/emploi/dashboard/" : "/entreprises/dashboard/");
    }
  }, [accessToken, role, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom complet est requis";
    if (role == "candidat") {
      if (!formData.candidate_type.trim()) newErrors.candidate_type = "Sélectionnez votre profil est requis";
    }

    if (!formData.email.trim()) newErrors.email = "L’email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "L’email n’est pas valide";

    if (formData.password !== formData.confirmePassword)
      newErrors.confirmePassword = "Les emails ne correspondent pas";

    if (formData.password.length < 6)
      newErrors.password = "Le mot de passe doit comporter au moins 6 caractères";

    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Vous devez accepter les conditions d’utilisation";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        role,
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        password: formData.password,
        pays: country,
        codePays: countryCode,
        ...(role === "candidat" && { candidate_type: formData.candidate_type })
      };



      const response = await axios.post(
        `${process.env.SERVER_HOST}/auth/register/`,
        payload,                 // <-- payload doit être le 2ème argument
        {
          withCredentials: true, // <-- options axios
        }
      );

      if (response.status === 201) {
        const { data } = response

        let userinfo = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user
        };


        login(userinfo);



      }


      setMessage("Inscription réussie ! Vérifiez votre e-mail pour confirmer votre compte.");
      setFormData({
        nom: "",
        email: "",
        confirmePassword: "",
        password: "",
        candidate_type: "",
        acceptTerms: false,
      });
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <div className="signup-container">
          <div className="form-section">
            <h2>Inscription</h2>

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

            <form className="signup-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="nom"
                placeholder="Nom complet..."
                value={formData.nom}
                onChange={handleChange}
              />
              {errors.nom && <p className="error">{errors.nom}</p>}

              {role === "candidat" && (
                <div className="select-candidate-type">
                  <select
                    name="candidate_type"
                    value={formData.candidate_type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>-- Sélectionnez votre profil --</option>
                    <option value="simple">Je suis un candidat à la recherche d’un emploi</option>
                    <option value="consultant">Je suis un consultant ou expert prêt à proposer mes services</option>

                  </select>
                </div>
              )}
              {errors.candidate_type && <p className="error">{errors.candidate_type}</p>}
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

              <input
                type="password"
                name="confirmePassword"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmePassword}
                onChange={handleChange}
              />
              {errors.confirmePassword && <p className="error">{errors.confirmePassword}</p>}



              <div className="checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <label htmlFor="terms">
                  J’ai lu et j’accepte les Conditions d’utilisation et la Politique de confidentialité
                </label>
              </div>
              {errors.acceptTerms && <p className="error">{errors.acceptTerms}</p>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Inscription en cours..." : "S’inscrire"}
              </button>

              {message && <p className="message">{message}</p>}

              <div className="or">ou</div>

              <div className="social-buttons">
                <button type="button" className="social-btn google-btn">Google</button>
                <button type="button" className="social-btn linkedin-btn">Linkedin</button>
              </div>
            </form>
          </div>

          <div className="info-section">
            {role === "candidat" ? (
              <div className="info-section-ctn">
                <h3>Postulez facilement, restez informé</h3>
                <ul>
                  <li>Offres d’emploi locales, régionales et internationales</li>
                  <li>Alertes personnalisées par e-mail ou WhatsApp</li>
                  <li>Gestion facile de vos candidatures</li>
                  <li>Accompagnement intelligent grâce à notre IA pour trouver les offres qui vous correspondent</li>

                </ul>
              </div>
            ) : (
              <div className="info-section-ctn">
                <h3>Toutes vos offres d’emploi et appels d’offres au même endroit</h3>
                <ul>
                  <li>Publication rapide d’offres d’emploi et d’appels d’offres</li>
                  <li>Appels d’offres ouverts aux particuliers</li>
                  <li>Organisation de QCM</li>
                  <li>Accès à un vivier de talents ciblés</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
