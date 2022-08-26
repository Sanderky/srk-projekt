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
};
const readDoctor = (req: Request, res: Response, next: NextFunction) => {};
const readAllDoctor = (req: Request, res: Response, next: NextFunction) => {};
const updateDoctor = (req: Request, res: Response, next: NextFunction) => {};
const deleteDoctor = (req: Request, res: Response, next: NextFunction) => {};
