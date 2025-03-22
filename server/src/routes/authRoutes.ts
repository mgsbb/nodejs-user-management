import { Router } from 'express';
import {
    googleAuthCallback,
    redirectToGoogleAuth,
    verifyToken,
    logout,
} from '../controllers/authControllers';

const router = Router();

router.get('/auth/google', redirectToGoogleAuth);

router.get('/auth/google/callback', googleAuthCallback);

router.get('/auth/verify-token', verifyToken);

router.get('/auth/logout', logout);

export default router;
