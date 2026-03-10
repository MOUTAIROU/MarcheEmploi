'use client';
import './style.css';
import axios from "axios";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import AnnonceList from "@/components/AnnonceList/page";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import ActionConfirmeSupressionModal from "@/components/modale/ActionConfirmeSupressionModal/page";
import { refreshAndRetry } from "@/utils/refreshAndRetry";
import { useSession } from "@/lib/sessionStore";
import api from "@/lib/axiosInstance";


export default function Home() {


    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false)
    const [actionGroupeType, setActionGroupeType] = useState('delete-account')
    const { session } = useSession();
    console.log(session)

    const handleSave = async () => {
        setIsModalOpenGroupe(true)
    };

    console.log(session)




    return (
        <div>
            <main >


                <div className="container-dashbord">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="mainContent">

                        <ActionConfirmeSupressionModal
                            title={"Suprssion de vontre commpte"}
                            name={session?.nom || " "}
                            isOpen={isModalOpenGroupe}
                            action="delete-account"
                            onClose={() => setIsModalOpenGroupe(false)}
                            onConfirm={(newStatus) => {
                                if (!actionGroupeType) return;

                                switch (actionGroupeType) {

                                    case "delete-account":
                                        console.log("Suppression confirmée pour :",);
                                        // API - supprimer
                                        break;




                                }

                                setIsModalOpenGroupe(false);
                            }}

                        />

                        <div className="container-ctn">

                            <div className="warning-text">
                                <p>
                                    La suppression de votre compte est irréversible. Vous ne pourrez plus récupérer votre compte ni les informations associées.
                                </p>
                                <p>
                                    Vos données seront conservées pendant 90 jours avant d’être définitivement supprimées. Après ce délai, elles seront totalement effacées de notre système.
                                </p>
                            </div>

                            <button className="save" onClick={handleSave}>
                                Suppression de votre compte
                            </button>



                        </div>







                    </div>
                </div>

            </main>
            <footer >

            </footer>
        </div>
    );
}




