import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import axios from 'axios';

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/v1/auth/verify-token',
                    { withCredentials: true }
                );
                const data = response.data;
                if (data?.isVerified === true) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                // console.error(error);
                setIsAuthenticated(false);
            }
        };
        verifyToken();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to='/login' />;
}
