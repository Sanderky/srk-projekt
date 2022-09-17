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

//na chwile obecna nie dziala, ale WIP xD
const updateSlotForReservation = async (doctorId: mongoose.Types.ObjectId, dayId: mongoose.Types.ObjectId, time: string) => {
	return await Slots.findOne({ doctorId: doctorId, dayId: dayId })
		.then((slotsObj: any) => {
			if (slotsObj) {
				const found = slotsObj.slots.find((slot: { start: string }) => {
					slot.start === time;
				});
				if (found) {
					if (found.availability) {
						found.availability = false;
						return false;
					} else {
						throw new Error('Slot occupied');
					}
				} else {
					throw new Error('Object with specified time cannot be found in days array of slots object.');
				}
			} else {
				throw new Error('Slots object with specified doctorId does not exist.');
			}
		})
		.catch((error) => {
			Log.error(error);
		});
};

export { dayIdByDate, updateSlotForReservation };