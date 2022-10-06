import express from 'express';
import controller from '@/controllers/Doctor';
import {isAuthorized} from "@/middleware/Authorize";

const router = express.Router();

router.use(isAuthorized("doctor"))
router.post('/create', controller.createDoctor);
router.get('/get/:doctorId', controller.readDoctor);
router.get('/get/', controller.readAllDoctors);
router.patch('/update/:doctorId', controller.updateDoctor);
router.delete('/delete/:doctorId', controller.deleteDoctor);

export = router;
