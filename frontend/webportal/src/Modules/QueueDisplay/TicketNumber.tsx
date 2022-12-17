import styles from "./TicketNumber.module.css"
const TicketNumber = (props: any) => {
    return <div className={props.nextInQue ? styles.ticketNext : styles.ticketDefault}>&nbsp;{props.visitCode}&nbsp;</div>
}

export default TicketNumber;
