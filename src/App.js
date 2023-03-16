import './App.css';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { Login, Profile, Home, Category, GenerateFlashcards } from './pages';
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

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route element={<Register />} path="/register" exact />
              <Route element={<Profile />} path="/profile" exact />
              <Route element={<Category />} path="/profile/my-flashcards/:categoryId" exact />
              <Route element={<GenerateFlashcards />} path="/generate-flashcards" exact />
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
            <Link className='nav-link' to="/generate-flashcards">Make flashcard</Link>
            <Link className='nav-link' to="/">Make resume</Link>

          </section>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default App;