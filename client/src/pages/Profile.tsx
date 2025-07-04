import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';

interface IUserInfo {
    email: string;
    name: string;
    picture: string;
}

export default function Profile() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['users', 'profile'],
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:3000/api/v1/users/profile`,
                { withCredentials: true }
            );
            const data = await res.data;
            return data;
        },
    });

    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.get('http://localhost:3000/api/v1/auth/logout', {
            withCredentials: true,
        });
        navigate('/login');
    };

    if (isError) {
        return <>Error...</>;
    }

    if (isLoading) {
        return <>Loading...</>;
    }

    const userInfo: IUserInfo = data.user;

    return (
        <div>
            <p>Welcome {userInfo?.name}</p>
            <p>{userInfo?.email}</p>
            <img src={userInfo?.picture} alt='user profile picture' />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
