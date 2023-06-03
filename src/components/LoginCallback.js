import React, { useEffect } from 'react'

export default function LoginCallback() {
    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code");
                const encodedCode = encodeURIComponent(code);

                const response = await fetch(`https://rbrain.onrender.com/login/google/callback/?code=${encodedCode}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
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
