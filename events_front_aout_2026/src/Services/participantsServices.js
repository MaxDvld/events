import axios from "axios";
import {API_URL} from "./url";

function insertParticipant(participant) {
    return axios.post(API_URL + "/participants/", participant)
}

export default {
    insertParticipant

}