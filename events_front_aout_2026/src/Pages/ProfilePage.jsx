import { useState, useEffect } from "react";
import usersServices from "../Services/usersServices";

const ProfilePage = () => {
    // VARIABLES
    const [user, setUser] = useState({})
    const [changePassword, setChangePassword] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    // Appelée à CHAQUE lettre tapée dans un champ du formulaire de mot de passe
    const handleChange = (e) => {
        // name = le nom du champ modifié, value = ce qui est écrit dedans
        const {name, value} = e.target;
        // "...changePassword" recopie les anciennes valeurs, puis on remplace seulement le champ modifié
        setChangePassword({...changePassword, [name] : value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await usersServices.resetPassword(changePassword);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMe = async () => {
        try {
            const response = await usersServices.getMe();
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    }



    useEffect(() => {
        fetchMe();
    }, []);
    // RENDU
    return <>
        <h1> {user.us_username} </h1>
        <h2> {user.us_email}</h2>
        <h3>Commentaires</h3>
        {/* CONDITION "? :" = "s'il y a des commentaires ? alors la liste : sinon un message" */}
        {user.comments && user.comments.length > 0 ? user.comments.map((comment) => {
            return <li key={comment.co_id}>{comment.co_comment}</li>
        }) : "Pas de commentaire"}
        <h3>Participations</h3>
        {user.events && user.events.length > 0 ? user.events.map((event) => {
            return <li key={event.ev_id}>{event.ev_title}</li>
        }) : "Pas d'inscription active ! "}

        {/* Formulaire pour changer de mot de passe (pas encore relié au back) */}
        <form onSubmit={handleSubmit}>
            <label htmlFor="old_password">Ancien mot de passe</label>
            <input type="password" id="old_password" name="old_password" onChange={handleChange} value={changePassword.old_password} />
            <label htmlFor="new_password">Nouveau mot de passe</label>
            <input type="password" id="new_password" name="new_password" onChange={handleChange} value={changePassword.new_password} />
            <label htmlFor="confirm_password">Confirmer mot de passe</label>
            <input type="password" id="confirm_password" name="confirm_password" onChange={handleChange} value={changePassword.confirm_password} />
            {/* type="submit" : cliquer ce bouton envoie le formulaire */}
            <input type="submit" value="Valider" />
        </form>
    </>;
}


// Rendu JSX : ce qui s'affiche à l'écran
export default ProfilePage;