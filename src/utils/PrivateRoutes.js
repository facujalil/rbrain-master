import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function PrivateRoutes() {
    let { authTokens } = useContext(AuthContext)
    return (
        authTokens ? <Outlet /> : <Navigate to="/login" />
    )
}