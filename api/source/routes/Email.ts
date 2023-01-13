import express from 'express';
import controller from '@/services/Mailer';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';

const router = express.Router();

//SERVICE

router.post('/send-confirmation', controller.sendConfirmationEmail);

router.use(userController.verifyJWT);
router.use(userController.verifyRoles([ROLES.admin]));

export = router;
