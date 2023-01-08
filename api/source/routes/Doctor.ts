import express, { application } from 'express';
import controller from '@/controllers/Doctor';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';
import userController from '@/controllers/User';
const router = express.Router();

//Sciezki niezabepieczone
router.get('/get/:doctorId', controller.readDoctor);
router.get('/get/', controller.readAllDoctors);

//Sciezki zabezpieczone
router.use(userController.verifyJWT);
router.use(userController.verifyRoles(['doctor', 'admin']));
router.post('/create', controller.createDoctor);
router.patch('/update/:doctorId', controller.updateDoctor);
router.delete('/delete/:doctorId', controller.deleteDoctor);

export = router;
