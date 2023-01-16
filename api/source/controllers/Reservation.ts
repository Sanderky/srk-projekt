import { NextFunction, Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import Reservation from '@/models/Reservation';
import { dayIdByDate } from '@/library/DaysUtils';
import { generateReservationCode, updateSlotForNewReservation, makeSlotAvailable, flagAsRegistered } from '@/library/ReservationUtils';
import Log from '@/library/Logging';
import mailService from '@/services/Mailer';

interface CreateResReqBody {
	email: String;
	doctorId: mongoose.Types.ObjectId;
	date: Date;
	time: string;
	doctorName: String;
}

const createReservation = async (req: Request, res: Response, next: NextFunction) => {
	const { email, doctorId, date, time, doctorName }: CreateResReqBody = req.body;
	try {
		const day = new Date(date).toISOString();
		const dayId = await dayIdByDate(doctorId, day)
			.then((result) => {
				return result;
			})
			.catch((error) => {
				throw error;
			});
		await updateSlotForNewReservation(doctorId.toString(), dayId, date, time).catch((error) => {
			throw error;
		});

		const reservationCode = await generateReservationCode()
			.then((result) => {
				return result;
			})
			.catch((error) => {
				throw error;
			});
		const reservation = new Reservation({
			_id: new mongoose.Types.ObjectId(),
			reservationCode,
			email,
			doctorId,
			day,
			time
		});
		return await reservation
			.save()
			.then((reservation) => {
				mailService.sendConfirmationEmail({
					email: email,
					date: new Date(date).toLocaleDateString('pl-PL'),
					code: reservationCode,
					doctor: doctorName,
					time: time
				});
				res.status(201).json({ reservation });
			})
			.catch((error) => {
				throw error;
			});
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const readReservation = async (req: Request, res: Response, next: NextFunction) => {
	const reservationId = req.params.reservationId;
	return await Reservation.findById(reservationId)
		.populate('doctorId', '-days -__v')
		.then((reservation) => (reservation ? res.status(200).json({ reservation }) : res.status(404).json({ message: 'Not found' })))
		.catch((error) => res.status(500).json({ error }));
};

const readAllReservations = async (req: Request, res: Response, next: NextFunction) => {
	const { reservationCode } = req.query;
	try {
		if (reservationCode) {
			return await Reservation.findOne({ reservationCode: reservationCode })
				.populate('doctorId', '-days -__v')
				.then((reservation) => (reservation ? res.status(200).json({ reservation }) : res.status(404).json({ message: 'Not found' })));
		} else {
			return await Reservation.find()
				.populate('doctorId', '-days -__v')
				.then((reservations) => res.status(200).json({ reservations }));
		}
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const updateReservation = async (req: Request, res: Response, next: NextFunction) => {
	const reservationId = req.params.reservationId;
	const { doctorId, day, time } = req.body;
	try {
		await makeSlotAvailable(reservationId).catch((error) => {
			throw error;
		});
		const dayId = await dayIdByDate(doctorId, day)
			.then((result) => {
				return result;
			})
			.catch((error) => {
				throw error;
			});
		await updateSlotForNewReservation(doctorId, dayId, day, time).catch((error) => {
			throw error;
		});
		return await Reservation.findById(reservationId)
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
			.catch((error) => {
				throw error;
			});
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const reservationId = req.params.reservationId;
		await makeSlotAvailable(reservationId).catch((error) => {
			throw error;
		});
		const reservation = await Reservation.findByIdAndDelete(reservationId);
		return reservation ? res.status(201).json({ message: `Deleted: ${reservationId})` }) : res.status(404).json({ message: 'Not found' });
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const loginWithReservation = async (req: Request, res: Response, next: NextFunction) => {
	const { reservationCode } = req.body;
	try {
		const reservations = await Reservation.find({ reservationCode: reservationCode }).exec();
		if (reservations.length === 1) {
			flagAsRegistered(reservationCode);
			return res.status(200).json({ message: 'Registered' });
		} else if (reservations.length > 1) {
			throw new Error('Multiple reservations with the same code.');
		} else {
			return res.status(404).json({ message: 'Not found.' });
		}
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

export default { createReservation, readReservation, readAllReservations, updateReservation, deleteReservation, loginWithReservation };
