import './App.css';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { Register, Login, Profile, Category, GenerateFlashcards, Configuracion, MakeResume } from './pages';
import { PrivateRoutes } from './utils/PrivateRoutes';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>

            <Route path="/" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Register />} path="/register" exact />
            <Route element={<Configuracion />} path="/configuracion" exact />
            <Route element={<PrivateRoutes />}>
              <Route element={<Profile />} path="/profile" exact />
              <Route element={<Category />} path="/profile/my-flashcards/:categoryId" exact />
              <Route element={<GenerateFlashcards />} path="/generate-flashcards" exact />
              <Route element={<MakeResume />} path="/make-resume" exact />
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

            { /*user ? (
            <p className='none' onClick={logoutUser}></p>
          ) : (
            <Link className='nav-link' to="/login">Login</Link>
          )*/}

            <Link className='nav-link' to="/profile">Profile</Link>
            <Link className='nav-link' to="/generate-flashcards">Generate flashcards</Link>
            <Link className='nav-link' to="/make-resume">Make resume</Link>

          </section>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default App;