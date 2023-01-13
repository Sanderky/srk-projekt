import express from 'express';
import controller from '@/controllers/Room';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';
import userController from '@/controllers/User';
const router = express.Router();

//Sciezki niezabepieczone

//Sciezki zabezpieczone
router.use(userController.verifyJWT);
router.use(userController.verifyRoles(['admin', 'doctor']));
router.get('/get/:roomId', controller.readRoom);
router.get('/get/', controller.readAllRooms);
router.post('/create', controller.createRoom);
router.patch('/update', controller.updateRoom);
router.delete('/delete/:roomId', controller.deleteRoom);

export = router;
