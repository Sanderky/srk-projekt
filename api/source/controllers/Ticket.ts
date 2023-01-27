import { Request, Response, response } from 'express';
import mongoose from 'mongoose';
import Ticket from '@/models/Ticket';
import Log from '@/library/Logging';
import { generateVisitCode } from '@/library/TicketUtils';
import { insertTicketIntoQue } from '@/library/QueEngine';
import queController from '@/controllers/Que';

let updateResponse: Response = response;

function ticketEventsHandler(request: Request, response: Response) {
	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache'
	};
	response.writeHead(200, headers);

	const data = `data: ${JSON.stringify('Connection Established')}\n\n`;

	response.write(data);
	updateResponse = response;
}

function updateTicketList() {
	return updateResponse.write(`data: ${JSON.stringify('Ticket list updated')}\n\n`);
}

const createTicket = async (req: Request, res: Response) => {
	const { queId, visitTime, reservationCode } = req.body;
	const queIdObj = new mongoose.Types.ObjectId(queId);
	try {
		const [visitCode, roomNumber] = await generateVisitCode(queId);
		const ticketId = new mongoose.Types.ObjectId();
		const ticket = new Ticket({
			_id: ticketId,
			queId: queIdObj,
			priority: 5,
			visitCode: visitCode,
			visitTime: visitTime,
			reservationCode: reservationCode,
			roomNumber: roomNumber
		});
		await ticket.save();
		const queResponse = await insertTicketIntoQue(ticketId);
		updateTicketList();
		queController.updateQuePanel();
		return res.status(201).json({ ticket, queResponse });
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const readTicket = async (req: Request, res: Response) => {
	const ticketId = req.params.ticketId;
	try {
		return await Ticket.findById(ticketId).then((ticket) => (ticket ? res.status(200).json({ ticket }) : res.status(404).json({ message: 'Not found' })));
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const readAllTickets = async (req: Request, res: Response) => {
	const reservationCode = req.query.reservationCode;
	const inRoomReq = req.query.inRoom;
	const inRoom = inRoomReq === 'true' ? true : false;
	try {
		if (inRoomReq) {
			return await Ticket.find({ inRoom: inRoom }).then((ticket) => (ticket ? res.status(200).json({ ticket }) : res.status(404).json({ message: 'Not found' })));
		} else if (reservationCode) {
			return await Ticket.findOne({ reservationCode: reservationCode }).then((ticket) => (ticket ? res.status(200).json({ ticket }) : res.status(404).json({ message: 'Not found' })));
		} else {
			return await Ticket.find().then((ticket) => (ticket ? res.status(200).json({ ticket }) : res.status(404).json({ message: 'Not found' })));
		}
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const updateTicket = async (req: Request, res: Response) => {
	const ticketId = req.params.ticketId;

	return await Ticket.findById(ticketId)
		.then((ticket) => {
			if (ticket) {
				ticket.set(req.body);

				return ticket.save().then((ticket) => {
					res.status(201).json({ ticket });
					updateTicketList();
				});
			} else {
				res.status(404).json({ message: 'Not found' });
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

const deleteTicket = async (req: Request, res: Response) => {
	const ticketId = req.params.ticketId;
	try {
		const ticket = await Ticket.findByIdAndDelete(ticketId);
		updateTicketList();
		return ticket ? res.status(201).json({ message: `Deleted ticket: ${ticketId}` }) : res.status(404).json({ message: 'Not found' });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

export default { createTicket, readTicket, readAllTickets, updateTicket, deleteTicket, ticketEventsHandler };
