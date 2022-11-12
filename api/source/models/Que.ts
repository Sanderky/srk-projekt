import mongoose, { Document, Schema } from 'mongoose';

export interface IQue {
	doctorId: mongoose.Types.ObjectId;
	roomNumber: number;
	activeTickets: mongoose.Types.ObjectId[];
}

export interface IQueModel extends IQue, Document {}

const QueSchema: Schema = new Schema({
	doctorId: { type: Schema.Types.ObjectId, required: true, ref: 'Doctor' },
	roomNumber: { type: Number, required: true },
	activeTickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }]
});

export default mongoose.model<IQueModel>('Que', QueSchema);
