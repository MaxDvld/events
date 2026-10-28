import { useState } from "react";
import authServices from "../Services/authServices";

const LoginPage = () => {
    // VARIABLES
    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    // TRAITEMENTS
    const handleChange = (e) => {
        // const name = e.target.name;
        // const value = e.target.value;
        const {name, value} = e.target;
        setUser({...user, [name] : value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authServices.login(user);
            const token = response.data.token;
            window.localStorage.setItem("token",token)
        } catch (error) {
            console.error(error);
        }
    }


    // Rendu
    return <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Login</label>
            <input type="text" name="username" id="username" value={user.username} onChange={handleChange}/>
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" value={user.password} onChange={handleChange}/>
            <button type="submit">Se Connecter</button>
        </form>
    </>;
}
 
export default LoginPage;