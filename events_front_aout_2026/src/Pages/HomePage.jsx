import { useNavigate } from "react-router";

const HomePage = () => {
    // VARIABLES
    // Const navigate de useNavigate me permets de faire des redirections
    const navigate = useNavigate();


    // TRAITEMENTS (Functions)


    // Rendu (Affichage pour l'utilisateur)
    return <>
        <div className="p-5 bg-white rounded-3 shadow-sm text-center">
            <h1 className="display-5 fw-bold">Bienvenue sur EventHub</h1>
            <p className="lead text-muted mb-4">Découvrez, créez et participez à des événements.</p>
            <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-primary btn-lg" onClick={()=>{ navigate("/events") }}>Voir les événements</button>
                <button className="btn btn-outline-primary btn-lg" onClick={()=>{ navigate("/login") }}>Login</button>
                {/* <button onClick={function(){}}>Login</button> */}
                <button className="btn btn-outline-secondary btn-lg" onClick={()=>{ navigate("/register") }}>Register</button>
            </div>
        </div>
    </>;
}

export default HomePage;
