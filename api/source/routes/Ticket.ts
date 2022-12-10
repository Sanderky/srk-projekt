import express from 'express';
import controller from '@/controllers/Ticket';
import { isAuthorized } from '@/middleware/Authorize';

const router = express.Router();

router.post('/create', controller.createTicket);
router.get('/get/:ticketId', controller.readTicket);
router.get('/get/', controller.readAllTickets);
router.get('/get/', controller.readTicketsForQue);
router.patch('/update/:ticketId', isAuthorized('doctor'), controller.updateTicket);
router.delete('/delete/:ticketId', isAuthorized('doctor'), controller.deleteTicket);

export = router;