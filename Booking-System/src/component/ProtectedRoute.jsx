import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 

export const ProtectedRoute = ({ allowedRoles }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }


    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
};