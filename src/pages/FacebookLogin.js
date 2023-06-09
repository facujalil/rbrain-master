import React from 'react';
import { FacebookProvider, Login } from 'react-facebook';

const FacebookLogin = () => {
  const handleResponse = (response) => {
    // Aquí puedes manejar la respuesta del inicio de sesión
    console.log(response);
  };

  return (
    <FacebookProvider appId="729470312263084">
      <Login
        scope="email"
        onResponse={handleResponse}
        onError={(error) => console.log(error)}
      >
        <button>
          Iniciar sesión con Facebook
        </button>
      </Login>
    </FacebookProvider>
  );
};

export default FacebookLogin;
