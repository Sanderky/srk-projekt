import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Que from '@/models/Que';
import Log from '@/library/Logging';

const createQue = (req: Request, res: Response) => {
	const { doctorId, roomNumber } = req.body;
	const doctorIdObj = new mongoose.Types.ObjectId(doctorId);
	const ticketArray: mongoose.AnyObject = [];
	try {
		let que;
		if (!doctorIdObj) {
			throw new Error('DoctorId is empty!')
		} else {
			que = new Que({
				doctorId: doctorIdObj,
				roomNumber,
				activeTickets: ticketArray
			});
		}
		return que
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

const readQue = async (req: Request, res: Response) => {
	const queId = req.params.queId;
	try {
		return await Que.findById(queId)
			.populate('doctorId activeTickets', 'firstname lastname visitTime visitCode')
			.then((que) => (que ? res.status(200).json({ que }) : res.status(404).json({ message: 'Not found' })));
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const readAllQues = async (req: Request, res: Response) => {
	try {
		return await Que.find()
			.populate('doctorId activeTickets', 'firstname lastname visitTime visitCode')
			.then((que) => (que ? res.status(200).json({ que }) : res.status(404).json({ message: 'Not found' })));
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const readQueFofDoctor = async (req: Request, res: Response) => {
	const doctorId = req.params.doctorId;
	try {
		return await Que.findOne({ doctorId: doctorId })
			.populate('doctorId activeTickets', 'firstname lastname visitTime visitCode')
			.then((que) => (que ? res.status(200).json({ que }) : res.status(404).json({ message: 'Not found' })));
	} catch (error) {
		Log.error(error);
		res.status(500).json({ error });
	}
};

const updateQue = async (req: Request, res: Response) => {
	const queId = req.params.queId;

	return await Que.findById(queId)
		.then((que) => {
			if (que) {
				que.set(req.body);

				return que.save().then((que) => res.status(201).json({ que }));
			} else {
				res.status(404).json({ message: 'Not found' });
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

const deleteQue = async (req: Request, res: Response) => {
	const queId = req.params.queId;
	try {
		const que = await Que.findByIdAndDelete(queId);
		return que ? res.status(201).json({ message: `Deleted que: ${queId}` }) : res.status(404).json({ message: 'Not found' });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

export default { createQue, readQue, readAllQues, readQueFofDoctor, updateQue, deleteQue };
