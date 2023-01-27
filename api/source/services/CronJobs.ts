import Log from '@/library/Logging';
import cron from 'node-cron';
import { updateDoctorDayArray } from '@/library/DaysUtils';
import { deleteOutdatedReservation } from '@/library/ReservationUtils';
import { cronSettings } from '@/config/settings';

//────────────────┤CRON HELPER├────────────────
//
// ┌───────────────────── seconds (0-59) (optional)
// │  ┌───────────────── minute (0-59)
// │  │  ┌────────────── hour (0-23)
// │  │  │  ┌─────────── day of month (1-31)
// │  │  │  │  ┌──────── month (1-11)
// │  │  │  │  │  ┌───── day of week (0-6)
// ┴  ┴  ┴  ┴  ┴  ┴
// *  *  *  *  *  *

const updateDoctorsDayArrays = () => {
	updateDoctorDayArray();
	const hour = cronSettings.updateDayArray.hour || 7;
	const minutes = cronSettings.updateDayArray.minutes || 0;
	cron.schedule(`${minutes} ${hour} * * *`, updateDoctorDayArray);
	Log.info(`Started cron job: 'Update day arrays' every day at ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}.`);
}

const deleteOutdatedReservations = () => {
	deleteOutdatedReservation();
	const hour = cronSettings.deleteOutdatedReservations.hour || 7;
	const minutes = cronSettings.deleteOutdatedReservations.minutes || 0;
	cron.schedule(`${minutes} ${hour} * * *`, deleteOutdatedReservation);
	Log.info(`Started cron job: 'Delete outdated reservations' every day at ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}.`);
}

export { updateDoctorsDayArrays, deleteOutdatedReservations };