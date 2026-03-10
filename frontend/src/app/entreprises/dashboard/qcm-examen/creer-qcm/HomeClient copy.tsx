"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import "./questions.css";
import Sidebar from "@/components/SidebarEntreprises/page";

interface Question {
    id: number;
    intitule: string;
    type: string;
    niveau: string;
    points: number;
    temps?: number;
    options: string[];
    bonnesReponses: string[];
    justification?: string;
    isOpen?: boolean;
}

export default function OffresPage() {

    const [afficherResultat, setAfficherResultat] = useState("non");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [nouvelleQuestion, setNouvelleQuestion] = useState<Question>({
        id: 0,
        intitule: "",
        type: "",
        niveau: "",
        points: 0,
        temps: undefined,
        options: [],
        bonnesReponses: [],
        justification: "",
    });
    const [optionTemp, setOptionTemp] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState("");

    const handleAddOption = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (newOption.trim() !== "") {
            setOptions([...options, newOption.trim()]);
            setNewOption("");
        }
    };


    const ajouterOption = () => {
        if (optionTemp.trim() === "") return;
        setNouvelleQuestion({
            ...nouvelleQuestion,
            options: [...nouvelleQuestion.options, optionTemp],
        });
        setOptionTemp("");
    };

    const sauvegarderQuestion = () => {
        if (!nouvelleQuestion.intitule.trim()) return;

        if (isEditing && editId !== null) {
            setQuestions((prev) =>
                prev.map((q) =>
                    q.id === editId ? { ...nouvelleQuestion, id: editId, isOpen: q.isOpen } : q
                )
            );
            setIsEditing(false);
            setEditId(null);
        } else {
            const newQuestion = {
                ...nouvelleQuestion,
                id: Date.now(),
                isOpen: false,
            };
            setQuestions([...questions, newQuestion]);
        }

        setNouvelleQuestion({
            id: 0,
            intitule: "",
            type: "",
            niveau: "",
            points: 0,
            temps: undefined,
            options: [],
            bonnesReponses: [],
            justification: "",
        });
        setShowForm(false);
    };

    const supprimerQuestion = (id: number) => {
        if (confirm("Supprimer cette question ?")) {
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        }
    };

    const modifierQuestion = (id: number) => {
        const q = questions.find((q) => q.id === id);
        if (!q) return;
        setNouvelleQuestion(q);
        setShowForm(true);
        setIsEditing(true);
        setEditId(id);
    };

    const toggleQuestion = (id: number) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id ? { ...q, isOpen: !q.isOpen } : q
            )
        );
    };


    return (
        <div>
            <main >
                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="mainContent">

                        <h2 className="qcm-title">Créer un QCM</h2>
                        <p className="qcm-subtitle">
                            Créez un questionnaire pour évaluer vos candidats sur un poste ou un appel d’offres.
                        </p>

                        <button className="qcm-btn-secondary">Retour à la liste des QCM</button>

                        <h3 className="qcm-section-title">Informations générales</h3>

                        <form className="qcm-form">
                            <div className="qcm-field">
                                <label>Titre du QCM</label>
                                <input type="text" placeholder="Titre du QCM" />
                            </div>

                            <div className="qcm-field">
                                <label>Catégorie / Domaine</label>
                                <select>
                                    <option value="">Sélectionnez une catégorie</option>
                                    <option>Développement Web</option>
                                    <option>Marketing</option>
                                    <option>Comptabilité</option>
                                </select>
                            </div>

                            <div className="qcm-field">
                                <label>Description</label>
                                <textarea rows={4} placeholder="Décrivez le contenu du QCM..." />
                            </div>

                            <div className="qcm-row">
                                <div className="qcm-field">
                                    <label>Durée limite (en minutes)</label>
                                    <input type="number" placeholder="Ex: 30" />
                                </div>
                                <div className="qcm-field">
                                    <label>Note minimale de réussite (%)</label>
                                    <input type="number" placeholder="Ex: 70" />
                                </div>
                            </div>

                            <div className="qcm-row">
                                <div className="qcm-field">
                                    <label>Mode de passage</label>
                                    <div className="qcm-radio-group">
                                        <label>
                                            <input type="radio" name="mode" /> Séquentiel (une question à la fois)
                                        </label>
                                        <label>
                                            <input type="radio" name="mode" defaultChecked /> Libre (toutes les questions visibles)
                                        </label>
                                    </div>
                                </div>

                                <div className="qcm-field">
                                    <label>Réponses aléatoires ?</label>
                                    <div className="qcm-radio-group">
                                        <label>
                                            <input type="radio" name="oui" /> Oui
                                        </label>
                                        <label>
                                            <input type="radio" name="non" defaultChecked /> Non
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="qcm-row">
                                <div className="qcm-field">
                                    <label>Tentatives autorisées</label>
                                    <input type="number" placeholder="Ex: 3" />
                                </div>
                                <div className="qcm-field">
                                    <label>Niveau global du test (optionnel)</label>
                                    <select>
                                        <option value="">Sélectionnez un niveau</option>
                                        <option>Débutant</option>
                                        <option>Intermédiaire</option>
                                        <option>Avancé</option>
                                    </select>
                                </div>
                            </div>

                            <div className="qcm-field">
                                <label>Afficher résultat immédiat ?</label>
                                <div className="qcm-radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name="resultat"
                                            value="oui"
                                            checked={afficherResultat === "oui"}
                                            onChange={() => setAfficherResultat("oui")}
                                        />{" "}
                                        Oui
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="resultat"
                                            value="non"
                                            checked={afficherResultat === "non"}
                                            onChange={() => setAfficherResultat("non")}
                                        />{" "}
                                        Non
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h3>Questions</h3>

                                {questions.map((q) => (
                                    <div key={q.id} className="question-box">
                                        <div className="question-header" onClick={() => toggleQuestion(q.id)}>
                                            <strong>
                                                Question — {q.intitule || "Sans titre"} ({q.niveau || "N/A"})
                                            </strong>
                                            <div className="actions">
                                                <button
                                                    className="btn-edit"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        modifierQuestion(q.id);
                                                    }}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        supprimerQuestion(q.id);
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                                <span className="arrow">{q.isOpen ? "▲" : "▼"}</span>
                                            </div>
                                        </div>

                                        {q.isOpen && (
                                            <div className="question-body">
                                                <p><b>Type :</b> {q.type}</p>
                                                <p><b>Points :</b> {q.points}</p>
                                                <p><b>Temps :</b> {q.temps || "—"}</p>
                                                <p><b>Options :</b> {q.options.join(", ") || "Aucune"}</p>
                                                <p><b>Bonne(s) réponse(s) :</b> {q.bonnesReponses.join(", ") || "—"}</p>
                                                {q.justification && (
                                                    <p><b>Justification :</b> {q.justification}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {!showForm && (
                                    <button className="btn-add" onClick={() => setShowForm(true)}>
                                        Ajouter une question
                                    </button>
                                )}

                                {showForm && (
                                    <div className="question-form">
                                        <h4>{isEditing ? "Modifier la question" : "Nouvelle question"}</h4>

                                        <div className="field">
                                            <label>Intitulé de la question</label>
                                            <input
                                                type="text"
                                                value={nouvelleQuestion.intitule}
                                                onChange={(e) =>
                                                    setNouvelleQuestion({ ...nouvelleQuestion, intitule: e.target.value })
                                                }
                                                placeholder="Ex : Quelle est la principale étape d’une vente B2B ?"
                                            />
                                        </div>

                                        {/* Type de question */}
                                        <div className="field">
                                            <label>Type de question</label>
                                            <select
                                                value={nouvelleQuestion.type}
                                                onChange={(e) => {
                                                    const selectedType = e.target.value;
                                                    // Adaptation automatique selon le type
                                                    if (selectedType === "vrai-faux") {
                                                        setOptions(["Vrai", "Faux"]);
                                                    } else if (selectedType === "reponse-texte") {
                                                        setOptions([]);
                                                    } else {
                                                        setOptions([]); // Réinitialise pour les QCM
                                                    }

                                                    setNouvelleQuestion({ ...nouvelleQuestion, type: selectedType });
                                                }}
                                            >
                                                <option value="">Sélectionnez un type</option>
                                                <option value="choix-multiple">Choix multiple</option>
                                                <option value="vrai-faux">Vrai / Faux</option>
                                                <option value="reponse-texte">Réponse texte</option>
                                                <option value="qcm-unique">QCM à réponse unique</option>
                                            </select>
                                        </div>

                                        {/* Niveau de difficulté */}
                                        <div className="field">
                                            <label>Niveau de difficulté</label>
                                            <select
                                                value={nouvelleQuestion.niveau}
                                                onChange={(e) =>
                                                    setNouvelleQuestion({ ...nouvelleQuestion, niveau: e.target.value })
                                                }
                                            >
                                                <option value="">Sélectionnez un niveau</option>
                                                <option value="facile">Facile</option>
                                                <option value="moyen">Moyen</option>
                                                <option value="difficile">Difficile</option>
                                            </select>
                                        </div>

                                        <div className="row">
                                            <div className="field">
                                                <label>Points attribués</label>
                                                <input
                                                    type="number"
                                                    value={nouvelleQuestion.points}
                                                    onChange={(e) =>
                                                        setNouvelleQuestion({
                                                            ...nouvelleQuestion,
                                                            points: Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="field">
                                                <label>Temps limite (optionnel)</label>
                                                <input
                                                    type="number"
                                                    value={nouvelleQuestion.temps || ""}
                                                    onChange={(e) =>
                                                        setNouvelleQuestion({
                                                            ...nouvelleQuestion,
                                                            temps: Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>




                                        {/* Options de réponse */}
                                        <div className="section">
                                            <label className="section-title">Options de réponse</label>
                                            <div className="section-content">
                                                {/* Cas 1 : choix multiple ou qcm unique */}
                                                {(nouvelleQuestion.type === "choix-multiple" ||
                                                    nouvelleQuestion.type === "qcm-unique" ||
                                                    nouvelleQuestion.type === "vrai-faux") && (
                                                        <>
                                                            {options.map((opt, index) => (
                                                                <div key={index} className="radio-item">
                                                                    {nouvelleQuestion.type === "qcm-unique" ||
                                                                        nouvelleQuestion.type === "vrai-faux" ? (
                                                                        <input type="radio" name="option" disabled />
                                                                    ) : (
                                                                        <input type="checkbox" disabled />
                                                                    )}
                                                                    <label>{opt}</label>
                                                                </div>
                                                            ))}

                                                            {/* Ajout manuel d’options (sauf vrai/faux) */}
                                                            {(nouvelleQuestion.type === "choix-multiple" ||
                                                                nouvelleQuestion.type === "qcm-unique") && (
                                                                    <div className="add-option">
                                                                        <input
                                                                            type="text"
                                                                            value={newOption}
                                                                            onChange={(e) => setNewOption(e.target.value)}
                                                                            placeholder="Nouvelle option"
                                                                        />
                                                                        <button type="button" onClick={handleAddOption}>
                                                                            AJOUTER
                                                                        </button>
                                                                    </div>
                                                                )}
                                                        </>
                                                    )}

                                                {/* Cas 2 : réponse texte (affiche textarea) */}
                                                {nouvelleQuestion.type === "reponse-texte" && (
                                                    <textarea
                                                        placeholder="Ex : Écrivez la bonne orthographe du mot ou une réponse courte"
                                                        value={nouvelleQuestion.bonnesReponses[0] || ""}
                                                        onChange={(e) =>
                                                            setNouvelleQuestion({
                                                                ...nouvelleQuestion,
                                                                bonnesReponses: [e.target.value],
                                                            })
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Marquer la/les bonne(s) réponse(s) */}
                                        <div className="section">
                                            <label className="section-title">Marquer la/les bonne(s) réponse(s)</label>
                                            <div className="section-content">
                                                {nouvelleQuestion.type === "reponse-texte" ? (
                                                    <input
                                                        type="text"
                                                        placeholder="Entrez la bonne réponse"
                                                        value={nouvelleQuestion.bonnesReponses[0] || ""}
                                                        onChange={(e) =>
                                                            setNouvelleQuestion({
                                                                ...nouvelleQuestion,
                                                                bonnesReponses: [e.target.value],
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    options.map((opt, index) => (
                                                        <div key={index} className="checkbox-item">
                                                            {nouvelleQuestion.type === "qcm-unique" ||
                                                                nouvelleQuestion.type === "vrai-faux" ? (
                                                                <input
                                                                    type="radio"
                                                                    name="bonne-reponse"
                                                                    checked={nouvelleQuestion.bonnesReponses.includes(opt)}
                                                                    onChange={() =>
                                                                        setNouvelleQuestion({ ...nouvelleQuestion, bonnesReponses: [opt] })
                                                                    }
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="checkbox"
                                                                    checked={nouvelleQuestion.bonnesReponses.includes(opt)}
                                                                    onChange={(e) => {
                                                                        const newBonnes =
                                                                            e.target.checked
                                                                                ? [...nouvelleQuestion.bonnesReponses, opt]
                                                                                : nouvelleQuestion.bonnesReponses.filter((r) => r !== opt);
                                                                        setNouvelleQuestion({
                                                                            ...nouvelleQuestion,
                                                                            bonnesReponses: newBonnes,
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                            <label>{opt}</label>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>





                                        {/* Explication / Justification */}
                                        <div className="section">
                                            <label className="section-title">
                                                Explication / justification (facultatif)
                                            </label>
                                            <textarea placeholder="Expliquer pourquoi cette réponse est correcte ou incorrecte..."></textarea>
                                        </div>

                                        

                                        

                                        <div className="form-actions">
                                            <button type="button" className="btn-add" onClick={sauvegarderQuestion}>
                                                {isEditing ? "Mettre à jour" : "Ajouter la question"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-cancel"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setIsEditing(false);
                                                    setNouvelleQuestion({
                                                        id: 0,
                                                        intitule: "",
                                                        type: "",
                                                        niveau: "",
                                                        points: 0,
                                                        temps: undefined,
                                                        options: [],
                                                        bonnesReponses: [],
                                                        justification: "",
                                                    });
                                                }}
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="qcm-btn-primary">
                                Enregistrer le QCM
                            </button>
                        </form>


                    </div>
                </div>
            </main >
        </div >


    );
}
