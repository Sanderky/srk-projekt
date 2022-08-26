import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor {
	firstname: string;
	lastname: string;
	specialization: string;
}

export interface IDoctorModel extends Document {}

const DoctorSchema: Schema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	specialization: { type: String, required: true },
	days: [
		{
			date: Date,
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
