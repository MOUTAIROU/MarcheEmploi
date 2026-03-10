"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import "./questions.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import { useParams } from "next/navigation";
import api from "@/lib/axiosInstance";
import { countryNumberCode, treatment_msg_to_send, reverse_treatment_msg, country, countryCode, CATEGORIE_LABELS } from "@/utils/types";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'

const MAX_CHARACTERS = 2000;
interface Question {
    id: number;
    intitule: string;
    type: string;
    niveau: string;
    optionTexte: string;
    points: number;
    temps?: number;
    tempsMin?: number; // minutes
    tempsSec?: number; // secondes:
    options: string[];
    bonnesReponses: string[];
    justification?: string;
    isOpen?: boolean;
}


interface Parametre {
    difficulte: boolean,
    inactivite: boolean,
    retour: boolean,
    chrono: boolean,
    mail: boolean,
}
const MAX_QUESTIONS = 20;

export default function OffresPage() {

    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [duree, setDuree] = useState<number | "">("");
    const [noteMin, setNoteMin] = useState<number | "">("");
    const [mode, setMode] = useState<"libre" | "sequentiel">("libre");
    const [tentatives, setTentatives] = useState<number | "">("");
    const [niveauGlobal, setNiveauGlobal] = useState("");
    const [reponsesAleatoires, setReponsesAleatoires] = useState(false);
    const [afficherResultat, setAfficherResultat] = useState("non");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [params, setParams] = useState<Parametre>({
        difficulte: false,
        inactivite: true,
        retour: true,
        chrono: true,
        mail: false,
    });
    const [nouvelleQuestion, setNouvelleQuestion] = useState<Question>({
        id: 0,
        intitule: "",
        type: "",
        niveau: "",
        optionTexte: "",
        tempsMin: 0, // minutes
        tempsSec: 0, // secondes:
        points: 1,
        temps: undefined,
        options: [],
        bonnesReponses: [],
        justification: "",
    });
    const [optionTemp, setOptionTemp] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [categorie, setCategorie] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState("");
    const [texteOption, setTexteOption] = useState("");
    const { qcmId } = useParams<{ qcmId: string }>();

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (!qcmId) return;
        getOffres()

    }, [qcmId]);

    useEffect(() => {
        // Si le QCM passe en mode libre, réinitialiser tempsMin et tempsSec pour la nouvelleQuestion
        if (mode === "libre") {
            setNouvelleQuestion(prev => ({
                ...prev,
                tempsMin: 0,
                tempsSec: 0
            }));
        }
    }, [mode]);

    async function getOffres() {
        try {
            const response = await api.get(
                `entreprise_get/get_qcm_by_post_id/${qcmId}`
            );

            const offre = response.data.data;
            if (!offre) return;


            // 🔹 Infos générales
            setTitre(offre.titre || "");
            setCategorie(offre.categorie || "");
            setDescription(reverse_treatment_msg(offre.categorie) || "");
            setDuree(Number(offre.duree) || "");
            setNoteMin(Number(offre.noteMin) || "");
            setMode(offre.mode === "sequentiel" ? "sequentiel" : "libre");
            setTentatives(Number(offre.tentatives) || "");
            setNiveauGlobal(offre.niveauGlobal || "");
            setAfficherResultat(offre.afficherResultat ? "oui" : "non");
            setReponsesAleatoires(!!offre.reponsesAleatoires);

            // 🔹 Paramètres avancés
            if (offre.params) {
                setParams({
                    difficulte: !!offre.params.difficulte,
                    inactivite: !!offre.params.inactivite,
                    retour: !!offre.params.retour,
                    chrono: !!offre.params.chrono,
                    mail: !!offre.params.mail,
                });
            }

            // 🔹 Questions
            if (Array.isArray(offre.questions)) {
                setQuestions(
                    offre.questions.map((q: any, index: number) => ({
                        id: index + 1,
                        intitule: q.intitule,
                        type: q.type,
                        niveau: q.niveau,
                        optionTexte: q.optionTexte || "",
                        points: q.points || 0,
                        tempsMin: q.tempsMin || 0,
                        tempsSec: q.tempsSec || 0,
                        options: q.options || [],
                        bonnesReponses: q.bonnesReponses || [],
                        justification: q.justification || "",
                        isOpen: false,
                    }))
                );
            }

        } catch (error) {
            console.error("Erreur récupération offre :", error);
        }
    }


    function decodeHTML(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const handleRemoveOption = (index: number) => {
        const removedOption = options[index];

        const newOptions = options.filter((_, i) => i !== index);
        const newBonnes = nouvelleQuestion.bonnesReponses.filter(
            (r) => r !== removedOption
        );

        setOptions(newOptions);
        setNouvelleQuestion({
            ...nouvelleQuestion,
            options: newOptions,
            bonnesReponses: newBonnes,
        });
    };

    const handleChange = (key: string, value: boolean) => {
        setParams({ ...params, [key]: value });
    };

    const handlePreview = () => alert("Prévisualisation du QCM");

    const handleSave = async () => {
        try {
            const payload = buildPayload();

            await api.put(
                "entreprise_update/update_qcm",
                { ...payload, statut: "brouillon" }
            );

            alert("💾 QCM enregistré comme brouillon");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l’enregistrement");
        }
    };


    function validateQCM(): string | null {
        if (!titre.trim()) return "Titre du QCM obligatoire.";
        if (!categorie) return "Catégorie / Domaine obligatoire.";
        if (!description.trim()) return "Description obligatoire.";
        if (!duree) return "Durée obligatoire.";
        if (!noteMin) return "Note minimale de réussite (%) obligatoire.";
        //  if (!tentatives) return "Nombre de tentatives obligatoire.";

        let totalPoints = 0;

        if (questions.length === 0)
            return "Ajoutez au moins une question.";

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            if (!q.intitule.trim())
                return `Question ${i + 1} : intitulé obligatoire.`;

            if (!q.type)
                return `Question ${i + 1} : type obligatoire.`;

            if (!q.niveau)
                return `Question ${i + 1} : niveau obligatoire.`;

            if (!q.points)
                return `Question ${i + 1} : points obligatoires.`;

            totalPoints += q.points; // 🔹 addition des points

            if (!q.bonnesReponses || q.bonnesReponses.length === 0)
                return `Question ${i + 1} : sélectionnez la bonne réponse.`;

            if (
                (q.type === "choix-multiple" || q.type === "qcm-unique") &&
                (!q.options || q.options.length < 2)
            )
                return `Question ${i + 1} : au moins 2 options.`;
        }

        // 🔹 Vérification du total des points
        if (totalPoints > 100)
            return `Le total des points des questions (${totalPoints}) ne doit pas dépasser 100.`;

        return null;
    }


    const handleUpdateOption = (index: number, value: string) => {
        const oldOption = options[index];

        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);

        // 🔁 Mettre à jour bonnes réponses si nécessaire
        const newBonnes = nouvelleQuestion.bonnesReponses.map((r) =>
            r === oldOption ? value : r
        );

        setNouvelleQuestion({
            ...nouvelleQuestion,
            options: newOptions,
            bonnesReponses: newBonnes,
        });
    };

    const handlePublish = async () => {
        try {

            const payload = buildPayload();

            const error = validateQCM();

            if (error) {
                setErrorMsg(error);
                setShowError(true);
                return;
            }


            const response = await api.post(
                "entreprise/update_qcm", payload
            );

            console.log(response)
            if (response.status == 201) {
                const { data } = response
                if (data.status == "updated" || data.status == "no_change") {
                    setSuccessMsg(" Le QCM a été mise à jour avec succès.");
                    setShowSuccess(true)
                }

            }

        } catch (error) {
            console.error(error);
            setErrorMsg("Une erreur est survenue lors de l’enregistrement du QCM.");
            setShowError(true);
        }
    };


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

        if (questions.length >= MAX_QUESTIONS) {
            setErrorMsg(`Vous ne pouvez pas ajouter plus de ${MAX_QUESTIONS} questions.`);
            setShowError(true);
            return;
        }

        if (!nouvelleQuestion.intitule.trim()) return;

        if (nouvelleQuestion.intitule.length > MAX_CHARACTERS) {
            setErrorMsg(`L’intitulé de la question ne peut pas dépasser ${MAX_CHARACTERS} caractères.`);
            setShowError(true);
            return;
        }

        const questionToSave = {
            ...nouvelleQuestion,
            options: [...options], // <-- on copie les options actuelles ici
            optionTexte: texteOption, // <-- ajoute l'option texte si nécessaire
        };

        let updatedQuestions: Question[];

        if (isEditing && editId !== null) {
            updatedQuestions = questions.map((q) =>
                q.id === editId ? { ...questionToSave, id: editId, isOpen: q.isOpen } : q
            );
            setQuestions(updatedQuestions);
            setIsEditing(false);
            setEditId(null);
        } else {
            const newQuestion = {
                ...questionToSave,
                id: Date.now(),
                isOpen: false,
            };
            updatedQuestions = [...questions, newQuestion];
            setQuestions(updatedQuestions);
        }

        // Affiche le tableau des questions dans la console
        console.log("Questions actuelles :", updatedQuestions);

        if (mode === "sequentiel") {
            setNouvelleQuestion({
                id: 0,
                intitule: "",
                type: "",
                niveau: "",
                optionTexte: "",
                points: 0,
                tempsMin: 1, // minutes
                tempsSec: 0, // secondes:
                temps: undefined,
                options: [],
                bonnesReponses: [],
                justification: "",
            });
        } else {
            setNouvelleQuestion({
                id: 0,
                intitule: "",
                type: "",
                niveau: "",
                optionTexte: "",
                points: 0,
                tempsMin: 0, // minutes
                tempsSec: 0, // secondes:
                temps: undefined,
                options: [],
                bonnesReponses: [],
                justification: "",
            });
        }
        setOptions([]);
        setTexteOption("");
        setShowForm(false);
    };
    const buildPayload = () => {
        return {
            post_id: qcmId,
            titre,
            categorie,
            description: treatment_msg_to_send(description),
            duree,
            countryCode,
            noteMin,
            mode,
            tentatives,
            niveauGlobal,
            afficherResultat: afficherResultat === "oui",
            reponsesAleatoires,

            params: {
                difficulte: params.difficulte,
                inactivite: params.inactivite,
                retour: params.retour,
                chrono: params.chrono,
                mail: params.mail,
            },

            questions: questions.map((q) => ({
                type: q.type,
                niveau: q.niveau,
                points: q.points,
                intitule: q.intitule,
                options: q.options,
                bonnesReponses: q.bonnesReponses,
                optionTexte: q.optionTexte,
                justification: q.justification,
                tempsMin: q.tempsMin || 0,
                tempsSec: q.tempsSec || 0,
            })),
        };
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
        setOptions(q.options || []); // <-- ajoute ceci
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

                        {showError && (
                            <PopupError
                                isOpen={showError}
                                title="Erreur"
                                message={errorMsg}
                                onClose={() => setShowError(false)}
                            />
                        )}

                        {showSuccess && (
                            <PopupSuccess
                                isOpen={showSuccess}
                                title="Success"
                                message={successMsg}
                                onClose={() => setShowSuccess(false)}
                            />
                        )}


                        <h2 className="qcm-title">Créer un QCM</h2>
                        <p className="qcm-subtitle">
                            Créez un questionnaire pour évaluer vos candidats sur un poste ou un appel d’offres.
                        </p>

                        <button className="qcm-btn-secondary">Retour à la liste des QCM</button>

                        <h3 className="qcm-section-title">Informations générales</h3>

                        <form className="qcm-form">
                            <div className="qcm-field">
                                <label>Titre du QCM</label>
                                <input type="text"
                                    placeholder="Titre du QCM"
                                    value={titre}
                                    onChange={(e) => setTitre(e.target.value)} />
                            </div>

                            <div className="qcm-field">
                                <label>Catégorie / Domaine</label>
                                <select
                                    value={categorie}
                                    onChange={(e) => setCategorie(e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionnez une catégorie</option>

                                    {/* IT & Digital */}
                                    <option value="developpement_web">Développement Web</option>
                                    <option value="developpement_mobile">Développement Mobile</option>
                                    <option value="reseaux_systemes">Réseaux & Systèmes</option>
                                    <option value="data_ia">Data / IA</option>

                                    {/* Business */}
                                    <option value="marketing">Marketing</option>
                                    <option value="vente_commercial">Vente / Commercial</option>
                                    <option value="gestion_projet">Gestion de projet</option>

                                    {/* Finance & Admin */}
                                    <option value="comptabilite">Comptabilité</option>
                                    <option value="finance">Finance</option>
                                    <option value="administration">Administration</option>

                                    {/* Appels d’offres */}
                                    <option value="appel_offre_btp">Appel d’offres – BTP</option>
                                    <option value="appel_offre_services">Appel d’offres – Services</option>
                                    <option value="appel_offre_fournitures">Appel d’offres – Fournitures</option>

                                    {/* Autres */}
                                    <option value="ressources_humaines">Ressources humaines</option>
                                    <option value="juridique">Juridique</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            <div className="qcm-field">
                                <label>Description</label>
                                <textarea rows={4}
                                    placeholder="Décrivez le contenu du QCM..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            <div className="qcm-row">
                                <div className="qcm-field">
                                    <label>Durée limite (en minutes)</label>
                                    <input type="number"
                                        placeholder="Durée en minutes (0 à 360)"
                                        max={360}
                                        value={duree}
                                        onChange={(e) => setDuree(Number(e.target.value))} />
                                </div>
                                <div className="qcm-field">
                                    <label>Note minimale de réussite (%)</label>
                                    <input type="number"
                                        placeholder="Ex: 70"
                                        value={noteMin}
                                        onChange={(e) => setNoteMin(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="qcm-row">
                                <div className="qcm-field">
                                    <label>Mode de passage</label>
                                    <div className="qcm-radio-group">
                                        <label>
                                            <input type="radio"
                                                name="mode"
                                                checked={mode === "sequentiel"}
                                                onChange={() => setMode("sequentiel")} /> Séquentiel (une question à la fois)
                                        </label>
                                        <label>
                                            <input type="radio"
                                                name="mode"
                                                checked={mode === "libre"}
                                                onChange={() => setMode("libre")} /> Libre (toutes les questions visibles)
                                        </label>
                                    </div>
                                </div>

                                <div className="qcm-field">
                                    <label>Réponses aléatoires ?</label>
                                    <div className="qcm-radio-group">
                                        <label>
                                            <input type="radio"
                                                checked={reponsesAleatoires}
                                                onChange={() => setReponsesAleatoires(true)} /> Oui
                                        </label>
                                        <label>
                                            <input type="radio"
                                                checked={!reponsesAleatoires}
                                                onChange={() => setReponsesAleatoires(false)} /> Non
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="qcm-row">
                                <div className="qcm-field">
                                    <label>Tentatives autorisées</label>
                                    <input type="number"
                                        placeholder="Ex: 3"
                                        value={tentatives}
                                        onChange={(e) => setTentatives(Number(e.target.value))} />
                                </div>
                                <div className="qcm-field">
                                    <label>Niveau global du test (optionnel)</label>
                                    <select
                                        value={niveauGlobal}
                                        onChange={(e) => setNiveauGlobal(e.target.value)}
                                    >
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
                                <div className="question-titre"> <h3>Questions</h3></div>

                                {questions.map((q, i) => (
                                    <div key={q.id} className="question-box">
                                        <div className="question-header" onClick={() => toggleQuestion(q.id)}>
                                            <strong>
                                                Question ({i + 1}) — {reverse_treatment_msg(q.intitule) || "Sans titre"} ({q.niveau || "N/A"})
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
                                                <p>
                                                    <b>Temps :</b>{" "}
                                                    {q.tempsMin || q.tempsSec
                                                        ? `${q.tempsMin ?? 0} min ${q.tempsSec ?? 0} sec`
                                                        : "—"}
                                                </p>
                                                {/* Affiche options selon le type de question */}
                                                {q.type === "reponse-texte" ? (
                                                    <p><b>Option / Indice :</b> {q.optionTexte || "—"}</p>
                                                ) : (
                                                    <p><b>Options :</b> {q.options.join(", ") || "Aucune"}</p>
                                                )}
                                                <p><b>Bonne(s) réponse(s) :</b> {q.bonnesReponses.join(", ") || "—"}</p>
                                                {q.justification && (
                                                    <p><b>Justification :</b> {reverse_treatment_msg(q.justification)}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}



                                {!showForm && questions.length < MAX_QUESTIONS && (
                                    <button className="btn-add" onClick={() => setShowForm(true)}>
                                        Ajouter une question
                                    </button>
                                )}
                                {questions.length >= MAX_QUESTIONS && (
                                    <p className="info-limit">Nombre maximum de questions atteint.</p>
                                )}

                                {showForm && (
                                    <div className="question-form">
                                        <h4>{isEditing ? "Modifier la question" : "Nouvelle question"}</h4>

                                        <div className="field">
                                            <label>Intitulé de la question</label>
                                            <textarea

                                                value={reverse_treatment_msg(nouvelleQuestion.intitule)}
                                                onChange={(e) =>

                                                    setNouvelleQuestion({
                                                        ...nouvelleQuestion,
                                                        intitule: treatment_msg_to_send(e.target.value),
                                                    })
                                                }
                                                placeholder={`Rédigez votre question ici (maximum ${MAX_CHARACTERS} caractères)`}

                                                rows={3}
                                                className="question-textarea"
                                            />
                                        </div>

                                        {/* Type de question */}
                                        <div className="field">
                                            <label>Type de question</label>
                                            <select
                                                value={nouvelleQuestion.type}
                                                onChange={(e) => {
                                                    const selectedType = e.target.value;
                                                    let newOptions: string[] = [];
                                                    let newBonnesReponses: string[] = [];

                                                    if (selectedType === "vrai-faux") {
                                                        newOptions = ["Vrai", "Faux"];
                                                    } else if (selectedType === "reponse-texte") {
                                                        newOptions = [];
                                                        newBonnesReponses = [""]; // réinitialise la bonne réponse
                                                    } else {
                                                        newOptions = [];
                                                    }

                                                    setOptions(newOptions);
                                                    setNouvelleQuestion({
                                                        ...nouvelleQuestion,
                                                        type: selectedType,
                                                        options: newOptions,
                                                        bonnesReponses: newBonnesReponses,
                                                    });
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
                                                <label>  Temps limite par question{" "} {mode === "libre" ? "(désactivé en mode Libre)" : "(Mode Séquentiel)"}</label>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={nouvelleQuestion.tempsMin ?? ""} // <-- Ici
                                                        onChange={(e) =>
                                                            setNouvelleQuestion({ ...nouvelleQuestion, tempsMin: Number(e.target.value) })
                                                        }
                                                        placeholder="Minutes"
                                                        disabled={mode === "libre"} // 🔹 Désactivation si mode libre
                                                    />
                                                    <div className="span-text">minute</div>
                                                    <input
                                                        type="number"
                                                        min={15}
                                                        max={59}
                                                        value={nouvelleQuestion.tempsSec ?? ""}
                                                        onChange={(e) =>
                                                            setNouvelleQuestion({ ...nouvelleQuestion, tempsSec: Number(e.target.value) })
                                                        }
                                                        placeholder="Secondes"
                                                        disabled={mode === "libre"} // 🔹 Désactivation si mode libre
                                                    />
                                                    <div className="span-text">second</div>
                                                </div>
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


                                                                <div key={index} className="option-item">
                                                                    {nouvelleQuestion.type === "qcm-unique" ||
                                                                        nouvelleQuestion.type === "vrai-faux" ? (
                                                                        <input type="radio" disabled />
                                                                    ) : (
                                                                        <input type="checkbox" disabled />
                                                                    )}

                                                                    <input
                                                                        type="text"
                                                                        value={opt}
                                                                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                                                                        className="option-input"
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        className="btn-remove-option"
                                                                        onClick={() => handleRemoveOption(index)}
                                                                        title="Supprimer l’option"
                                                                    >
                                                                        ❌
                                                                    </button>
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
                                                        value={reverse_treatment_msg(texteOption)}
                                                        onChange={(e) => setTexteOption(treatment_msg_to_send(e.target.value))}
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

                                            <textarea
                                                placeholder="Expliquer pourquoi cette réponse est correcte ou incorrecte..."
                                                value={reverse_treatment_msg(nouvelleQuestion.justification || "")}
                                                onChange={(e) =>
                                                    setNouvelleQuestion({
                                                        ...nouvelleQuestion,
                                                        justification: treatment_msg_to_send(e.target.value),
                                                    })
                                                }
                                            ></textarea>
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
                                                        optionTexte: "",
                                                        points: 0,
                                                        tempsMin: 0, // minutes
                                                        tempsSec: 0, // secondes:
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


                            <div className="question-titre"> <h3>Paramètres avancés (optionnel)</h3></div>

                            <div className="option">
                                <label>Activer difficulté adaptative ?</label>
                                <div className="radio-group">
                                    <label><input type="radio" checked={params.difficulte} onChange={() => handleChange("difficulte", true)} /> Oui</label>
                                    <label><input type="radio" checked={!params.difficulte} onChange={() => handleChange("difficulte", false)} /> Non</label>
                                </div>
                            </div>

                            <div className="option">
                                <label>Activer détection d'inactivité ?</label>
                                <div className="radio-group">
                                    <label><input type="radio" checked={params.inactivite} onChange={() => handleChange("inactivite", true)} /> Oui</label>
                                    <label><input type="radio" checked={!params.inactivite} onChange={() => handleChange("inactivite", false)} /> Non</label>
                                </div>
                            </div>

                            <div className="option">
                                <label>Empêcher retour arrière ?</label>
                                <div className="radio-group">
                                    <label><input type="radio" checked={params.retour} onChange={() => handleChange("retour", true)} /> Oui</label>
                                    <label><input type="radio" checked={!params.retour} onChange={() => handleChange("retour", false)} /> Non</label>
                                </div>
                            </div>

                            <div className="option">
                                <label>Afficher chronomètre global ?</label>
                                <div className="radio-group">
                                    <label><input type="radio" checked={params.chrono} onChange={() => handleChange("chrono", true)} /> Oui</label>
                                    <label><input type="radio" checked={!params.chrono} onChange={() => handleChange("chrono", false)} /> Non</label>
                                </div>
                            </div>

                            <div className="option">
                                <label>Envoyer mail automatique du résultat</label>
                                <div className="radio-group">
                                    <label><input type="radio" checked={params.mail} onChange={() => handleChange("mail", true)} /> Oui</label>
                                    <label><input type="radio" checked={!params.mail} onChange={() => handleChange("mail", false)} /> Non</label>
                                </div>
                            </div>



                            <button type="button" className="publish-btn" onClick={handlePublish}>
                                ✅ Publier le QCM
                            </button>


                        </form>


                    </div>
                </div>
            </main >

        </div >


    );
}
