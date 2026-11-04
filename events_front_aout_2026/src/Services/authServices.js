// axios : outil qui permet au front d'envoyer des requêtes au back (comme Postman, mais dans le code)
import axios from "axios";
// API_URL : l'adresse du back, écrite une seule fois dans url.js
import { API_URL } from "./url";
import {jwtDecode} from "jwt-decode";

// Envoie le username et le mot de passe au back pour se connecter
// Requête POST (= on envoie des données) sur /auth/login
// Si c'est bon, le back répond avec un token
function login(user) {
    return axios.post(API_URL + "/auth/login", user)
}

// Envoie les infos du formulaire d'inscription au back pour créer un compte
// Requête POST sur /auth/register
function register(user) {
    return axios.post(API_URL + "/auth/register", user)
}

function isConnected() {
    const token = window.localStorage.getItem("token");
    if (token) {
        const decodedToken = jwtDecode(token)
        if (decodedToken.exp > Date.now() / 1000) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return true;
    } 
}
    axios.defaults.headers.common["Authorization"] = "";
    return false;
}

// On exporte les fonctions pour les utiliser dans LoginPage et RegisterPage
// Exemple : authServices.login(user)
export default {
    login,
    register,
    isConnected,
}
