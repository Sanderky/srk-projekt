import express from 'express';
import controller from '@/controllers/User';
const router = express.Router();

router.post('/signup', controller.createUser);
router.post('/login', controller.loginUser);
router.get('/refresh', controller.refreshTokenController);
router.get('/logout', controller.logout);

export = router;
