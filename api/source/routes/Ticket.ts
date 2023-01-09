import express from 'express';
import controller from '@/controllers/Ticket';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';
import userController from '@/controllers/User';

const router = express.Router();

router.use(userController.verifyJWT);
router.use(userController.verifyRoles(['doctor', 'staff', 'admin']));

router.post('/create', controller.createTicket);
router.get('/get/:ticketId', controller.readTicket);
router.get('/get/', controller.readAllTickets);

router.patch('/update/:ticketId', controller.updateTicket);
router.delete('/delete/:ticketId', controller.deleteTicket);

export = router;
