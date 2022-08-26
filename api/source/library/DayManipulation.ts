import { settings } from '@/config/settings';

// Helper objects for creating array of days for each doctor
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
	slots: SlotObject[];

	constructor(date: Date, slots: SlotObject[]) {
		this.date = date;
		this.slots = slots;
	}
}

function convertTime(time: number) {
	const minutes = time % 60;
	const hours = Math.floor(time / 60);

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function for creating array of slots for each day
function createSlotArray() {
	const slotCount = (settings.days.start - settings.days.end) / settings.slot.duration || 14;
	const slotLength = settings.slot.duration || 30;
	const firstSlotStart = settings.days.start || 480;
	let slotArray: SlotObject[] = [];
	for (let i = 0; i < slotCount; i++) {
		const start = firstSlotStart + i * slotLength;
		const end = start + slotLength;
		const singleSlot = new SlotObject(convertTime(start), convertTime(end), true);
		slotArray.push(singleSlot);
	}
	return slotArray;
}
// console.log(createSlotsArray());

//==========================EXPORTING==========================
// Creating array of days with length configured in @/config/settings
export function createDayArray() {
	const dayCount = settings.days.dayCount || 30;
	const slotArray = createSlotArray();

	let date = new Date();
	let dayArray: DayObject[] = [];

	while (dayArray.length <= dayCount) {
		const date_day = String(date.getDate()).padStart(2, '0');
		const date_month = String(date.getMonth() + 1).padStart(2, '0');
		const date_year = String(date.getFullYear());

		const day_month = date_day + '/' + date_month;
		const currentDate = new Date(day_month + '/' + date_year);

		const newDay = new DayObject(currentDate, slotArray);
		dayArray.push(newDay);

		date.setDate(date.getDate() + 1);
	}
	return dayArray;
}

console.log(createDayArray());
