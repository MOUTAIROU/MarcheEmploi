'use client';
import './style.css';
import axios from "axios";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
import ActionConfirmeSupressionModal from "@/components/modale/ActionConfirmeSupressionModal/page";

import api from "@/lib/axiosInstance";


export default function Home() {


    const [isModalOpenGroupe, setIsModalOpenGroupe] = useState(false)
    const [actionGroupeType, setActionGroupeType] = useState('delete-account')

    const [userName, seUserName] = useState("")
    const [userID, seUserID] = useState("")


    useEffect(() => {

        get_user_data();
    }, []);

    // 🔹 récupérer les préférences
    async function get_user_data() {
        try {

            const response = await api.get("users/get_user_data");

            alert('toto')


            const { status, data } = response

            if (status == 201) {

                if (data.status == "success") {

                    seUserName(data.data.nom)
                    seUserID(data.data.id)

                }

            }



            if (!data) return;

        } catch (error) {
            console.error("Erreur récupération notifications:", error);
        }
    }
    const handleSave = async () => {
        setIsModalOpenGroupe(true)
    };

    async function deletet_user_data() {
        try {


            const payload = {
                userName,
                userID
            };

            const response = await api.post(
                "users/delete_user",
                payload
            );





            console.log(response)
            const { status, data } = response

            if (status == 201) {

                if (data.status == "success") {

                }

            }



            if (!data) return;

        } catch (error) {
            console.error("Erreur récupération notifications:", error);
        }
    }

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
                            name={userName || ""}
                            isOpen={isModalOpenGroupe}
                            action="delete-account"
                            onClose={() => setIsModalOpenGroupe(false)}
                            onConfirm={(newStatus) => {
                                if (!actionGroupeType) return;

                                switch (actionGroupeType) {

                                    case "delete-account":
                                        console.log("Suppression confirmée pour :");
                                        deletet_user_data()
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




