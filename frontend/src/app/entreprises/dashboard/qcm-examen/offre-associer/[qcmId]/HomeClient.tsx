"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SidebarEntreprises/page";
import api from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import Pagination from "@/components/PaginationTap/Pagination";
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
    const [selectedFilter, setSelectedFilter] = useState("Toutes");

    const params = useParams();



    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [Offresearch, setOffreSearch] = useState("");
    const [Offrepage, setOffrePage] = useState(1);
    const [Offretotal, setOffreTotal] = useState(0);

    const limit = 10;

    useEffect(() => {

        const post_id_param = params["qcmId"];
        const id = Array.isArray(post_id_param) ? post_id_param[0] : post_id_param;

        if (!id) return;

        setPost_id(id);

        const searchValue = search?.trim() || "";
        const offreValue = Offresearch?.trim() || "";

        // ❌ empêcher recherche < 3 caractères
        if (
            (searchValue && searchValue.length < 3) ||
            (offreValue && offreValue.length < 3)
        ) {
            return;
        }

        const timer = setTimeout(() => {

            // 🔎 cas recherche
            if (searchValue || offreValue) {

                fetchOffres(
                    searchValue,
                    offreValue,
                    selectedFilter,
                    id,
                    page,
                    Offrepage,
                    limit
                );

            } else {

                // 📄 cas normal
                getOffresAssociees(
                    id,
                    page,
                    Offrepage,
                    limit
                );

            }

        }, 500);

        return () => clearTimeout(timer);

    }, [params, search, Offresearch, selectedFilter, page, Offrepage]);

    const fetchOffres = async (searchValue: string, offresearch: string, filterValue: string, post_id: string, page: number, offrepage: number, limit: number) => {

        try {


            const res = await api.get("entreprise_get/get_offre_by_post_id_search", {
                params: {
                    post_id,
                    search: searchValue,
                    offresearch,
                    filter: filterValue,
                    page,
                    offrepage,
                    limit: 10
                }
            });

            const offres = res.data.data || [];

            setOffresAssociees(offres.offresAvecTitre || []);
            setOffresRecruteur(offres.toutesOffres || []);
            setTotal(offres.total || 0)
            setOffreTotal(offres.offreTotal || 0)


        } catch (error) {
            console.error(error);
        }

    };

    // 🔹 Offres associées au QCM
    async function getOffresAssociees(post_id: string, pageNumber: number = 1, pageNumberOffre: number = 1, limit: number = 10) {

        if (!post_id) return

        try {
            const response = await api.get(`entreprise_get/get_offre_by_post_id`, {
                params: {
                    post_id,
                    pageNumberOffre,
                    page: pageNumber,
                    limit: limit
                }
            }
            );


            const offres = response.data.data || [];

            setOffresAssociees(offres.offresAvecTitre || []);
            setOffresRecruteur(offres.toutesOffres || []);
            setTotal(offres.total || 0)
            setOffreTotal(offres.offrePage || 0)

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
                getOffresAssociees(post_id, page,Offrepage,limit);
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
                getOffresAssociees(post_id, page,Offrepage,limit);
            }

        } catch (err) {
            console.error("Erreur ajouter offre :", err);
        }
    };


    console.log(offresAssociees)
    console.log(offresRecruteur)
    return (
        <div className="container-dashbord">
            <Sidebar />

            <div className="mainContent offre-associer">
                <h2>Offres associées au QCM</h2>


                <input
                    type="text"
                    placeholder="Recherche par titre"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
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
                        {offresAssociees.map(offre => (
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
                <Pagination
                    page={page}
                    setPage={setPage}
                    total={total}
                    limit={limit}
                />

                <h2>Toutes les offres du recruteur</h2>
                <input
                    type="text"
                    placeholder="Recherche par titre"
                    value={Offresearch}
                    onChange={e => setOffreSearch(e.target.value)}
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
                        {offresRecruteur.map(offre => (
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
                <Pagination
                    page={Offrepage}
                    setPage={setOffrePage}
                    total={Offretotal}
                    limit={limit}
                />
            </div>
        </div>
    );
}
