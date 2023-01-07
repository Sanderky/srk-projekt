import { useState, useEffect } from "react";
import styles from './DoctorPanel.module.css';
import logo from '../../Assets/Images/logo.png';
import logoutIcon from '../../Assets/Images/logout.png';
import spinnerImg from "../../Assets/Images/spinner.png"
import Clock from '../../Components/Clock';
import react from 'react';
import axios from 'axios';

const doctorId = '63b2258dbb4dc4efaf5b60b3';
const BASE_URL = 'http://localhost:3000';

interface HeaderProps {
    setRoomNumber: (roomNumber: number | undefined) => void;
    roomSelected: boolean;
    setRoomSelected: (roomSelected: boolean) => void;
}

function Header({ setRoomNumber, roomSelected, setRoomSelected }: HeaderProps) {
    const logout = () => {
        setRoomNumber(undefined);
        setRoomSelected(false);
        localStorage.clear()
        window.location.reload();
    }

    return (
        <header>
            <div className={styles.logo}>
                <img className={styles.logoImage} src={logo} alt="Logo" />
                <h1 className={styles.logoText}>SRK</h1>
            </div>
            <Clock />
            {!roomSelected ?
                <button className={styles.logoutButton} onClick={logout}>
                    <p>Wyloguj</p>
                    <img className={styles.logoutIcon} src={logoutIcon} alt=">" />
                </button> :
                <></>}
        </header>
    )
}

interface ContainerHeaderProps {
    roomNumber: number | undefined;
    roomSelected: boolean;
}

function ContainerHeader({ roomNumber, roomSelected }: ContainerHeaderProps) {
    const renderSelectedRoomPart = () => {
        if (roomNumber && roomSelected) {
            return (
                <section className={styles.containerHeaderSection}>
                    <h3 className={styles.containerHeaderLeft}>Numer gabinetu:</h3>
                    <h1 className={styles.containerHeaderRight}>{roomNumber}</h1>
                </section>
            )
        }
    }
    const [doctorName, setDoctorName] = useState<string>('-');

    const getDoctorName = async () => {
        const fetchedDoctor = await axios.get(`${BASE_URL}/doctor/get/${doctorId}`)
        console.log(fetchedDoctor.data.doctor.firstname)
        setDoctorName(`${fetchedDoctor.data.doctor.firstname} ${fetchedDoctor.data.doctor.lastname}`);
    }

    useEffect(() => {
        getDoctorName();
    }, [])

    return (
        <div className={styles.containerHeader}>
            <section className={styles.containerHeaderSection}>
                <h3 className={styles.containerHeaderLeft}>Zalogowano jako:</h3>
                <h1 className={styles.containerHeaderRight}>{doctorName}</h1>
            </section>
            {renderSelectedRoomPart()}
        </div>
    )
}

interface RoomSelectionProps {
    roomNumber: number | undefined;
    setRoomNumber: (roomNumber: number | undefined) => void;
    setRoomSelected: (roomSelected: boolean) => void;
    error: boolean;
    setError: (error: boolean) => void;
    setLoading: (loading: boolean) => void;
    setQueId: (queId: string | undefined) => void;
}

function RoomSelectionView({ roomNumber, setRoomNumber, setRoomSelected, error, setError, setLoading, setQueId }: RoomSelectionProps) {

    const handleChange = (value: string) => {
        setRoomNumber(parseInt(value));
        setError(false);
        localStorage.setItem('roomNumber', value);
    }

    const startTakingPatients = async () => {
        if (roomNumber) {
            setLoading(true);
            setRoomSelected(true);
            localStorage.setItem('roomSelected', 'true');

            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: token! }
            }
            const createQuePayload = {
                doctorId: doctorId,
                roomNumber: roomNumber
            }
            try {
                const createdQue = await axios.post(`${BASE_URL}/que/create`, createQuePayload, config);
                const createdQueId = createdQue.data.que._id;
                setQueId(createdQueId);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        } else {
            setError(true);
        }
    }

    return (
        <div className={styles.roomSelectionContainer}>
            <label className={styles.roomSelectionLabel} htmlFor="room">Numer gabinetu</label>
            <div className={styles.selectWrapper}>
                <select className={styles.roomSelection} defaultValue={"null"} name="room" id="room" onChange={e => handleChange(e.target.value)}>
                    <option value="null" disabled>Wybierz numer gabinetu</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <button className={styles.startTakingPatientsButton} type="submit" onClick={startTakingPatients}>ROZPOCZNIJ PRZYJMOWANIE</button>
            {error ? <p className={styles.errorMessage}>Wybierz numer gabinetu !</p> : <></>}
        </div>
    )
}

interface TakingPatientsProps {
    setRoomNumber: (roomNumber: number | undefined) => void;
    setRoomSelected: (roomSelected: boolean) => void;
    setLoading: (loading: boolean) => void;
    queId: string | undefined;
    setQueId: (queId: string | undefined) => void;
}


