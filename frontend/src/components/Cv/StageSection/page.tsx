import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./style.css";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";

export interface Stage {
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
export interface StageSectionRef {
  fillStagesFromParent: (newStages: Stage[]) => void;
  getStages:() => Stage[];
}

const StageSection = forwardRef<StageSectionRef>((_, ref) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [enEdition, setEnEdition] = useState<boolean>(false);
  const [formationActuelle, setStageActuelle] = useState<Stage>({
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
  });

  // 🔹 Méthode exposée au parent
  useImperativeHandle(ref, () => ({
    fillStagesFromParent(newStages: Stage[]) {
      if (!newStages?.length) return;
      const formatted = newStages.map((f) => ({
        ...f,
        id: Date.now() + Math.random(),
      }));
      setStages(formatted);
    },
    getStages(){
      return stages
    }
  }));

  // 🔹 Sauvegarde de la formation en haut du tableau
  // 🔹 Sauvegarde (ajout ou mise à jour)
  const handleSave = () => {
    if (!formationActuelle.titre.trim()) return;

    if (enEdition) {
      // Mode modification : on remplace l'ancien
      setStages((prev) =>
        prev.map((f) =>
          f.id === formationActuelle.id ? { ...formationActuelle } : f
        )
      );
      setEnEdition(false);
    } else {
      // Mode ajout
      setStages((prev) => [
        ...prev,
        { ...formationActuelle, id: Date.now() },
      ]);
    }

    // Réinitialiser le formulaire
    setStageActuelle({
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
    });
  };



  const supprimerStage = (id: number) => {
    setStages((prev) => prev.filter((f) => f.id !== id));
  };

  const handleChange = (field: keyof Stage, value: any) => {
    setStageActuelle((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Nouvelle fonction pour modifier une formation existante
  const modifierStage = (id: number) => {
    const formationTrouvee = stages.find((f) => f.id === id);
    if (formationTrouvee) {
      setStageActuelle({ ...formationTrouvee });
      setEnEdition(true);
    }
  };

  return (
    <div className="formation-container">
      {/* Tableau des stages enregistrées */}
      {stages.length > 0 && (
        <div className="table-ctn">
          <table className="formation-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stages.map((f) => (
              <tr key={f.id}>
                <div className="table-row-d">
                  <td>{f.titre || "Sans titre"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => supprimerStage(f.id)}
                    >
                      Supprimer
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => modifierStage(f.id)}
                    >
                      Modifier
                    </button>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* Formulaire principal (inchangé) */}
      <StageCard
        formation={formationActuelle}
        onChange={(id, field, value) => handleChange(field, value)}
        onDelete={() => setStageActuelle({
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
        })}
        onSave={handleSave}
      />
    </div>
  );
});

export default StageSection;

// =========================
//   SOUS COMPOSANT
// =========================
export function StageCard({
  formation,
  onChange,
  onDelete,
  onSave,
}: {
  formation: Stage;
  onChange: (id: number, field: keyof Stage, value: any) => void;
  onDelete: (id: number) => void;
  onSave: () => void;
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

  

   useEffect(() => {
            if (quill) {
              const editor = quill.root;
              editor.style.fontFamily = "Arial, sans-serif";
              editor.style.fontSize = "16px";
        
              // ✅ Met à jour le contenu uniquement si différent
              if (quill.root.innerHTML !== formation.description) {
                quill.setContents([]);
                quill.clipboard.dangerouslyPasteHTML(formation.description || "");
              }
        
              quill.on("text-change", () => {
                onChange(formation.id, "description", quill.root.innerHTML);
              });
            }
          }, [quill, formation.description]); // ✅ ajouter formation.description

  return (
    <div className="formation-card">
      <div className="form-row">
        <label>Stage</label>
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
            <label>Employeur</label>
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
              onChange={(e) => onChange(formation.id, "ville", e.target.value)}
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
        <button className="save-btn" onClick={onSave}>
          ✔ Terminé
        </button>
      </div>
    </div>
  );
}
