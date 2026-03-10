"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import "./style.css";

interface Offre {
    post_id: string;
    titre: string;
}



export default function OffresPage() {
    const [offresAssociees, setOffresAssociees] = useState<Offre[]>([]);
    const [offresRecruteur, setOffresRecruteur] = useState<Offre[]>([]);
    const [searchAssocie, setSearchAssocie] = useState("");
    const [searchRecruteur, setSearchRecruteur] = useState("");
    const [post_id, setPost_id] = useState("");

    const params = useParams();

    useEffect(() => {

        const post_id_param = params["qcmId"];
        const post_id = Array.isArray(post_id_param) ? post_id_param[0] : post_id_param;


        if (!post_id) return;

        setPost_id(post_id)
        getOffresAssociees(post_id);
    }, [params]);

    // 🔹 Offres associées au QCM
    async function getOffresAssociees(post_id: string) {


        try {
            const response = await api.get(
                `entreprise_get/get_offre_by_post_id/${post_id}`
            );


            const offres = response.data.data || [];

            setOffresAssociees(offres.offresAvecTitre);
            setOffresRecruteur(offres.toutesOffres);
        } catch (err) {
            console.error("Erreur récupération offres associées :", err);
        }
    }



    // 🔹 Retirer une offre du QCM
    const retirerOffre = async (post_id_offre: string) => {
        try {
            const res = await api.post(`entreprise_get/retirer_offre_qcm`, {
                qcm_id: post_id,
                post_id: post_id_offre,
            });


            if (res.status == 201) {
                getOffresAssociees(post_id);
            }
            // retirer localement
            // setOffresAssociees(prev => prev.filter(o => o.post_id !== post_id_offre));
        } catch (err) {
            console.error("Erreur retirer offre :", err);
        }
    };

    // 🔹 Ajouter une offre au QCM
    const ajouterOffre = async (post_id_offre: string) => {
        try {

            console.log({
                qcm_id: post_id,
                post_id: post_id_offre,
            })



            const offre = offresAssociees.find(o => o.post_id === post_id_offre);

            if (offre) {
                alert("L'offre associer est connecter aux qcm")
                return
            }

            const res = await api.post(`entreprise_get/ajouter_offre_qcm`, {
                qcm_id: post_id,
                post_id: post_id_offre,
            });


            if (res.status == 201) {
                getOffresAssociees(post_id);
            }

        } catch (err) {
            console.error("Erreur ajouter offre :", err);
        }
    };

    // 🔹 Filtrage recherche
    const filteredAssociees = offresAssociees.filter(o =>
        o.titre.toLowerCase().includes(searchAssocie.toLowerCase())
    );

    const filteredRecruteur = offresRecruteur.filter(o =>
        o.titre.toLowerCase().includes(searchRecruteur.toLowerCase())
    );

    return (
        <div className="container-dashbord">
            <Sidebar />

            <div className="mainContent offre-associer">
                <h2>Offres associées au QCM</h2>
                <input
                    type="text"
                    placeholder="Recherche par titre"
                    value={searchAssocie}
                    onChange={e => setSearchAssocie(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Offre ID</th>
                            <th>Titre</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssociees.map(offre => (
                            <tr key={offre.post_id}>
                                <td>{offre.post_id}</td>
                                <td>{offre.titre}</td>
                                <td>
                                    <button onClick={() => retirerOffre(offre.post_id)}>
                                        Retirer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Toutes les offres du recruteur</h2>
                <input
                    type="text"
                    placeholder="Recherche par titre"
                    value={searchRecruteur}
                    onChange={e => setSearchRecruteur(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Offre ID</th>
                            <th>Titre</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecruteur.map(offre => (
                            <tr key={offre.post_id}>
                                <td>{offre.post_id}</td>
                                <td>{offre.titre}</td>
                                <td>
                                    <button onClick={() => ajouterOffre(offre.post_id)}>
                                        Ajouter au QCM
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
