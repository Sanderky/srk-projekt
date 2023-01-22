import 'module-alias/register';
import Doctor from '@/models/Doctor';
import Days from '@/models/Days';
import Slots from '@/models/Slots';
import Reservation from '@/models/Reservation';
import Log from '@/library/Logging';

export { cascadeDeleteDoctor };

const cascadeDeleteDoctor = async (doctorId: string) => {
	const doctor = await Doctor.findById(doctorId);
	if (!doctor) {
		throw new Error('Doctor with given ID does not exist.');
	} else {
		try {
			const deletedDays = await Days.findOneAndRemove({ doctorId: doctorId });
			const deletedSlots = await Slots.deleteMany({ doctorId: doctorId });
			const deletedReservations = await Reservation.deleteMany({ doctorId: doctorId });
			Log.info(`Successfully deleted days, ${deletedSlots.deletedCount} slots and ${deletedReservations.deletedCount} reservations linked to ${doctorId}.`);
		} catch (error) {
			return error;
		}
	}
};
