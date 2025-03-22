import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prismaUtils';

declare module 'jsonwebtoken' {
    export interface TokenPaylod extends JwtPayload {
        id: number;
        method: string;
    }
}

export const getUserInfo = async (req: Request, res: Response) => {
    // TODO: check and verify token in a middleware
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    try {
        const decodedToken = <jwt.TokenPaylod>(
            jwt.verify(token, process.env.JWT_SECRET!)
        );

        const user = await prisma.user.findUnique({
            where: { googleId: String(decodedToken.id) },
        });

        const userInfo = {
            name: user?.name,
            email: user?.email,
            picture: user?.picture,
        };

        res.status(200).json({
            message: 'User fetch succesful',
            user: userInfo,
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
