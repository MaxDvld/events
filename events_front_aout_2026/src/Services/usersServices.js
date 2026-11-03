import axios from "axios";

function getUserById(id) {
    return axios.get("http://127.0.0.1:3000/users/" + id, {
        headers : {
            // On envoie le token (le "badge" reçu à la connexion) pour prouver qu'on est connecté
            // Sans lui, le back répond 401 ou 403 (voir checkToken dans le back)
            Authorization : "Bearer "+ window.localStorage.getItem("token")
        }
    })
}


export default getUserById;