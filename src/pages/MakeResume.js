import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';

export default function MakeResume() {

    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        handleSubmitResume()
    }, [])

    const handleSubmitResume = async (value) => {
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
            if (response.status === 200) {
                console.log(data)
            } else {
                console.log(response)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const saveResume = async () => {
        try {
            const response = await fetch('https://rbrain.onrender.com/save-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                },
                body: JSON.stringify({ resume: 'Fútbol', theme: 'El fútbol es...', category_name: 'Fútbol' })
            })
            const data = await response.json()
            if (response.status === 201) {
                console.log(data)
            } else {
                console.log("Error")
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div></div>
    )
}
