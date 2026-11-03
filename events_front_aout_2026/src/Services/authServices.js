// axios : outil qui permet au front d'envoyer des requêtes au back (comme Postman, mais dans le code)
import axios from "axios";


// Envoie le username et le mot de passe au back pour se connecter
// Requête POST (= on envoie des données) sur /auth/login
// Si c'est bon, le back répond avec un token
function login(user){
    return axios.post("http://127.0.0.1:3000/auth/login", user)
}

// Envoie les infos du formulaire d'inscription au back pour créer un compte
// Requête POST sur /auth/register
function register(user){
    return axios.post("http://127.0.0.1:3000/auth/register", user)

}

// On exporte les fonctions pour les utiliser dans LoginPage et RegisterPage
// Exemple : authServices.login(user)
export default {
    login,
    register
}
