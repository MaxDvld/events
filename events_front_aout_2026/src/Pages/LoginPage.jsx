/*
 * Formulaire de connexion.
 * Les champs sont "contrôlés" : leur texte vit dans le state React,
 * pas seulement dans le HTML.
 *
 * Exemple, après avoir tapé "lea" dans Identifiant :
 *   user vaut { username: "lea", password: "" }
 *   parce que handleChange recopie l'objet et remplace username.
 */
import { useContext, useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import authServices from "../Services/authServices";
// ⚠️ Chez toi, le dossier s'appelle "Context" (sans s)
import AuthContext from "../Context/AuthContext";
import axios from "axios";

const LoginPage = () => {
    // VARIABLES
    // user : ce qui sera envoyé à l'API. feedback : message succès ou erreur, ou null si rien à dire.
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();
    // On prend setIsConnected dans le contexte. isConnected n'est pas utile sur cette page.
    // "setUser: setConnectedUser" = on renomme setUser du Context, car "setUser" existe déjà
    // dans cette page (pour le formulaire). Il sert à ranger l'utilisateur connecté dans le Context
    // (utilisé par EventPage pour savoir si on participe déjà).
    const { setIsConnected, setUser: setConnectedUser } = useContext(AuthContext);

    // TRAITEMENTS
    /*
     * À chaque frappe, le navigateur donne un événement e.
     * e.target.name est l'attribut name du champ ("username" ou "password").
     * e.target.value est le texte actuel.
     *
     * { ...user, [name]: value } copie user puis écrase une seule clé.
     * Les crochets [name] utilisent la variable comme nom de propriété.
     * Exemple : name = "password", value = "secret"
     *   { username: "lea", password: "" } devient { username: "lea", password: "secret" }
     * Sans les "...user", on perdrait l'autre champ.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    /*
     * async permet d'utiliser await : on attend la réponse HTTP avant de continuer.
     * try / catch : le code du try tourne normalement.
     * Si axios reçoit une erreur (mauvais mot de passe, API éteinte), on saute dans le catch.
     */
    const handleSubmit = async (e) => {
        // preventDefault empêche le navigateur de recharger la page, comportement par défaut d'un <form>.
        e.preventDefault();
        setFeedback(null);
        try {
            const response = await authServices.login(user);
            // response.data est le JSON renvoyé par l'API. Exemple : { token: "eyJ..." }.
            const token = response.data.token;
            /*
             * localStorage garde une chaîne même après fermeture de l'onglet.
             * Les autres pages relisent "token" pour l'en-tête Authorization.
             * Ce n'est pas un cookie : c'est un petit stockage propre à ce site, dans le navigateur.
             */
            window.localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            navigate("/events");
            // Prévenir la NavBar : elle va cacher Connexion / Inscription et montrer l'avatar.
            setIsConnected(true);
            // On range aussi l'utilisateur connecté dans le Context (lu dans le nouveau token)
            setConnectedUser(authServices.getUser());
            setFeedback({ severity: "success", message: "Connexion réussie." });
        } catch (error) {
            console.error(error);
            setFeedback({ severity: "error", message: "Identifiants incorrects ou service indisponible." });
        }
    };

    // RENDU
    return (
        <Box sx={{ minHeight: "74vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* component="form" transforme le Paper en balise <form>, donc Entrée déclenche onSubmit. */}
            <Paper component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 460, p: { xs: 3, md: 5 } }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="overline" sx={{ color: "primary.light", letterSpacing: "0.22em" }}>
                            Espace membre
                        </Typography>
                        <Typography variant="h3" component="h1">Connexion</Typography>
                    </Box>
                    {/*
                      feedback && ... n'affiche l'alerte que si feedback n'est pas null.
                      Exemple : feedback vaut null au début, donc rien.
                      Après une erreur, feedback vaut { severity: "error", message: "..." }, donc l'alerte apparaît.
                    */}
                    {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}
                    {/*
                      value={user.username} affiche le state.
                      onChange={handleChange} met le state à jour.
                      Les deux ensemble font un champ contrôlé : React est la source du texte.
                      required empêche l'envoi si le champ est vide (vérification du navigateur).
                    */}
                    <TextField
                        label="Identifiant"
                        name="username"
                        id="username"
                        value={user.username}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <Button type="submit" variant="contained" size="large">
                        Se connecter
                    </Button>
                    {/*
                      type="button" est INDISPENSABLE ici : ce bouton est DANS le formulaire.
                      Sans lui, un bouton est "submit" par défaut => cliquer dessus enverrait le formulaire de connexion !
                    */}
                    <Button type="button" variant="text" onClick={() => navigate("/forgot-password")}>
                        Mot de passe oublié ?
                    </Button>
                    <Stack direction="row" spacing={1}>
                        <Button variant="text" onClick={() => navigate("/")}>Accueil</Button>
                        <Button variant="text" onClick={() => navigate("/register")}>Créer un compte</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default LoginPage;
