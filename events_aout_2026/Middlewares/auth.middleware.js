// MIDDLEWARE = un "videur" placé entre la requête et la route
// Il vérifie quelque chose AVANT de laisser passer (ici : est-ce que l'utilisateur a un token valide ?)
// Il est utilisé dans index.js : app.use("/events", checkToken, eventRoutes)

// jsonwebtoken : outil pour créer et vérifier les tokens
import jwt from 'jsonwebtoken'
// dotenv : permet de lire le fichier .env (où est rangée la clé secrète JWT_SECRET)
import dotenv from 'dotenv'
dotenv.config();

// req  = la requête envoyée par le front (ce qu'il demande)
// res  = la réponse qu'on va renvoyer au front
// next = "c'est bon, laisse passer vers la route suivante"
function checkToken(req, res, next) {
    // On récupère le token dans les headers de la requête
    // Le front envoie : Authorization : "Bearer eyJhbGc..." (voir eventsServices.js)
    const headers = req.headers["authorization"];
    // Ice je découpe la valeur
    // split(" ") coupe "Bearer eyJhbGc..." à l'espace => ["Bearer", "eyJhbGc..."]
    // [1] prend le 2e morceau => le token seul
    // "headers &&" = on ne découpe QUE s'il y a des headers (sinon ça planterait)
    const token = headers && headers.split(" ")[1];

    // CONDITION : pas de token => on bloque avec une erreur 401 ("tu n'es pas identifié")
    // "return" arrête la fonction ici : on ne va pas plus loin
    if (!token) {
        return res.status(401).json({ error: "Unhautorized" });
    }

    // On vérifie que le token est VRAI et PAS EXPIRÉ, grâce à la clé secrète du .env
    // (un faux token ou un token de plus de 4h sera refusé)
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        // CONDITION : token faux ou expiré => on bloque avec une erreur 403 ("accès refusé")
        if (err) {
            return res.status(403).json({ error: "Token incorrect" });
        }
        // "decode" = le contenu du token ouvert. On range l'utilisateur dans "req.user"
        // => la fonction appelée ensuite (ex : getMe) saura QUI fait la demande, sans relire le token
        req.user = decode.user;
        // Tout est bon : next() laisse passer la requête vers la route demandée
        next();
    })
}

// On exporte le videur pour l'utiliser dans index.js
export default checkToken;
