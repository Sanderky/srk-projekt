import { NextFunction, Request, Response } from 'express';
import Slots from '@/models/Slots';
import Log from '@/library/Logging'

const readAllSlotsForDoctor = (req: Request, res: Response, next: NextFunction) => {
    const doctorId = req.params.doctorId;
    return Slots.find({ doctorId: doctorId })
        .populate({
            path: 'doctorId',
            select: 'firstname lastname specialization -_id'
        })
        .then((slots) => ((slots && slots.length !== 0) ? res.status(200).json({ slots }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => {
            res.status(500).json({ error })
        });
};

const readAllSlotsForDoctorAndDay = (req: Request, res: Response, next: NextFunction) => {
    const doctorId = req.params.doctorId;
    const dayId = req.params.dayId;
    return Slots.find({ doctorId: doctorId, dayId: dayId })
        .populate({
            path: 'doctorId',
            select: 'firstname lastname specialization -_id'
        })
        .then((slots) => ((slots && slots.length !== 0) ? res.status(200).json({ slots }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => {
            res.status(500).json({ error })
        });
};

const readAllSlotsForAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
    return Slots.find()
        .populate({
            path: 'doctorId',
            select: 'firstname lastname specialization -_id'
        })
        .then((slots) => res.status(200).json({ slots }))
        .catch((error) => {
            res.status(500).json({ error })
        });
};


export default { readAllSlotsForDoctor, readAllSlotsForDoctorAndDay, readAllSlotsForAllDoctors };