import express from 'express';
import controller from '@/controllers/Reservation';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';
import userVerification from '@/middleware/UserVerification';
const router = express.Router();

router.post('/create', controller.createReservation);

router.use(userVerification.verifyJWT);
router.use(userVerification.verifyRoles([ROLES.admin, ROLES.staff]));

router.get('/get/:reservationId', controller.readReservation);
router.get('/get/', controller.readAllReservations);
router.post('/login/', controller.loginWithReservation);
router.patch('/update/:reservationId', controller.updateReservation);
router.delete('/delete/:reservationId', controller.deleteReservation);

export = router;
