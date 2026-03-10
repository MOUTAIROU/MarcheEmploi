"use client";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import "./style.css";

export interface CentreInteretRef {
  getCentres: () => string[];
  fillCentresFromParent: (values: string[]) => void;
}

interface Props {
  initialCentres?: string[];
}

const CentreInteret = forwardRef<CentreInteretRef, Props>(
  ({ initialCentres = [] }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [centres, setCentres] = useState<string[]>([]);
    const suggestions = [
      "Programmation",
      "Lecture",
      "Jeux vidéo",
      "Randonnée",
      "Photographie",
    ];

    // Charger les centres reçus du parent
    useEffect(() => {
      if (initialCentres.length > 0) {
        setCentres(initialCentres);
      }
    }, [initialCentres]);

    // Exposer des fonctions vers le parent
    useImperativeHandle(ref, () => ({
      getCentres: () => centres,
      fillCentresFromParent: (values: string[]) => {
        setCentres(values);
      },
    }));

    const handleAdd = (value: string) => {
      if (value && !centres.includes(value)) {
        setCentres([...centres, value]);
        setInputValue("");
      }
    };

    const handleDelete = (value: string) => {
      setCentres(centres.filter((c) => c !== value));
    };

    return (
      <div className="centre-interet-ctn">
        {centres.length > 0 && (
          <div className="selected">
            <div className="selectedTags">
              {centres.map((c) => (
                <span key={c} className="tag">
                  {c}
                  <button onClick={() => handleDelete(c)}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="inputCard">
          <label htmlFor="centreInput">Centre d'intérêt</label>
          <input
            id="centreInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Saisissez un centre d'intérêt"
          />
          <div className="actions">
            <button className="deleteBtn" onClick={() => setInputValue("")}>
              🗑
            </button>
            <button className="doneBtn" onClick={() => handleAdd(inputValue)}>
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
                onClick={() => handleAdd(s)}
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

export default CentreInteret;
