import { BrowserRouter, Routes, Route } from 'react-router';
import { Login, Profile } from './pages';
import { ProtectedRoute } from './components/';
import { AuthProvider } from './context/authContext';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='login' element={<Login />} />
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
