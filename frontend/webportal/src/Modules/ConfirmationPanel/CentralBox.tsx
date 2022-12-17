// import { useEffect } from "react";
import styles from './CentralBox.module.css';
import axios from "axios"
import React from "react";

// const TooFast = (): JSX.Element => {
//     return (
//         <div className={styles.TooFast}>
//             <div className={`${styles.text} ${styles.title}`}>Jesteś za szybko!</div>
//             <div className={styles.text}>Proszę przybyć w dzień swojej wizyty.</div>
//             <div className={styles.buttonWrapper}>
//                 <button className={styles.buttonNew}>Nowa rejestracja</button>
//             </div>
//         </div>
//     );
// }

interface SuccessDataProps {
    label: string;
    data: string | number;
    color?: string;
}

const ConfirmationData = ({ label, data, color = "var(--subText)" }: SuccessDataProps): JSX.Element => {
    return (
        <div className={styles.ConfirmationDataContainer}>
            <div className={styles.ConfirmationDataLabel}>{label}</div>
            <div className={styles.ConfirmationDataLabel} style={{ color: color }}>{data}</div>
        </div>
    );
}

class CentralBox extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { panelStatus: "enterInformation", time: "-", roomNumber: -1, visitCode: "-", queIndex: -1 }
    }

    backToLogin = () => {
        this.setState({ panelStatus: "enterInformation", time: "-", roomNumber: -1, visitCode: "-", queIndex: -1 });
    }

    confirmReservation = async (event: any) => {
        event.preventDefault();
        const reservationPayload = { reservationCode: event.target.form[0].value };
        const reservationParams = new URLSearchParams(reservationPayload)
        let reservation;
        try {
            reservation = await axios.get(`http://localhost:3000/reservation/get?${reservationParams}`);
        } catch (error) {
            console.log(error)
            this.setState({ panelStatus: "wrongCode" })
            return
        }
        const reservationData = reservation?.data.reservation;

        if (reservationData.registered) {
            //Get ticket data
            const ticketData = await axios.get(`http://localhost:3000/ticket/get?${reservationParams}`);
            const ticket = ticketData.data.ticket;

            const queId = ticket.queId;
            const queData = await axios.get(`http://localhost:3000/que/get/${queId}`);
            const que = queData.data.que;

            const queIndex = que.activeTickets.findIndex((t: { _id: any; }) => t._id === ticket._id)
            this.setState({
                panelStatus: "duplicate",
                roomNumber: que.roomNumber,
                visitCode: ticket.visitCode,
                queIndex: queIndex + 1
            });
        } else {
            //Create ticket
            const queParams = new URLSearchParams({ doctorId: reservationData.doctorId._id })
            const que = await axios.get(`http://localhost:3000/que/get?${queParams}`);
            const queData = que.data.que;
            const queId = queData._id;

            const ticketPayload = {
                queId: queId,
                visitTime: reservationData.time,
                reservationCode: reservationData.reservationCode,
                roomNumber: queData.roomNumber
            }
            const createTicketResponse = await axios.post('http://localhost:3000/ticket/create', ticketPayload)
            const ticket = createTicketResponse.data.ticket;
            const queResponse = createTicketResponse.data.queResponse;

            this.setState({
                panelStatus: queResponse.lateStatus,
                time: ticket.visitTime,
                roomNumber: queData.roomNumber,
                visitCode: ticket.visitCode,
                queIndex: queResponse.queIndex
            });
            axios.post('http://localhost:3000/reservation/login/', reservationPayload);
        }
    }


    EnterCode = (): JSX.Element => {
        return (
            <div>
                <div className={`${styles.text} ${styles.title}`}>Witaj</div>
                <div className={styles.text}>Podaj swój unikatowy kod rezerwacji</div>
                <form className={styles.form}>
                    <input type="text" name="reservationCode" placeholder="Unikatowy kod rezerwacji" className={styles.input} maxLength={8} />
                    <button type="submit" onClick={event => this.confirmReservation(event)} className={styles.buttonSend}>Zatwierdź</button>
                </form>
            </div>
        );
    }


    Success = (): JSX.Element => {
        return (
            <div className={styles.success}>
                <div className={styles.successData}>
                    <ConfirmationData label={"Twój numer:"} data={this.state.visitCode} />
                    <ConfirmationData label={"Gabinet:"} data={this.state.roomNumber} />
                    <ConfirmationData label={"Godzina wizyty:"} data={this.state.time} />
                    <ConfirmationData label={"Miejsce w kolejce:"} data={this.state.queIndex} />
                </div>
                <div className={`${styles.successInfo} ${styles.text}`}>
                    Proszę obserwować tablicę wywoławczą i oczekiwać na swoją kolej
                    Po wywołaniu można udać się do odpowiedniego gabinetu
                </div>
                <div className={styles.buttonWrapper}>
                    <button type="submit" onClick={() => { this.backToLogin() }} className={styles.buttonNew}>Zakończ</button>
                </div>
            </div>
        );
    }

    WrongCode = (): JSX.Element => {
        return (
            <div className={styles.WrongCode}>
                <div className={`${styles.text} ${styles.title}`}>Błędny kod</div>
                <div className={styles.text}>Podany kod jest nieprawidłowy <br /> Spróbuj ponownie</div>

                <form className={styles.form}>
                    <input type="text" className={styles.input} maxLength={10} placeholder="Unikatowy kod rezerwacji" />
                    <button type="submit" className={`${styles.buttonSend} ${styles.buttonError}`} onClick={event => this.confirmReservation(event)}>Zatwierdź</button>
                    <button type="submit" onClick={() => { this.backToLogin() }} className={styles.buttonNew}>Powrót</button>
                </form>
            </div>
        );
    }

    Warning = (): JSX.Element => {
        const addZero = (minutes: number): string => minutes < 10 ? "0" + minutes : minutes.toString();
        const today = new Date();
        const confirmationTime = today.getHours() + ":" + addZero(today.getMinutes());

        return (
            <div className={styles.success}>
                <div className={styles.text} style={{ marginBottom: "30px" }}>
                    Rejestracja potwierdzona z opóźnieniem <br />
                    Kolejność przyjęcia mogła ulec zmianie
                </div>
                <div className={styles.successData}>
                    <ConfirmationData label={"Twój numer:"} data={this.state.visitCode} />
                    <ConfirmationData label={"Gabinet:"} data={this.state.roomNumber} />
                    <ConfirmationData label={"Miejsce w kolejce:"} data={this.state.queIndex} />
                    <ConfirmationData label={"Godzina wizyty:"} data={this.state.time} />
                    <ConfirmationData label={"Godzina potwierdzenia:"} data={confirmationTime} color={"var(--warning)"} />
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.buttonNew} onClick={() => { this.backToLogin() }}>Powrót</button>
                </div>
            </div>
        );
    }

    Duplicate = (): JSX.Element => {
        return (
            <div className={styles.success}>
                <div className={styles.text} style={{ marginBottom: "30px" }}>
                    Rezerwacja została już potwierdzona
                </div>
                <div className={styles.successData}>
                    <ConfirmationData label={"Twój numer:"} data={this.state.visitCode} />
                    <ConfirmationData label={"Gabinet:"} data={this.state.roomNumber} />
                    <ConfirmationData label={"Aktualne miejsce w kolejce:"} data={this.state.queIndex} />
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.buttonNew} onClick={() => { this.backToLogin() }}>Powrót</button>
                </div>
            </div>
        );
    }

    // useEffect(() => {setInterval(() => props.showHelloScreen(), 30000)}, []);

    //Automatyczny powrót do ekranu wprowadzania danych po 30 sekundach
    componentDidUpdate() {
        setTimeout(() => {
            this.backToLogin()
        }, 30000);
    }

    render() {
        let toRender;
        let labelColor;

        if (this.state.panelStatus === "enterInformation") {
            toRender = <this.EnterCode />;
        } else if (this.state.panelStatus === "duplicate") {
            labelColor = styles.warningLabel;
            toRender = <this.Duplicate />
        } else if (this.state.panelStatus === "onTime") {
            labelColor = styles.successLabel;
            toRender = <this.Success />
        }
        else if (this.state.panelStatus === "late") {
            labelColor = styles.warningLabel;
            toRender = <this.Warning />;
        }
        else if (this.state.panelStatus === "wrongCode") {
            labelColor = styles.wrongCodeLabel;
            toRender = <this.WrongCode />;
        }
        return (
            <div className={`${styles.containerBackground} ${labelColor}`}>
                <div className={styles.container}>
                    {toRender}
                </div>
            </div>
        );
    }
}

export default CentralBox;