import express from 'express';
import controller from '@/controllers/Doctor';
import {isAuthorized} from "@/middleware/Authorize";
import passport from 'passport';
const router = express.Router();


//Sciezki niezabepieczone
router.get('/get/:doctorId', controller.readDoctor);
router.get('/get/', controller.readAllDoctors);

router.use(passport.authenticate('jwt',{session:false}))
router.use(isAuthorized("doctor"))

//Sciezki zabezpieczone
router.post('/create', controller.createDoctor);
router.patch('/update/:doctorId', controller.updateDoctor);
router.delete('/delete/:doctorId', controller.deleteDoctor);

export = router;
