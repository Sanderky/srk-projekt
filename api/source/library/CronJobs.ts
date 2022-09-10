import Log from '@/library/Logging';
import cron from 'node-cron';
import { shiftDayArray } from '@/library/DayManipulation';
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

export function updateDayArrays() {
	const hour = cronSettings.updateDayArray.hour || 7;
	const minutes = cronSettings.updateDayArray.minutes || 0;
	cron.schedule(`${minutes} ${hour} * * *`, shiftDayArray);
	Log.info(`Started cron job: Update day arrays every day at ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}.`);
}
