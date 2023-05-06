import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const [errorLoginApi, setErrorLoginApi] = useState(false)

    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const loginUser = async (valor) => {

        const response = await fetch('https://rbrain.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': valor.loginEmail, 'password': valor.loginPassword })
        })

        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access_token))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/profile')
            setErrorLoginApi(false)

        } else {
            setErrorLoginApi(true)
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    const updateToken = async () => {
        const response = await fetch('https://rbrain.onrender.com/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens?.refresh_token
            }
        })

        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access_token))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    useEffect(() => {

        if (loading) {
            updateToken()
        }

        const fourMinutes = 1000 * 600 * 4
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser, errorLoginApi }} >
            {loading ? null : children}
            {/*{useEffect(() => {
            if(loading){
                setLoading(false)
            }
        }, [loading])}*/}
        </AuthContext.Provider>
    )
}