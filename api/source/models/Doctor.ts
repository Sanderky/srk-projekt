import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor {
	firstname: string;
	lastname: string;
	specialization: string;
}

export interface IDoctorModel extends IDoctor, Document {}

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
