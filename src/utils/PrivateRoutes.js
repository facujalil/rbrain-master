import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export const PrivateRoutes = () => {
    let {authTokens} = useContext(AuthContext) 
    return (
        authTokens ? <Outlet /> : <Navigate to="/login" />
    )
}