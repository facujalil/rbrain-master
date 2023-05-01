import './App.css';
import { Routes, Route, BrowserRouter, Link, Navigate } from 'react-router-dom';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { PublicRoutes } from './utils/PublicRoutes';
import { Register } from './componentes/Register';
import { Login } from './componentes/Login';
import { Profile } from './componentes/Profile';
import { Category } from './componentes/Category';
import { GenerateFlashcards } from './componentes/GenerateFlashcards';
import { Configuration } from './componentes/Configuration';


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
              <Route path="/profile/my-flashcards/:categoryId" element={<Category />} />
              <Route path="/generate-flashcards" element={<GenerateFlashcards />} />
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
  let { user, logoutUser } = useContext(AuthContext)

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
            <Link className='nav-link' onClick={logoutUser}>Logout</Link>

          </section>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default App;