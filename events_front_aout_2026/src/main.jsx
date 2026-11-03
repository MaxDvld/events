// C'est le POINT DE DÉPART de toute l'application React : c'est le premier fichier lancé

// StrictMode : mode "vérification" de React, il affiche plus d'avertissements pendant le développement
import { StrictMode } from 'react'
// createRoot : permet à React de prendre le contrôle d'une zone de la page HTML
import { createRoot } from 'react-dom/client'
// Le CSS de Bootstrap (les classes comme "btn", "card", "container"...)
import 'bootstrap/dist/css/bootstrap.min.css'
// Notre propre CSS pour toute l'application
import './index.css'
// Le composant principal qui contient tout le reste
import App from './App.jsx'

// On cherche la balise <div id="root"> dans index.html,
// puis on dit à React d'y afficher notre composant <App />
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
