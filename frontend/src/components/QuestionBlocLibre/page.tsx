"use client";
import React from "react";
import "./style.css";
import { countryNumberCode, treatment_msg_to_send, reverse_treatment_msg, country, countryCode, CATEGORIE_LABELS } from "@/utils/types";
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

  function decodeHTML(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }



  return (
    <div className="exam-question-card">
      <div className="question-header">
        <h4>Question {index + 1}</h4>
        {afficherDifficulte && (
          <span className={`badge-niveau niveau-${q.niveau.toLowerCase()}`}>
            Niveau : {q.niveau}
          </span>
        )}
      </div>

      <p className="question-intitule">{reverse_treatment_msg(q.intitule)}</p>

      {/* Options */}
      {(q.type === "qcm-unique" || q.type === "choix-multiple") && (
        <div className="options">

          {/* 👇 Message si choix multiple */}
          {q.type === "choix-multiple" && (
            <div className="multi-info">
              ✔️ Plusieurs réponses sont possibles.
            </div>
          )}


          {q.options.map((opt, i) => (
            <label
              key={i}
              className={`option-item`}
            >
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
                  if (q.type === "qcm-unique") handleReponseChange(q.id, opt);
                  else {
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

              {reverse_treatment_msg(opt)}
            </label>
          ))}
        </div>
      )}

      {/* Vrai / Faux */}
      {q.type === "vrai-faux" && (
        <div className="options">
          {["Vrai", "Faux"].map((opt) => (
            <label
              key={opt}
              className={`option-item`}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={reponse === opt}
                onChange={() => handleReponseChange(q.id, opt)}
              />
              {reverse_treatment_msg(opt)}
            </label>
          ))}
        </div>
      )}

      {/* Réponse texte */}
      {q.type === "reponse-texte" && (
        <textarea
          className={`text-reponse ${examTermine ? "disabled" : ""}`}
          placeholder="Votre réponse..."
          value={reverse_treatment_msg(reponse) || ""}
          onChange={(e) => handleReponseChange(q.id, treatment_msg_to_send(e.target.value))}
          disabled={examTermine}
        />
      )}


    </div>

  );
}
