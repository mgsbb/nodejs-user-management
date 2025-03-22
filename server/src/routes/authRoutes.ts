import { Router } from 'express';
import {
    googleAuthCallback,
    redirectToGoogleAuth,
} from '../controllers/authControllers';

const router = Router();

router.get('/auth/google', redirectToGoogleAuth);

router.get('/auth/google/callback', googleAuthCallback);

export default router;
