// NavLink : un lien qui change de page SANS recharger tout le site
// (et qui sait si on est déjà sur cette page, pour la mettre en surbrillance)
import { NavLink } from "react-router";

// Composant de la barre de navigation, affiché en haut de toutes les pages (voir App.jsx)
const NavBar = () => {
    // Rendu
    // Les "className" sont des classes Bootstrap pour le style (fond sombre, ombre...)
    return <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
            {/* Le nom du site à gauche : renvoie vers la page d'accueil "/" */}
            <NavLink className="navbar-brand fw-bold" to="/">EventHub</NavLink>
            {/* "ms-auto" pousse les liens tout à droite */}
            <div className="navbar-nav ms-auto">
                {/* "to" = la page vers laquelle le lien emmène */}
                <NavLink className="nav-link" to="/events">Événements</NavLink>
                <NavLink className="nav-link" to="/login">Connexion</NavLink>
                <NavLink className="nav-link" to="/register">Inscription</NavLink>
            </div>
        </div>
    </nav>;
}

// On exporte le composant pour l'utiliser dans App.jsx
export default NavBar;
