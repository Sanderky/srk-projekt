import express from 'express';
import controller from '@/controllers/Ticket';
import { isAuthorized } from '@/middleware/Authorize';
import passport from 'passport';

const router = express.Router();

router.get('/events', controller.queEventsHandler);

router.use(passport.authenticate('jwt',{session:false}))
router.use(isAuthorized("doctor"))

router.post('/create', controller.createTicket);
router.get('/get/:ticketId', controller.readTicket);
router.get('/get/', controller.readAllTickets);

router.patch('/update/:ticketId', controller.updateTicket);
router.delete('/delete/:ticketId', controller.deleteTicket);

export = router;