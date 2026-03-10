"use client";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import "./style.css";

// Typage du ref exposé au parent
export interface DescriptionEditorRef {
  fillWithSuggestion: (text: string) => void;
  getProfile: () => string; // ✅ retourne le contenu du profil
}

const DescriptionProfile = forwardRef<DescriptionEditorRef>((props, ref) => {
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

  // ✅ Fonction pour remplir avec un texte suggéré
  const fillWithSuggestion = (text?: string) => {
    if (!quill) return;

    const defaultText =
      "Passionné(e) par la création et toujours prêt(e) à relever de nouveaux défis !";

    quill.setText(text ?? defaultText);
    quill.formatText(0, quill.getLength(), "size", "18px");
  };

  // ✅ Fonction pour récupérer le texte du profil
  const getProfile = () => {
    if (!quill) return "";
    return quill.root.innerHTML.trim(); // tu peux aussi faire quill.getText() si tu veux du texte brut
  };

  // ✅ Expose les fonctions au parent
  useImperativeHandle(ref, () => ({
    fillWithSuggestion,
    getProfile,
  }));

  // ✅ Appliquer un style par défaut
  useEffect(() => {
    if (quill) {
      const editor = quill.root;
      editor.style.fontFamily = "Arial, sans-serif";
      editor.style.fontSize = "16px";
    }
  }, [quill]);

  return (
    <div className="description-profile">
      <label className="label">Description</label>
      <div ref={quillRef} className="editor" />
      <button onClick={() => fillWithSuggestion()} className="aiButton">
        ✨ Suggestions de l'IA
      </button>
    </div>
  );
});

export default DescriptionProfile;
