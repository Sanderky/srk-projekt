import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Reservation from '@/models/Reservation';
import {GenerateReservationCode} from "@/library/GenerateReservationCode";
import Log from "@/library/Logging";

const createReservation = (req: Request, res: Response, next: NextFunction) => {
    const {email, doctor, day, time } = req.body;
    GenerateReservationCode().then(
        (uniqueCode) => {
            let reservationCode = uniqueCode;
            const reservation = new Reservation({
                _id: new mongoose.Types.ObjectId(),
                reservationCode,
                email,
                doctor,
                day,
                time
            });
            return reservation
                .save()
                .then((reservation) => res.status(201).json({ reservation }))
                .catch((error) => res.status(500).json({ error }));
        }
    ).catch((error) => res.status(500).json({error}));
};

const readReservation = (req: Request, res: Response, next: NextFunction) => {
    const reservationId = req.params.reservationId;
    return Reservation.findById(reservationId)
        .populate('doctor', '-days -__v')
        .then((reservation) => (reservation ? res.status(200).json({ reservation }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAllReservations = (req: Request, res: Response, next: NextFunction) => {
    return Reservation.find()
        .populate('doctor', '-days -__v')
        .then((reservations) => res.status(200).json({ reservations }))
        .catch((error) => res.status(500).json({ error }));
};

const updateReservation = (req: Request, res: Response, next: NextFunction) => {
    const reservationId = req.params.reservationId;

    return Reservation.findById(reservationId)
        .then((reservation) => {
            if (reservation) {
                reservation.set(req.body);

                return reservation
                    .save()
                    .then((reservation) => res.status(201).json({ reservation }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    const reservationId = req.params.reservationId;

    const reservation = await Reservation.findByIdAndDelete(reservationId);
    return (reservation ? res.status(201).json({ message: `Deleted: ${reservationId})` }) : res.status(404).json({ message: 'Not found' }));
};

export default { createReservation, readReservation, readAllReservations, updateReservation, deleteReservation };
