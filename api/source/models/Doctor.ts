import mongoose, { Document, Schema } from 'mongoose';

interface ISlotObject {
	start: string;
	end: string;
	availability: boolean;
}

interface IDayObject {
	date: Date;
	workday: Boolean;
	slots: ISlotObject[];
}

export interface IDoctor {
	firstname: string;
	lastname: string;
	specialization: string;
}

export interface IDoctorModel extends IDoctor, Document {
	days: IDayObject[]
}

const DoctorSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	specialization: { type: String, required: true },
	days: [
		{
			date: Date,
			workday: Boolean,
			slots: [
				{
					start: String,
					end: String,
					availability: Boolean
				}
			]
		}
	]
});

export default mongoose.model<IDoctorModel>('Doctor', DoctorSchema);
