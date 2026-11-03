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
    <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h1 className="h3 mb-4 text-center">Page d'inscription</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" name="username" onChange = {handleChange} value={user.username}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
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
                        <input type="submit" className="btn btn-primary w-100" value="S'inscrire"/>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
}

export default RegisterPage;
