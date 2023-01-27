import 'module-alias/register';
import mongoose from 'mongoose';
import Que from '@/models/Que';
import Ticket from '@/models/Ticket';
import { lateThreshold } from '@/config/settings';
import Log from './Logging';

function convertTime(time: string) {
	const hour = parseInt(time.split(':')[0]);
	const minutes = parseInt(time.split(':')[1]);

	return hour * 60 + minutes;
}

function getCurrentTime() {
	const nonUTC = new Date();
	const hour = nonUTC.getUTCHours();
	const minutes = nonUTC.getUTCMinutes();
	return hour * 60 + minutes;
}

export { insertTicketIntoQue };

const insertTicketIntoQue = async (ticketId: mongoose.Types.ObjectId) => {
	try {
		const ticket = await Ticket.findById(ticketId).exec();
		if (!ticket) {
			throw new Error('Ticket with given ID does not exist.');
		} else {
			const queId = ticket.queId;
			const que = await Que.findById(queId).exec();
			if (!que) {
				throw new Error('Que with given ID does not exist.');
			}
			const currentTime = getCurrentTime();
			const ticketToInsertTime = convertTime(ticket.visitTime);
			const timeDifference = ticketToInsertTime - currentTime;
			const queResponse = {
				lateStatus: 'onTime',
				queIndex: 1
			};
			if (que.activeTickets.length === 0) {
				if (timeDifference < 0 && Math.abs(timeDifference) > lateThreshold) {
					queResponse.lateStatus = 'late';
				}
				que.activeTickets.push(ticket._id);
				que.save();
				return queResponse;
			} else if (timeDifference < 0 && Math.abs(timeDifference) < lateThreshold) {
				que.activeTickets.unshift(ticket._id);
				que.save();
				queResponse.lateStatus = 'onTime';
				return queResponse;
			} else if (timeDifference < 0 && Math.abs(timeDifference) > lateThreshold) {
				que.activeTickets.push(ticket._id);
				que.save();
				queResponse.lateStatus = 'late';
				queResponse.queIndex = que.activeTickets.length;
				return queResponse;
			}
			const mapTickets = async () => {
				let timeArray: string[] = [];
				while (timeArray.length !== que.activeTickets.length) {
					timeArray = [];
					for (const ticket of que.activeTickets) {
						let singleTicket = await Ticket.findById(ticket).exec();
						if (singleTicket) {
							timeArray.push(singleTicket.visitTime);
						}
					}
				}
				return timeArray;
			};
			const mappedTickets: string[] = await mapTickets();

			const index = mappedTickets.findIndex((time) => convertTime(time!) > ticketToInsertTime);
			if (index < 0) {
				que.activeTickets.push(ticket._id);
				que.save();
				queResponse.queIndex = que.activeTickets.length;
				return queResponse;
			} else {
				que.activeTickets.splice(index, 0, ticket._id);
				que.save();
				queResponse.queIndex = index + 1;
				return queResponse;
			}
		}
	} catch (error) {
		Log.error(error);
		return error;
	}
};
