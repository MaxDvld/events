import { NavLink } from "react-router";

const NavBar = () => {
    // Rendu
    return <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
            <NavLink className="navbar-brand fw-bold" to="/">EventHub</NavLink>
            <div className="navbar-nav ms-auto">
                <NavLink className="nav-link" to="/events">Événements</NavLink>
                <NavLink className="nav-link" to="/login">Connexion</NavLink>
                <NavLink className="nav-link" to="/register">Inscription</NavLink>
            </div>
        </div>
    </nav>;
}

export default NavBar;
