// useState : permet de stocker des données qui peuvent changer (ici ce que l'utilisateur tape)
// useContext : permet de lire le Context (l'info partagée entre toutes les pages)
import { useContext, useState } from "react";
// useNavigate : permet de changer de page depuis le code
import { useNavigate } from "react-router";
// Le service qui envoie les demandes de connexion/inscription au back
import authServices from "../Services/authServices";
// Le Context qui contient l'info "connecté ou pas"
import AuthContext from "../Context/AuthContext";

// Page de connexion, affichée sur l'adresse "/login"
const LoginPage = () => {
    // VARIABLES
    // "user" contient ce que l'utilisateur tape dans le formulaire (vide au départ)
    // "setUser" sert à le mettre à jour
    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    const [feedback, setFeedback] = useState(null)
    const navigate = useNavigate();
    const { setIsConnected } = useContext(AuthContext);
    // TRAITEMENTS
    // Appelée à CHAQUE lettre tapée dans un champ du formulaire
    // "e" (l'événement) contient des infos sur le champ qui a changé
    const handleChange = (e) => {
        // const name = e.target.name;
        // const value = e.target.value;
        // name = le nom du champ ("username" ou "password"), value = ce qui est écrit dedans
        const {name, value} = e.target;
        // "...user" recopie toutes les anciennes valeurs, puis on remplace seulement le champ modifié
        setUser({...user, [name] : value})
    }

    // Appelée quand on clique sur "Se Connecter" (envoi du formulaire)
    const handleSubmit = async (e) => {
        // Empêche le navigateur de recharger la page (comportement normal d'un formulaire)
        e.preventDefault();
        try {
            // On envoie le username et le mot de passe au back, et on attend sa réponse
            const response = await authServices.login(user);
            // Si c'est bon, le back renvoie un token (le "badge" qui prouve qu'on est connecté)
            const token = response.data.token;
            // On range le token dans le navigateur (localStorage) pour le réutiliser plus tard
            // (par exemple dans eventsServices pour voir les événements)
            window.localStorage.setItem("token",token)
            // On met à jour l'état de connexion
            setIsConnected(true);
            // On affiche un message de réussite
            setFeedback("Connexion réussie ! Redirection vers la page d'accueil...");
            // On redirige vers la page d'accueil après 1,5 seconde (1500 millisecondes)
            // pour laisser le temps de lire le message
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            // Si ça échoue (mauvais mot de passe, back éteint...), on affiche l'erreur dans la console
            console.error(error);
            // CONDITION : si le back a répondu, on affiche son message (ex : "Identifiants incorrect")
            // Sinon (back éteint), error.response n'existe pas : on affiche un message général
            if (error.response) {
                setFeedback("Erreur de connexion : " + error.response.data.error);
            } else {
                setFeedback("Erreur de connexion : le serveur ne répond pas");
            }
        }
    }


    // Rendu
    return <>
        {/* Les classes Bootstrap centrent la carte au milieu de la page */}
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <h1 className="h3 mb-4 text-center">Connexion</h1>
                        {/* CONDITION : s'il y a un message (feedback), on l'affiche dans un encadré */}
                        {feedback && <div className="alert alert-info">{feedback}</div>}
                        {/* onSubmit : lance handleSubmit quand on envoie le formulaire */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Login</label>
                                {/* name = quel champ de "user" modifier, value = ce qui est affiché, onChange = à chaque frappe */}
                                <input type="text" className="form-control" name="username" id="username" value={user.username} onChange={handleChange}/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Mot de passe</label>
                                {/* type="password" cache les caractères tapés */}
                                <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={handleChange}/>
                            </div>
                            {/* type="submit" : cliquer ce bouton envoie le formulaire */}
                            <button type="submit" className="btn btn-primary w-100">Se Connecter</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

// On exporte la page pour l'utiliser dans App.jsx
export default LoginPage;
