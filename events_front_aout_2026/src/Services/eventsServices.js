import axios from "axios"

function getAll() {
    return axios.get("http://127.0.0.1:3000/events", {
        headers : {
            Authorization : "Bearer "+ window.localStorage.getItem("token")
        }
    })
}

export default {
    getAll
}