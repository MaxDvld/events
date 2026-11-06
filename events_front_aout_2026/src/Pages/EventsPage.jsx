// Hooks React : useState pour stocker des données, useEffect pour lancer du code au montage du composant
import { useEffect, useState } from "react"
// Hook de React Router pour changer de page par le code
import { useNavigate } from "react-router"
// Composants tout prêts de Material UI (MUI) pour le style
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Alert from "@mui/material/Alert"
// Icônes de MUI (calendrier, lieu, personne)
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import PlaceIcon from "@mui/icons-material/Place"
import PersonIcon from "@mui/icons-material/Person"

// Service qui centralise les appels à l'API pour les événements
import eventsServices from "../Services/eventsServices"

// Composant page qui affiche la liste des événements
const EventsPage = () => {
    // VARIABLES
    // État local contenant la liste des événements (tableau vide au départ)
    const [events, setEvents] = useState([])
    // navigate sert à changer de page depuis le code (utilisé par le bouton "Voir les détails")
    const navigate = useNavigate()

    // TRAITEMENTS
    // Récupère les événements depuis l'API
    const fetchEvents = async () => {
        try {
            // Appel asynchrone au back : on attend la réponse avant de continuer
            const events = await eventsServices.getAll()
            setEvents(events.data) // Met à jour l'état local avec les événements reçus
            // Affiche les données reçues dans la console (utile pour le debug)
            console.log(events.data)

        } catch (error) {
            // En cas d'erreur (API injoignable, erreur serveur...), on l'affiche dans la console
            console.error(error)
        }
    }

    // Le tableau de dépendances vide [] fait que fetchEvents n'est appelé qu'une seule fois,
    // au premier affichage du composant
    useEffect(() => {
        fetchEvents()
    }, [])

    // RENDU
    return <>
        {/* Titre de la page (variant = taille du texte, gutterBottom = espace en dessous) */}
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Pages des événements
        </Typography>
        {/* Bouton pour aller sur la page de création */}
        <Button variant="contained" onClick={() => navigate("/create")} sx={{ mb: 3 }}>
            Créer un événement
        </Button>


        {/* CONDITION : s'il n'y a aucun événement, on affiche un message */}
        {events.length === 0 && <Alert severity="info">Aucun événement à afficher.</Alert>}

        {/* Grille de cartes : 1 colonne sur mobile (xs), 2 sur tablette (sm), 3 sur ordinateur (md) */}
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 3,
            }}
        >
            {/* map = "pour chaque événement de la liste, crée une carte" */}
            {/* key = étiquette unique pour que React reconnaisse chaque carte */}
            {events.map((event) => {
                return <Card key={event.ev_id} sx={{ display: "flex", flexDirection: "column" }}>
                    {/* Contenu de la carte (flexGrow: 1 = prend toute la hauteur dispo, pour aligner les boutons en bas) */}
                    <CardContent sx={{ flexGrow: 1 }}>
                        {/* Titre de l'événement */}
                        <Typography variant="h6" component="h2" gutterBottom>
                            {event.ev_title}
                        </Typography>

                        {/* Stack = empile les lignes les unes sous les autres, avec un espace (spacing) */}
                        <Stack spacing={1}>
                            {/* Chaque ligne : une icône + un texte, côte à côte (direction="row") */}
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <CalendarMonthIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(event.ev_date).toLocaleDateString()}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <PlaceIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {event.ev_location}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <PersonIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {event.us_username}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>

                    {/* Zone des boutons, en bas de la carte */}
                    <CardActions>
                        {/* Le bouton envoie vers la page de détail, ex : /event/12 */}
                        <Button size="small" variant="contained" onClick={() => navigate("/event/" + event.ev_id)}>
                            Voir les détails
                        </Button>
                    </CardActions>
                </Card>
            })}
        </Box>
    </>
}

// On exporte la page pour l'utiliser dans App.jsx
export default EventsPage
