//====================================================================
// SETTINGS FOR WORKDAYS
//====================================================================

const DAY_COUNT = 30;
const WORKDAY_START = 480; // in minutes from midnight, 480 -> 8:00
const WORKDAY_END = 900; // in minutes from midnight, 900 -> 15:00
const SLOT_DURATION = 30; // in minutes

export const workdaySettings = {
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

//====================================================================
// SETTINGS FOR CRONJOBS
// It is possible to add more parameters and objects to cronSettings
// object to set different settings for each cron job.
//====================================================================

const TIME_OF_UPDATE_HOUR = 7; // hours 0-23
const TIME_OF_UPDATE_MINUTES = 0; // minutes 0-59

const TIME_OF_DELETE_HOUR = 7; // hours 0-23
const TIME_OF_DELETE_MINUTES = 0; // minutes 0-59

export const cronSettings = {
	updateDayArray: {
		hour: TIME_OF_UPDATE_HOUR,
		minutes: TIME_OF_UPDATE_MINUTES
	},
	deleteOutdatedReservations: {
		hour: TIME_OF_DELETE_HOUR,
		minutes: TIME_OF_DELETE_MINUTES
	}
};

//====================================================================
// SETTINGS FOR ROOMS
//====================================================================

// Objects below are not an enum object, although TS supports it, because 
// floor and room numbers are only a simple example.
// They can be changed to whatever numbers client requires.
export const roomLetter = [
	{ roomNumber: 1, letter: 'A' },
	{ roomNumber: 2, letter: 'B' },
	{ roomNumber: 3, letter: 'C' },
	{ roomNumber: 4, letter: 'D' },
	{ roomNumber: 5, letter: 'E' },
	{ roomNumber: 6, letter: 'F' },
	{ roomNumber: 7, letter: 'G' },
	{ roomNumber: 8, letter: 'H' },
	{ roomNumber: 9, letter: 'I' },
	{ roomNumber: 10, letter: 'J' },
	{ roomNumber: 11, letter: 'K' },
	{ roomNumber: 12, letter: 'L' },
	{ roomNumber: 13, letter: 'M' },
	{ roomNumber: 14, letter: 'N' },
	{ roomNumber: 16, letter: 'O' },
	{ roomNumber: 17, letter: 'P' },
	{ roomNumber: 18, letter: 'Q' },
	{ roomNumber: 19, letter: 'R' },
	{ roomNumber: 20, letter: 'S' },
	{ roomNumber: 21, letter: 'T' },
	{ roomNumber: 22, letter: 'U' },
	{ roomNumber: 23, letter: 'V' },
	{ roomNumber: 24, letter: 'W' },
	{ roomNumber: 25, letter: 'X' },
	{ roomNumber: 26, letter: 'Y' },
	{ roomNumber: 27, letter: 'Z' }
]

//====================================================================
// SETTINGS FOR TICKETS
//====================================================================
const FIRST_IN_QUE_THESHOLD = 20 //minutes threshold after which ticket is directed to last index
export const lateThreshhold = FIRST_IN_QUE_THESHOLD;