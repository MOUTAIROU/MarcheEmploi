import React from "react";
import "./style.css";

export interface ProfilCandidatProps {
    data: {
        profile?: string;

        informations: {
            "Prénom": string;
            "Nom de famille": string;
            "Emploi recherché"?: string;
            "Adresse e-mail"?: string;
            "Numéro de téléphone"?: string;
            "Adresse"?: string;
            "Ville"?: string;
            "Date de naissance"?: string;
            "Nationalité"?: string;
            "Autre"?: string;
            "Champs Personnel"?: string;
        };

        formations?: Array<{
            id: number;
            titre: string;
            etablissement: string;
            ville: string;
            debutMois: string;
            debutAnnee: string;
            finMois?: string;
            finAnnee?: string;
            enCours: boolean;
            description?: string;
        }>;

        experiences?: Array<{
            id: number;
            titre: string;
            etablissement: string;
            ville: string;
            debutMois: string;
            debutAnnee: string;
            finMois?: string;
            finAnnee?: string;
            enCours: boolean;
            description?: string;
        }>;

        competences?: Array<{
            nom: string;
            niveau: string;
        }>;

        langues?: Array<{
            nom: string;
            niveau: string;
        }>;

        centres?: string[];

        cours?: Array<{
            id: number;
            titre: string;
            mois: string;
            annee: string;
            description?: string;
            enCours: boolean;
        }>;

        stages?: Array<{
            id: number;
            titre: string;
            etablissement: string;
            ville: string;
            debutMois: string;
            debutAnnee: string;
            finMois?: string;
            finAnnee?: string;
            enCours: boolean;
            description?: string;
        }>;

        activités?: Array<{
            id: number;
            titre: string;
            etablissement: string;
            ville: string;
            debutMois: string;
            debutAnnee: string;
            finMois?: string;
            finAnnee?: string;
            enCours: boolean;
            description?: string;
        }>;

        References?: Array<{
            id: number;
            nom: string;
            entreprise: string;
            ville: string;
            telephone: string;
            email: string;
        }>;

        qualites?: string[];

        certificats?: Array<{
            id: number;
            titre: string;
            mois: string;
            annee: string;
            description?: string;
            enCours: boolean;
        }>;

        realisations?: string[];

        signature?: {
            nom: string;
            ville: string;
            date: string;
            consentement: string;
        };

        rubriquesPersonnalisees?: Array<{
            id: number;
            titre: string;
            description?: string;
            lien?: string;
            date?: string;
        }>;
    };
}


