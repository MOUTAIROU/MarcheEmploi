"use client";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./style.css";

type Competence = {
  nom: string;
  niveau: string;
};

export type LangueFormRef = {
  addSuggestion: (nom: string) => void;
  removeSuggestion: (nom: string) => void;
  resetSuggestions: (liste: string[]) => void;
  getSuggestions: () => string[];
  getValidated: () => Competence[];
  getLangues:() => Competence[];
  fillLanguesFromParent: (liste: Competence[]) => void; // 👈 nouvelle méthode
};

const LangueForm = forwardRef<LangueFormRef>((_, ref) => {
  const [competences, setCompetences] = useState<Competence[]>([
    { nom: "", niveau: "" },
  ]);
  const [validated, setValidated] = useState<Competence[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Portugais",
    "Italien",
    "Arabe",
    "Chinois (Mandarin)",
    "Russe",
    "Japonais",
    "Turc",
    "Swahili",
    "Néerlandais",
    "Coréen",
    "Hindi",
    "Lingala",
    "Fon",
    "Yoruba",
    "Zoulou",
    "Tamoul",
  ]);

  const niveaux = ["Débutant", "Intermédiaire", "Avancé", "Expert"];

  // 🔹 Modification d’un champ
  const handleChange = (
    index: number,
    field: keyof Competence,
    value: string
  ) => {
    const updated = [...competences];
    updated[index][field] = value;
    setCompetences(updated);
  };

  // 🔹 Ajouter une compétence vide
  const addCompetence = () => {
    setCompetences([...competences, { nom: "", niveau: "" }]);
  };

  // 🔹 Supprimer une compétence en cours
  const removeCompetence = (index: number) => {
    const updated = competences.filter((_, i) => i !== index);
    setCompetences(updated);
  };

  // 🔹 Supprimer une compétence validée
  const removeValidated = (nom: string) => {
    setValidated((prev) => prev.filter((c) => c.nom !== nom));
  };

  // 🔹 Ajouter depuis une suggestion (remplace si déjà présent)
  const addFromSuggestion = (nom: string) => {
    setCompetences((prev) => {
      const filtered = prev.filter((c) => c.nom !== nom);
      return [...filtered, { nom, niveau: "" }];
    });
  };

  // 🔹 Valider une compétence (remplace si doublon)
  const markAsDone = (index: number) => {
    const comp = competences[index];
    if (!comp.nom || !comp.niveau) {
      alert("Veuillez remplir la compétence et le niveau avant de valider.");
      return;
    }

    setValidated((prev) => {
      const filtered = prev.filter((c) => c.nom !== comp.nom);
      return [...filtered, comp];
    });

    removeCompetence(index);
  };

  // 🧩 Méthodes exposées au parent
  useImperativeHandle(ref, () => ({
    addSuggestion: (nom: string) => {
      setSuggestions((prev) => (prev.includes(nom) ? prev : [...prev, nom]));
    },
    removeSuggestion: (nom: string) => {
      setSuggestions((prev) => prev.filter((s) => s !== nom));
    },
    resetSuggestions: (liste: string[]) => {
      setSuggestions(liste);
    },
    getSuggestions: () => suggestions,
    getValidated: () => validated,
    getLangues(){
     return validated
    },

    // 🟩 Méthode principale : remplir depuis le parent
    fillLanguesFromParent: (liste: Competence[]) => {
      if (!Array.isArray(liste)) return;

      setValidated((prev) => {
        const merged = [...prev];
        liste.forEach((c) => {
          if (c.nom && c.niveau) {
            const existingIndex = merged.findIndex(
              (item) => item.nom === c.nom
            );
            if (existingIndex !== -1) {
              // remplace si déjà présent
              merged[existingIndex] = c;
            } else {
              merged.push(c);
            }
          }
        });
        return merged;
      });
    },
  }));

  return (
    <div className="competence-container">
      {/* ✅ Tableau des compétences validées */}
      {validated.length > 0 && (
        <table className="validated-table">
          <thead>
            <tr>
              <th>Langue</th>
              <th>Niveau</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {validated.map((c, i) => (
              <tr key={i}>
                <td>{c.nom}</td>
                <td>{c.niveau}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeValidated(c.nom)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧾 Formulaire principal */}
      {competences.map((comp, index) => (
        <div key={index} className="competence-card">
          <div className="form-group">
            <label>Langue</label>
            <input
             className="del-extra-margin"
              type="text"
              value={comp.nom}
              onChange={(e) => handleChange(index, "nom", e.target.value)}
              placeholder="Ex : Français"
            />
          </div>

          <div className="form-group">
            <label>Niveau</label>
            <select
              value={comp.niveau}
              onChange={(e) => handleChange(index, "niveau", e.target.value)}
            >
              <option value="">Choisissez</option>
              {niveaux.map((niv) => (
                <option key={niv} value={niv}>
                  {niv}
                </option>
              ))}
            </select>
          </div>

          <div className="actions">
            <button
              type="button"
              className="delete-btn btn-extra"
              onClick={() => removeCompetence(index)}
            >
              🗑️
            </button>
            <button
              type="button"
              className="done-btn btn-extra"
              onClick={() => markAsDone(index)}
            >
              ✔️ Terminé
            </button>
          </div>
        </div>
      ))}

      {/* 🔘 Boutons du bas */}
      <div className="bottom-buttons">
        <button type="button" className="add-btn" onClick={addCompetence}>
          + Ajouter une compétence
        </button>
        <button type="button" className="ai-btn">
          ✨ Suggestions de l'IA
        </button>
      </div>

      {/* 💡 Suggestions dynamiques */}
      <div className="suggestions">
        {suggestions.map((s, i) => (
          <span key={i} onClick={() => addFromSuggestion(s)}>
            + {s}
          </span>
        ))}
      </div>
    </div>
  );
});

export default LangueForm;
