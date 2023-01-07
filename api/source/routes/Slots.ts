import express from 'express';
import controller from '@/controllers/Slots';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';
import userController from '@/controllers/User';
const router = express.Router();

// router.get('/get/:doctorId/:dayId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/:doctorId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/', controller.readAllSlotsForAllDoctors);
router.use(userController.verifyJWT);
router.use(userController.verifyRoles('doctor'));

export = router;
