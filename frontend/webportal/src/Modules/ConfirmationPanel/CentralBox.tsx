import { useEffect } from "react";
import styles from './CentralBox.module.css';
import axios from "axios"
import React from "react";

const TooFast = (): JSX.Element => {
    return (
        <div className={styles.TooFast}>
            <div className={`${styles.text} ${styles.title}`}>Jesteś za szybko!</div>
            <div className={styles.text}>Proszę przybyć w dzień swojej wizyty.</div>
            <div className={styles.buttonWrapper}>
                <button className={styles.buttonNew}>Nowa rejestracja</button>
            </div>
        </div>
    );
}

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
        this.state = { panelStatus: "enterInformation", time: "", roomNumber: 0, visitCode: "" }
    }

    backToLogin = () => {
        this.setState({ panelStatus: "enterInformation" });
    }

    getReservations = (e: any) => {
        e.preventDefault();
        const configuration = {
            method: "POST",
            url: "http://localhost:3000/reservation/login",
            data: {
                reservationCode: e.target.form[0].value,
            }
        }
        axios(configuration)
            .then((res1) => {
                const getQueConfig = {
                    method: "GET",
                    url: "http://localhost:3000/que/get",
                    data: {
                        doctorId: res1.data.reservations[0].doctorId,
                    }
                }

                axios(getQueConfig)
                    .then((res2) => {
                        const addToQueConfig = {
                            method: "POST",
                            url: "http://localhost:3000/ticket/create",
                            data: {
                                queId: res2.data.que[0]._id,
                                visitTime: res1.data.reservations[0].time,
                            }
                        }

                        axios(addToQueConfig)
                            .then((res3) => {
                                console.log(res3)
                                this.setState({
                                    panelStatus: res3.data.queResponse.lateStatus,
                                    time: res1.data.reservations[0].time,
                                    roomNumber: res2.data.que[0].roomNumber,
                                    visitCode: res3.data.ticket.visitCode,
                                    queIndex: res3.data.queResponse.queIndex,
                                    reservationRegistered: res1.data.reservations[0].registered
                                });

                            })
                            .catch((err) => { console.log(err) })
                        console.log(res2.data.que[0]._id)
                        console.log(res1.data.reservations[0].time)
                    })
                    .catch((err) => console.log("Nie znaleziono kolejki"))
            })
            .catch((error) => { this.setState({ panelStatus: "wrongCode" }) });
    }

    EnterCode = (): JSX.Element => {
        return (
            <div>
                <div className={`${styles.text} ${styles.title}`}>Witaj</div>
                <div className={styles.text}>Podaj swój unikatowy kod rezerwacji</div>
                <form className={styles.form}>
                    <input type="text" name="reservationCode" placeholder="Unikatowy kod rezerwacji" className={styles.input} maxLength={8} />
                    <button type="submit" onClick={(e) => { this.getReservations(e) }} className={styles.buttonSend}>Zatwierdź</button>
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
                    Proszę obserwować tablicę wywoławczą i oczekiwać na swoją kolej.
                    Po wywołaniu można udać się do odpowiedniego gabinetu.
                </div>
                <div className={styles.buttonWrapper}>
                    <button type="submit" onClick={(e) => { this.backToLogin() }} className={styles.buttonNew}>Zakończ</button>
                </div>
            </div>
        );
    }

    WrongCode = (): JSX.Element => {
        return (
            <div className={styles.WrongCode}>
                <div className={`${styles.text} ${styles.title}`}>Błędny kod</div>
                <div className={styles.text}>Podany kod nie istnieje. <br /> Spróbuj ponownie.</div>

                <form className={styles.form}>
                    <input type="text" className={styles.input} maxLength={10} placeholder="Unikatowy kod rezerwacji" />
                    <button type="submit" className={`${styles.buttonSend} ${styles.buttonError}`} onClick={(e) => { this.getReservations(e) }}>Zatwierdź</button>
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
                    Rejestracja potwierdzona z opóźnieniem. <br />
                    Kolejność przyjęcia mogła ulec zmianie.
                </div>
                <div className={styles.successData}>
                    <ConfirmationData label={"Twój numer:"} data={this.state.visitCode} />
                    <ConfirmationData label={"Gabinet:"} data={this.state.roomNumber} />
                    <ConfirmationData label={"Miejsce w kolejce:"} data={this.state.queIndex} />
                    <ConfirmationData label={"Godzina wizyty:"} data={this.state.time} />
                    <ConfirmationData label={"Godzina potwierdzenia:"} data={confirmationTime} color={"var(--warning)"} />
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.buttonNew} onClick={(e) => { this.backToLogin() }}>Powrót</button>
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
                    <ConfirmationData label={"Miejsce w kolejce:"} data={this.state.queIndex} />
                    <ConfirmationData label={"Godzina wizyty:"} data={this.state.time} />
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.buttonNew} onClick={(e) => { this.backToLogin() }}>Powrót</button>
                </div>
            </div>
        );
    }

    // useEffect(() => {setInterval(() => props.showHelloScreen(), 30000)}, []);
    render() {
        let toRender;
        let labelColor;

        if (this.state.panelStatus === "enterInformation") {
            toRender = <this.EnterCode />;
        } else if (this.state.reservationRegistered) {
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