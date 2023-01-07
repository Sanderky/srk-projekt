import express, { application } from 'express';
import controller from '@/controllers/User';
import passport from 'passport';
import { isAuthorized } from '@/middleware/Authorize';
const router = express.Router();

require('@/library/Passport');

router.post('/signup', controller.createUser);
router.post('/login', controller.loginUser);
router.get('/refresh', controller.refreshTokenController);

export = router;
