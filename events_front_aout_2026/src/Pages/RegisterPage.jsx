// useState : permet de stocker des données qui peuvent changer (ici ce que l'utilisateur tape)
import { useState } from "react";
// Le service qui envoie les demandes de connexion/inscription au back
import authServices from "../Services/authServices";

// Page d'inscription, affichée sur l'adresse "/register"
const  RegisterPage= () => {
    // VARIABLES
    // "user" contient tout ce que l'utilisateur tape dans le formulaire (vide au départ)
    const [user, setUser] = useState ({
        username : "",
        email : "",
        password : "",
        confirm_password : ""
    })

    // TRAITEMENTS
    // Appelée à CHAQUE lettre tapée dans un champ (même principe que dans LoginPage)
      const handleChange = (e) => {
        // const name = e.target.name;
        // const value = e.target.value;
        // name = le nom du champ modifié, value = ce qui est écrit dedans
        const {name, value} = e.target;
        // On garde les anciennes valeurs ("...user") et on remplace seulement le champ modifié
        setUser({...user, [name] : value})
    }
    // Appelée quand on clique sur "S'inscrire"
     const handleSubmit = async (e) => {
            // Empêche le rechargement de la page
            e.preventDefault();
            try {
                // CONDITION : si les deux mots de passe ne sont pas identiques...
                if (user.password != user.confirm_password){
                    // ... on prévient l'utilisateur avec une petite fenêtre
                    alert("Mot de passe différents")
                    // ... et "return" arrête la fonction ici : on n'envoie rien au back
                    return
                }
                // Sinon, on envoie les infos au back pour créer le compte
                const response = await authServices.register(user)
                // On affiche la réponse du back dans la console (F12)
                console.log(response)
            } catch (error) {
                // Si ça échoue (username déjà pris, back éteint...), on affiche l'erreur
                console.error(error)
            }
        }


    // RENDU
    return <>
    {/* Les classes Bootstrap centrent la carte au milieu de la page */}
    <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h1 className="h3 mb-4 text-center">Page d'inscription</h1>
                    {/* onSubmit : lance handleSubmit quand on envoie le formulaire */}
                    <form onSubmit={handleSubmit}>
                        {/* Chaque champ : name = quel champ de "user" modifier, value = ce qui est affiché */}
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" name="username" onChange = {handleChange} value={user.username}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            {/* type="email" : le navigateur vérifie que ça ressemble à une adresse mail */}
                            <input type="email" className="form-control" id="email" name="email" onChange = {handleChange} value={user.email}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" onChange = {handleChange} value={user.password}/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirm_password" name="confirm_password" onChange = {handleChange} value={user.confirm_password}/>
                        </div>
                        {/* Bouton d'envoi du formulaire */}
                        <input type="submit" className="btn btn-primary w-100" value="S'inscrire"/>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
}

// On exporte la page pour l'utiliser dans App.jsx
export default RegisterPage;
