import express from 'express';
import controller from '@/services/Mailer';
const router = express.Router();

//SERVICE
router.post('/send-confirmation', controller.sendConfirmationEmail);

export = router;
