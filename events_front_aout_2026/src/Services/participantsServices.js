import axios from "axios";
import {API_URL} from "./url";

function insertParticipant(participant) {
    return axios.post(API_URL + "/participants/", participant)
}

function deleteParticipant(eventID){
    return axios.delete(API_URL + "/participants/" + eventID)
}
export default {
    insertParticipant,
    deleteParticipant
}