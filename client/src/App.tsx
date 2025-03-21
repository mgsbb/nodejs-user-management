function App() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return <button onClick={handleLogin}>Sign in with Google</button>;
}

export default App;
