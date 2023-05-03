import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';

export default function MakeResume() {

    const { authTokens } = useContext(AuthContext);

    useEffect( ()=> {
        makeResume()
    }, [] )

    const makeResume = async (value) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                },
                body: JSON.stringify({ 'theme': "Fútbol" })
            })
            const data = await response.json()
            if (response.status === 201) {
                console.log(data)
            } else {
                console.log("Error")
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div></div>
    )
}
