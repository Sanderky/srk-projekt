// Nothing for now.
import 'module-alias/register';
import mongoose from 'mongoose';
import Que from '@/models/Que'
import Ticket from '@/models/Ticket'
import { lateThreshhold } from '@/config/settings';
const AsyncAF = require('async-af');


function convertTime(time: string) {
    const hour = parseInt(time.split(':')[0])
    const minutes = parseInt(time.split(':')[1])

    return (hour * 60 + minutes)
}

function getCurrentTime() {
    const nonUTC = new Date()
    const hour = nonUTC.getUTCHours()
    const minutes = nonUTC.getUTCMinutes()
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
            const queResponse = {
                lateStatus: 'onTime',
                queIndex: 1
            }
            if (que.activeTickets.length === 0) {
                que.activeTickets.push(ticket._id)
                que.save()
                return queResponse;
            } else {
                const currentTime = getCurrentTime()
                const ticketToInsertTime = convertTime(ticket.visitTime)
                const timeDifference = ticketToInsertTime - currentTime;
                if (timeDifference < 0 && Math.abs(timeDifference) < lateThreshhold) {
                    que.activeTickets.unshift(ticket._id)
                    que.save()
                    queResponse.lateStatus = 'late';
                    return queResponse;
                } else if (timeDifference < 0 && Math.abs(timeDifference) > lateThreshhold) {
                    que.activeTickets.push(ticket._id)
                    que.save()
                    queResponse.lateStatus = 'late';
                    queResponse.queIndex = que.activeTickets.length
                    return queResponse;
                }

                const mapTickets = async () => {
                    const timeArray = []
                    for (const ticket of que.activeTickets) {
                        let singleTicket = await Ticket.findById(ticket).exec()
                        timeArray.push(singleTicket?.visitTime)
                    }
                    return timeArray;
                }
                const mappedTickets = await mapTickets()

                const index = mappedTickets.findIndex((time) =>
                    convertTime(time!) > ticketToInsertTime
                )
                if (index < 0) {
                    que.activeTickets.push(ticket._id)
                    que.save()
                } else {
                    que.activeTickets.splice(index, 0, ticket._id)
                    que.save()
                }
                if (index < 0) {
                    queResponse.queIndex = que.activeTickets.length;
                    return queResponse;
                } else {
                    queResponse.queIndex = index + 1;
                    return queResponse;
                }
            }
        }
    }
}