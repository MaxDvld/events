import { useState } from "react";
import authServices from "../Services/authServices";

const  RegisterPage= () => {
    // Variables
    const [user, setUser] = useState ({
        username : "",
        email : "",
        password : "",
        confirm_password : ""
    })

    // Traitements
      const handleChange = (e) => {
        // const name = e.target.name;
        // const value = e.target.value;
        const {name, value} = e.target;
        setUser({...user, [name] : value})
    }
     const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (user.password != user.confirm_password){
                    alert("Mot de passe différents")
                    return
                }
                const response = await authServices.register(user)
                console.log(response)
            } catch (error) {
                console.error(error)
            }
        }

    
    // Rendu
    return <>
    <h1>Page d'inscpription</h1>
    <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" onChange = {handleChange} value={user.username}/>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" onChange = {handleChange} value={user.email}/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" onChange = {handleChange} value={user.password}/>
        <label htmlFor="confirm_password">Confirm Password</label>
        <input type="password" id="confirm_password" name="confirm_password" onChange = {handleChange} value={user.confirm_password}/>
        <input type="submit" value="S'inscrire"/>
    </form>
    </>
}

export default RegisterPage;