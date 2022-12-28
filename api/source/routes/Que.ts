import express from 'express';
import controller from '@/controllers/Que';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';
const router = express.Router();


router.use(passport.authenticate('jwt',{session:false}))
router.use(isAuthorized("doctor"))

router.post('/create', controller.createQue);
router.get('/get/:queId', controller.readQue);
router.get('/get/', controller.readAllQues);
router.patch('/update/:queId', controller.updateQue);
router.delete('/delete/:queId', controller.deleteQue);

export = router;
