"use client";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import "./style.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export interface RealisationFormRef {
  getRealisations: () => string[];
  fillRealisationsFromParent: (values: string[]) => void;
}

interface Props {
  initialRealisations?: string[];
}

const RealisationForm = forwardRef<RealisationFormRef, Props>(
  ({ initialRealisations = [] }, ref) => {
    const [realisations, setRealisations] = useState<string[]>([]);

    const suggestions = [
      "Mise en place de solutions logicielles innovantes ayant amélioré la productivité de l'équipe de 25%.",
      "Participation active à la conception et à la maintenance de plusieurs projets open source.",
      "Automatisation des processus de déploiement assurant une livraison rapide et sans erreur.",
      "Optimisation du code source pour réduire les temps de chargement de 30%.",
      "Développement d’une application mobile utilisée par plus de 10 000 utilisateurs.",
    ];

    const { quill, quillRef } = useQuill({
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
        ],
      },
      placeholder: "Décrivez une réalisation concrète ici...",
    });

    // Charger les réalisations reçues du parent
    useEffect(() => {
      if (initialRealisations.length > 0) {
        setRealisations(initialRealisations);
      }
    }, [initialRealisations]);

    // Style de base de l’éditeur
    useEffect(() => {
      if (quill) {
        const editor = quill.root;
        editor.style.fontFamily = "Arial, sans-serif";
        editor.style.fontSize = "16px";
      }
    }, [quill]);

    // Exposer des fonctions vers le parent
    useImperativeHandle(ref, () => ({
      getRealisations: () => realisations,
      fillRealisationsFromParent: (values: string[]) => {
        setRealisations(values);
      },
    }));

    // Récupérer le contenu de Quill (texte brut)
    const getEditorText = () => {
      if (!quill) return "";
      const html = quill.root.innerHTML.trim();
      const text = quill.getText().trim();
      return text || html;
    };

    const handleAdd = () => {
      const value = getEditorText();
      if (value && !realisations.includes(value)) {
        setRealisations([...realisations, value]);
        quill?.setText(""); // vider l’éditeur
      }
    };

    const handleDelete = (value: string) => {
      setRealisations(realisations.filter((r) => r !== value));
    };

    const handleAddSuggestion = (s: string) => {
      if (!realisations.includes(s)) setRealisations([...realisations, s]);
    };

    return (
      <div className="realisation-content">
        {realisations.length > 0 && (
          <ul className="realisation-list">
            {realisations.map((r, index) => (
              <li key={index} className="realisation-item">
                <div dangerouslySetInnerHTML={{ __html: r }} />
                 <div> <button className="deleteBtn" onClick={() => handleDelete(r)}>Supprimer</button></div>
              </li>
            ))}
          </ul>
        )}

        <div className="inputCard">
          <label htmlFor="realisationInput">Réalisation</label>
          <div ref={quillRef} className="editor" />

          <div className="actions">
            <button
              className="deleteBtn"
              onClick={() => quill?.setText("")}
              type="button"
            >
              🗑
            </button>
            <button className="doneBtn" onClick={handleAdd} type="button">
              Ajouter
            </button>
          </div>
        </div>

        <div className="tab-sugestion">
          <div className="tagsSection">
            {suggestions.map((s) => (
              <button
                key={s}
                className="suggestionBtn"
                onClick={() => handleAddSuggestion(s)}
              >
                + {s}
              </button>
            ))}
          </div>

          <div className="bottomActions">
            <button className="aiBtn">✨ Suggestions de l'IA</button>
          </div>
        </div>
      </div>
    );
  }
);

export default RealisationForm;
