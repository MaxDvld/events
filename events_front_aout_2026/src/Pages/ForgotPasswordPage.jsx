// useState : pour stocker l'email tapé dans le formulaire
import { useState } from "react";
// Le service qui envoie les demandes de connexion / inscription / mot de passe oublié au back
import authServices from "../Services/authServices";
// useNavigate : pour changer de page depuis le code
import { useNavigate } from "react-router";

// Page "Mot de passe oublié", affichée sur l'adresse "/forgot-password"
// (accessible SANS être connecté : c'est justement quand on ne peut plus se connecter)
const ForgotPasswordPage = () => {
    // VARIABLES
    // L'email tapé par l'utilisateur (vide au départ)
    const [mail, setMail] = useState("");
    const navigate = useNavigate();

    // TRAITEMENTS
    // Appelée quand on clique sur "valider"
    const handleSubmit = async (e) => {
        // Empêche le navigateur de recharger la page
        e.preventDefault();

        try {
            // On demande au back d'envoyer l'email de réinitialisation à cette adresse
            await authServices.forgotPassword(mail);
            // Puis on retourne à l'accueil
            navigate("/");
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe :", error);
        }
    }

    // RENDU
    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                {/* Un seul champ : pas besoin de handleChange avec [name], on range directement e.target.value */}
                <input type="email" placeholder="Email" value={mail} onChange={(e) => setMail(e.target.value)} />
                <button type="submit">valider</button>
            </form>
        </div>
    )
}

// On exporte la page pour l'utiliser dans App.jsx
export default ForgotPasswordPage;
