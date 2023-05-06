import './App.css';
import { Routes, Route, BrowserRouter, Link, Navigate } from 'react-router-dom';
import PublicRoutes from './utils/PublicRoutes';
import PrivateRoutes from './utils/PrivateRoutes';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Carpet from './pages/Carpet';
import Generate from './pages/Generate';
import Configuration from './pages/Configuration';


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
              <Route path="/profile/my-carpet/:categoryId" element={<Carpet />} />
              <Route path="/generate" element={<Generate />} />
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
            <Link className='nav-link' to="/generate">Generate</Link>
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