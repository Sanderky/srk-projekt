// Nothing for now.
import 'module-alias/register';
import mongoose from 'mongoose';
import Que from '@/models/Que'
import Ticket from '@/models/Ticket'
const AsyncAF = require('async-af');


function convertTime(time: string) {
    const hour = parseInt(time.split(':')[0])
    const minutes = parseInt(time.split(':')[1])

    return (hour * 60 + minutes)
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
                return 1;
            } else {
                const ticketToInsertTime = convertTime(ticket.visitTime)
                const mappedTickets = await AsyncAF(que.activeTickets).mapAF(async (ticket: mongoose.Types.ObjectId) => {
                    const mappedTicket = await Ticket.findById(ticket).exec()
                    return mappedTicket?.visitTime
                })
                const index = mappedTickets.findIndex((time: string) =>
                    convertTime(time) > ticketToInsertTime
                )
                if (index < 0) {
                    que.activeTickets.push(ticket._id)
                    que.save()
                } else {
                    que.activeTickets.splice(index, 0, ticket._id)
                    que.save()
                }
                if (index < 0) {
                    return que.activeTickets.length;
                } else {
                    return index + 1;
                }
            }
        }
    }
}