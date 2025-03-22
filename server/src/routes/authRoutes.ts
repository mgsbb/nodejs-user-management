import { Router } from 'express';
import {
    googleAuthCallback,
    redirectToGoogleAuth,
    verifyToken,
} from '../controllers/authControllers';

const router = Router();

router.get('/auth/google', redirectToGoogleAuth);

router.get('/auth/google/callback', googleAuthCallback);

router.get('/auth/verify-token', verifyToken);

export default router;
