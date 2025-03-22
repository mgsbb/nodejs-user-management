import { Navigate } from 'react-router';
import { useAuth } from '../context/authContext';

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to='/login' />;
}
