"use client";
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import "./style.css";

export interface SignatureRef {
  getSignature: () => {
    nom: string;
    ville: string;
    date: string;
    consentement: string;
  };
  fillSignatureFromParent: (values: {
    nom: string;
    ville?: string;
    date?: string;
    consentement?: string;
  }) => void;
}

interface Props {
  initialSignature?: {
    nom: string;
    ville?: string;
    date?: string;
    consentement?: string;
  };
}

const SignatureSection = forwardRef<SignatureRef, Props>(
  ({ initialSignature }, ref) => {
    const [nom, setNom] = useState(initialSignature?.nom || "");
    const [ville, setVille] = useState(initialSignature?.ville || "");
    const [date, setDate] = useState(
      initialSignature?.date || new Date().toLocaleDateString("fr-FR")
    );
    const [consentement, setConsentement] = useState(
      initialSignature?.consentement ||
        "J’atteste sur l’honneur que les informations ci-dessus sont exactes et sincères."
    );

    // 🔁 Méthodes exposées au parent
    useImperativeHandle(ref, () => ({
      getSignature: () => ({ nom, ville, date, consentement }),
      fillSignatureFromParent: (values) => {
        setNom(values.nom || "");
        setVille(values.ville || "");
        setDate(values.date || new Date().toLocaleDateString("fr-FR"));
        if (values.consentement) setConsentement(values.consentement);
      },
    }));

    useEffect(() => {
      if (!initialSignature) {
        setDate(new Date().toLocaleDateString("fr-FR"));
      }
    }, []);

    return (
      <div className="signature-section">
        <h3>Signature</h3>

        <p className="consentement">{consentement}</p>

        <div className="signature-block">
          <div className="field-group">
            <input
              type="text"
              placeholder="Ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="signature-input small"
            />
            <input
              type="text"
              placeholder="Nom et prénom du candidat"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="signature-input"
            />
          </div>

          {(nom || ville) && (
            <p className="signature-date">
              Fait {ville ? `à ${ville}, ` : ""}le {date}
            </p>
          )}

          {nom && (
            <p className="signature-text">
              ✍️ <span className="signature-handwritten">{nom}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default SignatureSection;
