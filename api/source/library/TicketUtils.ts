import 'module-alias/register';
import mongoose from 'mongoose';
import Ticket from '@/models/Ticket'
import Que from '@/models/Que'
import { roomLetter } from '@/config/settings'
import Log from '@/library/Logging';

export { generateVisitCode }

const generateVisitCode = async (queId: mongoose.Types.ObjectId) => {
    let roomNumber;
    const que = await Que.findById(queId).exec()
    if (!que) {
        throw new Error('Que with given ID does not exist.')
    } else {
        roomNumber = que.roomNumber
    }

    const prefix = (roomNumber: number) => {
        const letter = roomLetter.find(element => element.roomNumber === roomNumber)
        if (!letter) {
            throw new Error('Room with given number does not exist.');
        } else {
            return letter.letter;
        }
    }

    const postfix = async () => {
        const activeTickets = await Ticket.find().exec()
        if (activeTickets.length !== 0) {
            const lastVisitCode = activeTickets[activeTickets.length - 1].visitCode.substring(1);
            const lastVisitNumber = parseInt(lastVisitCode);
            if (lastVisitNumber < 100) {
                return (lastVisitNumber + 1).toString()
            } else {
                return '1'
            }
        } else {
            return '1'
        }
    }
    const visitCode = prefix(roomNumber) + await postfix()
    return visitCode;
}