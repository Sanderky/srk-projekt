import express from 'express';
import controller from '@/controllers/Room';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';
import userVerification from '@/middleware/UserVerification';
const router = express.Router();

//Sciezki niezabepieczone

//Sciezki zabezpieczone
router.use(userVerification.verifyJWT);
router.use(userVerification.verifyRoles([ROLES.admin, ROLES.doctor]));
router.get('/get/:roomId', controller.readRoom);
router.get('/get/', controller.readAllRooms);
router.post('/create', controller.createRoom);
router.patch('/update', controller.updateRoom);
router.delete('/delete/:roomId', controller.deleteRoom);

export = router;
