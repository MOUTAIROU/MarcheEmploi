"use client";
import React, { useRef } from "react";
import "./style.css";
import Sidebar from "@/components/SidebarEntreprises/page";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface LettreProps {
  data: {
    nomCandidat: string;
    email: string;
    lettre: string; // Contenu HTML de la lettre
    statut?: string;
    telephone?: string;
  };
}

export default function LettreMotivationPage({ data }: LettreProps) {
  const lettreRef = useRef<HTMLDivElement>(null);


  const generatePDF = async () => {
    if (!lettreRef.current) return;

    const canvas = await html2canvas(lettreRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // marges
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save(`${data.nomCandidat}_lettre_motivation.pdf`);
  };

  return (
    <div className="lettre-page">
      <Sidebar />

      <div className="">
        <div className="header">
          <h2>Lettre de motivation</h2>
          <button className="btn-download" onClick={generatePDF}>
            Télécharger en PDF
          </button>
        </div>

        <div className="lettre-container" ref={lettreRef}>
          <h3>{data.nomCandidat}</h3>
          <p><strong>Email:</strong> {data.email}</p>
          {
            data.email && (
              <p><strong>Telephone:</strong> {data.telephone}</p>
            )
          }


          {
            data.statut && (
              <p><strong>Statut:</strong> {data.statut}</p>
            )
          }


          <hr />

          <div
            className="lettre-content"
          >
            {data.lettre}
          </div>
        </div>
      </div>
    </div>
  );
}
