import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import NavBar from './Components/NavBar'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import EventsPage from './Pages/EventsPage'



function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <main className="container py-5">
          <Routes>
            {/* Path = chemin d'acces sur le navigateur */}
            {/* Element = Composant afficher pour la route associée */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/events' element={<EventsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
