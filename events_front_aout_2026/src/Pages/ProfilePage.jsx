import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import usersServices from "../Services/usersServices";

const ProfilePage = () => {
    // VARIABLES
    const token = window.localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const [user, setUser] = useState({})
    console.log(decodedToken);
    // TRAITEMENTS
const fetchUserById = async () => {
    // try = "essaie de faire ça"...
    try {
        // On demande au back l'utilisateur qui a cet id
        // "await" = on attend la réponse avant de passer à la ligne suivante
        const response = await usersServices.getById(decodedToken.user.us_id)
        // On range l'utilisateur reçu dans "user" : la page se met à jour toute seule
        setUser(response.data)
        // ... catch = "si ça plante, fais plutôt ça"
    } catch (error) {
        // On affiche l'erreur dans la console pour comprendre ce qui n'a pas marché
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
    }
};

// useEffect lance fetchUserById quand la page s'affiche
useEffect(() => {
    fetchUserById();
}, []);


    // RENDU
    return <>
        <h1>Mon profil</h1>
        {decodedToken && (
            <div>
               <p>Nom d'utilisateur : {user.us_username}</p>
                <p>Email : {user.us_email}</p>
            </div>
        )}
    </>;
}


// Rendu JSX : ce qui s'affiche à l'écran
export default ProfilePage;