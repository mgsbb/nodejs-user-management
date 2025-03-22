export default function Login() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/api/v1/auth/google';
    };

    return <button onClick={handleLogin}>Sign in with Google</button>;
}
