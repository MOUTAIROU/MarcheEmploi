"use client";
import "./style.css";
import React, { useState, forwardRef, useImperativeHandle } from "react";

import Image from "next/image";


interface Champ {
  label: string;
  value: string;
  type: string;
  display: boolean;
  custom?: boolean;
}

export interface InfoPersonnelleRef {
  fillInformationsFromParent: (donnees: Record<string, string>) => void;
}

const InformationPersonnelle = forwardRef<InfoPersonnelleRef>((props, ref) => {
  const [photo, setPhoto] = useState<string | null>(null);

  const [champs, setChamps] = useState<Champ[]>([
    // Champs de base
    { label: "Prénom", value: "", type: "text", display: true },
    { label: "Nom de famille", value: "", type: "text", display: true },
    { label: "Emploi recherché", value: "", type: "text", display: true },
    { label: "Adresse e-mail", value: "", type: "email", display: true },
    { label: "Numéro de téléphone", value: "", type: "tel", display: true },
    { label: "Adresse", value: "", type: "text", display: true },
    { label: "Code postal", value: "", type: "text", display: true },
    { label: "Ville", value: "", type: "text", display: true },

    // Champs extra (invisibles par défaut)
    { label: "Date de naissance", value: "", type: "date", display: false },
    { label: "Lieu de naissance", value: "", type: "text", display: false },
    { label: "Permis de conduire", value: "", type: "text", display: false },
    { label: "Sexe", value: "", type: "text", display: false },
    { label: "Nationalité", value: "", type: "text", display: false },
    { label: "État civil", value: "", type: "text", display: false },
    { label: "Site internet", value: "", type: "url", display: false },
    { label: "LinkedIn", value: "", type: "url", display: false },
  ]);

  const [newChampLabel, setNewChampLabel] = useState("");

  // ✅ Fonction publique (appelable par IA ou lecture de CV)
  const remplirChamps = (donnees: Record<string, string>) => {
    // 🔹 Remplir la photo si elle est présente
    if (donnees.Photo) {
      setPhoto(donnees.Photo);
    }

    setChamps((prev) => {
      const updated = prev.map((champ) => {
        const nouvelleValeur = donnees[champ.label];

        if (nouvelleValeur !== undefined && champ.label !== "Photo") {
          return {
            ...champ,
            value: nouvelleValeur,
            display: true, // rend visible s’il était caché
          };
        }

        return champ;
      });

      // Ajouter les champs supplémentaires qui ne sont pas encore dans la liste
      Object.keys(donnees).forEach((key) => {
        if (!updated.some((c) => c.label === key) && key !== "Photo") {
          updated.push({
            label: key,
            value: donnees[key],
            type: "text",
            display: true,
            custom: true,
          });
        }
      });

      return updated;
    });
  };




  // ✅ Exposer la fonction pour l'extérieur
  useImperativeHandle(ref, () => ({
    fillInformationsFromParent: remplirChamps,
    getInformations: () => {
      const data: Record<string, string> = {};
      champs.forEach((c) => {
        if (c.display && c.value.trim() !== "") {
          data[c.label] = c.value;
        }
      });
      if (photo) {
        data["Photo"] = photo;
      }
      return data;
    },
  }));

  // ✅ Pour test manuel (tu peux retirer après)
  const handleRemplissageDemo = () => {
    remplirChamps({
      "Prénom": "Yanis",
      "Nom de famille": "Moutaïrou",
      "Emploi recherché": "Développeur Full Stack",
      "Adresse e-mail": "yanis@example.com",
      "Ville": "Cotonou",
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddExtra = (label: string) => {
    setChamps(champs.map((c) => (c.label === label ? { ...c, display: true } : c)));
  };

  const handleRemoveExtra = (label: string) => {
    setChamps(champs.map((c) =>
      c.label === label ? { ...c, display: false, value: "" } : c
    ));
  };

  const handleAddCustomField = () => {
    if (!newChampLabel.trim()) return;
    setChamps([
      ...champs,
      { label: newChampLabel, value: "", type: "text", display: true, custom: true },
    ]);
    setNewChampLabel("");
  };

  const handleRemoveCustomField = (label: string) => {
    setChamps(champs.filter((c) => c.label !== label));
  };

  const handleChange = (label: string, value: string) => {
    setChamps(champs.map((c) => (c.label === label ? { ...c, value } : c)));
  };

  return (
    <div className="info-container">

      {/* Photo de profil */}
      <div className="photo-section">
        {photo ? (
          <div className="photo-preview">
            
            <Image
              src={photo}
              alt="Photo de cv"
              width={150}
              height={150}
              className="preview"
            />
            <button className="remove-photo" onClick={() => setPhoto(null)}>
              Retirer la photo
            </button>
          </div>
        ) : (
          <label className="photo-upload">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            <div className="upload-placeholder">📷 Ajouter une photo</div>
          </label>
        )}
      </div>

      {/* Champs affichés */}
      <div className="form-grid">
        {champs
          .filter((c) => c.display)
          .map((champ, index) => (
            <div key={index} className="form-group">
              <label>{champ.label}</label>
              <div className="input-wrapper">
                <input
                  type={champ.type}
                  value={champ.value}
                  onChange={(e) => handleChange(champ.label, e.target.value)}
                  placeholder={champ.label}
                />
                {(champ.custom ||
                  [
                    "Date de naissance",
                    "Lieu de naissance",
                    "Permis de conduire",
                    "Sexe",
                    "Nationalité",
                    "État civil",
                    "Site internet",
                    "LinkedIn",
                  ].includes(champ.label)) && (
                    <button
                      className="remove-field"
                      onClick={() =>
                        champ.custom
                          ? handleRemoveCustomField(champ.label)
                          : handleRemoveExtra(champ.label)
                      }
                    >
                      ✕
                    </button>
                  )}
              </div>
            </div>
          ))}
      </div>

      {/* Champs extras */}
      <div className="extra-zone">
        {champs
          .filter((c) => !c.display && !c.custom)
          .map((extra, index) => (
            <button
              key={index}
              onClick={() => handleAddExtra(extra.label)}
              className="extra-btn"
            >
              + {extra.label}
            </button>
          ))}
      </div>

      {/* Champ personnalisé */}
      <div className="custom-field">
        <input
          type="text"
          placeholder="Nom du champ personnalisé"
          value={newChampLabel}
          onChange={(e) => setNewChampLabel(e.target.value)}
        />
        <button onClick={handleAddCustomField}>+ Ajouter un champ</button>
      </div>


    </div>
  );
})

export default InformationPersonnelle;