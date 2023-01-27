import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Doctor from '@/models/Doctor';
import { createDayArray, updateDoctorDayArray } from '@/library/DaysUtils';
import { cascadeDeleteDoctor } from '@/library/DoctorUtils';
import Log from '@/library/Logging';

const createDoctor = async (req: Request, res: Response) => {
	const { firstname, lastname, specialization } = req.body;
	const doctorId = new mongoose.Types.ObjectId();
	const daysId = new mongoose.Types.ObjectId();

	try {
		const doctor = new Doctor({
			_id: doctorId,
			firstname,
			lastname,
			specialization,
			days: daysId
		});
		createDayArray(doctorId, daysId, firstname, lastname);
		await doctor.save();
		return res.status(201).json({ doctor });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

const readDoctor = async (req: Request, res: Response) => {
	const doctorId = req.params.doctorId;
	try {
		const doctor = await Doctor.findById(doctorId);
		return doctor ? res.status(200).json({ doctor }) : res.status(404).json({ message: 'Not found' });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

const readAllDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await Doctor.find();
		return res.status(200).json({ doctors });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

const updateDoctor = async (req: Request, res: Response) => {
	const doctorId = req.params.doctorId;
	try {
		const doctor = await Doctor.findById(doctorId);
		if (doctor) {
			doctor.set(req.body);
			await doctor.save();
			return res.status(200).json({ doctor });
		} else {
			return res.status(404).json({ message: 'Not found' });
		}
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

const deleteDoctor = async (req: Request, res: Response) => {
	const doctorId = req.params.doctorId;
	try {
		await cascadeDeleteDoctor(doctorId);
		const doctor = await Doctor.findByIdAndDelete(doctorId);
		return doctor ? res.status(201).json({ message: `Deleted: ${doctorId}` }) : res.status(404).json({ message: 'Not found' });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

export default { createDoctor, readDoctor, readAllDoctors, updateDoctor, deleteDoctor };
