/*
 * Coquille de l'application.
 * Elle décide quelle page afficher selon l'adresse du navigateur,
 * et partage "est-ce que l'utilisateur est connecté ?" à toute l'app.
 *
 * Exemple : l'adresse http://localhost:5173/events affiche EventsPage,
 * parce que path="/events" est associé à <EventsPage />.
 */
import { BrowserRouter, Route, Routes } from 'react-router'
import { Box } from '@mui/material'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import EventsPage from './Pages/EventsPage'
import EventPage from './Pages/EventPage'
import CalendarPage from './Pages/CalendarPage'
import ResetPasswordPage from './Pages/ResetPasswordPage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
// Ta page de création d'événement (pas dans la version du prof)
import CreateEventPage from './Pages/CreateEventPage'
import NavBar from './Components/NavBar'
// ⚠️ Chez toi, le dossier s'appelle "Context" (sans s)
import AuthContext from './Context/AuthContext'
import { useState } from 'react'
import ProfilePage from './Pages/ProfilePage'
import authServices from './Services/authServices'
import AuthWrapper from './Wrappers/AuthWrapper'


function App() {
  // VARIABLES
  /*
   * useState crée une donnée qui, quand elle change, redessine l'écran.
   * isConnected commence à authServices.isConnected() : true si un token valide
   * existe déjà dans le navigateur (même après F5), sinon false.
   * setIsConnected(true) est appelé par LoginPage après une connexion réussie.
   *
   * Exemple :
   *   const [score, setScore] = useState(0)
   *   setScore(1)  -> React réaffiche le composant avec score === 1
   */
  const [isConnected, setIsConnected] = useState(authServices.isConnected());
  // L'utilisateur connecté (lu dans le token), ou null si personne n'est connecté
  const [user, setUser] = useState(authServices.getUser())

  // RENDU
  return (
    /*
     * Le Provider met { isConnected, setIsConnected, user, setUser } à disposition
     * de NavBar, LoginPage, etc. sans les passer en props à la main.
     * Exemple : NavBar fait useContext(AuthContext) et lit isConnected
     * pour cacher "Connexion" quand l'utilisateur est déjà entré.
     */
    <AuthContext.Provider value={{isConnected, setIsConnected, user, setUser}}>
      {/* BrowserRouter écoute l'URL et permet à useNavigate de changer de page. */}
      <BrowserRouter>
        {/* La barre reste au-dessus de toutes les pages. */}
        <NavBar />
        {/*
          Box est une div stylée. component="main" donne la balise HTML <main>.
          maxWidth: 1120 limite la largeur du contenu, pas celle de la NavBar.
          mx: "auto" centre le bloc. px / py = padding horizontal / vertical.
          L'unité MUI vaut 8 px : py: 5 veut dire 40 px.
          { xs: 2, md: 3 } : 16 px sur téléphone, 24 px à partir de 900 px de large.
        */}
        <Box component="main" sx={{ maxWidth: 1120, mx: "auto", px: { xs: 2, md: 3 }, py: 5 }}>
          {/*
            Routes compare l'URL à chaque path et affiche un seul element.
            :id est un paramètre. Exemple : /event/12 affiche EventPage,
            et useParams() y renvoie { id: "12" }.
          */}
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/events' element={<AuthWrapper><EventsPage /></AuthWrapper>} />
            <Route path='/event/:id' element={<AuthWrapper><EventPage /></AuthWrapper>} />
            <Route path="/profile" element={<AuthWrapper><ProfilePage /></AuthWrapper>} />
            {/* Ta route de création d'événement (le bouton de EventsPage mène à "/create") */}
            <Route path='/create' element={<AuthWrapper><CreateEventPage /></AuthWrapper>} />
            {/* Calendrier : AVEC AuthWrapper, car GET /events demande d'être connecté (token) */}
            <Route path='/calendar' element={<AuthWrapper><CalendarPage /></AuthWrapper>} />
            {/* Mot de passe oublié : SANS AuthWrapper, puisqu'on n'est pas connecté */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
