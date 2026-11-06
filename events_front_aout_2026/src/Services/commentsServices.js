import axios from 'axios'

import {API_URL} from './url'

function insertComment(comment){
    return axios.post(API_URL + "/comments/", comment)
}

function deleteComment(id){
    return axios.delete(API_URL + "/comments/", id)
}
export default {
    insertComment,
    deleteComment
}