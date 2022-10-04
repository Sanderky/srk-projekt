import express from 'express';
import controller from '@/controllers/Days';

const router = express.Router();


router.get('/get/:doctorId', controller.readDaysForDoctor);
router.get('/get/', controller.readDaysForAllDoctors);

export = router;