import 'module-alias/register';
import mongoose from 'mongoose';
import Ticket from '@/models/Ticket';
import Que from '@/models/Que';
import Room from '@/models/Room';
import Log from '@/library/Logging';

export { generateVisitCode };

const generateVisitCode = async (queId: mongoose.Types.ObjectId) => {
	let roomNumber;
	const que = await Que.findById(queId).exec();
	if (!que) {
		throw new Error('Que with given ID does not exist.');
	} else {
		roomNumber = que.roomNumber;
	}

	const prefix = async (roomNumber: number) => {
		const room = await Room.findOne({ roomNumber: roomNumber }).exec();
		if (!room) {
			throw new Error('Room with given number does not exist.');
		} else {
			return room.code;
		}
	};

	const postfix = async () => {
		const activeTickets = await Ticket.find().exec();
		if (activeTickets.length !== 0) {
			const lastVisitCode = activeTickets[activeTickets.length - 1].visitCode.substring(1);
			const lastVisitNumber = parseInt(lastVisitCode);
			if (lastVisitNumber < 100) {
				return (lastVisitNumber + 1).toString();
			} else {
				return '1';
			}
		} else {
			return '1';
		}
	};
	const visitCode = (await prefix(roomNumber)) + (await postfix());
	return visitCode;
};
