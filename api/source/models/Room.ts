import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom {
	roomNumber: number;
	code: string;
	available: boolean;
	occupiedBy: mongoose.Types.ObjectId | null;
}

export interface IRoomModel extends IRoom, Document {}

const RoomSchema: Schema = new Schema({
	roomNumber: { type: Number, required: true },
	code: { type: String, required: true },
	available: { type: Boolean, default: true },
	occupiedBy: { type: Schema.Types.ObjectId, ref: 'Doctor', default: null }
});

export default mongoose.model<IRoomModel>('Room', RoomSchema);
