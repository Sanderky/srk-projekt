import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation {
    reservationCode: string;
}

export interface IReservationModel extends IReservation, Document {
    email: string,
    doctorId: string;
    day: Date;
    time: string;
    registered: boolean;
}

const ReservationSchema: Schema = new Schema({
    reservationCode: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, required: true, ref: 'Doctor' },
    day: { type: Date, required: true },
    time: { type: String, required: true },
    registered: { type: Boolean, required: true, default: false }
});

export default mongoose.model<IReservationModel>('Reservation', ReservationSchema);