const ProfilCandidat: React.FC<ProfilCandidatProps> = ({ data }) => {
    return (
        <div className="profil-container">
            <div className="profil-card">
                <div className="photo-box">Photo</div>

                <div className="section">
                    <h3>Informations personnelles</h3>
                    <div className="info-item">
                        <strong>Prénom :</strong> {data.informations["Prénom"]}
                    </div>
                    <div className="info-item">
                        <strong>Nom de famille :</strong> {data.informations["Nom de famille"]}
                    </div>
                    {data.informations["Emploi recherché"] && (
                        <div className="info-item">
                            <strong>Emploi recherché :</strong> {data.informations["Emploi recherché"]}
                        </div>
                    )}
                    {data.informations["Adresse e-mail"] && (
                        <div className="info-item">
                            <strong>Adresse e-mail :</strong> {data.informations["Adresse e-mail"]}
                        </div>
                    )}
                    {data.informations["Numéro de téléphone"] && (
                        <div className="info-item">
                            <strong>Numéro de téléphone :</strong> {data.informations["Numéro de téléphone"]}
                        </div>
                    )}
                    {data.informations["Adresse"] && (
                        <div className="info-item">
                            <strong>Adresse :</strong> {data.informations["Adresse"]}
                        </div>
                    )}
                    {data.informations["Ville"] && (
                        <div className="info-item">
                            <strong>Ville :</strong> {data.informations["Ville"]}
                        </div>
                    )}
                    {data.informations["Date de naissance"] && (
                        <div className="info-item">
                            <strong>Date de naissance :</strong> {data.informations["Date de naissance"]}
                        </div>
                    )}
                    {data.informations["Nationalité"] && (
                        <div className="info-item">
                            <strong>Nationalité :</strong> {data.informations["Nationalité"]}
                        </div>
                    )}
                    {data.informations["Autre"] && (
                        <div className="info-item">
                            <strong>Autre :</strong> {data.informations["Autre"]}
                        </div>
                    )}
                    {data.informations["Champs Personnel"] && (
                        <div className="info-item">
                            <strong>Champs Personnel :</strong> {data.informations["Champs Personnel"]}
                        </div>
                    )}
                </div>


                <hr />

                {data.formations && data.formations.length > 0 && (
                    <div className="section">
                        <h3>Formations</h3>
                        {data.formations.map((formation) => (
                            <div key={formation.id} className="formation-item">
                                <p>
                                    <strong>{formation.titre}</strong> – {formation.etablissement}, {formation.ville}
                                </p>
                                <p>
                                    {formation.debutMois} {formation.debutAnnee} –{" "}
                                    {formation.enCours ? "En cours" : `${formation.finMois || ""} ${formation.finAnnee || ""}`}
                                </p>
                                {formation.description && (
                                    <div
                                        className="description"
                                        dangerouslySetInnerHTML={{ __html: formation.description || "" }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <hr />
                {data.experiences && data.experiences.length > 0 && (
                    <div className="section">
                        <h3>Experiences</h3>
                        {data.experiences.map((formation) => (
                            <div key={formation.id} className="formation-item">
                                <p>
                                    <strong>{formation.titre}</strong> – {formation.etablissement}, {formation.ville}
                                </p>
                                <p>
                                    {formation.debutMois} {formation.debutAnnee} –{" "}
                                    {formation.enCours ? "En cours" : `${formation.finMois || ""} ${formation.finAnnee || ""}`}
                                </p>
                                {formation.description && (
                                    <div
                                        className="description"
                                        dangerouslySetInnerHTML={{ __html: formation.description || "" }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <hr />

                {data.competences && data.competences.length > 0 && (
                    <div className="section">
                        <h3>Compétences</h3>
                        <ul>
                            {data.competences.map((comp, i) => (
                                <li key={i}>
                                    {comp.nom} – {comp.niveau}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <hr />

                {data.langues && data.langues.length > 0 && (
                    <div className="section">
                        <h3>Langues</h3>
                        <ul>
                            {data.langues.map((comp, i) => (
                                <li key={i}>
                                    {comp.nom} – {comp.niveau}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <hr />

                {data.centres && data.centres.length > 0 && (
                    <div className="section">
                        <h3>Centres d’intérêt</h3>
                        <ul>
                            {data.centres.map((centre, i) => (
                                <li key={i}>{centre}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <hr />

                {data.cours && data.cours.length > 0 && (
                    <div className="section">
                        <h3>Cours et certifications</h3>
                        {data.cours.map((cours) => (
                            <div key={cours.id} className="cours-item">
                                <p><strong>{cours.titre}</strong> ({cours.mois} {cours.annee}) {cours.enCours && <span>(En cours)</span>}</p>
                                {cours.description && <p dangerouslySetInnerHTML={{ __html: cours.description }} />}
                            </div>
                        ))}
                    </div>
                )}
                <hr />

                {data.stages && data.stages.length > 0 && (
                    <div className="section">
                        <h3>Stages</h3>
                        {data.stages.map((formation) => (
                            <div key={formation.id} className="formation-item">
                                <p>
                                    <strong>{formation.titre}</strong> – {formation.etablissement}, {formation.ville}
                                </p>
                                <p>
                                    {formation.debutMois} {formation.debutAnnee} –{" "}
                                    {formation.enCours ? "En cours" : `${formation.finMois || ""} ${formation.finAnnee || ""}`}
                                </p>
                                {formation.description && (
                                    <div
                                        className="description"
                                        dangerouslySetInnerHTML={{ __html: formation.description || "" }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <hr />
                {data.activités && data.activités.length > 0 && (
                    <div className="section">
                        <h3>Activités Extre Scolaire</h3>
                        {data.activités.map((formation) => (
                            <div key={formation.id} className="formation-item">
                                <p>
                                    <strong>{formation.titre}</strong> – {formation.etablissement}, {formation.ville}
                                </p>
                                <p>
                                    {formation.debutMois} {formation.debutAnnee} –{" "}
                                    {formation.enCours ? "En cours" : `${formation.finMois || ""} ${formation.finAnnee || ""}`}
                                </p>
                                {formation.description && (
                                    <div
                                        className="description"
                                        dangerouslySetInnerHTML={{ __html: formation.description || "" }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <hr />

                {data.References && data.References.length > 0 && (
                    <div className="section">
                        <h3>Références</h3>
                        {data.References.map((ref) => (
                            <div key={ref.id} className="reference-item">
                                <p><strong>{ref.nom}</strong> – {ref.entreprise}, {ref.ville}</p>
                                <p>Téléphone : {ref.telephone}</p>
                                <p>Email : {ref.email}</p>
                            </div>
                        ))}
                    </div>
                )}
                <hr />
                {data.qualites && data.qualites.length > 0 && (
                    <div className="section">
                        <h3>Qualites</h3>
                        <ul>
                            {data.qualites.map((centre, i) => (
                                <li key={i}>{centre}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <hr />
                {data.certificats && data.certificats.length > 0 && (
                    <div className="section">
                        <h3>Certificats</h3>
                        {data.certificats.map((cert) => (
                            <div key={cert.id} className="certificat-item">
                                <p><strong>{cert.titre}</strong> ({cert.mois} {cert.annee}) {cert.enCours ? "(En cours)" : ""}</p>
                                {cert.description && <div dangerouslySetInnerHTML={{ __html: cert.description }} />}
                            </div>
                        ))}
                    </div>
                )}

                <hr />
                {data.realisations && data.realisations.length > 0 && (
                    <div className="section">
                        <h3>Realisations</h3>
                        <ul>
                            {data.realisations.map((centre, i) => (
                                <li key={i}>{centre}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <hr />
                {data.rubriquesPersonnalisees && data.rubriquesPersonnalisees.length > 0 && (
                    <div className="section">
                        <h3>Rubriques personnalisées</h3>
                        {data.rubriquesPersonnalisees.map((rub) => (
                            <div key={rub.id} className="rubrique-item">
                                {rub.titre && <p><strong>{rub.titre}</strong></p>}
                                {rub.date && <p><em>{rub.date}</em></p>}
                                {rub.description && <div dangerouslySetInnerHTML={{ __html: rub.description }} />}
                                {rub.lien && (
                                    <p>
                                        <a href={rub.lien} target="_blank" rel="noopener noreferrer">
                                            {rub.lien}
                                        </a>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <hr />
                {data.signature && (
                    <div className="section">
                        <h3>Signature</h3>
                        <p><strong>Nom :</strong> {data.signature.nom}</p>
                        <p><strong>Ville :</strong> {data.signature.ville}</p>
                        <p><strong>Date :</strong> {data.signature.date}</p>
                        <p>{data.signature.consentement}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProfilCandidat;
