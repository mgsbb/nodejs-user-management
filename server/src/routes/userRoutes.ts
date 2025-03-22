import { Router } from 'express';
import { getUserInfo } from '../controllers/userControllers';

const router = Router();

router.get('/users/profile', getUserInfo);

export default router;
