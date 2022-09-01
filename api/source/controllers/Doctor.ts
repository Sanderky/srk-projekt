import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Doctor from '@/models/Doctor';
import { createDayArray } from '@/library/DayManipulation';

const createDoctor = (req: Request, res: Response, next: NextFunction) => {
	const { firstname, lastname, specialization } = req.body;
	const days = createDayArray();

	const doctor = new Doctor({
		_id: new mongoose.Types.ObjectId(),
		firstname,
		lastname,
		specialization,
		days
	});
	return doctor
		.save()
		.then((doctor) => res.status(201).json({ doctor }))
		.catch((error) => res.status(500).json({ error }));
};

const readDoctor = async (req: Request, res: Response, next: NextFunction) => {
	const doctorId = req.params.doctorId;
	try {
		const doctor = await Doctor.findById(doctorId);
		return (doctor ? res.status(200).json({ doctor }) : res.status(404).json({ message: 'Not found' }));
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const doctors = await Doctor.find();
		return res.status(200).json({ doctors });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateDoctor = (req: Request, res: Response, next: NextFunction) => {
	const doctorId = req.params.doctorId;

	return Doctor.findById(doctorId)
		.then((doctor) => {
			if (doctor) {
				doctor.set(req.body);

				return doctor
					.save()
					.then((doctor) => res.status(201).json({ doctor }))
					.catch((error) => res.status(500).json({ error }));
			} else {
				res.status(404).json({ message: 'Not found' });
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
	const doctorId = req.params.doctorId;

	const doctor = await Doctor.findByIdAndDelete(doctorId);
	return (doctor ? res.status(201).json({ message: `Deleted: ${doctorId})` }) : res.status(404).json({ message: 'Not found' }));
};

export default { createDoctor, readDoctor, readAllDoctors, updateDoctor, deleteDoctor };
