import 'module-alias/register';
import { workdaySettings, holidays } from '@/config/settings';
import Doctor from '@/models/Doctor';
import Log from '@/library/Logging';

//====================================================================
// Helper classes for creating array of days for each doctor
//====================================================================
class SlotObject {
	start: string;
	end: string;
	availability: boolean;

	constructor(start: string, end: string, availability: boolean) {
		this.start = start;
		this.end = end;
		this.availability = availability;
	}
}

class DayObject {
	date: Date;
	workday: Boolean;
	slots: SlotObject[];

	constructor(date: Date, workday: Boolean, slots: SlotObject[]) {
		this.date = date;
		this.workday = workday;
		this.slots = slots;
	}
}

//====================================================================
// Helper functions
//====================================================================
function convertTime(time: number) {
	const minutes = time % 60;
	const hours = Math.floor(time / 60);

	// Return time in format hh:mm
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function createSlotArray() {
	const slotCount = (workdaySettings.days.end - workdaySettings.days.start) / workdaySettings.slot.duration || 14;
	const slotLength = workdaySettings.slot.duration || 30;
	const firstSlotStart = workdaySettings.days.start || 480;
	const slotArray: SlotObject[] = [];
	for (let i = 0; i < slotCount; i++) {
		const start = firstSlotStart + i * slotLength;
		const end = start + slotLength - 1;
		const singleSlot = new SlotObject(convertTime(start), convertTime(end), true);
		slotArray.push(singleSlot);
	}
	return slotArray;
}

function createDay(date: Date) {
	const slotArray = createSlotArray();

	const dateDay = String(date.getDate()).padStart(2, '0');
	const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
	const dateYear = String(date.getFullYear());

	const monthAndDay = dateMonth + '-' + dateDay;
	const currentDate = new Date(dateYear + '-' + monthAndDay);
	let newDay;
	// Validate workday //TODO - Modify holiday validating - probably new schema will be needed and each holiday as separate object in database
	if (currentDate.getDay() === 0 || currentDate.getDay() === 6 || holidays.includes(monthAndDay)) {
		newDay = new DayObject(currentDate, false, []);
	} else {
		newDay = new DayObject(currentDate, true, slotArray);
	}
	return newDay;
}

//====================================================================
//----------------------------EXPORTING-------------------------------
//--------------------------------------------------------------------
// Creating array of days with length configured in @/config/settings
//====================================================================
export function createDayArray() {
	const dayCount = workdaySettings.days.dayCount || 30;

	let dayArray: DayObject[] = [];
	let date = new Date();

	while (dayArray.length <= dayCount) {
		const newDay = createDay(date);
		dayArray.push(newDay);
		date.setDate(date.getDate() + 1);
	}
	Log.debug(`Created day array with length of ${dayCount} starting from ${new Date().toLocaleDateString()}.`);
	return dayArray;
}

//====================================================================
// Shifting array of days for each doctor in database
//====================================================================
export function updateDoctorDayArrays() {
	const today = new Date();
	today.setUTCHours(0, 0, 0, 0);
	let aux = 0;
	Doctor.find().exec((err, doctorArray) => {
		doctorArray.forEach((doctor) => {
			while (doctor.days[0].date < today) {
				doctor.days.shift();
				const dayCount = workdaySettings.days.dayCount || 30;
				const date = new Date();
				const newDay = createDay(new Date(date.setDate(date.getDate() + dayCount)));
				doctor.days.push(newDay);
				aux++;
				doctor.save();
			}
			if (aux) {
				Log.debug(`Updated day array of doctor ${doctor.firstname} ${doctor.lastname} ${aux} times.`);
				aux = 0;
			}
			// else {
			// 	Log.debug(`There was no need to update day array of doctor ${doctor.firstname} ${doctor.lastname}.`);
			// }
		});
	});
}
