import React from "react";
import "./style.css";
import jsPDF from "jspdf";
import Image from "next/image";
import defaultProfile from "..//../../public/default-profile.png";
import html2canvas from "html2canvas";
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


const ProfilCandidat: React.FC<any> = ({ data, imgProfile }) => {



    const generatePDF = async () => {
        const input = document.getElementById("profil-pdf");
        if (!input) return;

        // html2canvas capture l'intégralité de l'élément
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // marges gauche/droite
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const pageHeight = pdf.internal.pageSize.getHeight() - 20; // marges haut/bas
        let position = 0;

        // Ajouter image sur plusieurs pages si nécessaire
        while (position < pdfHeight) {
            pdf.addImage(
                imgData,
                "PNG",
                10,
                10 - position, // margin top 10mm
                pdfWidth,
                pdfHeight
            );
            position += pageHeight;
            if (position < pdfHeight) pdf.addPage();
        }

        pdf.save(
            `${data.informations["Prénom"]}_${data.informations["Nom de famille"]}_profil.pdf`
        );
    };


    return (
        <div>

            <div className="profil-container">


                <div className="profil-card" id="profil-pdf">
                    <div className="photo-box">
                        <Image
                            src={
                                imgProfile
                                    ? `${process.env.SERVER_HOST}/uploads/${imgProfile}`
                                    : defaultProfile
                            }
                            alt="image sur le cv"
                            width={400}
                            height={500}
                            className="image"
                        />
                    </div>

                    {data["Informations personnelles"] &&
                        Object.entries(data["Informations personnelles"]).map(
                            ([label, value]) =>
                                value && (
                                    <div className="info-item" key={label}>
                                        <strong>{label} :</strong> {String(value)}
                                    </div>
                                )
                        )}

                    <hr />

                    {data["Formation"] && data["Formation"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Formations</h3>

                                {data["Formation"].map((formation: any) => {
                                    const debut =
                                        formation.debutMois || formation.debutAnnee
                                            ? `${formation.debutMois ?? ""} ${formation.debutAnnee ?? ""}`.trim()
                                            : "";

                                    const fin = formation.enCours
                                        ? "En cours"
                                        : formation.finMois || formation.finAnnee
                                            ? `${formation.finMois ?? ""} ${formation.finAnnee ?? ""}`.trim()
                                            : "";

                                    return (
                                        <div key={formation.id} className="formation-item">
                                            {/* Titre */}
                                            {(formation.titre || formation.etablissement || formation.ville) && (
                                                <p>
                                                    <strong>{formation.titre}</strong>
                                                    {formation.etablissement && ` – ${formation.etablissement}`}
                                                    {formation.ville && `, ${formation.ville}`}
                                                </p>
                                            )}

                                            {/* Période */}
                                            {(debut || fin) && (
                                                <p className="periode">
                                                    {debut}
                                                    {debut && fin && " – "}
                                                    {fin}
                                                </p>
                                            )}

                                            {/* Description */}
                                            {formation.description && (
                                                <div
                                                    className="description"
                                                    dangerouslySetInnerHTML={{ __html: formation.description }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <hr />
                        </>

                    )}



                    {data["Expérience professionnelle"] && data["Expérience professionnelle"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Expériences professionnelles</h3>

                                {data["Expérience professionnelle"].map((exp: any) => {
                                    const debut =
                                        exp.debutMois || exp.debutAnnee
                                            ? `${exp.debutMois ?? ""} ${exp.debutAnnee ?? ""}`.trim()
                                            : "";

                                    const fin = exp.enCours
                                        ? "En cours"
                                        : exp.finMois || exp.finAnnee
                                            ? `${exp.finMois ?? ""} ${exp.finAnnee ?? ""}`.trim()
                                            : "";

                                    return (
                                        <div key={exp.id} className="experience-item">
                                            {/* Titre et établissement */}
                                            {(exp.titre || exp.etablissement || exp.ville) && (
                                                <p>
                                                    <strong>{exp.titre}</strong>
                                                    {exp.etablissement && ` – ${exp.etablissement}`}
                                                    {exp.ville && `, ${exp.ville}`}
                                                </p>
                                            )}

                                            {/* Période */}
                                            {(debut || fin) && (
                                                <p className="periode">
                                                    {debut}
                                                    {debut && fin && " – "}
                                                    {fin}
                                                </p>
                                            )}

                                            {/* Description */}
                                            {exp.description && (
                                                <div
                                                    className="description"
                                                    dangerouslySetInnerHTML={{ __html: exp.description }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <hr />
                        </>

                    )}




                    {data["Compétences"] && data["Compétences"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Compétences</h3>
                                <ul>
                                    {data["Compétences"].map((comp: any, i: number) => (
                                        <li key={i}>
                                            {comp.nom ? comp.nom : "Nom non renseigné"}
                                            {comp.niveau ? ` – ${comp.niveau}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr />
                        </>

                    )}

                    {data["Langue"] && data["Langue"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Langues</h3>
                                <ul>
                                    {data["Langue"].map((lang: any, i: number) => (
                                        <li key={i}>
                                            {lang.nom ? lang.nom : "Nom de langue non renseigné"}
                                            {lang.niveau ? ` – ${lang.niveau}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <hr />
                        </>

                    )}


                    {data["Centre d’intérêt"] && data["Centre d’intérêt"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Centres d’intérêt</h3>
                                <ul>
                                    {data["Centre d’intérêt"].map((centre: string, i: number) => (
                                        <li key={i}>{centre}</li>
                                    ))}
                                </ul>
                            </div>

                            <hr />
                        </>

                    )}



                    {data["Cours"] && data["Cours"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Cours et certifications</h3>
                                {data["Cours"].map((cours: any) => (
                                    <div key={cours.id} className="cours-item">
                                        <p>
                                            <strong>{cours.titre}</strong>
                                            {cours.mois || cours.annee ? ` (${cours.mois || ""} ${cours.annee || ""})` : ""}
                                            {cours.enCours && <span> (En cours)</span>}
                                        </p>
                                        {cours.description && (
                                            <p dangerouslySetInnerHTML={{ __html: cours.description }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <hr />
                        </>

                    )}


                    {data["Stages"] && data["Stages"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Stages</h3>
                                {data["Stages"].map((stage: any) => (
                                    <div key={stage.id} className="formation-item">
                                        <p>
                                            <strong>{stage.titre}</strong> –{" "}
                                            {stage.etablissement || ""}{stage.ville ? `, ${stage.ville}` : ""}
                                        </p>
                                        <p>
                                            {stage.debutMois || ""} {stage.debutAnnee || ""} –{" "}
                                            {stage.enCours
                                                ? "En cours"
                                                : `${stage.finMois || ""}${stage.finMois && stage.finAnnee ? " " : ""}${stage.finAnnee || ""}`}
                                        </p>
                                        {stage.description && stage.description.trim() !== "" && (
                                            <div
                                                className="description"
                                                dangerouslySetInnerHTML={{ __html: stage.description }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </>

                    )}


                    {data["Activités extra-scolaires"] && data["Activités extra-scolaires"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Activités Extra-Scolaires</h3>
                                {data["Activités extra-scolaires"].map((activite: any) => (
                                    <div key={activite.id} className="formation-item">
                                        <p>
                                            <strong>{activite.titre}</strong>
                                            {activite.etablissement ? ` – ${activite.etablissement}` : ""}
                                            {activite.ville ? `, ${activite.ville}` : ""}
                                        </p>
                                        <p>
                                            {activite.debutMois || ""} {activite.debutAnnee || ""} –{" "}
                                            {activite.enCours
                                                ? "En cours"
                                                : `${activite.finMois || ""}${activite.finMois && activite.finAnnee ? " " : ""}${activite.finAnnee || ""}`}
                                        </p>
                                        {activite.description && activite.description.trim() !== "" && (
                                            <div
                                                className="description"
                                                dangerouslySetInnerHTML={{ __html: activite.description }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </>

                    )}


                    {data["Certificats"] && data["Certificats"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Certificats</h3>
                                {data["Certificats"].map((cert: any) => (
                                    <div key={cert.id} className="certificat-item">
                                        <p>
                                            <strong>{cert.titre}</strong>
                                            {(cert.mois || cert.annee) && (
                                                <> ({cert.mois || ""}{cert.mois && cert.annee ? " " : ""}{cert.annee || ""})</>
                                            )}
                                            {cert.enCours ? " (En cours)" : ""}
                                        </p>
                                        {cert.description && cert.description.trim() !== "" && (
                                            <div dangerouslySetInnerHTML={{ __html: cert.description }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <hr />

                        </>

                    )}


                    {data["Qualités"] && data["Qualités"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Qualités</h3>
                                <ul>
                                    {data["Qualités"].map((qualite: string, i: number) => (
                                        qualite?.trim() !== "" && <li key={i}>{qualite}</li>
                                    ))}
                                </ul>
                            </div>
                            <hr />
                        </>

                    )}


                    {data["Réalisations"] && data["Réalisations"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Réalisations</h3>
                                <ul>
                                    {data["Réalisations"].map((realisation: string, i: number) => (
                                        realisation?.trim() !== "" && <li key={i}>{realisation}</li>
                                    ))}
                                </ul>
                            </div>

                            <hr />
                        </>

                    )}


                    {data["Rubrique personnalisée"] && data["Rubrique personnalisée"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Rubriques personnalisées</h3>
                                {data["Rubrique personnalisée"].map((rub: any) => (
                                    <div key={rub.id} className="rubrique-item">
                                        {rub.titre && <p><strong>{rub.titre}</strong></p>}
                                        {rub.date && <p><em>{rub.date}</em></p>}
                                        {rub.description && (
                                            <div dangerouslySetInnerHTML={{ __html: rub.description }} />
                                        )}
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
                            <hr />
                        </>

                    )}


                    {data["Références"] && data["Références"].length > 0 && (

                        <>
                            <div className="section">
                                <h3>Références</h3>
                                {data["Références"].map((item: any) => (
                                    <div key={item.id} className="reference-item">
                                        <p>
                                            <strong>{item.nom || "Nom non renseigné"}</strong>
                                            {item.entreprise && ` – ${item.entreprise}`}
                                            {item.ville && `, ${item.ville}`}
                                        </p>
                                        {item.telephone && <p>Téléphone : {item.telephone}</p>}
                                        {item.email && <p>Email : {item.email}</p>}
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </>

                    )}


                    {data["Références"] && data["Références"].length > 0 && (

                        <>

                            <div className="section">
                                <h3>Références</h3>
                                {data["Références"].map((item: any) => (
                                    <div key={item.id} className="reference-item">
                                        <p>
                                            <strong>{item.nom || "Nom non renseigné"}</strong>
                                            {item.entreprise && ` – ${item.entreprise}`}
                                            {item.ville && `, ${item.ville}`}
                                        </p>
                                        {item.telephone && <p>Téléphone : {item.telephone}</p>}
                                        {item.email && <p>Email : {item.email}</p>}
                                    </div>
                                ))}
                            </div>

                            <hr />
                        </>

                    )}


                    {data["Signature"] && (

                        <>

                            <div className="section">
                                <h3>Signature</h3>
                                {Object.entries(data["Signature"]).map(([key, value]) => {
                                    if (!value) return null; // ignore les valeurs vides
                                    return (
                                        <p key={key}>
                                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)} :</strong> {String(value)}
                                        </p>
                                    );
                                })}
                            </div>
                        </>

                    )}


                </div>
            </div>

        </div>

    );
};

export default ProfilCandidat;
