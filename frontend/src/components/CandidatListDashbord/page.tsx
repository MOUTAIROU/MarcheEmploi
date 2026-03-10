import React from "react";
import Pagination from "@/components/PaginationDashbord/page";
import QuillContent from '@/components/QuillContent/page';
import "./style.css";

interface Candidate {
    id: number;
    user_id: string;
    resume: string;
    profil: string;
    pays: string;
    ville?: string;
    disponibiliteMatch: boolean;
    villeMatch: boolean;
    createdAt: string;
}

interface Props {
    candidates: Candidate[];
    total: number;
    currentpage: number;
    onVisiterCV: (id: string) => void;
    onEnregistrer: (id: string) => void;
}


export const allPays = [
    { code: "BJ", nom: "Bénin" },
    { code: "TG", nom: "Togo" },
    { code: "CI", nom: "Côte d’Ivoire" },
    { code: "SN", nom: "Sénégal" },
    { code: "CM", nom: "Cameroun" },
];

const CandidateList: React.FC<Props> = ({ candidates, total, currentpage, onVisiterCV, onEnregistrer }) => {

    function getCountryInfo(name: string) {
        const pays = allPays.find(p => p.nom.toLowerCase() === name.toLowerCase());
        return pays ? { nom: pays.nom, drapeauUrl: `https://flagcdn.com/w40/${pays.code.toLowerCase()}.png` } : { nom: name, drapeauUrl: "" };
    }

    function formatDate(dateStr: string) {
        if (!dateStr) return "--";
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }

    return (
        <>
            <div className="candidate-list">
                {candidates.map(c => {
                    const pays = getCountryInfo(c.pays);
                    return (
                        <div key={c.id} className="candidate-card">
                            <div className="candidate-header">
                                <span>
                                    {pays.drapeauUrl && <img src={pays.drapeauUrl} alt={pays.nom} width={30} />} {pays.nom}
                                    {c.villeMatch && c.ville ? ` - ${c.ville}` : ""}
                                </span>
                                <span>
                                    {c.disponibiliteMatch ? "Disponible" : "Non disponible"}
                                </span>
                                <span>{formatDate(c.createdAt)}</span>
                            </div>

                            <div className="candidate-body">
                                <div className="resume">
                                    <strong>Résumé :</strong>
                                    <p>{c.resume}</p>
                                </div>

                                <div className="profil">
                                    <strong>Profil :</strong>
                                    <QuillContent html={c.profil} />
                                </div>
                            </div>

                            <div className="candidate-footer">
                                <button className="btn-visiter" onClick={() => onVisiterCV(c.user_id)}>Visiter mon CV</button>
                                <button className="btn-enregistrer" onClick={() => onEnregistrer(c.user_id)}>Enregistrer</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination
                totalItems={total}
                currentPage={currentpage}
                itemsPerPage={12}
            />
        </>
    );
};

export default CandidateList;
