'use client';
import './style.css';
import Image from "next/image";
import Header from '@/components/header/page'
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceListDashbord/page";
import { countryCode, allPays, allVilles, allSecteurs, typeAnnonce, SEARCH_SESSION_KEY } from "@/utils/types";
import { NumberValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import { useParams } from "next/navigation";
import Sidebar from "@/components/SidebarEntreprises/page";


export default function Home() {

    const params = useParams();

    const [motsCles, setMotsCles] = useState<string[]>([]);
    const [motCleInput, setMotCleInput] = useState("");
    const [showMore, setShowMore] = useState(false);

    const [pays, setPays] = useState<string[]>([]);
    const [ville, setVille] = useState<string[]>([]);
    const [secteurs, setSecteurs] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [annonces, setAnnonces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [periode, setPeriode] = useState<string>("");
    const [currentpage, setCurrentpage] = useState<string>("");
    const [total, setTotal] = useState<number>(0);

    const { page } = params


    const periodeOptions = [
        "Il y a 24h",
        "Il y a 7 jours",
        "Il y a 12 jours",
        "Il y a 30 jours",
    ];


    useEffect(() => {
        if (!page) return;

        const savedSearch = JSON.parse(sessionStorage.getItem(SEARCH_SESSION_KEY) || "{}");

        const hasActiveFilters = (search: any) => {
            return (
                (search.motsCles && search.motsCles.length > 0) ||
                (search.types && search.types.length > 0) ||
                (search.pays && search.pays.length > 0) ||
                (search.villes && search.villes.length > 0) ||
                (search.secteurs && search.secteurs.length > 0) ||
                !!search.periode ||
                !!search.dateDebut ||
                !!search.dateFin
            );
        };

        // 🔹 Recherche par défaut (aucun filtre actif)
        const fetchDefaultAnnonces = async () => {
            try {
                setLoading(true);

                const res = await api.get(
                    `/frontend/appels_offres_by_page/${countryCode}/${page}/${encodeURIComponent(JSON.stringify(savedSearch))}`
                );

                if (res.status === 201) {
                    setCurrentpage(res.data.page);
                    setTotal(res.data.total);
                    setAnnonces(res.data.data);
                }
            } catch (error) {
                console.error("Erreur chargement annonces", error);
            } finally {
                setLoading(false);
            }
        };

        // 🔹 Recherche avec filtre actif
        const fetchWithFilterAnnonces = async () => {
            try {
                setLoading(true);

                const res = await api.post(
                    `/frontend/appels_offres_recherche_by_page`,
                    { page, params: sessionStorage.getItem(SEARCH_SESSION_KEY) }
                );

                if (res.status === 201 || res.status === 200) {
                    setCurrentpage(res.data.page);
                    setTotal(res.data.total);
                    setAnnonces(res.data.data);
                }
            } catch (error) {
                console.error("Erreur recherche filtrée", error);
            } finally {
                setLoading(false);
            }
        };

        // 🔹 Lancement en fonction des filtres
        if (hasActiveFilters(savedSearch)) {
            fetchWithFilterAnnonces();
        } else {
            fetchDefaultAnnonces();
        }
    }, [page]);



    const hasActiveFilters = (search: any) => {
        return (
            (search.motsCles && search.motsCles.length > 0) ||
            (search.types && search.types.length > 0) ||
            (search.pays && search.pays.length > 0) ||
            (search.villes && search.villes.length > 0) ||
            (search.secteurs && search.secteurs.length > 0) ||
            !!search.periode ||
            !!search.dateDebut ||
            !!search.dateFin
        );
    };


    return (
        <div>


            <main >

                <div className="container-dashbord">

                    <Sidebar />

                    <div className="mainContent">

                        <h1 className="page-title">
                            Appels d’offres et opportunités professionnelles
                        </h1>
                        <h2 className="recherche-ctn-txt">{`Resultat de recherche ( ${total} )`}</h2>

                        <div className='ctn-opp'>
                          


                            <div className='annonce-list-ctn'>
                                <AnnonceList
                                    annonces={annonces}
                                    total={15}
                                    currentpage={Number(currentpage)}
                                />
                            </div>


                        </div>



                    </div>

                </div>



            </main>
            <footer >

            </footer>
        </div>
    );
}




