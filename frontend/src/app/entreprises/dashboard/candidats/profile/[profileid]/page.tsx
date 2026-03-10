"use client";
import "./style.css";
import { useState, useEffect } from 'react';
import Sidebar from "@/components/SidebarEntreprises/page";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";

import QuillContent from '@/components/QuillContent/page';

export const allPays = [
  { code: "BJ", nom: "Bénin" },
  { code: "TG", nom: "Togo" },
  { code: "CI", nom: "Côte d’Ivoire" },
  { code: "SN", nom: "Sénégal" },
  { code: "CM", nom: "Cameroun" },
];

interface Entreprise {
  id: number;
  user_id: string;
  user_info: string;           // nom court affiché, ex: "DOUS TEC"
  nom?: string;                // nom officiel complet
  adresse?: string;
  countryCode: string;
  secteur?: string;
  site?: string;
  filenameBase?: string | null; // logo de l'entreprise
  presentation: string;        // description / présentation HTML
  mission: string;             // missions HTML
  valeurs: string;             // valeurs HTML
  createdAt: string;
  updatedAt: string;
}


export default function EntreprisePage() {

  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  useEffect(() => {

    const post_id_param = params["profileid"];


    const post_id = Array.isArray(post_id_param) ? post_id_param[0] : post_id_param;

    if (!post_id) return;

    getOffres(post_id);
  }, [params]);


  function getCountryName(code?: string) {
    if (!code) return "—";

    const pays = allPays.find((p) => p.code === code);
    return pays ? pays.nom : code; // retourne code si non trouvé
  }

  async function getOffres(post_id: string) {


    try {
      const response = await api.get(
        `entreprise_get/user_infomation/${post_id}`
      );

      const offre = response.data.data; // 👈 objet simple


      if (!offre) {
        setLoading(false);
        return;
      }



      setEntreprise(offre)
      setLoading(false);




    } catch (error) {
      console.error("Erreur récupération offre :", error);
    }
  }

  if (loading) return <div className="loading">Chargement...</div>;
  if (!entreprise) return <div className="error">Entreprise introuvable.</div>;

  return (

    <main>
      <div className="container-dashbord">
        <Sidebar />

        <div className="mainContent">


          <div className="entreprise-page">
            <div className="card">


              {/* HEADER */}
              <div className="card-header entreprise-header">
                {entreprise.filenameBase && (
                  <img
                    src={`${process.env.SERVER_HOST}/uploads/${entreprise.filenameBase}`}
                    alt={`Logo de ${entreprise.user_info}`}
                    className="entreprise-logo"
                  />
                )}
                <div className="entreprise-title">
                  <h1>{entreprise.user_info}</h1>
                  {entreprise.nom && <p className="entreprise-nom">{entreprise.nom}</p>}
                  {entreprise.secteur && <p className="entreprise-secteur">{entreprise.secteur}</p>}
                </div>
              </div>

              {/* SITE */}
              {entreprise.site && (
                <div className="entreprise-site">
                  <a href={entreprise.site} target="_blank" rel="noopener noreferrer">
                    {entreprise.site}
                  </a>
                </div>
              )}

              {/* PRESENTATION */}
              <section className="entreprise-section">
                <h2>Présentation</h2>
                <QuillContent html={entreprise.presentation} />
              </section>

              {/* MISSION */}
              <section className="entreprise-section">
                <h2>Mission</h2>
                <QuillContent html={entreprise.mission} />
              </section>

              {/* VALEURS */}
              <section className="entreprise-section">
                <h2>Valeurs</h2>
                <QuillContent html={entreprise.valeurs} />
              </section>

              {/* INFORMATIONS COMPLEMENTAIRES */}
              <section className="entreprise-infos">
                {entreprise.adresse && (
                  <p>
                    <strong>Adresse:</strong> {entreprise.adresse}
                  </p>
                )}
                <p>
                  <strong>Pays:</strong> {getCountryName(entreprise.countryCode)}
                </p>
                {/*<p>
                                          <strong>Publié le:</strong> {new Date(entreprise.createdAt).toLocaleDateString('fr-FR')}
                                      </p>
                                      <p>
                                          <strong>Dernière mise à jour:</strong> {new Date(entreprise.updatedAt).toLocaleDateString('fr-FR')}
                                      </p>*/}
              </section>



            </div>
          </div>


        </div>
      </div>
    </main>


  );
}
