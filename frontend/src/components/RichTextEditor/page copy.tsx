"use client";
import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Commencez à rédiger ici...",
  rows = 6,
}) => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
      ],
    },
    placeholder,
  });

  useEffect(() => {
    if (quill) {
      const editor = quill.root;
      editor.style.fontFamily = "Arial, sans-serif";
      editor.style.fontSize = "16px";
      editor.style.minHeight = `${rows * 24}px`;
      editor.style.maxHeight = "400px";
      editor.style.overflowY = "auto";
      editor.style.padding = "10px 12px";
      editor.style.background = "#fff";

      if (value) quill.root.innerHTML = value;

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return <div ref={quillRef} className="editor" />;
};

export default RichTextEditor;
