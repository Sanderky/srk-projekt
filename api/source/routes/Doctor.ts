import express from 'express';
import controller from '@/controllers/Doctor';
import {requireAuth} from '@/middleware/authMiddleware'
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser())
router.post('/create', requireAuth, controller.createDoctor);
router.get('/get/:doctorId', requireAuth, controller.readDoctor);
router.get('/get/', requireAuth, controller.readAllDoctors);
router.patch('/update/:doctorId', requireAuth, controller.updateDoctor);
router.delete('/delete/:doctorId', requireAuth, controller.deleteDoctor);

export = router;
