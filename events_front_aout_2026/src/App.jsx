import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import EventsPage from './Pages/EventsPage'



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Path = chemin d'acces sur le navigateur */}
          {/* Element = Composant afficher pour la route associée */}
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/events' element={<EventsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
