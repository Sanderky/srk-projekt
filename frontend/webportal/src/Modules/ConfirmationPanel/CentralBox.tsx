// import { useEffect } from "react";
import styles from './CentralBox.module.css';
import axios from "axios"
import React from "react";
import spinnerImg from "../../Assets/Images/spinner.png"

interface SuccessDataProps {
    label: string;
    data: string | number;
    color?: string;
}

const BASE_URL = 'http://localhost:3000'

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
        this.state = { panelStatus: "enterInformation", time: "-", roomNumber: -1, visitCode: "-", queIndex: -1, loading: false }
    }

    backToLogin = () => {
        this.setState({ panelStatus: "enterInformation", time: "-", roomNumber: -1, visitCode: "-", queIndex: -1, loading: false });
    }

    confirmReservation = async (event: any) => {
        this.setState({ loading: true });
        if (event.target.form[0].value === '') {
            this.setState({ loading: false });
            this.backToLogin()
        }
        event.preventDefault();
        const reservationPayload = { reservationCode: event.target.form[0].value };
        const reservationParams = new URLSearchParams(reservationPayload)
        let reservation;
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: token! }
        }
        try {
            reservation = await axios.get(`${BASE_URL}/reservation/get?${reservationParams}`, config);
        } catch (error) {
            console.log(error)
            this.setState({ panelStatus: "wrongCode" });
            this.setState({ loading: false });
            return
        }
        const reservationData = reservation?.data.reservation;

        const nonUTC = new Date();
        const today = new Date(Date.UTC(nonUTC.getUTCFullYear(), nonUTC.getUTCMonth(), nonUTC.getUTCDate(), 0, 0, 0, 0));
        const reservationDay = new Date(reservationData.day)
        if (reservationDay.getTime() > today.getTime()) {
            this.setState({ panelStatus: "tooFast" })
            this.setState({ loading: false });
            return
        } else if (reservationDay.getTime() < today.getTime()) {
            this.setState({ panelStatus: "tooLate" })
            this.setState({ loading: false });
            return
        }

        if (reservationData.registered) {
            //Get ticket data
            const ticketData = await axios.get(`${BASE_URL}/ticket/get?${reservationParams}`, config);
            const ticket = ticketData.data.ticket;

            const queId = ticket.queId;
            const queData = await axios.get(`${BASE_URL}/que/get/${queId}`, config);
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
            const que = await axios.get(`${BASE_URL}/que/get?${queParams}`, config);
            const queData = que.data.que;
            const queId = queData._id;

            const ticketPayload = {
                queId: queId,
                visitTime: reservationData.time,
                reservationCode: reservationData.reservationCode,
                roomNumber: queData.roomNumber
            }
            const createTicketResponse = await axios.post(`${BASE_URL}/ticket/create`, ticketPayload, config)
            const ticket = createTicketResponse.data.ticket;
            const queResponse = createTicketResponse.data.queResponse;

            this.setState({
                panelStatus: queResponse.lateStatus,
                time: ticket.visitTime,
                roomNumber: queData.roomNumber,
                visitCode: ticket.visitCode,
                queIndex: queResponse.queIndex
            });
            axios.post(`${BASE_URL}/reservation/login/`, reservationPayload, config);
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
                <img src={spinnerImg} alt="ładowanie..." className={this.state.loading ? styles.spinnerActive : styles.spinnerDisabled} />
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
                <img src={spinnerImg} alt="ładowanie..." className={this.state.loading ? styles.spinnerActive : styles.spinnerDisabled} />
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
                    <ConfirmationData label={"Godzina potwierdzenia:"} data={confirmationTime} color={"var(--yellow)"} />
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

    TooFast = (): JSX.Element => {
        return (
            <div className={styles.TooFast}>
                <div className={`${styles.text} ${styles.title}`}>Jesteś za szybko!</div>
                <div className={styles.text}>Proszę przybyć w dzień swojej wizyty.</div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.buttonNew} onClick={() => { this.backToLogin() }}>Powrót</button>
                </div>
            </div>
        );
    }

    TooLate = (): JSX.Element => {
        return (
            <div className={styles.TooLate}>
                <div className={`${styles.text} ${styles.title}`}>Jesteś za późno!</div>
                <div className={styles.text}>Przykro nam, termin Twojej wizyty minął.</div>
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

        switch (this.state.panelStatus) {
            case "enterInformation":
                labelColor = styles.defaultLabel;
                toRender = <this.EnterCode />;
                break;
            case "success":
                labelColor = styles.successLabel;
                toRender = <this.Success />
                break;
            case "duplicate":
                labelColor = styles.warningLabel;
                toRender = <this.Duplicate />
                break;
            case "late":
                labelColor = styles.warningLabel;
                toRender = <this.Warning />;
                break;
            case "tooFast":
                labelColor = styles.warningLabel;
                toRender = <this.TooFast />;
                break;
            case "tooLate":
                labelColor = styles.warningLabel;
                toRender = <this.TooLate />;
                break;
            case "wrongCode":
                labelColor = styles.wrongCodeLabel;
                toRender = <this.WrongCode />;
                break;
            default:
                labelColor = styles.defaultLabel;
                toRender = <this.EnterCode />;
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