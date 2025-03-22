import { BrowserRouter, Routes, Route } from 'react-router';
import { Login, Profile } from './pages';
import { ProtectedRoute } from './components/';

function App() {
    return (
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
    );
}

export default App;
