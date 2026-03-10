"use client";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./style.css";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface Formation {
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

// --- Interface exposée au parent ---
export interface FormationSectionRef {
  fillFormationsFromParent: (newFormations: Formation[]) => void;
}

const FormationSection = forwardRef<FormationSectionRef>((_, ref) => {
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

  // 🔹 Méthode exposée au grand parent
  useImperativeHandle(ref, () => ({
    fillFormationsFromParent(newFormations: Formation[]) {
      if (!newFormations?.length) return;
      const formatted = newFormations.map((f) => ({
        ...f,
        id: Date.now() + Math.random(),
      }));
      setFormations(formatted);
    },
  }));

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
});


export function FormationCard({
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
      quill.setText(formation.description || "");
    }
  }, [quill, formation.description]);

  return (
    <div className="formation-card">
      <div className="form-row">
        <label>Formation</label>
        <input
          type="text"
          value={formation.titre}
          onChange={(e) => onChange(formation.id, "titre", e.target.value)}
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

export default FormationSection;
