import './App.css';
import { Routes, Route, BrowserRouter, Navigate, NavLink } from 'react-router-dom';
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
import MentalMap from './pages/MentalMap';
import ResetPassword from './pages/ResetPassword';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>

            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/my-carpet/:categoryId" element={<Carpet />} />
              <Route path="/profile/my-carpet/:categoryId/:categoryCardMentalMapId" element={<MentalMap />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path='*' element={<Navigate to="/profile" />} />


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

            <NavLink className='nav-link' to="/profile">Profile</NavLink>
            <NavLink className='nav-link' to="/generate">Generate</NavLink>
            <NavLink className='nav-link' to="/configuration">Configuration</NavLink>

          </section>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default App;