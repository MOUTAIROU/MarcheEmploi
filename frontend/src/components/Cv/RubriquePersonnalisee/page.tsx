"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./style.css";

export interface RubriquePersonnalisee {
  id: number;
  titre: string;
  description: string;
  lien?: string;
  date?: string;
}

export interface RubriquesPersonnaliseesRef {
  getRubriques: () => RubriquePersonnalisee[];
  fillRubriquesPersonnaliseesFromParent: (data: RubriquePersonnalisee[]) => void;
}

const RubriquesPersonnalisees = forwardRef<RubriquesPersonnaliseesRef>((props, ref) => {
  const [rubriques, setRubriques] = useState<RubriquePersonnalisee[]>([]);
  const [rubriqueEnEdition, setRubriqueEnEdition] = useState<RubriquePersonnalisee | null>(null);
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

  // Style par défaut du contenu
  useEffect(() => {
    if (quill) {
      const editor = quill.root;
      editor.style.fontFamily = "Arial, sans-serif";
      editor.style.fontSize = "16px";

      // Sync Quill avec le state
      quill.on("text-change", () => {
        if (rubriqueEnEdition) {
          const html = quill.root.innerHTML;
          setRubriqueEnEdition({ ...rubriqueEnEdition, description: html });
          setRubriques(rubriques.map(r => r.id === rubriqueEnEdition.id ? { ...r, description: html } : r));
        }
      });
    }
  }, [quill, rubriqueEnEdition, rubriques]);

  

  const modifierRubrique = (id: number, field: keyof RubriquePersonnalisee, value: string) => {
    setRubriques(rubriques.map(r => (r.id === id ? { ...r, [field]: value } : r)));
    if (rubriqueEnEdition && rubriqueEnEdition.id === id) {
      setRubriqueEnEdition({ ...rubriqueEnEdition, [field]: value });
    }
  };

  const supprimerRubrique = (id: number) => {
    setRubriques(rubriques.filter(r => r.id !== id));
    if (rubriqueEnEdition && rubriqueEnEdition.id === id) {
      setRubriqueEnEdition(null);
    }
  };

  const editerRubrique = (rubrique: RubriquePersonnalisee) => {
    setRubriqueEnEdition(rubrique);
    if (quill) {
      quill.root.innerHTML = rubrique.description || "";
    }
  };

  useImperativeHandle(ref, () => ({
    getRubriques: () => {
      // On retourne seulement les rubriques avec titre ou description ou lien/date
      return rubriques.filter(
        r => r.titre.trim() !== "" || r.description.trim() !== "" || r.lien?.trim() !== "" || r.date?.trim() !== ""
      );
    },

    fillRubriquesPersonnaliseesFromParent: (data: RubriquePersonnalisee[]) => {
      if (!Array.isArray(data)) return;

      // On filtre les éléments vides
      const filteredData = data.filter(
        r => r.titre?.trim() !== "" || r.description?.trim() !== "" || r.lien?.trim() !== "" || r.date?.trim() !== ""
      );

      setRubriques(filteredData);

      // Mettre en édition la première si elle existe
      if (filteredData.length > 0) {
        setRubriqueEnEdition(filteredData[0]);
        if (quill) {
          setTimeout(() => {
            quill.root.innerHTML = filteredData[0].description || "";
          }, 100);
        }
      }
    },
  }));

  // Ajouter une rubrique vide mais ne l'ajouter que si aucune rubrique vide n'existe
  const ajouterRubrique = () => {
    const hasEmpty = rubriques.some(
      r => r.titre.trim() === "" && r.description.trim() === "" && r.lien?.trim() === "" && r.date?.trim() === ""
    );
    if (hasEmpty) return; // Empêche la création d’une rubrique vide supplémentaire

    const nouvelleRubrique: RubriquePersonnalisee = {
      id: Date.now(),
      titre: "",
      description: "",
      lien: "",
      date: "",
    };
    setRubriques([...rubriques, nouvelleRubrique]);
    setRubriqueEnEdition(nouvelleRubrique);
  };

  return (
    <div className="rubriques-personnalisees">
      <h2>Rubriques personnalisées</h2>

      {/* Tableau des rubriques */}
      {rubriques.length > 0 && (
        <div className="table-rubriques-ctn">
          <table className="tableau-rubriques">
            <thead>
              <tr>
                <th>Titre</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rubriques.map(r => (
                <tr key={r.id}>
                  <div className="table-row-d">
                    <td>{r.titre || "Sans titre"}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editerRubrique(r)}>Modifier</button>
                      <button className="del-btn" onClick={() => supprimerRubrique(r.id)}>Supprimer</button>
                    </td>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulaire d'édition */}
      {rubriqueEnEdition && (
        <div className="form-edition">
          <h3>Modifier la rubrique</h3>
          <input
            type="text"
            placeholder="Titre"
            value={rubriqueEnEdition.titre}
            onChange={e => modifierRubrique(rubriqueEnEdition.id, "titre", e.target.value)}
          />
          <div ref={quillRef} className="editor" />
          <input
            type="url"
            placeholder="Lien externe (optionnel)"
            value={rubriqueEnEdition.lien}
            onChange={e => modifierRubrique(rubriqueEnEdition.id, "lien", e.target.value)}
          />
          <input
            type="text"
            placeholder="Date ou période (optionnel)"
            value={rubriqueEnEdition.date}
            onChange={e => modifierRubrique(rubriqueEnEdition.id, "date", e.target.value)}
          />
        </div>
      )}

      <button className="btn-ajouter" onClick={ajouterRubrique}>
        Ajouter une rubrique personnalisée
      </button>
    </div>
  );
});

RubriquesPersonnalisees.displayName = "RubriquesPersonnalisees";
export default RubriquesPersonnalisees;
