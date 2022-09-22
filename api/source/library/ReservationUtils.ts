import 'module-alias/register';
import Log from '@/library/Logging';
import Reservation from '@/models/Reservation';
import Days from '@/models/Days';
import Slots from '@/models/Slots';
import mongoose from 'mongoose';


export { updateSlotForNewReservation };


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
			} else {
				throw Error('Slot occupied.');
			}
		} else {
			throw Error('Object with specified time cannot be found in days array of slots object.');
		}
	} else {
		throw Error('Slots object with specified doctorID or dayID does not exist.');
	}
};
