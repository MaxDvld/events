// useParams : permet de lire les morceaux variables de l'URL (ici le ":id" de "/event/:id")
import { useParams } from "react-router"
// useEffect : permet de lancer du code automatiquement quand la page s'affiche
import { useEffect, useState} from "react"
// Le service : c'est lui qui envoie les demandes au back (au serveur)
import eventsServices from "../Services/eventsServices"

// Composant page qui affiche le détail d'un seul événement
// Il s'affiche quand on va sur "/event/12" par exemple (voir la route dans App.jsx)
const EventPage = () => {
    // On récupère l'id de l'événement depuis l'URL
    // Exemple : sur "/event/12", id vaut "12"
    const { id } = useParams()
    const [event, setEvent] = useState({})

    // Fonction qui va chercher UN événement précis auprès du back, grâce à son id
    // "async" = la fonction doit attendre une réponse du serveur (ça prend un peu de temps)
    const fetchEventById = async () => {
        // try = "essaie de faire ça"...
        try {
            // On demande au back l'événement qui a cet id
            // "await" = on attend la réponse avant de passer à la ligne suivante
            const response = await eventsServices.getById(id)
            // On affiche la réponse dans la console du navigateur (F12) pour vérifier ce qu'on reçoit
            setEvent(response.data)
        // ... catch = "si ça plante, fais plutôt ça"
        } catch (error) {
            // On affiche l'erreur dans la console pour comprendre ce qui n'a pas marché
            console.error("Erreur lors de la récupération de l'événement :", error);
        }
    };

    // useEffect lance fetchEventById quand la page s'affiche
    // [id] = on la relance aussi à chaque fois que l'id de l'URL change
    // (par exemple si on passe de "/event/12" à "/event/13")
    useEffect(() => {
        fetchEventById();
    }, [id]);

    // Rendu JSX : ce qui s'affiche à l'écran
    return<>
    {/* Titre de la page */}
    <h1>{event.ev_title}</h1>
    <h2>{new Date(event.ev_date).toLocaleDateString()} - {event.ev_location}</h2>
    <p>{event.ev_description}</p>
    <h3>Participants</h3>
    <ul>
        {event.participants && event.participants.map((participant) => {
            return <li>{participant.us_username}</li>
        })}
    </ul>
    <h3>Commentaires</h3>
    {event.ev_comments && event.ev_comments.map((comment) => {
        return<li>{comment.co_comment}</li>
    })}
    </>
}

// On exporte le composant pour pouvoir l'utiliser dans App.jsx (dans la route "/event/:id")
export default EventPage
