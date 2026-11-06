// Outils de React Router pour gérer la navigation entre les pages :
// - BrowserRouter : active la navigation dans toute l'application
// - Routes : contient la liste de toutes les routes
// - Route : une route = une adresse (URL) reliée à une page
import { BrowserRouter, Route, Routes } from 'react-router'
// Le CSS propre à ce composant
import './App.css'
// La barre de navigation (en haut de toutes les pages)
import NavBar from './Components/NavBar'
// Les différentes pages de l'application
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import EventsPage from './Pages/EventsPage'
import EventPage from './Pages/EventPage'
import AuthContext from './Context/AuthContext'
import ProfilePage from './Pages/ProfilePage'
import { useState } from 'react'
// Le service d'authentification (contient isConnected : "y a-t-il un token ?")
import authServices from './Services/authServices'
import AuthWrapper from './Wrappers/AuthWrapper'


// Composant principal : c'est lui qui décide quelle page afficher selon l'URL
function App() {
  const [isConnected, setIsConnected] = useState(authServices.isConnected());
  // L'utilisateur connecté (lu dans le token), ou null si personne n'est connecté
  const [user, setUser] = useState(authServices.getUser());
  return (


    <AuthContext.Provider value={{ isConnected, setIsConnected, user, setUser }}>
      <BrowserRouter>
        {/* La NavBar est en dehors de <Routes> : elle s'affiche donc sur TOUTES les pages */}
        <NavBar />
        {/* Zone principale où s'affiche la page en cours */}
        <main className="container py-5">
          <Routes>
            {/* Path = chemin d'acces sur le navigateur */}
            {/* Element = Composant afficher pour la route associée */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/events' element={<AuthWrapper><EventsPage /></AuthWrapper>} />
            {/* ":id" = partie variable de l'URL (ex : /event/12), lue avec useParams() dans EventPage */}
            <Route path='/event/:id' element={<AuthWrapper><EventPage /></AuthWrapper>} />
            <Route path='/profile' element={<AuthWrapper><ProfilePage /></AuthWrapper>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

// On exporte App pour que main.jsx puisse l'afficher
export default App
