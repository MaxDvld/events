// useParams : permet de lire les morceaux variables de l'URL (ici le ":id" de "/event/:id")
// useNavigate : permet de changer de page depuis le code (pour le bouton "Retour")
import { useParams, useNavigate } from "react-router"
// useEffect : permet de lancer du code automatiquement quand la page s'affiche
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
// Composants tout prêts de Material UI (MUI) pour le style
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
// Icônes de MUI
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import PlaceIcon from "@mui/icons-material/Place"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// Le service : c'est lui qui envoie les demandes au back (au serveur)
import eventsServices from "../Services/eventsServices"
import participantsServices from "../Services/participantsServices"

// Composant page qui affiche le détail d'un seul événement
// Il s'affiche quand on va sur "/event/12" par exemple (voir la route dans App.jsx)
const EventPage = () => {
    // On récupère l'id de l'événement depuis l'URL
    // Exemple : sur "/event/12", id vaut "12"
    const { id } = useParams()
    // "event" contient l'événement reçu du back (objet vide au départ)
    const [event, setEvent] = useState({})
    // navigate sert à changer de page (bouton "Retour aux événements")
    const navigate = useNavigate()

    const token = window.localStorage.getItem("token")
    const myId = jwtDecode(token).user.us_id 

    const isParticipant = event.participants && event.participants.some(participant => participant.us_id === myId) 

    // Fonction qui va chercher UN événement précis auprès du back, grâce à son id
    // "async" = la fonction doit attendre une réponse du serveur (ça prend un peu de temps)
    const fetchEventById = async () => {
        // try = "essaie de faire ça"...
        try {
            // On demande au back l'événement qui a cet id
            // "await" = on attend la réponse avant de passer à la ligne suivante
            const response = await eventsServices.getById(id)
            // On range l'événement reçu dans "event" : la page se met à jour toute seule
            setEvent(response.data)
            // ... catch = "si ça plante, fais plutôt ça"
        } catch (error) {
            // On affiche l'erreur dans la console pour comprendre ce qui n'a pas marché
            console.error("Erreur lors de la récupération de l'événement :", error);
        }
    };
    // Inscrit l'utilisateur connecté à cet événement
    const particip = async () => {
        try {
            // L'objet attendu par le back : { user, event }
            const participant = {
                event: id                       // À QUEL événement ? => dans l'URL (useParams)
            }
            await participantsServices.insertParticipant(participant)
            // On recharge l'événement pour voir apparaître le nouveau participant
            fetchEventById()
        } catch (error) {
            console.error("Erreur lors de l'ajout du participant :", error);
        }
    }

    const unParticip = async () => {
        try {
            await participantsServices.deleteParticipant(id)
            fetchEventById()
        } catch (error){
            console.error("Erreur lors de la désincription", error)
        }
    }

    // useEffect lance fetchEventById quand la page s'affiche
    // [id] = on la relance aussi à chaque fois que l'id de l'URL change
    // (par exemple si on passe de "/event/12" à "/event/13")
    useEffect(() => {
        fetchEventById();
    }, [id]);

    // Rendu JSX : ce qui s'affiche à l'écran
    return <>
        {/* Bouton pour revenir à la liste des événements */}
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/events")} sx={{ mb: 2 }}>
            Retour aux événements
        </Button>

        {/* Paper = un bloc blanc avec une ombre (comme une feuille posée sur la page) */}
        {/* p = padding (espace intérieur) : 2 sur mobile, 4 sur ordinateur */}
        <Paper sx={{ p: { xs: 2, md: 4 } }}>

            {/* ===== EN-TÊTE : titre, date, lieu ===== */}
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {event.ev_title}
            </Typography>

            {/* Date et lieu côte à côte sur ordinateur, l'un sous l'autre sur mobile */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 3 }} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <CalendarMonthIcon color="action" />
                    <Typography color="text.secondary">
                        {/* CONDITION : on affiche la date seulement si elle existe (évite "Invalid Date") */}
                        {event.ev_date && new Date(event.ev_date).toLocaleDateString()}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <PlaceIcon color="action" />
                    <Typography color="text.secondary">{event.ev_location}</Typography>
                </Stack>
            </Stack>

            {/* ===== DESCRIPTION ===== */}
            <Typography variant="body1" sx={{ mb: 3 }}>
                {event.ev_description}
            </Typography>

            {/* Divider = une ligne de séparation */}
            <Divider sx={{ mb: 3 }} />

            {/* ===== PARTICIPANTS ===== */}
            <Typography variant="h6" component="h2" gutterBottom>
                {/* CONDITION : on affiche le nombre de participants seulement s'il y a la liste */}
                Participants {event.participants && `(${event.participants.length})`}
            </Typography>
            {isParticipant ? (
           <Button onClick={unParticip} variant="outlined" color="error" sx={{ mb: 2 }}>
                Se désinscrire 
            </Button>
            ) : (
            <Button onClick={particip} variant="contained" color="primary" sx={{ mb: 2 }}>
                Participer à cet événement
            </Button>
            )}

            {/* Box avec flexWrap : les participants passent à la ligne s'il n'y a plus de place */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {/* CONDITION : s'il n'y a aucun participant, on l'indique */}
                {event.participants && event.participants.length === 0 &&
                    <Typography color="text.secondary">Aucun participant pour le moment.</Typography>}

                {/* Chip = petite étiquette arrondie, avec un Avatar (rond avec la 1re lettre du nom) */}
                {event.participants && event.participants.map((participant) => {
                    return <Chip
                        key={participant.us_id}
                        avatar={<Avatar>{participant.us_username.charAt(0).toUpperCase()}</Avatar>}
                        label={participant.us_username}
                        variant="outlined"
                    />
                })}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ===== COMMENTAIRES ===== */}
            <Typography variant="h6" component="h2" gutterBottom>
                Commentaires {event.comments && `(${event.comments.length})`}
            </Typography>

            {/* CONDITION : s'il n'y a aucun commentaire, on l'indique */}
            {event.comments && event.comments.length === 0 &&
                <Typography color="text.secondary">Aucun commentaire pour le moment.</Typography>}

            {/* List / ListItem = une liste MUI (comme <ul> / <li>, mais stylée) */}
            <List>
                {event.comments && event.comments.map((comment) => {
                    return <ListItem key={comment.co_id} sx={{ bgcolor: "grey.100", borderRadius: 2, mb: 1 }}>
                        {/* ListItemText = le texte d'une ligne de la liste */}
                        <ListItemText primary={comment.co_comment} />
                    </ListItem>
                })}
            </List>
        </Paper>
    </>
}

// On exporte le composant pour pouvoir l'utiliser dans App.jsx (dans la route "/event/:id")
export default EventPage
