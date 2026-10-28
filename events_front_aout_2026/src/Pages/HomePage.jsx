import { useNavigate } from "react-router";

const HomePage = () => {
    // VARIABLES
    // Const navigate de useNavigate me permets de faire des redirections
    const navigate = useNavigate();


    // TRAITEMENTS (Functions)


    // Rendu (Affichage pour l'utilisateur)
    return <>
        <h1>Home Page</h1>
        <button onClick={()=>{ navigate("/login") }}>Login</button>
        {/* <button onClick={function(){}}>Login</button> */}
        <button onClick={()=>{ navigate("/register") }}>Register</button>
        <button onClick={()=>{ navigate("/events") }}>Events</button>

    </>;
}
 
export default HomePage;