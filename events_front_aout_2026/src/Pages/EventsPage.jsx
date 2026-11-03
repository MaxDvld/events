// Hooks React : useState pour stocker des données, useEffect pour lancer du code au montage du composant
import { useEffect, useState } from "react"
// Hook de React Router pour changer de page par le code
import { useNavigate } from "react-router"

// Service qui centralise les appels à l'API pour les événements
import eventsServices from "../Services/eventsServices"

// Composant page qui affiche la liste des événements
const EventsPage = () => {

    // État local contenant la liste des événements (tableau vide au départ)
    const [events, setEvents] = useState([])
    // navigate sert à changer de page depuis le code (utilisé par le bouton "Voir les détails")
    const navigate = useNavigate()

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
    useEffect(()  =>{
        fetchEvents()
    }, [])

    // Rendu JSX de la page
    return <>
        <h1>Pages des événements</h1>
        {/* map = "pour chaque événement de la liste, crée une ligne <li>" */}
        {/* key = étiquette unique pour que React reconnaisse chaque ligne */}
        {/* Le bouton envoie vers la page de détail, ex : /event/12 */}
        {events.map((event) => {
            return <li key={event.ev_id}>{event.ev_id} {event.ev_title} {event.ev_location} {event.us_username} {new Date(event.ev_date).toLocaleDateString()}
            <button onClick={() => navigate("/event/"+event.ev_id)}>Voir les détails</button></li>
        })}
    </>
}

// On exporte la page pour l'utiliser dans App.jsx
export default EventsPage
