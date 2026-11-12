// useState : pour stocker le nouveau mot de passe tapé
import { useState } from "react";
// Le service qui parle au back pour l'authentification
import authServices from "../Services/authServices";
// useNavigate : changer de page / useSearchParams : lire ce qu'il y a après le "?" dans l'adresse
import { useNavigate, useSearchParams } from "react-router";

// Page ouverte par le lien de l'email : http://localhost:5173/reset-password?token=a8f3c2...
// (accessible SANS être connecté)
const ResetPasswordPage = () => {
    // VARIABLES
    // Le nouveau mot de passe tapé par l'utilisateur
    const [newPassword, setNewPassword] = useState("");
    // searchParams = les "paramètres de recherche" de l'adresse, tout ce qui est après le "?"
    const [searchParams] = useSearchParams();
    // On lit la valeur de "token" dans l'adresse (?token=a8f3c2... => "a8f3c2...")
    const resetToken = searchParams.get("token");

    // Pour vérifier pendant les tests (à retirer ensuite : le code secret n'a rien à faire dans la console)
    console.log(resetToken);

    // navigation
    const navigate = useNavigate();

    // TRAITEMENTS
    // handle submit pour reset le mot de passe
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // On envoie au back le code secret (pour prouver qui on est) + le nouveau mot de passe
            await authServices.resetPassword(resetToken, newPassword);
            navigate("/");
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe :", error);
        }
    }

    // RENDU
    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    )

}

// On exporte la page pour l'utiliser dans App.jsx
export default ResetPasswordPage;
