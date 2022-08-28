import 'module-alias/register';
import { settings, holidays } from '@/config/settings';
import mongoose from 'mongoose';
import Doctor from '@/models/Doctor';

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

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function createSlotArray() {
	const slotCount = (settings.days.end - settings.days.start) / settings.slot.duration || 14;
	const slotLength = settings.slot.duration || 30;
	const firstSlotStart = settings.days.start || 480;
	let slotArray: SlotObject[] = [];
	for (let i = 0; i < slotCount; i++) {
		const start = firstSlotStart + i * slotLength;
		const end = start + slotLength - 1;
		const singleSlot = new SlotObject(convertTime(start), convertTime(end), true);
		slotArray.push(singleSlot);
	}
	return slotArray;
}

//====================================================================
//----------------------------EXPORTING-------------------------------
//--------------------------------------------------------------------
// Creating array of days with length configured in @/config/settings
//====================================================================
export function createDayArray() {
	const dayCount = settings.days.dayCount || 30;
	const slotArray = createSlotArray();

	let date = new Date();
	let dayArray: DayObject[] = [];

	while (dayArray.length <= dayCount) {
		const dateDay = String(date.getDate()).padStart(2, '0');
		const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
		const dateYear = String(date.getFullYear());

		const monthAndDay = dateMonth + '-' + dateDay;
		const currentDate = new Date(dateYear + '-' + monthAndDay);
		let newDay;
		// Validate workday
		if (currentDate.getDay() === 0 || currentDate.getDay() === 6 || holidays.includes(monthAndDay)) {
			newDay = new DayObject(currentDate, false, []);
		} else {
			newDay = new DayObject(currentDate, true, slotArray);
		}
		dayArray.push(newDay);
		date.setDate(date.getDate() + 1);
	}
	return dayArray;
}

export function shiftDayArray() {
	const doctors = Doctor.find().find();
	console.log(doctors);
}
