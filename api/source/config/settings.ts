const DAY_COUNT = 30;
const WORKDAY_START = 480; // in minutes from midnight, 480 -> 8:00
const WORKDAY_END = 900; // in minutes from midnight, 900 -> 15:00
const SLOT_DURATION = 30; // in minutes

export const settings = {
	days: {
		dayCount: DAY_COUNT,
		start: WORKDAY_START,
		end: WORKDAY_END
	},
	slot: {
		duration: SLOT_DURATION
	}
};

export const holidays = ['01-01', '01-06', '05-01', '05-03', '08-15', '11-01', '11-11', '12-25', '12-26'];
