import Logging from '@/library/Logging';
import cron from 'node-cron';
import { shiftDayArray } from '@/library/DayManipulation'

//────────────────┤CRON HELPER├────────────────
//
// ┌───────────────────── seconds (0-59) (optional)
// │   ┌───────────────── minute (0-59)
// │   │  ┌────────────── hour (0-23)
// │   │  │  ┌─────────── day of month (1-31)
// │   │  │  │  ┌──────── month (1-11)
// │   │  │  │  │  ┌───── day of week (0-6)
// ┴   ┴  ┴  ┴  ┴  ┴
// *  *  *  *  *  *

export function updateDayArrays() {
    cron.schedule('0 7 * * *', shiftDayArray);
    Logging.info('Started cron job: Update day arrays every day at 00:00');
}