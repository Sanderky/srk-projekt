import express from 'express';
import controller from '@/controllers/Slots';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';

const router = express.Router();

router.get('/get/:doctorId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/', controller.readAllSlotsForAllDoctors);
router.use(userController.verifyJWT);
router.use(userController.verifyRoles([ROLES.doctor]));

export = router;
