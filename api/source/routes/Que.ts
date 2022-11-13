import express from 'express';
import controller from '@/controllers/Que';
import { isAuthorized } from '@/middleware/Authorize';

const router = express.Router();

router.post('/create', isAuthorized('doctor'), controller.createQue);
router.get('/get/:queId', controller.readQue);
router.get('/get/', controller.readAllQues);
router.get('/get/', controller.readQueFofDoctor);
router.patch('/update/:queId', isAuthorized('que'), controller.updateQue);
router.delete('/delete/:queId', isAuthorized('que'), controller.deleteQue);

export = router;
