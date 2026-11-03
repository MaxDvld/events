// React : nécessaire pour utiliser React.useState plus bas
import * as React from 'react';
// useNavigate : permet de changer de page depuis le code (au clic sur un bouton)
import { useNavigate } from "react-router";
// useContext : permet de lire le Context (l'info "connecté ou pas")
import { useContext } from "react";
// Les composants tout prêts de Material UI (MUI) qui forment la barre de navigation
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import AuthContext from '../Context/AuthContext';

// Les choix du petit menu qui s'ouvre au clic sur l'avatar (à droite)
// const settings = ['Mon profil', 'Mes événements', 'Déconnexion'];

// Composant de la barre de navigation, affiché en haut de toutes les pages (voir App.jsx)
function NavBar() {
  // anchorElNav : le menu mobile (☰) est-il ouvert ? (null = fermé)
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  // anchorElUser : le menu de l'avatar est-il ouvert ? (null = fermé)
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // navigate sert à changer de page
  const navigate = useNavigate();
  // On lit dans le Context si l'utilisateur est connecté (true) ou pas (false)
  const { isConnected, setIsConnected } = useContext(AuthContext);
  // Ouvre le menu mobile (☰)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // Ouvre le menu de l'avatar
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Ferme le menu mobile
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Ferme le menu de l'avatar
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Au clic sur un lien du menu mobile : on change de page ET on ferme le menu
  const goTo = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    // On supprime le token du localStorage
    localStorage.removeItem("token");
    // On met à jour le Context pour dire que l'utilisateur n'est plus connecté
    setIsConnected(false);
    // On redirige vers la page d'accueil
    navigate("/");
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/*
            LÉGENDE : la barre contient 2 versions, une seule est visible à la fois
            🖥️ ORDINATEUR = display: { xs: 'none', md: 'flex' }  (caché sur mobile)
            📱 MOBILE     = display: { xs: 'flex', md: 'none' }  (caché sur ordinateur)
            Ordre dans le fichier : 1. 🖥️ Logo  2. 📱 Menu ☰  3. 📱 Logo  4. 🖥️ Liens  5. Avatar (les deux)
          */}

          {/* ===== 🖥️ 1. DÉBUT Logo version ORDINATEUR (caché sur mobile) ===== */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            EventHub
          </Typography>
          {/* ===== 🖥️ 1. FIN Logo version ORDINATEUR ===== */}

          {/* ===== 📱 2. DÉBUT Menu version MOBILE : bouton ☰ (caché sur ordinateur) ===== */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="ouvrir le menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* La liste qui s'ouvre quand on clique sur ☰ */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={() => goTo("/")}>
                <Typography sx={{ textAlign: 'center' }}>Accueil</Typography>
              </MenuItem>

              {/* CONDITION : si on est connecté, on affiche "Événements" */}
              {isConnected == true && <>
                <MenuItem onClick={() => goTo("/profile")}>
                  <Typography sx={{ textAlign: 'center' }}>Mon profil</Typography>
                </MenuItem>
                <MenuItem onClick={() => goTo("/events")}>
                  <Typography sx={{ textAlign: 'center' }}>Événements</Typography>
                </MenuItem>
                <MenuItem onClick={() => goTo("/my-events")}>
                  <Typography sx={{ textAlign: 'center' }}>Mes événements</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleCloseNavMenu(); }}>
                  <Typography sx={{ textAlign: 'center' }}>Déconnexion</Typography>
                </MenuItem>
              </>}
              {/* CONDITION : si on n'est PAS connecté, on affiche "Connexion" et "Inscription" */}
              {isConnected == false && <>
                <MenuItem onClick={() => goTo("/login")}>
                  <Typography sx={{ textAlign: 'center' }}>Connexion</Typography>
                </MenuItem>
                <MenuItem onClick={() => goTo("/register")}>
                  <Typography sx={{ textAlign: 'center' }}>Inscription</Typography>
                </MenuItem>
              </>}
            </Menu>
          </Box>
          {/* ===== 📱 2. FIN Menu version MOBILE ===== */}

          {/* ===== 📱 3. DÉBUT Logo version MOBILE (caché sur ordinateur) ===== */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            EventHub
          </Typography>
          {/* ===== 📱 3. FIN Logo version MOBILE ===== */}

          {/* ===== 🖥️ 4. DÉBUT Liens version ORDINATEUR (cachés sur mobile) ===== */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button onClick={() => navigate("/")} sx={{ my: 2, color: 'white', display: 'block' }}>
              Accueil
            </Button>
            {/* Mêmes conditions que dans le menu mobile */}
            {isConnected == true && <>
              <Button onClick={() => navigate("/profile")} sx={{ my: 2, color: 'white', display: 'block' }}>
                Mon profil
              </Button>
              <Button onClick={() => navigate("/events")} sx={{ my: 2, color: 'white', display: 'block' }}>
                Événements
              </Button>
              <Button onClick={() => navigate("/my-events")} sx={{ my: 2, color: 'white', display: 'block' }}>
                Mes événements
              </Button>
              <Button onClick={handleLogout} sx={{ my: 2, color: 'white', display: 'block' }}>
                Déconnexion
              </Button>
            </>}
            {isConnected == false && <>
              <Button onClick={() => navigate("/login")} sx={{ my: 2, color: 'white', display: 'block' }}>
                Connexion
              </Button>
              <Button onClick={() => navigate("/register")} sx={{ my: 2, color: 'white', display: 'block' }}>
                Inscription
              </Button>

            </>}
          </Box>
          {/* ===== 🖥️ 4. FIN Liens version ORDINATEUR ===== */}

          {/* ===== 🖥️📱 5. DÉBUT Avatar à droite + son menu (visible sur les deux) ===== */}
          {isConnected == true && <>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-user"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* Chaque MenuItem = un choix du menu de l'avatar, avec sa propre action */}
                <MenuItem onClick={() => { navigate("/profile"); handleCloseUserMenu(); }}>
                  <Typography sx={{ textAlign: 'center' }}>Mon profil</Typography>
                </MenuItem>
                <MenuItem onClick={() => { navigate("/my-events"); handleCloseUserMenu(); }}>
                  <Typography sx={{ textAlign: 'center' }}>Mes événements</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleCloseUserMenu(); }}>
                  <Typography sx={{ textAlign: 'center' }}>Déconnexion</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </>}
          {/* ===== 🖥️📱 5. FIN Avatar ===== */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// On exporte le composant pour l'utiliser dans App.jsx
export default NavBar;
