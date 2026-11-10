// CONTROLLER = le "cuisinier" : il reçoit la commande (la requête), prépare la réponse et la renvoie
// Chaque fonction ici est appelée par une route de users.route.js
// req = la requête du front (ce qu'il demande) / res = la réponse qu'on lui renvoie

// Les models : ce sont eux qui parlent à la base de données (requêtes SQL)
import userModel from "../Models/users.model.js";
import commentModel from '../Models/comments.model.js'
import eventModel from '../Models/events.model.js'
// bcrypt : outil pour chiffrer les mots de passe (on ne les range jamais en clair)
import bcrypt from 'bcrypt';

// Récupère TOUS les utilisateurs (route GET /users)
async function getAll(req, res) {
    // try = "essaie de faire ça"...
    try {
        // On demande la liste au model, et on attend la réponse de la base
        const users = await userModel.getAll();
        // On renvoie la liste au front, au format JSON
        res.json(users)
    // ... catch = "si ça plante, fais plutôt ça" => erreur 500 (erreur du serveur)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des users" })
    }
}

// Récupère UN utilisateur grâce à son id (route GET /users/12)
async function getByUserId(req, res) {
    try {
        // req.params.id = le ":id" de l'adresse (ex : sur /users/12, id vaut "12")
        const id = req.params.id;
        // On cherche l'utilisateur dans la base
        const user = await userModel.getById(id);
        // CONDITION : s'il n'existe pas => erreur 404 ("introuvable") et "return" arrête tout
        if (!user) {
            return res.status(404).json({ erreur: "Le user n'existe pas" });
        }
        // Je vais chercher tout les évenement ou ce user participe
        const events = await eventModel.getByUserId(id);
        // Je vais chercher tout les commentaire écrit par ce user
        const comments = await commentModel.getByUserId(id);
        // On ajoute ces deux listes dans l'objet "user" avant de le renvoyer
        user.comments = comments;
        user.events = events;
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du user" })
    }
}

// Modifie un utilisateur (route PATCH /users/12)
async function update(req, res) {
    try {
        const id = req.user.us_id;
        // req.body = les données envoyées par le front (ex : { email: "nouveau@mail.com" })
        const body = req.body;
        // On récupère d'abord l'utilisateur actuel
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ erreur: "Le user n'existe pas" });
        }

        // CONDITIONS : on ne remplace QUE ce que le front a envoyé, le reste ne bouge pas
        if (body.email) {
            user.us_email = body.email;
        }

        if (body.username) {
            user.us_username = body.username;
        }

        if (body.password) {
            // Le nouveau mot de passe est chiffré avant d'être rangé (10 = niveau de chiffrement)
            user.us_password = bcrypt.hashSync(body.password,10);
        }

        // On enregistre l'utilisateur modifié dans la base
        const updated = await userModel.update(id,user);
        res.json({message : "Votre modification à bien été effectué", user});
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du users" })
    }
}

// Crée un nouvel utilisateur (route POST /users)
async function insert(req, res) {
    try {
        const body = req.body;
        // CONDITION : si un des 3 champs manque ("||" = "ou") => on refuse
        if(!body.username || !body.email || !body.password){
            return res.status(403).json({error : "Tout les champs sont requis !"})
        }
        // On ajoute l'utilisateur dans la base
        const inserted = await userModel.insert(body);
        // 201 = "créé avec succès"
        res.status(201).json({message: "Votre ajout d'utilisateur à bien été fait", user: body})
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l'insertion du user" })
    }
}

// Supprime un utilisateur (route DELETE /users/12)
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        // On vérifie d'abord qu'il existe
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ erreur: "Le user n'existe pas" });
        }
        // On le supprime de la base
        const deleted = await userModel.deleteUser(id);
        res.json({message : "Votre suppression à bien été faites", user});
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du user" })
    }
}

// Récupère l'utilisateur CONNECTÉ (route GET /users/me)
// Différence avec getByUserId : ici, le front n'envoie PAS d'id.
// C'est le back qui sait qui demande, grâce au token => impossible de voir le profil d'un autre
async function getMe(req, res) {
    try {
        // req.user a été rempli par le videur (checkToken) : c'est la "photo" du token, prise à la connexion.
        // On s'en sert SEULEMENT pour l'id, et on va chercher les infos À JOUR dans la base de données
        // (sinon, après une modification du pseudo/email, on renverrait les anciennes valeurs du token)
        const userConnected = await userModel.getById(req.user.us_id);
        // On ne renvoie JAMAIS le mot de passe (même chiffré) au front 🔐
        delete userConnected.us_password;
        // Je vais chercher tous les événements où ce user participe (grâce à son id)
        const events = await eventModel.getByUserId(userConnected.us_id);
        // Je vais chercher tout les commentaire écrit par ce user
        const comments = await commentModel.getByUserId(userConnected.us_id);
        // On ajoute ces deux listes dans l'objet avant de le renvoyer
        userConnected.comments = comments;
        userConnected.events = events;
        // Tout est bon : on renvoie l'utilisateur au front
        res.json(userConnected);
    } catch (error) {
        // Si quelque chose plante (base de données injoignable...) => erreur 500
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du profil" })
    }
}

// Change le mot de passe de l'utilisateur CONNECTÉ (route PATCH /users/resetPassword)
async function resetPassword(req, res) {
    try {
        // req.user a été rempli par le videur (checkToken) : c'est l'utilisateur connecté
        const user = req.user;
        // On récupère les 3 champs envoyés par le formulaire du front
        const { old_password, new_password, confirm_password } = req.body;

        // On compare l'ancien mot de passe tapé avec celui (chiffré) de l'utilisateur
        // compareSync renvoie true s'ils correspondent, false sinon
        const verifyPassword = bcrypt.compareSync(old_password, user.us_password);
        // CONDITION : l'ancien mot de passe est faux => on refuse (403) et "return" arrête tout
        if (verifyPassword == false) {
            // if (!verifyPassword) {
            return res.status(403).json({ error: "Ancien mot de passe ne correspond pas." })
        }

        // On chiffre le nouveau mot de passe avant de le ranger (on ne range JAMAIS un mot de passe en clair)
        const hashPassword = bcrypt.hashSync(new_password, 10);

        // On remplace le mot de passe dans l'objet user, puis on l'enregistre dans la base
        user.us_password = hashPassword;
        // "await" = on attend que la base ait bien enregistré avant de répondre
        const updatedUser = await userModel.update(user.us_id, user);
        res.status(201).json({ message: "Votre mot de passe à bien été changé" })
    } catch (error) {
        res.status(500).json({error : "Une erreur est survenue lors de la modification du mot de passe"})
    }
}

// On exporte toutes les fonctions pour que users.route.js puisse les utiliser
export default {
    getAll,
    getByUserId,
    getMe,
    update,
    insert,
    deleteUser,
    resetPassword
}
