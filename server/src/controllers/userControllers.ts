import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
    export interface UserInfoPayload extends JwtPayload {
        email: string;
        name: string;
        picture: string;
    }
}

export const getUserInfo = async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    try {
        const decodedToken = <jwt.UserInfoPayload>(
            jwt.verify(token, process.env.JWT_SECRET!)
        );
        const user = {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
        };
        res.status(200).json({ message: 'User fetch succesful', user });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
