"use client";
import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./style.css";

interface Formation {
  id: number;
  titre: string;
  etablissement: string;
  ville: string;
  debutMois: string;
  debutAnnee: string;
  finMois: string;
  finAnnee: string;
  enCours: boolean;
  description: string;
}

export default function FormationSection() {
  const [formations, setFormations] = useState<Formation[]>([
    {
      id: Date.now(),
      titre: "",
      etablissement: "",
      ville: "",
      debutMois: "",
      debutAnnee: "",
      finMois: "",
      finAnnee: "",
      enCours: false,
      description: "",
    },
  ]);

  const ajouterFormation = () => {
    setFormations((prev) => [
      ...prev,
      {
        id: Date.now(),
        titre: "",
        etablissement: "",
        ville: "",
        debutMois: "",
        debutAnnee: "",
        finMois: "",
        finAnnee: "",
        enCours: false,
        description: "",
      },
    ]);
  };

  const supprimerFormation = (id: number) => {
    setFormations((prev) => prev.filter((f) => f.id !== id));
  };

  const handleChange = (id: number, field: keyof Formation, value: any) => {
    setFormations((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  return (
    <div className="formation-container">
      {formations.map((formation) => (
        <FormationCard
          key={formation.id}
          formation={formation}
          onChange={handleChange}
          onDelete={supprimerFormation}
        />
      ))}

      <button className="add-btn" onClick={ajouterFormation}>
        ➕ Ajouter une formation
      </button>
    </div>
  );
}

function FormationCard({
  formation,
  onChange,
  onDelete,
}: {
  formation: Formation;
  onChange: (id: number, field: keyof Formation, value: any) => void;
  onDelete: (id: number) => void;
}) {
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

  React.useEffect(() => {
    if (quill) {
      const editor = quill.root;
      editor.style.fontFamily = "Arial, sans-serif";
      editor.style.fontSize = "16px";
    }
  }, [quill]);

  // Fonction IA : ajoute un texte suggestion dans CE quill
  const fillWithSuggestion = (text?: string) => {
    if (!quill) return;
    const defaultText =
      "Passionné(e) par la création et toujours prêt(e) à relever de nouveaux défis !";
    quill.setText(text ?? defaultText);
  };

  return (
    <div className="formation-card">
      <div className="form-row">
        <label>Formation</label>
        <input
          type="text"
          value={formation.titre}
          onChange={(e) =>
            onChange(formation.id, "titre", e.target.value)
          }
          placeholder="Ex : Licence en Informatique"
        />
      </div>

      <div className="form-row-grid">
        <div className="form-row double">
          <div>
            <label>Établissement</label>
            <input
              type="text"
              value={formation.etablissement}
              onChange={(e) =>
                onChange(formation.id, "etablissement", e.target.value)
              }
            />
          </div>

          <div>
            <label>Date de début</label>
            <div className="date-row">
              <select
                value={formation.debutMois}
                onChange={(e) =>
                  onChange(formation.id, "debutMois", e.target.value)
                }
              >
                <option>Mois</option>
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
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Année"
                value={formation.debutAnnee}
                onChange={(e) =>
                  onChange(formation.id, "debutAnnee", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="form-row double">
          <div>
            <label>Ville</label>
            <input
              type="text"
              value={formation.ville}
              onChange={(e) =>
                onChange(formation.id, "ville", e.target.value)
              }
            />
          </div>

          <div className="dateposition">
            <label>Date de fin</label>
            <div className="date-row">
              <select
                value={formation.finMois}
                onChange={(e) =>
                  onChange(formation.id, "finMois", e.target.value)
                }
                disabled={formation.enCours}
              >
                <option>Mois</option>
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
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Année"
                value={formation.finAnnee}
                onChange={(e) =>
                  onChange(formation.id, "finAnnee", e.target.value)
                }
                disabled={formation.enCours}
              />
              <label className="checkbox today">
                <input
                  type="checkbox"
                  checked={formation.enCours}
                  onChange={(e) =>
                    onChange(formation.id, "enCours", e.target.checked)
                  }
                />
                ce jour
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label>Description</label>
        <div ref={quillRef} className="editor" />
        <button
          onClick={() => fillWithSuggestion()}
          className="aiButton"
        >
          ✨ Suggestions de l'IA
        </button>
      </div>

      <div className="form-footer">
        <button className="delete-btn" onClick={() => onDelete(formation.id)}>
          🗑️ Supprimer
        </button>
        <button className="save-btn">✔ Terminé</button>
      </div>
    </div>
  );
}
