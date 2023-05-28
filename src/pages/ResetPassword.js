import React, { useState } from 'react'
import Login from './Login'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const [errorResetPassword, setErrorResetPassword] = useState(false)
    const [unequalPasswords, setUnequalPasswords] = useState(false)
    const navigate = useNavigate()

    const resetPassword = async (value) => {

        if (value.firstPassword === value.secondPassword) {

            setUnequalPasswords(false)

            try {
                const response = await fetch('https://rbrain.onrender.com/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({ reset_token: token, new_password: value.firstPassword }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()

                if (response.status === 200) {
                    navigate('/login')
                    setErrorResetPassword(false)
                }
                else {
                    setErrorResetPassword(true)
                }

            }
            catch (error) {
                console.error(error)
            }
            finally {
                console.log("OK")
            }
        }
        else {
            setUnequalPasswords(true)
        }
    }

    return (
        <Login
            showResetPassword={true}
            resetPassword={resetPassword}
            errorResetPassword={errorResetPassword}
            unequalPasswords={unequalPasswords}
        />
    )
}