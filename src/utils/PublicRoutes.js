import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function PublicRoutes() {
    let { authTokens } = useContext(AuthContext)
    return (
        authTokens === null ? <Outlet /> : <Navigate to="/profile" />
    )
}