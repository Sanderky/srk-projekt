import { Request, Response } from 'express';
import Room from '@/models/Room';
import Log from '@/library/Logging';

const createRoom = async (req: Request, res: Response) => {
	const { roomNumber, code } = req.body;
	try {
		const room = await new Room({
			roomNumber: roomNumber,
			code: code
		}).save();
		return res.status(201).json({ room });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readRoom = async (req: Request, res: Response) => {
	const roomId = req.params.roomId;
	try {
		const room = await Room.findById(roomId);
		return room ? res.status(200).json({ room }) : res.status(404).json({ message: 'Room not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readAllRooms = async (req: Request, res: Response) => {
	try {
		const rooms = await Room.find();
		return res.status(200).json({ rooms });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateRoom = async (req: Request, res: Response) => {
	const roomNumber = req.query.roomNumber;
	const room = await Room.findOne({ roomNumber: roomNumber }).exec();
	const roomId = room?._id;
	try {
		const room = await Room.findById(roomId);
		if (room) {
			room.set(req.body);
			return room
				.save()
				.then((room) => res.status(201).json({ room }))
				.catch((error) => res.status(500).json({ error }));
		} else {
			res.status(404).json({ message: 'Room not found' });
		}
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

const deleteRoom = async (req: Request, res: Response) => {
	const roomId = req.params.roomId;
	try {
		const room = await Room.findByIdAndDelete(roomId);
		return room ? res.status(201).json({ message: `Deleted room: ${roomId}` }) : res.status(404).json({ message: 'Room not found' });
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

export default { createRoom, readRoom, readAllRooms, updateRoom, deleteRoom };
