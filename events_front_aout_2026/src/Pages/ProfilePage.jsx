import { useState, useEffect } from "react";
import usersServices from "../Services/usersServices";
// Composants tout prêts de Material UI (MUI) pour le formulaire de mot de passe
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ProfilePage = () => {
    // VARIABLES
    const [user, setUser] = useState({})
    const [changePassword, setChangePassword] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [showModal, setShowModal] = useState(false)
    const [editUser, setEditUser] = useState({
        username: "",
        email: ""
    })
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    // TRAITEMENTS
    // Appelée à CHAQUE lettre tapée dans un champ du formulaire de mot de passe
    const handleChange = (e) => {
        // name = le nom du champ modifié, value = ce qui est écrit dedans
        const { name, value } = e.target;
        // "...changePassword" recopie les anciennes valeurs, puis on remplace seulement le champ modifié
        setChangePassword({ ...changePassword, [name]: value })
    }

    const handleEditUser = (e) => {
        const { name, value } = e.target
        setEditUser({ ...editUser, [name]: value })
    }

    // Envoie le nouveau pseudo / email au back
    const handleUpdateUser = async () => {
        try {
            // 1. On envoie la boîte de la modale au back
            const response = await usersServices.updateMe (editUser)
                // 2. On ferme la modale
                setShowModal(false)
        // 3. On recharge le profil pour voir les nouvelles infos
        fetchMe()
    } catch (error) {
            console.error(error)
        }
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

        {/* Au clic : on pré-remplit le formulaire avec les infos actuelles, PUIS on ouvre la modale */}
        <button type="button" className="btn btn-primary" onClick={() => {
            setEditUser({ username: user.us_username, email: user.us_email });
            setShowModal(true);
        }}>
            Modifier mon profil
        </button>

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
        {/* Paper = un bloc blanc avec une ombre. maxWidth = largeur max, mt = marge en haut */}
        <Paper sx={{ p: 3, mt: 4, maxWidth: 400 }}>
            <Typography variant="h6" component="h2" gutterBottom>
                Changer mon mot de passe
            </Typography>

            {/* Box avec component="form" = un vrai <form>, stylé par MUI */}
            <Box component="form" onSubmit={handleSubmit}>
                {/* Stack = empile les champs les uns sous les autres, avec un espace de 2 */}
                <Stack spacing={2}>
                    {/* TextField = label + case de saisie en un seul composant
                        (plus besoin de htmlFor : MUI relie le label à la case tout seul grâce à "id") */}
                    <TextField
                        label="Ancien mot de passe"
                        type="password"
                        id="old_password"
                        name="old_password"
                        value={changePassword.old_password}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Nouveau mot de passe"
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={changePassword.new_password}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Confirmer mot de passe"
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={changePassword.confirm_password}
                        onChange={handleChange}
                    />
                    {/* type="submit" : cliquer ce bouton envoie le formulaire */}
                    <Button type="submit" variant="contained">
                        Valider
                    </Button>
                </Stack>
            </Box>
        </Paper>
        {showModal && (
            <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modifier mon profil</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="username" className="form-label">Pseudo</label>
                            <input type="text" className="form-control mb-3" id="username"
                                name="username" value={editUser.username} onChange={handleEditUser} />

                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email"
                                name="email" value={editUser.email} onChange={handleEditUser} />

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>;
}


// On exporte la page pour l'utiliser dans App.jsx
export default ProfilePage;