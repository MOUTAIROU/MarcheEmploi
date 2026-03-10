"use client";
import React, { useState } from "react";
import "./style.css";
interface CVUploaderProps {
  onExtract: (data: any) => void;
}

export default function CVUploader({ onExtract }: CVUploaderProps) {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);


    try {
      const res = await fetch(`${process.env.SERVER_CV}/extract_cv/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // console.log("DEBUG backend response:", data);
      setResult(data.text || "");
      onExtract && onExtract(data);
    } catch (error) {
      console.error("Erreur upload CV:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    handleUpload(file); // upload direct après sélection
  };

  return (
    <div className="cv-uploader">
      <label htmlFor="cvInput" className="btn-upload">
        📄 Uploader un CV (PDF ou image)
      </label>
      <input
        id="cvInput"
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        hidden
      />
      {/* {fileName && <p>Fichier chargé : {fileName}</p>}
      {result && <pre>{result}</pre>}*/}
    </div>
  );
}
