import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [errorLoginApi, setErrorLoginApi] = useState(false);
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (valor) => {
    const response = await fetch('https://rbrain.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: valor.loginEmail, password: valor.loginPassword }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access_token));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/profile');
      setErrorLoginApi(false);
    } else {
      setErrorLoginApi(true);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  const updateToken = async () => {
    if (authTokens && authTokens.refresh_token) {
      const response = await fetch('https://rbrain.onrender.com/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.refresh_token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwt_decode(data.access_token));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        logoutUser();
      }
    } else {
      logoutUser();
    }
  };

  useEffect(() => {
    let timeout;

    const fourMinutes = 1000 * 60 * 4;

    const updateTokenWithTimeout = async () => {
      await updateToken();
      timeout = setTimeout(updateTokenWithTimeout, fourMinutes);
    };

    const startTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateTokenWithTimeout, fourMinutes);
    };

    if (loading) {
      updateTokenWithTimeout();
      setLoading(false);
    }

    document.addEventListener('mousemove', startTimeout);
    document.addEventListener('keypress', startTimeout);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', startTimeout);
      document.removeEventListener('keypress', startTimeout);
    };
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser, errorLoginApi }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
