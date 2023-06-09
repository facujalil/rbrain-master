import React, { useEffect } from 'react'

export default function LoginCallback() {
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedCode = urlParams.get("code");
        //const encodedCode = encodeURIComponent(code);

        const response = await fetch(`https://rbrain.onrender.com/login/google/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encodedCode })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          const { accessToken, refreshToken } = data;
          // Guardar los tokens en el localStorage
          localStorage.setItem('authTokens', JSON.stringify(data));

          window.location.href = 'https://rbrain-master.netlify.app/profile';
        } else {
          // Error en la autenticación, maneja el error de acuerdo a tus necesidades
          console.log("error en la autenticación")
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
      }
    };

    fetchAccessToken();
  }, []);

  return (
    <>
    </>
  );
}
