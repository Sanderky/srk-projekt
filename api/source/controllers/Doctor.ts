import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Doctor from '@/models/Doctor';
import { createDayArray, shiftDayArray } from '@/library/DayManipulation';

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

const readDoctor = (req: Request, res: Response, next: NextFunction) => {
	const doctorId = req.params.doctorId;

	return Doctor.findById(doctorId)
		.then((doctor) => (doctor ? res.status(200).json({ doctor }) : res.status(404).json({ message: 'Not found' })))
		.catch((error) => res.status(500).json({ error }));
};

const readAllDoctors = (req: Request, res: Response, next: NextFunction) => {
	shiftDayArray();
	return Doctor.find()
		.then((doctors) => res.status(200).json({ doctors }))
		.catch((error) => res.status(500).json({ error }));
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

const deleteDoctor = (req: Request, res: Response, next: NextFunction) => {
	const doctorId = req.params.doctorId;

	return Doctor.findByIdAndDelete(doctorId).then((doctor) => (doctor ? res.status(201).json({ message: `Deleted: ${doctorId})` }) : res.status(404).json({ message: 'Not found' })));
};

export default { createDoctor, readDoctor, readAllDoctors, updateDoctor, deleteDoctor };
