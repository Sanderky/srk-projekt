import express from 'express';
import controller from '@/services/Mailer';
import userController from '@/controllers/User';
const router = express.Router();

//SERVICE
router.use(userController.verifyJWT);
router.use(userController.verifyRoles(['admin']));
router.post('/send-confirmation', controller.sendConfirmationEmail);

export = router;
