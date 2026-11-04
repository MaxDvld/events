import axios from "axios";

function getMe() {
    return axios.get("http://127.0.0.1:3000/users/me", {
        headers : {
            Authorization : "Bearer "+ window.localStorage.getItem("token")
        }
    })
}

function resetPassword(changePassword) {
    return axios.patch("http://127.0.0.1:3000/users/resetPassword", changePassword, {
        headers : {
            Authorization : "Bearer "+ window.localStorage.getItem("token")
        }
    })
}

export default {
    getMe,
    resetPassword
}
