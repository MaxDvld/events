// useNavigate : permet de changer de page depuis le code (par exemple au clic sur un bouton)
import { useNavigate } from "react-router";
// useContext : permet de lire le Context (l'info "connecté ou pas")
import { useContext } from "react";
// Le Context qui contient isConnected
import AuthContext from "../Context/AuthContext";

// Page d'accueil, affichée sur l'adresse "/"
const HomePage = () => {
    // VARIABLES
    // Const navigate de useNavigate me permets de faire des redirections
    const navigate = useNavigate();
    // On lit dans le Context si l'utilisateur est connecté (true) ou pas (false)
    const { isConnected } = useContext(AuthContext);


    // TRAITEMENTS


    // RENDU
    return <>
        {/* Grand bloc blanc centré (classes Bootstrap) */}
        <div className="p-5 bg-white rounded-3 shadow-sm text-center">
            <h1 className="display-5 fw-bold">Bienvenue sur EventHub</h1>
            <p className="lead text-muted mb-4">Découvrez, créez et participez à des événements.</p>
            {/* Les 3 boutons, alignés côte à côte */}
            <div className="d-flex gap-2 justify-content-center">
                {/* onClick = ce qui se passe au clic : ici on change de page avec navigate */}
                <button className="btn btn-primary btn-lg" onClick={()=>{ navigate("/events") }}>Voir les événements</button>
                {/* CONDITION : "Se connecter" et "S'inscrire" seulement si on n'est PAS connecté */}
                {isConnected == false && <>
                    <button className="btn btn-outline-primary btn-lg" onClick={()=>{ navigate("/login") }}>Se connecter</button>
                    <button className="btn btn-outline-secondary btn-lg" onClick={()=>{ navigate("/register") }}>S'inscrire</button>
                </>}
            </div>
        </div>
    </>;
}

// On exporte la page pour l'utiliser dans App.jsx
export default HomePage;
