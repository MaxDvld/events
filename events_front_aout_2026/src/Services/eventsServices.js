// axios : outil qui permet au front d'envoyer des requêtes au back (comme Postman, mais dans le code)
import axios from "axios"
// API_URL : l'adresse du back, écrite une seule fois dans url.js
import { API_URL } from "./url";

// Demande au back la liste de tous les événements
// Requête GET sur http://127.0.0.1:3000/events
function getAll() {
    return axios.get(API_URL + "/events")
}


// Demande au back UN seul événement, grâce à son id
// Requête GET sur http://127.0.0.1:3000/events/12 (si id vaut 12)
function getById(id) {
    return axios.get(API_URL + "/events/" + id)
}

// On exporte les fonctions pour pouvoir les utiliser dans les pages
// Exemple : eventsServices.getAll() dans EventsPage.jsx
export default {
    getAll,
    getById
}

