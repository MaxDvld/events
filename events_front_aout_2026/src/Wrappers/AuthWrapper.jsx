import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import LoginPage from "../Pages/LoginPage";

// Garde d'une page : affiche la page (children) si on est connecté, sinon la page de connexion
const AuthWrapper = ({ children }) => {
    // VARIABLES
    // On lit dans le Context si l'utilisateur est connecté
    const { isConnected } = useContext(AuthContext); 

    // RENDU
    // children = ce qu'il y a entre <AuthWrapper> et </AuthWrapper> (ex : <ProfilePage />)
    return<>
    {isConnected ? children : <LoginPage />}
    </>
}

export default AuthWrapper