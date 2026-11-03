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
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <h1 className="h3 mb-4 text-center">Connexion</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Login</label>
                                <input type="text" className="form-control" name="username" id="username" value={user.username} onChange={handleChange}/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Mot de passe</label>
                                <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={handleChange}/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Se Connecter</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default LoginPage;
