import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Que from '@/models/Que';
import Log from '@/library/Logging';

const createQue = async (req: Request, res: Response) => {
	const { doctorId, roomNumber } = req.body;
	const ticketArray: mongoose.AnyObject = [];
	try {
		return await new Que(doctorId, roomNumber, ticketArray)
			.save()
			.then((que) => res.status(201).json({ que }))
			.catch((error) => {
				throw error;
			});
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const readQue = (req: Request, res: Response) => {};

const readAllQues = (req: Request, res: Response) => {};

const readQueFofDoctor = (req: Request, res: Response) => {};

const updateQue = (req: Request, res: Response) => {};

const deleteQue = (req: Request, res: Response) => {};

export default { createQue, readQue, readAllQues, readQueFofDoctor, updateQue, deleteQue };
