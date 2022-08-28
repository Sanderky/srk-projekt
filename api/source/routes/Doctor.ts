import express from 'express';
import controller from '@/controllers/Doctor';

const router = express.Router();

router.post('/create', controller.createDoctor);
router.get('/get/:doctorId', controller.readDoctor);
router.get('/get/', controller.readAllDoctors);
router.patch('/update/:doctorId', controller.updateDoctor);
router.delete('/delete/:doctorId', controller.deleteDoctor);

export = router;
