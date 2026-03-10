"use client";
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface Props {
  placeholder?: string;
  editorRef?: any;
}

export default function QuillEditor({ placeholder, editorRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (internalRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
    });

    internalRef.current = quill;
    if (editorRef) editorRef.current = quill;

    // Supprimer toutes les toolbars sauf la dernière
    const toolbars = containerRef.current.parentElement?.querySelectorAll(".ql-toolbar");
    if (toolbars && toolbars.length > 1) {
      toolbars.forEach((toolbar, index) => {
        if (index < toolbars.length - 1) {
          toolbar.remove();
        }
      });
    }

    return () => {
      quill.disable();
      quill.root.innerHTML = "";
      internalRef.current = null;
      if (editorRef) editorRef.current = null;
    };
  }, [editorRef, placeholder]);

  return <div ref={containerRef} />;
}
