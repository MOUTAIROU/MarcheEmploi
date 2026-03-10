import React from "react";
import "./style.css";

export default function EntreprisePage() {
  return (
    <div className="entreprise-container">
      {/* Zone Logo */}
      <div className="logo-box">
        <span>Logo Entreprise</span>
      </div>

      {/* Nom */}
      <h1 className="entreprise-title">BELLECK Technologies</h1>

      {/* À propos */}
      <section className="section">
        <h2>À propos</h2>
        <p>
          BELLECK Technologies est une entreprise spécialisée dans le
          développement de solutions digitales, l’intégration de systèmes et
          l’accompagnement technologique des organisations.
        </p>
      </section>

      {/* Expertises */}
      <section className="section">
        <h2>Domaines d’expertise</h2>
        <ul>
          <li>Développement web & mobile</li>
          <li>Cybersécurité et infrastructure</li>
          <li>Intégration ERP & outils métier</li>
          <li>Automatisation & Intelligence Artificielle</li>
        </ul>
      </section>

      {/* Valeurs */}
      <section className="section">
        <h2>Nos valeurs</h2>
        <ul>
          <li>Innovation continue</li>
          <li>Qualité & professionnalisme</li>
          <li>Respect des délais</li>
          <li>Satisfaction client</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="section">
        <h2>Informations de contact</h2>
        <p>📍 Adresse : Avenue Charles De Gaulle, Cotonou</p>
        <p>📞 Téléphone : +229 01 23 45 67</p>
        <p>📧 Email : contact@belleck-tech.com</p>
        <p>🌐 Site web : www.belleck-tech.com</p>
      </section>
    </div>
  );
}
