"use client";
import React from "react";

interface Question {
  id: number;
  intitule: string;
  type: string;
  niveau: string;
  optionTexte: string;
  points: number;
  options: string[];
  bonnesReponses: string[];
  justification?: string;
}

interface QuestionBlocProps {
  q: Question;
  index: number;
  reponse?: any;
  examTermine: boolean;
  afficherResultat: boolean;
  afficherDifficulte: boolean;
  handleReponseChange: (questionId: number, value: any) => void;
}

export default function QuestionBloc({
  q,
  index,
  reponse,
  examTermine,
  afficherResultat,
  afficherDifficulte,
  handleReponseChange,
}: QuestionBlocProps) {
  return (
    <div className="exam-question">
      <h4>Question {index + 1}</h4>
      <p className="question-intitule">{q.intitule}</p>

      {afficherDifficulte && (
        <span className="badge-niveau">Niveau : {q.niveau}</span>
      )}

      {/* Affichage des corrections si examen terminé */}
      {examTermine && afficherResultat && (
        <div className="correction">
          <p>
            <strong>Bonne réponse :</strong> {q.bonnesReponses.join(", ")}
          </p>
          {q.justification && (
            <p className="justification">
              <strong>Justification :</strong> {q.justification}
            </p>
          )}
        </div>
      )}

      {/* 🔹 Choix multiple ou QCM unique */}
      {(q.type === "choix-multiple" || q.type === "qcm-unique") && (
        <div className="options">
          {q.options.map((opt, i) => (
            <label key={i} className="option-item">
              <input
                type={q.type === "qcm-unique" ? "radio" : "checkbox"}
                name={`question-${q.id}`}
                value={opt}
                checked={
                  q.type === "qcm-unique"
                    ? reponse === opt
                    : Array.isArray(reponse) && reponse.includes(opt)
                }
                onChange={(e) => {
                  if (q.type === "qcm-unique") {
                    handleReponseChange(q.id, opt);
                  } else {
                    const current = Array.isArray(reponse) ? reponse : [];
                    handleReponseChange(
                      q.id,
                      e.target.checked
                        ? [...current, opt]
                        : current.filter((v: string) => v !== opt)
                    );
                  }
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {/* 🔹 Vrai / Faux */}
      {q.type === "vrai-faux" && (
        <div className="options">
          {["Vrai", "Faux"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={reponse === opt}
                onChange={() => handleReponseChange(q.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {/* 🔹 Réponse texte */}
      {q.type === "reponse-texte" && (
        <textarea
          placeholder="Votre réponse..."
          value={reponse || ""}
          onChange={(e) => handleReponseChange(q.id, e.target.value)}
        />
      )}
    </div>
  );
}
