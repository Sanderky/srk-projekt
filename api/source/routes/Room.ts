import express from 'express';
import controller from '@/controllers/Room';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';

const router = express.Router();

//Sciezki niezabepieczone
router.get('/get/:roomId', controller.readRoom);
router.get('/get/', controller.readAllRooms);

router.use(passport.authenticate('jwt', { session: false }));
router.use(isAuthorized('doctor'));

//Sciezki zabezpieczone
router.post('/create', controller.createRoom);
router.patch('/update', controller.updateRoom);
router.delete('/delete/:roomId', controller.deleteRoom);

export = router;
