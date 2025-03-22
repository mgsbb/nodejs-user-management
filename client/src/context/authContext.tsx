import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext<{ isAuthenticated: boolean | null }>({
    isAuthenticated: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // console.error(error);
                setIsAuthenticated(false);
            }
        };
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
