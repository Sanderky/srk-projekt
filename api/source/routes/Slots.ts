import express from 'express';
import controller from '@/controllers/Slots';

const router = express.Router();


// router.get('/get/:doctorId/:dayId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/:doctorId', controller.readAllSlotsForDoctorAndDay);
router.get('/get/', controller.readAllSlotsForAllDoctors);

export = router;