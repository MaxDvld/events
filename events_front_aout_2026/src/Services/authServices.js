import axios from "axios";


function login(user){
    return axios.post("http://127.0.0.1:3000/auth/login", user)
}

function register(user){
    return axios.post("http://127.0.0.1:3000/auth/register", user)

}

export default {
    login,
    register
}