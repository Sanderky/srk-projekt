// Nothing for now.
import 'module-alias/register';
import mongoose from 'mongoose';
import Que from '@/models/Que'
import Ticket from '@/models/Ticket'

function convertTime(time: string) {
    const hourString = time.split(':')[0]
    const minutesString = time.split(':')[1]
    const hour = parseInt(hourString)
    const minutes = parseInt(minutesString)

    return (hour * 60 + minutes)
}

function getTimeDifference(visitTimeString: string) {
    const today = new Date()
    const currentTime = today.getHours() * 60 + today.getMinutes()
    const visitTime = convertTime(visitTimeString)
    return (visitTime - currentTime)
}

export { insertTicketIntoQue }

const insertTicketIntoQue = async (ticketId: mongoose.Types.ObjectId) => {
    const ticket = await Ticket.findById(ticketId).exec()
    if (!ticket) {
        throw new Error('Ticket with given ID does not exist.')
    } else {
        const queId = ticket.queId
        const que = await Que.findById(queId).exec()
        if (!que) {
            throw new Error('Que with given ID does not exist.')
        } else {
            if (que.activeTickets.length === 0) {
                que.activeTickets.push(ticket._id)
                que.save()
            } else {
                const timeDifference = getTimeDifference(ticket.visitTime)
                //TODO 
            }

        }
    }
}