import express from 'express';
import controller from '@/controllers/Que';
import { isAuthorized } from '@/middleware/Authorize';

const router = express.Router();

router.post('/create', isAuthorized('doctor'), controller.createQue);
router.get('/get/:queId', controller.readQue);
router.get('/get/', controller.readAllQues);
router.patch('/update/:queId', isAuthorized('doctor'), controller.updateQue);
router.delete('/delete/:queId', isAuthorized('doctor'), controller.deleteQue);

export = router;
