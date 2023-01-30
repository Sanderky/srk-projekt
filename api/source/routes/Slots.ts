import express from 'express';
import controller from '@/controllers/Slots';
import userController from '@/controllers/User';
import userVerification from '@/middleware/UserVerification';
import { ROLES } from '@/config/settings';

const router = express.Router();

router.get('/get/:doctorId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/', controller.readAllSlotsForAllDoctors);
router.use(userVerification.verifyJWT);
router.use(userVerification.verifyRoles([ROLES.doctor]));

export = router;
