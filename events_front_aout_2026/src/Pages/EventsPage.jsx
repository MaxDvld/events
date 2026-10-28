import { useEffect } from "react"
import eventsServices from "../Services/eventsServices"

const EventsPage = () => {

    const fetchEvents = async () => {
        try {
            const events = await eventsServices.getAll()
            console.log(events)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()  =>{
        fetchEvents()
    }, [])
    return <>
    <h1>Pages des événements</h1>
    </>
}

export default EventsPage