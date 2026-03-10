"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { countryNumberCode, treatment_msg_to_send, reverse_treatment_msg, country, countryCode, CATEGORIE_LABELS } from "@/utils/types";
interface Question {
  id: number;
  intitule: string;
  type: string;
  niveau: string;
  options: string[];
  bonnesReponses: string[];
  justification?: string;
}

interface QuestionBlocSequentielProps {
  question: Question;
  index: number;
  temps: number; // temps total en secondes reçu du parent
  reponse?: any;
  examTermine: boolean;
  tempsRestant: number;
  afficherDifficulte: boolean;
  handleReponseChange: (questionId: number, value: any) => void;
  passerQuestionSuivante: () => void;
}

export default function QuestionBlocSequentiel({
  question,
  index,
  temps,
  reponse,
  examTermine,
  tempsRestant,
  afficherDifficulte,
  handleReponseChange,
  passerQuestionSuivante,
}: QuestionBlocSequentielProps) {



  const timerRef = useRef<number | null>(null);

  function decodeHTML(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }




  return (
    <div className="exam-question">
      <h4>
        Question {index + 1}
        {tempsRestant > 0 && (
          <span className="sticky-timer timer-badge">
            ⏱ Temps restant : {Math.floor(tempsRestant / 60)}:
            {(tempsRestant % 60).toString().padStart(2, "0")}
          </span>
        )}
      </h4>

      <p className="question-intitule">{reverse_treatment_msg(question.intitule)}</p>

      {afficherDifficulte && <span className="badge-niveau">Niveau : {question.niveau}</span>}

      {/* Options de réponse */}
      {(question.type === "choix-multiple" || question.type === "qcm-unique") && (


        <div className="options">

          {/* 👇 Message si choix multiple */}
          {question.type === "choix-multiple" && (
            <div className="multi-info">
              ✔️ Plusieurs réponses sont possibles.
            </div>
          )}
          {question.options.map((opt, i) => (
            <label key={i} className="option-item">
              <input
                type={question.type === "qcm-unique" ? "radio" : "checkbox"}
                name={`question-${question.id}`}
                value={opt}
                checked={
                  question.type === "qcm-unique"
                    ? reponse === opt
                    : Array.isArray(reponse) && reponse.includes(opt)
                }
                onChange={(e) => {
                  if (question.type === "qcm-unique") {
                    handleReponseChange(question.id, opt);
                  } else {
                    const current = Array.isArray(reponse) ? reponse : [];
                    handleReponseChange(
                      question.id,
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

      {question.type === "vrai-faux" && (
        <div className="options">
          {["Vrai", "Faux"].map((opt) => (
            <label key={opt} className="option-item">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt}
                checked={reponse === opt}
                onChange={() => handleReponseChange(question.id, opt)}
              />
              {reverse_treatment_msg(opt)}
            </label>
          ))}
        </div>
      )}

      {question.type === "reponse-texte" && (
        <textarea
          placeholder="Votre réponse..."
          value={reverse_treatment_msg(reponse) || ""}
          onChange={(e) => handleReponseChange(question.id, treatment_msg_to_send(e.target.value))}
        />
      )}
    </div>
  );
}
