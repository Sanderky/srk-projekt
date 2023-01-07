import express from 'express';
import controller from '@/controllers/Que';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';
import userController from '@/controllers/User';
const router = express.Router();

router.use(userController.verifyJWT);
router.use(userController.verifyRoles('doctor'));

router.post('/create', controller.createQue);
router.get('/get/:queId', controller.readQue);
router.get('/get/', controller.readAllQues);
router.patch('/update/:queId', controller.updateQue);
router.delete('/delete/:queId', controller.deleteQue);

export = router;
