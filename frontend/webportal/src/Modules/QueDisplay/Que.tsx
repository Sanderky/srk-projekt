import { useState } from "react";
import TicketNumber from "./TicketNumber";
import styles from "./Que.module.css"

const Que = (props: any) => {

    const tickets = props.tickets.activeTickets.map((item: any, index: any) => {
        // console.log(props.tickets.activeTickets[0].visitCode)
        if (index === 0) {
            return <TicketNumber nextInQue={true} key={index} visitCode={item.visitCode} />
        } else {
            return <TicketNumber nextInQue={false} key={index} visitCode={item.visitCode} />
        }
    })
    // console.log(ques);
    return (
        <div className={styles.queDefault}>
            <h1 className={styles.roomNumber}>{props.tickets.roomNumber}</h1>
            <hr className={styles.roomNumberDivider} />
            <div className={styles.ticketsWrapper}>
                {tickets}
            </div>
        </div>
    )
}

export default Que; 