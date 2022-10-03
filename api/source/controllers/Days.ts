import { NextFunction, Request, Response } from 'express';
import Days from '@/models/Days';

const readDaysForDoctor = (req: Request, res: Response, next: NextFunction) => {
    const doctorId = req.params.doctorId;
    return Days.findOne({ doctorId: doctorId })
        .populate('days.slots')
        .then((days) => (days ? res.status(200).json({ days }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readDaysForAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
    return Days.find()
        .populate('days.slots')
        .then((days) => res.status(200).json({ days }))
        .catch((error) => res.status(500).json({ error }));
};

export default { readDaysForDoctor, readDaysForAllDoctors };