function TakingPatientsView({ setRoomNumber, setRoomSelected, setLoading, queId, setQueId }: TakingPatientsProps) {


    const finishTakingPatients = async () => {
        setLoading(true);
        localStorage.removeItem('roomNumber');
        localStorage.removeItem('roomSelected');
        setRoomNumber(undefined);
        setRoomSelected(false);
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: token! }
        }
        try {
            await axios.delete(`${BASE_URL}/que/delete/${queId}`, config)
            setQueId(undefined);
            setLoading(false);
        } catch (error) {
            setQueId(undefined);
            setLoading(false);
        }
    }

    return (
        <div className={styles.takingPanel}>
            <div className={styles.queContainer}>
                <h2 className={styles.queTitle}>Kolejka</h2>
                <div className={styles.ticketsContainer}>
                    <div className={styles.singleTicket}>
                        <div className={styles.ticketNumber}>A1</div>
                        <div className={styles.visitTime}>10:30</div>
                    </div>
                    <div className={styles.singleTicket}>
                        <div className={styles.ticketNumber}>A2</div>
                        <div className={styles.visitTime}>11:30</div>
                    </div>
                    <div className={styles.singleTicket}>
                        <div className={styles.ticketNumber}>A3</div>
                        <div className={styles.visitTime}>12:30</div>
                    </div>
                    <div className={styles.singleTicket}>
                        <div className={styles.ticketNumber}>A4</div>
                        <div className={styles.visitTime}>13:30</div>
                    </div>
                    <div className={styles.singleTicket}>
                        <div className={styles.ticketNumber}>A5</div>
                        <div className={styles.visitTime}>14:30</div>
                    </div>
                </div>
            </div>
            <div className={styles.panelControlsContainer}>
                <h2 className={styles.currentTicketInfo}>Aktualnie w gabinecie</h2>
                <h1 className={styles.currentTicketValue}>B11</h1>
                <div className={styles.buttonsContainer}>
                    <button className={`${styles.controlPanelButton} ${styles.buttonEndCurrentVisit}`}>ZAKOŃCZ</button>
                    <button className={`${styles.controlPanelButton} ${styles.buttonTakeInNext}`}>PRZYJMIJ</button>
                    <button className={`${styles.controlPanelButton} ${styles.buttonFinishTakingIn}`} onClick={finishTakingPatients}>ZAKOŃCZ PRZYJMOWANIE</button>
                </div>
            </div>
        </div>
    )
}

interface ContentProps {
    roomNumber: number | undefined;
    setRoomNumber: (roomNumber: number | undefined) => void;
    roomSelected: boolean;
    setRoomSelected: (roomSelected: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: boolean;
    setError: (error: boolean) => void;
}

function Content({ roomNumber, setRoomNumber, roomSelected, setRoomSelected, error, setError, loading, setLoading }: ContentProps) {
    const [queId, setQueId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const globalRoomSelected = localStorage.getItem('roomSelected');
        const globalRoomNumber = localStorage.getItem('roomNumber');

        if (globalRoomNumber !== null && globalRoomSelected !== null) {
            setRoomNumber(parseInt(globalRoomNumber))
            setRoomSelected(globalRoomSelected === 'true' ? true : false)
        }
    }, [])

    return (
        <main className={styles.content}>
            <div className={styles.mainContainer}>
                <ContainerHeader roomNumber={roomNumber} roomSelected={roomSelected} />
                {roomNumber && roomSelected ?
                    <TakingPatientsView
                        setRoomNumber={setRoomNumber}
                        setRoomSelected={setRoomSelected}
                        setLoading={setLoading}
                        queId={queId}
                        setQueId={setQueId} /> :
                    <RoomSelectionView
                        setRoomNumber={setRoomNumber}
                        roomNumber={roomNumber}
                        setRoomSelected={setRoomSelected}
                        error={error}
                        setError={setError}
                        setLoading={setLoading}
                        setQueId={setQueId} />
                }
            </div>
            {loading ? <img src={spinnerImg} alt="" className={styles.spinner} /> : <></>}
        </main>
    )
}

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer>
            <p className={styles.footer}>System rejestracji i kolejkowania | {year}</p>
        </footer>
    )

}

export default function DoctorPanel() {
    const [roomNumber, setRoomNumber] = useState<number | undefined>(undefined);
    const [roomSelected, setRoomSelected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    return (
        <div className={styles.page}>
            <Header
                setRoomNumber={setRoomNumber}
                roomSelected={roomSelected}
                setRoomSelected={setRoomSelected} />
            <Content
                roomNumber={roomNumber}
                setRoomNumber={setRoomNumber}
                roomSelected={roomSelected}
                setRoomSelected={setRoomSelected}
                error={error}
                setError={setError}
                loading={loading}
                setLoading={setLoading} />
            <Footer />
        </div>
    )
}