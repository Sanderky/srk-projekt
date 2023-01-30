import express from 'express';
import controller from '@/controllers/Que';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';
import userVerification from '@/middleware/UserVerification';

const router = express.Router();

router.get('/events', controller.queEventsHandler);

router.use(userVerification.verifyJWT);
router.use(userVerification.verifyRoles([ROLES.admin, ROLES.staff, ROLES.doctor]));

router.get('/get/:queId', controller.readQue);
router.get('/get/', controller.readAllQues);
router.patch('/shift/:queId', controller.shiftQue);
router.post('/create', controller.createQue);
router.patch('/update/:queId', controller.updateQue);
router.delete('/delete/:queId', controller.deleteQue);

export = router;
