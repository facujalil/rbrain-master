import React, { useEffect } from 'react'

export default function LoginCallback() {
   useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedCode = urlParams.get("code");
        //const encodedCode = encodeURIComponent(code);
         
        console.log(encodedCode)

        const response = await fetch(`https://rbrain.onrender.com/login/google/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encodedCode })
        });

                if (response.ok) {
                    console.log(encodedCode)
                    console.log("BIEN")
                } else {
                    // Error en la autenticación, maneja el error de acuerdo a tus necesidades
                }
            } catch (error) {
                console.error("Error en la autenticación:", error);
            }
        };

        fetchAccessToken();
    }, []);

    return (
        <div>
            <p>Procesando la autenticación...</p>
        </div>
    );
}
