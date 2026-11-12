/*
 * Appels HTTP liés au compte : connexion, inscription, mot de passe oublié.
 * axios envoie une requête et renvoie une promesse.
 * Le composant qui appelle login() doit donc utiliser await (ou .then).
 *
 * Exemple de corps envoyé à /auth/login :
 *   { "username": "lea", "password": "secret" }
 * Réponse typique :
 *   { "token": "eyJhbGciOi..." }
 * Ce token est ensuite stocké dans le navigateur (voir LoginPage).
 *
 * ⚠️ Chez toi, API_URL vaut "http://127.0.0.1:3000" SANS "/" à la fin (voir url.js).
 * Il faut donc écrire "/auth/login" (avec le "/" devant), sinon l'adresse devient
 * "http://127.0.0.1:3000auth/login" et la requête échoue.
 */
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
// API_URL : l'adresse du back, écrite une seule fois dans url.js
import { API_URL } from "./url";


// POST crée une ressource ou déclenche une action. Ici : ouvrir une session.
function login(user) {
    return axios.post(API_URL + "/auth/login", user)
}

// Le 2e argument de axios.post est le JSON envoyé dans le corps de la requête.
function register(user) {
    return axios.post(API_URL + "/auth/register", user)
}

// Connecté ou pas ? On regarde s'il existe un token ET s'il n'est pas expiré.
// Au passage, on règle (ou on vide) l'en-tête Authorization envoyé automatiquement par axios.
function isConnected() {
    const token = window.localStorage.getItem("token");
    if (token) {
        const decoded = jwtDecode(token);
        // exp = date d'expiration du token (en secondes) ; Date.now() est en millisecondes, d'où le / 1000
        if (decoded.exp > Date.now() / 1000) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return true
        }
    }
    axios.defaults.headers.common["Authorization"] = ""
    return false;
}

// Renvoie l'utilisateur connecté (lu dans le token), ou null si personne n'est connecté
function getUser(){
    if(isConnected()){
        const token = window.localStorage.getItem("token");
        const decoded = jwtDecode(token);
        return decoded.user;
    }
    return null;
}

// Mot de passe oublié : demande au back d'envoyer un email avec un lien de réinitialisation.
// Le back attend { mail: "..." } (il lit req.body.mail)
function forgotPassword(mail) {
    return axios.post(API_URL + "/auth/forgot-password", { mail })
}

// Réinitialisation : envoie le code secret (du lien de l'email) + le nouveau mot de passe.
// Le back attend { resetToken, newPassword }
function resetPassword(resetToken, newPassword) {
    return axios.post(API_URL + "/auth/reset-password", { resetToken, newPassword })
}

/*
 * On exporte un objet pour écrire authServices.login(user).
 * Équivalent plus long :
 *   import { login } from "..."   si on avait écrit export function login
 */
export default {
    login,
    register,
    isConnected,
    getUser,
    forgotPassword,
    resetPassword
}
