import './App.css';
import { Routes, Route, BrowserRouter, Link, Navigate } from 'react-router-dom';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { PublicRoutes } from './utils/PublicRoutes';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { MyCarpet } from './components/MyCarpet';
import { GenerateFlashcards } from './components/GenerateFlashcards';
import MakeResume from './components/MakeResume';
import { Configuration } from './components/Configuration';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>

            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Profile />} />
              <Route path="/profile/my-flashcards/:categoryId" element={<MyCarpet />} />
              <Route path="/generate-flashcards" element={<GenerateFlashcards />} />
              <Route path="/make-resume" element={<MakeResume />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path='*' element={<Navigate to="/" />} />

            </Route>


          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

function Navigation() {
  let { user } = useContext(AuthContext)

  return (
    <>
      {user ? (
        <div className='nav-container'>
          <div className="container-circle-nav">
            <div className="circle-nav"></div>
          </div>

          <section className='nav'>

            <Link className='nav-link' to="/">Profile</Link>
            <Link className='nav-link' to="/generate-flashcards">Generate flashcards</Link>
            <Link className='nav-link' to="/configuration">Configuration</Link>

          </section>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default App;