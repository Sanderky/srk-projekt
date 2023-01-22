import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket {
	queId: mongoose.Types.ObjectId;
	priority: number;
	visitCode: string;
	visitTime: string;
}

export interface ITicketModel extends ITicket, Document {}

const TicketSchema: Schema = new Schema({
	queId: { type: Schema.Types.ObjectId, required: true, ref: 'Que' },
	priority: Number,
	visitCode: { type: String, required: true },
	visitTime: String,
	reservationCode: String,
	inRoom: { type: Boolean, default: false },
	roomNumber: Number
});

export default mongoose.model<ITicketModel>('Ticket', TicketSchema);
