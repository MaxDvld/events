import { useState } from 'react'
import { useNavigate } from 'react-router'
import eventsServices from '../Services/eventsServices'


const CreateEventPage = () => {
    // VARIABLES
    const [event, setEvent] = useState({
        title: "",
        description: "",
        date: "",
        location: ""
    })
    const navigate = useNavigate()


    // TRAITEMENTS
    // Appelée à CHAQUE lettre tapée dans un champ du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent({ ...event, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await eventsServices.insertEvent(event)
            navigate("/events")
            console.log(response);
        } catch (error) {
            console.error(error)
        }
    }
    // RENDU
    return <>
        <h1>Créer un événement</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Titre</label>
            <input type="text" id="title" name="title" value={event.title} onChange={handleChange} />

            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={event.description} onChange={handleChange} />

            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={event.date} onChange={handleChange} />

            <label htmlFor="location">Lieu</label>
            <input type="text" id="location" name="location" value={event.location} onChange={handleChange} />

            <button type="submit">Créer</button>
        </form>
    </>;
}

export default CreateEventPage;
