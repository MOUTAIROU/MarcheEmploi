"use client";
import React, {
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
} from "react";
import "./style.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export interface CertificatsItem {
    id: number;
    titre: string;
    mois: string;
    annee: string;
    description: string;
    enCours: boolean;
}

export interface CertificatsRef {
    fillCertificatsFromParent: (data: CertificatsItem[]) => void;
    getCertificats: () => CertificatsItem[];
}

const CertificatsForm = forwardRef<CertificatsRef>((_, ref) => {
    const [cours, setCours] = useState<CertificatsItem[]>([]);
    const [titre, setTitre] = useState("");
    const [mois, setMois] = useState("");
    const [annee, setAnnee] = useState("");
    const [description, setDescription] = useState("");
    const [enCours, setEnCours] = useState(false);
    const [editId, setEditId] = useState<number | null>(null); // 🟢 mode édition

    const { quill, quillRef } = useQuill({
        modules: {
            toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
            ],
        },
        placeholder: "Commencez à rédiger ici...",
    });

    // --- Synchroniser description avec l'éditeur Quill
    useEffect(() => {
        if (quill) {
            const editor = quill.root;
            editor.style.fontFamily = "Arial, sans-serif";
            editor.style.fontSize = "15px";

            quill.on("text-change", () => {
                setDescription(quill.root.innerHTML);
            });
        }
    }, [quill]);

    // --- Si "En cours" est coché → année actuelle, désactive les selects
    useEffect(() => {
        if (enCours) {
            const currentYear = new Date().getFullYear().toString();
            setAnnee(currentYear);
            setMois("");
        } else {
            setAnnee("");
        }
    }, [enCours]);

    // --- Ajouter ou modifier un cours
    const handleAdd = () => {
        if (!titre.trim()) return;

        if (editId) {
            // 🔹 Mode modification
            setCours((prev) =>
                prev.map((c) =>
                    c.id === editId
                        ? { ...c, titre, mois, annee, description, enCours }
                        : c
                )
            );
            setEditId(null);
        } else {
            // 🔹 Mode ajout
            const newCours: CertificatsItem = {
                id: Date.now(),
                titre,
                mois,
                annee,
                description,
                enCours,
            };
            setCours((prev) => [...prev, newCours]);
        }

        // Réinitialiser le formulaire
        setTitre("");
        setMois("");
        setAnnee("");
        setEnCours(false);
        setDescription("");
        if (quill) quill.setText("");
    };


    // --- 🟢 Modifier un cours
    const handleEdit = (id: number) => {
        const selected = cours.find((c) => c.id === id);
        if (selected) {
            setEditId(selected.id);
            setTitre(selected.titre);
            setMois(selected.mois);
            setAnnee(selected.annee);
            setDescription(selected.description);
            setEnCours(selected.enCours);
            if (quill) quill.root.innerHTML = selected.description || "";
        }
    };


    // --- Suppression d’un cours
    const handleDelete = (id: number) => {
        setCours((prev) => prev.filter((c) => c.id !== id));
    };

    // --- Exposer les fonctions au parent
    useImperativeHandle(ref, () => ({
        fillCertificatsFromParent: (data: CertificatsItem[]) => {
            
            console.log(data)
            setCours(data);
        },
        getCertificats(){
            return cours
        }
    }));

    return (
        <div className="cours-container">
            {/* Tableau des cours */}
            {cours.length > 0 && (
                <table className="cours-table">
                    <thead>
                        <tr>
                            <th>Certificats</th>
                            <th>Période</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cours.map((c) => (
                            <tr key={c.id}>
                                <td>{c.titre}</td>
                                <td>{c.enCours ? "En cours" : `${c.mois} ${c.annee}`}</td>
                                <td>
                                    <div
                                        className="desc-cell"
                                        dangerouslySetInnerHTML={{ __html: c.description }}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="deleteBtn"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Supprimer
                                    </button>

                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(c.id)}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Formulaire */}
            <div className="form-card">
                <div className="form-header">
                    <div className="form-group">
                        <label>Certificats</label>
                        <input
                            type="text"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Nom du cours"
                        />
                    </div>

                    <div className="form-group form-group-position-absolute">
                        <label>Période</label>
                        <div className="periode">
                            <select
                                value={mois}
                                onChange={(e) => setMois(e.target.value)}
                                disabled={enCours}
                            >
                                <option value="">Mois</option>
                                {[
                                    "Janvier",
                                    "Février",
                                    "Mars",
                                    "Avril",
                                    "Mai",
                                    "Juin",
                                    "Juillet",
                                    "Août",
                                    "Septembre",
                                    "Octobre",
                                    "Novembre",
                                    "Décembre",
                                ].map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={annee}
                                onChange={(e) => setAnnee(e.target.value)}
                                disabled={enCours}
                            >
                                <option value="">Année</option>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <option key={i} value={2025 - i}>
                                        {2025 - i}
                                    </option>
                                ))}
                            </select>


                        </div>


                        <div className="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={enCours}
                                    onChange={(e) => setEnCours(e.target.checked)}
                                />{" "}
                                Ce jour
                            </label>
                        </div>
                    </div>


                </div>

                <div className="form-group form-group-des">
                    <label>Description</label>
                    <div ref={quillRef} className="editor" />
                </div>

                <div className="form-actions">
                    <button className="deleteBtn" onClick={() => setTitre("")}>
                        🗑
                    </button>
                    <button className="doneBtn" onClick={handleAdd}>
                        Terminé
                    </button>
                </div>
            </div>
        </div>
    );
});

export default CertificatsForm;
