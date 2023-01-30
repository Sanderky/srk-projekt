import express from 'express';
import controller from '@/controllers/Ticket';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';
import userVerification from '@/middleware/UserVerification';
const router = express.Router();

router.get('/events', controller.ticketEventsHandler);

router.use(userVerification.verifyJWT);
router.use(userVerification.verifyRoles([ROLES.admin, ROLES.staff, ROLES.doctor]));

router.post('/create', controller.createTicket);
router.get('/get/:ticketId', controller.readTicket);
router.get('/get/', controller.readAllTickets);
router.patch('/update/:ticketId', controller.updateTicket);
router.delete('/delete/:ticketId', controller.deleteTicket);

export = router;
