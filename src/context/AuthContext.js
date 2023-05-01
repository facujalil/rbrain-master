import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const [errorLoginApi, setErrorLoginApi] = useState(false)

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (valor) => {

        console.log('Form submited')

        let response = await fetch('https://rbrain.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': valor.loginEmail, 'password': valor.loginPassword })
        })
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access_token))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/profile')

        } else {
            setErrorLoginApi(true)
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    let updateToken = async () => {
        console.log('update token called!')
        let response = await fetch('https://rbrain.onrender.com/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens?.refresh_token
            }
        })
        let data = await response.json()

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

        let fourMinutes = 1000 * 600 * 4
        let interval = setInterval(() => {
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