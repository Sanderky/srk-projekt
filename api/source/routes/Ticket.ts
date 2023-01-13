import express from 'express';
import controller from '@/controllers/Ticket';
import userController from '@/controllers/User';
import { ROLES } from '@/config/settings';

const router = express.Router();

router.use(userController.verifyJWT);
router.use(userController.verifyRoles([ROLES.admin, ROLES.staff, ROLES.doctor]));

router.post('/create', controller.createTicket);
router.get('/get/:ticketId', controller.readTicket);
router.get('/get/', controller.readAllTickets);

router.patch('/update/:ticketId', controller.updateTicket);
router.delete('/delete/:ticketId', controller.deleteTicket);

export = router;
