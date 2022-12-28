import express from 'express';
import controller from '@/controllers/Slots';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';

const router = express.Router();

router.use(passport.authenticate('jwt',{session:false}))
router.use(isAuthorized("doctor"))

// router.get('/get/:doctorId/:dayId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/:doctorId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/', controller.readAllSlotsForAllDoctors);

export = router;