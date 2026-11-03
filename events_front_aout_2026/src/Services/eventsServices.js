// axios : outil qui permet au front d'envoyer des requêtes au back (comme Postman, mais dans le code)
import axios from "axios"

// Demande au back la liste de tous les événements
// Requête GET sur http://127.0.0.1:3000/events
function getAll() {
    return axios.get("http://127.0.0.1:3000/events", {
        headers : {
            // On envoie le token (le "badge" reçu à la connexion) pour prouver qu'on est connecté
            // Sans lui, le back répond 401 ou 403 (voir checkToken dans le back)
            Authorization : "Bearer "+ window.localStorage.getItem("token")
        }
    })
}

// Demande au back UN seul événement, grâce à son id
// Requête GET sur http://127.0.0.1:3000/events/12 (si id vaut 12)
function getById(id) {
    return axios.get("http://127.0.0.1:3000/events/" + id, {
        headers : {
            // On envoie le token (le "badge" reçu à la connexion) pour prouver qu'on est connecté
            // Sans lui, le back répond 401 ou 403 (voir checkToken dans le back)
            Authorization : "Bearer "+ window.localStorage.getItem("token")
        }
    })
}

// On exporte les fonctions pour pouvoir les utiliser dans les pages
// Exemple : eventsServices.getAll() dans EventsPage.jsx
export default {
    getAll,
    getById
}

