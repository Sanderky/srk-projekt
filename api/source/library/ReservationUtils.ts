import 'module-alias/register';
import Log from '@/library/Logging';
import Reservation from '@/models/Reservation';
import Days from '@/models/Days';
import Slots from '@/models/Slots';
import mongoose from 'mongoose';


const dayIdByDate = async (doctorId: mongoose.Types.ObjectId, dayDate: Date) => {
	const dayNonUTC = new Date(dayDate);
	const givenDay = new Date(Date.UTC(dayNonUTC.getUTCFullYear(), dayNonUTC.getUTCMonth(), dayNonUTC.getUTCDate(), 0, 0, 0, 0));
	return await Days.findOne({ doctorId: doctorId }).then((daysObj: any) => {
		if (daysObj) {
			const found = daysObj.days.find((day: { date: { getTime: () => number } }) => day.date.getTime() === givenDay.getTime());
			if (found) {
				return found._id.toString();
			} else {
				throw new Error('Object with specified date cannot be found in days array of days object.');
			}
		} else {
			throw new Error('Doctor with specified id does not exist.');
		}
	});
};


const updateSlotForNewReservation = async (doctorId: string, dayId: string, dayDate: Date, time: string) => {
	const doctor = new mongoose.Types.ObjectId(doctorId);
	const day = new mongoose.Types.ObjectId(dayId);
	const occupied = await Reservation.findOne({ doctorId: doctorId, day: dayDate, time: time })
		.then((reservation: any) => {
			return reservation;
		});
	if (occupied) {
		throw Error('Reservation with given details already exists.');
	}
	const slotsObj = await Slots.findOne({ doctorId: doctor, dayId: day })
	if (slotsObj) {
		const found = slotsObj.slots.find((slot: { start: string }) => {
			return slot.start === time;
		});
		if (found) {
			if (found.availability) {
				found.availability = false;
				slotsObj.save();
				return true;
			} else {
				throw Error('Slot occupied');
			}
		} else {
			throw Error('Object with specified time cannot be found in days array of slots object.');
		}
	} else {
		throw Error('Slots object with specified doctorId or dayId does not exist.');
	}
};

export { dayIdByDate, updateSlotForNewReservation };
