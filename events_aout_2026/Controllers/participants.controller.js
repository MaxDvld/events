/*
 * Controllers/participants.controller.js — inscriptions aux événements
 * ---------------------------------------------------------------------
 * Une "participation" = un utilisateur inscrit à un événement.
 *
 * Routes (adaptées à TON fichier Routes/participants.route.js) :
 *   GET    /participants                     toutes les inscriptions
 *   GET    /participants/user/:userID        celles d'un utilisateur
 *   GET    /participants/event/:eventID      celles d'un événement
 *   POST   /participants                     m'inscrire (moi = l'utilisateur connecté)
 *   DELETE /participants/:eventID            me désinscrire
 *
 * Exemple d'inscription :
 *   POST /participants
 *   { "event": 5 }        → "user" n'est PAS dans le body : il vient du token (req.user)
 *
 * Exemple de suppression :
 *   DELETE /participants/5
 *   → retire l'utilisateur connecté de l'événement 5 uniquement
 */

import participantModel from '../Models/participants.model.js'
import mailService from '../Services/mail.service.js'

async function getAll(req, res) {
    try {
        const participants = await participantModel.getAll();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participants" })
    }
}

// GET /participants/user/2 → événements auxquels l'utilisateur 2 est inscrit
async function getByUserID(req, res) {
    try {
        // Le nom :userID dans la route doit correspondre exactement à req.params.userID
        const userID = req.params.userID;
        const participants = await participantModel.getByUserID(userID);
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participation par User" })
    }
}

// GET /participants/event/5 → utilisateurs inscrits à l'événement 5
async function getByEventID(req, res) {
    try {
        const eventID = req.params.eventID;
        const participants = await participantModel.getByEventID(eventID);
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participants par Event" })
    }
}

// POST /participants — inscrit l'utilisateur connecté, puis lui envoie un email de confirmation
async function insert(req, res) {
    try {
        // On construit nous-mêmes l'objet envoyé au model :
        const participant = {
            user : req.user.us_id,    // QUI ? => l'utilisateur connecté, rangé par le videur (token vérifié)
            event : req.body.event    // À QUOI ? => choisi par le front, c'est normal
        }
        // CONDITION : seul l'événement peut manquer (user est garanti par le token)
        if (!participant.event) {
            return res.status(403).json({error : "Tout les champs sont obligatoires !"})
        }
        const inserted = await participantModel.insert(participant);

        // NOUVEAU (prof) : email de confirmation d'inscription à l'événement
        // On va chercher en base l'email de l'utilisateur + titre, date et lieu de l'événement.
        // Adapté : dans son propre try/catch. L'inscription est DÉJÀ faite à ce stade,
        // donc si Gmail refuse l'envoi, on ne veut pas répondre "erreur" au front.
        try {
            const data = await participantModel.getDataByUserIDAndEventID(participant.user, participant.event);
            // data est un TABLEAU de lignes. Un tableau vide [] est quand même "vrai" en JS,
            // donc on vérifie qu'il contient au moins une ligne (le prof testait if(data)).
            if (data.length > 0) {
                await mailService.eventConfirm(data[0].us_email, data[0].ev_title, data[0].ev_date, data[0].ev_location);
            }
        } catch (mailError) {
            console.error("Email de confirmation non envoyé :", mailError.message);
        }

        res.status(201).json({message : "Votre insertion à bien été effectué", participant : participant})
    } catch (error) {
        // La vraie erreur va dans le terminal du back, pas au front
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenur lors de l'insertion du participant" })
    }
}

/*
 * DELETE /participants/:eventID
 * QUI se désinscrit ? => req.user (le token), jamais l'URL ni le body.
 * Pour /participants/5 :
 *   req.params.eventID === "5"
 */
async function deleteParticipant(req, res) {
    try {
        const userID = req.user.us_id;  // QUI ? => l'utilisateur connecté, rangé par le videur (token vérifié)
        const eventID = req.params.eventID;
        const deleted = await participantModel.deleteParticipant(userID, eventID);
        res.json({message : "Votre suppression à bien été effectué", participant : {user : userID, event :eventID}})
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la suppression du participant" })
    }
}

export default {
    getAll,
    getByEventID,
    getByUserID,
    insert,
    deleteParticipant
}
