"use client";

import React, { useState, ChangeEvent, forwardRef, useImperativeHandle } from "react";
import "./style.css";

// 🔹 Interfaces
export interface Reference {
  nom: string;
  entreprise: string;
  ville: string;
  telephone: string;
  email: string;
}

export interface Contact extends Reference {
  id: number;
}

// --- Interface exposée au parent ---
export interface ReferenceFormRef {
  addContactFromParent: (contact: Reference) => void;
  fillReferencesFromParent: (contacts: Reference[]) => void;
  getReferences:()=>Reference[]
}

const ReferenceForm = forwardRef<ReferenceFormRef>((_, ref) => {
  const [mode, setMode] = useState<"demande" | "remplir">("remplir");
  const [formData, setReference] = useState<Reference>({
    nom: "",
    entreprise: "",
    ville: "",
    telephone: "",
    email: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const disabled = mode === "demande";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReference((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nom.trim()) return;

    if (editId !== null) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editId ? { ...formData, id: editId } : c))
      );
      setEditId(null);
    } else {
      setContacts((prev) => [...prev, { ...formData, id: Date.now() }]);
    }

    setReference({
      nom: "",
      entreprise: "",
      ville: "",
      telephone: "",
      email: "",
    });
  };

  const handleEdit = (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setReference(contact);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // 🔹 Méthodes exposées au parent
  useImperativeHandle(ref, () => ({
    addContactFromParent(contact: Reference) {
      setContacts((prev) => [...prev, { ...contact, id: Date.now() }]);
    },
    fillReferencesFromParent(contactsFromParent: Reference[]) {
      const formatted = contactsFromParent.map((c) => ({
        ...c,
        id: Date.now() + Math.random(),
      }));
      setContacts(formatted);
    },
    getReferences(){
     return contacts
    }
  }));

  // 🔹 Rendu HTML (inchangé)
  return (
    <div className="form-card">
      <div className="form-header">
        <h3>Référence</h3>
      </div>

      {contacts.length > 0 && (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <div className="table-row-d">
                  <td>{c.nom}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(c.id)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(c.id)}>🗑</button>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="form-group-option">
        <label>
          <input
            type="radio"
            name="mode"
            value="demande"
            checked={mode === "demande"}
            onChange={() => setMode("demande")}
          />{" "}
          Sur demande
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="mode"
            value="remplir"
            checked={mode === "remplir"}
            onChange={() => setMode("remplir")}
          />{" "}
          Je souhaite renseigner les coordonnées
        </label>
      </div>

      <div className="form-group">
        <label>Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Nom de la référence"
        />
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label>Entreprise</label>
          <input
            type="text"
            name="entreprise"
            value={formData.entreprise}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Nom de l'entreprise"
          />
        </div>

        <div className="form-group">
          <label>Ville</label>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Ville"
          />
        </div>
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label>Numéro de téléphone</label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Ex : +229 90 00 00 00"
          />
        </div>

        <div className="form-group">
          <label>Adresse e-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={disabled}
            placeholder="exemple@mail.com"
          />
        </div>
      </div>

      {mode === "remplir" && (
        <p className="warning-text">
          ⚠️ En renseignant une référence, vous confirmez avoir obtenu
          l’autorisation de la personne concernée. La plateforme Marche Emploi
          n’est pas responsable de la véracité ou de la diffusion de ces
          informations.
        </p>
      )}

      <div className="form-actions">
        <button type="button" onClick={handleSubmit} className="doneBtn">
          {editId !== null ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  );
});


export default ReferenceForm;
