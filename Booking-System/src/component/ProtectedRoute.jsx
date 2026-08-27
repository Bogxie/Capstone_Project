import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 

export const ProtectedRoute = ({ allowedRoles }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#23262f] flex items-center justify-center">
                <div className="text-[#b6ff2e] text-xl font-bold animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
};