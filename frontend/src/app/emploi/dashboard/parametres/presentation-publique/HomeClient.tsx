"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "@/components/Sidebar/page";
import api from "@/lib/axiosInstance";

import Image from "next/image";
const FILE_BASE_URL = `${process.env.SERVER_HOST}/uploads`;

const allowedInfos = [
  "Adresse",
  "Ville",
  "Nom de famille",
  "Prénom",
  "Adresse e-mail",
];

export default function CreerOffre() {
  const [cv, setCv] = useState<any>(null);

  useEffect(() => {
    fetchPresentation();
  }, []);

  async function fetchPresentation() {
    try {
      const res = await api.get("/users/get_presentatation_public");
      if (res.data?.data) {


        setCv({
          filenameBase: `${FILE_BASE_URL}/${res.data.filenameBase}`,
          ...res.data.data
        });
      }
    } catch (e) {
      console.error("Erreur récupération présentation", e);
    }
  }

  if (!cv) {
    return <div className="loading">Chargement du profil...</div>;
  }


  return (
    <main>
      <div className="container-dashbord">
        <Sidebar />

        <div className="mainContent">
          <div className="cv-portfolio">

            {/* ================= HEADER ================= */}
            <header className="cv-header">

              <Image
                src={cv.filenameBase}
                width={150}
                height={150}
                alt="Photo de profil"
                className="cv-avatar"
              />

              <div className="cv-header-info">
                <h1>{cv.informations?.Prénom} {cv.informations?.["Nom de famille"]}</h1>
                <h2>{cv.informations?.["Emploi recherché"]}</h2>

                {/* 🔥 ACTIONS */}
                <div className="cv-actions">
                  <a
                    href={`mailto:${cv.informations?.["Adresse e-mail"]}`}
                    className="btn-contact"
                  >
                    ✉️ Contacter
                  </a>

                  <span className="cv-views">
                    👀 100 entreprises ont visité ce profil
                  </span>
                </div>
              </div>

            </header>


            {/* ================= PROFIL ================= */}
            {cv.profil && (
              <section className="cv-section">
                <h3>Profil</h3>
                <div
                  className="cv-profil"
                  dangerouslySetInnerHTML={{ __html: cv.profil }}
                />
              </section>
            )}

            {/* ================= FORMATION ================= */}
            {cv.formation && (
              <section className="cv-section">
                <h3>Formation</h3>
                <div className="cv-card">
                  <strong>{cv.formation.titre}</strong>
                  <span>{cv.formation.etablissement}</span>
                  <small>
                    {cv.formation.enCours ? "En cours" : " "}
                  </small>
                </div>
              </section>
            )}

            {/* ================= COMPÉTENCES ================= */}
            {cv.competences?.length > 0 && (
              <section className="cv-section">
                <h3>Compétences</h3>
                <div className="skills">
                  {cv.competences.map((c: any, i: number) => (
                    <span key={i} className="skill">
                      {c.nom} <em>{c.niveau}</em>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ================= INFOS ================= */}
            {/* ================= INFOS ================= */}
            <section className="cv-section">
              <h3>Informations</h3>
              <ul className="info-list">
                {Object.entries(cv.informations)
                  .filter(([label]) => allowedInfos.includes(label))
                  .map(([label, value]: any) => (
                    <li key={label}>
                      <strong>{label} :</strong> {value}
                    </li>
                  ))}
              </ul>
            </section>


          </div>
        </div>
      </div>
    </main>
  );
}
