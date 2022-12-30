import express from 'express';
import controller from '@/controllers/Slots';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';

const router = express.Router();

// router.get('/get/:doctorId/:dayId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/:doctorId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/', controller.readAllSlotsForAllDoctors);
router.use(passport.authenticate('jwt', { session: false }));
router.use(isAuthorized('doctor'));

export = router;
