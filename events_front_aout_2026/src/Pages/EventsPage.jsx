import { useEffect, useState } from "react"
import eventsServices from "../Services/eventsServices"

const EventsPage = () => {

    const [events, setEvents] = useState([])

    const fetchEvents = async () => {
        try {
            const response = await eventsServices.getAll()
            setEvents(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()  =>{
        fetchEvents()
    }, [])
    return <>
    <h1 className="mb-4">Pages des événements</h1>
    {events.length === 0 ? (
        <div className="alert alert-info">Aucun événement à afficher.</div>
    ) : (
        <div className="row g-4">
            {events.map((event) => (
                <div className="col-md-6 col-lg-4" key={event.ev_id}>
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{event.ev_title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                                {event.ev_date && new Date(event.ev_date).toLocaleDateString("fr-FR")}
                                {event.ev_location && ` · ${event.ev_location}`}
                            </h6>
                            <p className="card-text">{event.ev_description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )}
    </>
}

export default EventsPage
