"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PopupError from '@/components/modale/Popup/PopupError/page'
import PopupSuccess from '@/components/modale/Popup/PopupSuccess/page'
import './style.css';

import api from "@/lib/axios";

export default function InvitationAccept() {
    const { token } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [invalide, setInvalide] = useState(false);

    const [form, setForm] = useState({
        nom: "",
        email: "",
        entreprise: "",
        password: "",
        confirm: "",
        acceptTerms: false
    });

    // 🔎 récupérer infos invitation
    useEffect(() => {
        if (!token) return;

        const fetchInvite = async () => {
            try {


                const res = await api.get(`/frontend/invitation/${token}`);


                if (res.data.status == "success") {
                    setForm((prev) => ({
                        ...prev,
                        nom: res.data.data.nom,
                        email: res.data.data.email,
                        entreprise: res.data.data.entreprise,
                    }));
                } else {
                    setInvalide(true)
                    setErrorMsg(res.data.status.message);
                    setShowError(true);
                }



                setLoading(false);
            } catch (err: any) {

                setErrorMsg("Invitation invalide ou expirée");
                setShowError(true);

                setLoading(false);
            }
        };

        fetchInvite();
    }, [token]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // ✅ accepter invitation
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (form.password !== form.confirm) {
            setErrorMsg("Les mots de passe ne correspondent pas");
            setShowError(true);
            return;
        }


        if (form.password.length < 6) {
            setErrorMsg("Le mot de passe doit comporter au moins 6 caractères");
            setShowError(true);
            return
        }


        if (!form.acceptTerms) {
            setErrorMsg("Vous devez accepter les conditions d’utilisation");
            setShowError(true);
            return;
        }


        try {
            const res = await api.patch(`/frontend/invitation_accept/${token}`, {
                password: form.password,
            });

            if (res.data.status == "success") {
                setSuccessMsg(res.data.status.message);
                setShowSuccess(true)
            } else {
                setInvalide(true)
                setErrorMsg(res.data.status.message);
                setShowError(true);
            }


            setTimeout(() => {
                router.push("/connexion");
            }, 3000);
        } catch (err: any) {
            setErrorMsg("Erreur lors de l’activation");
            setShowError(true);

        }
    };

    if (loading) return <div>Chargement...</div>;
    if (invalide) return <div>Token invalide...</div>;



    return (
        <div className="invite-container">
            {showError && (
                <PopupError
                    isOpen={showError}
                    title="Erreur"
                    message={errorMsg}
                    onClose={() => setShowError(false)}
                />
            )}

            {showSuccess && (
                <PopupSuccess
                    isOpen={showSuccess}
                    title="Success"
                    message={successMsg}
                    onClose={() => setShowSuccess(false)}
                />
            )}


            <h2>Activation de votre compte</h2>
            <p>
                Vous avez été invité à rejoindre <b>{form.entreprise}</b>
            </p>

            <form onSubmit={handleSubmit}>
                <label>Nom</label>
                <input value={form.nom} disabled />

                <label>Email</label>
                <input value={form.email} disabled />

                <label>Mot de passe</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <label>Confirmer</label>
                <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                />

                <label className="terms">
                    <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={form.acceptTerms}
                        onChange={handleChange}
                    />
                    J’accepte les conditions d’utilisation
                </label>

                <button className="btn" type="submit">Activer mon compte</button>
            </form>
        </div>
    );
}