import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./style.css";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";

export interface Experience {
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
export interface ExperienceSectionRef {
  fillExperienceFromParent: (newFormations: Experience[]) => void;
  getExperiences: () => Experience[];
}

const ExperienceSection = forwardRef<ExperienceSectionRef>((_, ref) => {
  const [formations, setFormations] = useState<Experience[]>([]);
  const [enEdition, setEnEdition] = useState<boolean>(false);
  const [formationActuelle, setFormationActuelle] = useState<Experience>({
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
    fillExperienceFromParent(newFormations: Experience[]) {
      if (!newFormations?.length) return;
      const formatted = newFormations.map((f) => ({
        ...f,
        id: Date.now() + Math.random(),
      }));
      setFormations(formatted);
    },
   
    getExperiences() {           // ✅ nouvelle méthode exposée
      return formations;
    },
  }));

  // 🔹 Sauvegarde de la formation en haut du tableau
  // 🔹 Sauvegarde (ajout ou mise à jour)
  const handleSave = () => {
    if (!formationActuelle.titre.trim()) return;

    if (enEdition) {
      // Mode modification : on remplace l'ancien
      setFormations((prev) =>
        prev.map((f) =>
          f.id === formationActuelle.id ? { ...formationActuelle } : f
        )
      );
      setEnEdition(false);
    } else {
      // Mode ajout
      setFormations((prev) => [
        ...prev,
        { ...formationActuelle, id: Date.now() },
      ]);
    }

    // Réinitialiser le formulaire
    setFormationActuelle({
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



  const supprimerFormation = (id: number) => {
    setFormations((prev) => prev.filter((f) => f.id !== id));
  };

  const handleChange = (field: keyof Experience, value: any) => {
    setFormationActuelle((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Nouvelle fonction pour modifier une formation existante
  const modifierFormation = (id: number) => {
    const formationTrouvee = formations.find((f) => f.id === id);
    if (formationTrouvee) {
      setFormationActuelle({ ...formationTrouvee });
      setEnEdition(true);
    }
  };

  return (
    <div className="formation-container">
      {/* Tableau des formations enregistrées */}
      {formations.length > 0 && (
        <div className="table-ctn" >
          <table className="formation-table">
            <thead>
              <tr>
                <th>Experience</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formations.map((f) => (
                <tr key={f.id}>
                  <div className="table-row-d">
                    <td>{f.titre || "Sans titre"}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => supprimerFormation(f.id)}
                      >
                        Supprimer
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => modifierFormation(f.id)}
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
      <FormationCard
        formation={formationActuelle}
        onChange={(id, field, value) => handleChange(field, value)}
        onDelete={() => setFormationActuelle({
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

export default ExperienceSection;

// =========================
//   SOUS COMPOSANT
// =========================
export function FormationCard({
  formation,
  onChange,
  onDelete,
  onSave,
}: {
  formation: Experience;
  onChange: (id: number, field: keyof Experience, value: any) => void;
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
        <label>Experience</label>
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
