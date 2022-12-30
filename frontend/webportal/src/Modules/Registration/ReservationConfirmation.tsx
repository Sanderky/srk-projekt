import styles from "./ReservationConfirmation.module.css";
import React, { useEffect, useState, useRef } from "react";
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';
import axiosDoctor from "../../APIs/Doctor";
import axios from 'axios'
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';
import nextArrowActive from '../../Assets/Images/expand_arrow_white.png'
import nextArrowInactive from '../../Assets/Images/expand_arrow_dark.png'
import spinnerImg from "../../Assets/Images/spinner.png"

//interfaces:
interface ReservationDataProps {
    email: string | undefined;
    doctorId: string | undefined;
    date: Date | undefined;
    time: string | undefined;
    createReservation: (    email:string | undefined, 
                            doctorId: string | undefined,
                            date: Date | undefined,
                            time: string | undefined
                    ) => void
}

interface DataSummaryProps {
    doctor: string | undefined;
    doctorId: string | undefined;
    date: Date | undefined;
    time: string | undefined;
    setDoctorId: (doctorId: string | undefined) => void;
    setDoctor: (doctor: string | undefined) => void;
    setDate: (date: Date | undefined) => void;
    setTime: (time: string | undefined) => void;
    setCode: (code: string) => void;
    setSummary: (summary: boolean) => void;
}

//Components:
function DataSummary({doctor, date, time, setDoctorId, setDoctor, setDate, setTime}: DataSummaryProps) {
    const clearSelections = (event: any) => {
        setDoctorId(undefined);
        setDate(undefined);
        setDoctor(undefined);
        setTime(undefined);
    }

    return (
        <div className={styles.dataSummary}>
            <h3>Wybrana wizyta:</h3>
            <div className={styles.summaryData}>
                <p className={styles.summaryText}>
                    {`${doctor}`} <br />
                    {`${format(date!, 'EEEE, dd.MM.yyyy', { locale: pl })} o godzinie ${time}.`}
                </p>
                <button className={styles.clearSelections} onClick={event => clearSelections(event)}>Wyczyść wybory</button>
            </div>
        </div>
    )
}

// Form with email inputs and 
function EmailForm({doctorId, date, time, createReservation}: ReservationDataProps) {
    const email = useRef<HTMLInputElement>(null);
    const confirmEmail = useRef<HTMLInputElement>(null);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isConfirmEmailDirty, setIsConfirmEmailDirty] = useState(false);
    
    const checkEmails = () => {
        setIsConfirmEmailDirty(true);
        if (isConfirmEmailDirty) {
            if (email.current?.value === confirmEmail.current?.value) {
                setShowErrorMessage(false);
            } else {
                setShowErrorMessage(true);
            }
        }
    }

    useEffect(() => {
        if (isConfirmEmailDirty) {
            if (email.current?.value === confirmEmail.current?.value) {
                setShowErrorMessage(false);
            } else {
                setShowErrorMessage(true);
            }
        }
    }, [isConfirmEmailDirty])

    function ifButtonActive() {
        if (email.current?.value !== '' && confirmEmail.current?.value !== '') {
            if (showErrorMessage && isConfirmEmailDirty) {
                return false;
            } else return true;
        } else {
            return false;
        }
    }

    function checkEmailMatch() {
        if (showErrorMessage && isConfirmEmailDirty) {
                return true;
            } else return false;
    }

    return (
        <form className={styles.emailForm}>
            <div className={styles.formPart}>
                <label htmlFor="email">Adres email</label>
                <input  className={styles.emailInput} 
                        type="text" 
                        id="email" 
                        name="email" 
                        ref={email}/>
            </div>
            <div className={styles.formPart}>
                <label htmlFor="confirmEmail">Potwierdź adres email</label>
                <input  className={checkEmailMatch() ? `${styles.wrongEmailInput} ${styles.emailInput}` : styles.emailInput} 
                        type="text" id="confirmEmail" 
                        name="confirmEmail" 
                        ref={confirmEmail} 
                        onChange={checkEmails}/>
            </div>
            {checkEmailMatch() ? <div className={styles.emailError}>Adresy się nie pokrywają!</div> : ''}
            <button className={ifButtonActive() ? styles.createReservationButton : styles.createReservationButtonInactive} 
                    type="button" onClick={event => createReservation(email.current?.value, doctorId, date, time)} 
                    disabled={ifButtonActive() ? false : true}>
                <p>Umów wizytę</p>
                <img className={styles.nextArrow} src={ifButtonActive() ? nextArrowActive : nextArrowInactive } alt=">" />
            </button>
        </form>
    )
}  

export default function ReservationConfirmation({ doctorId, date, time, setDoctor, setDoctorId, setDate, setTime, setCode, setSummary }: DataSummaryProps) {
    const BASE_URL = 'http://localhost:3000'
    const [loading, setLoading] = useState<boolean>(false);

    const createReservation = async (email: string | undefined, doctorId: string | undefined, date: Date | undefined, time: string | undefined ) => {
        setLoading(true)
        const dateUTC = new Date(Date.UTC(date!.getUTCFullYear(), date!.getUTCMonth(), date!.getUTCDate() + 1, 0, 0, 0, 0)).toISOString();
        const reservationPayload = {
            email: email,
            doctorId: doctorId,
            day: dateUTC,
            time: time,
        }
        const reservationData = await axios.post(`${BASE_URL}/reservation/create/`, reservationPayload);
        setCode(reservationData.data.reservation.reservationCode);
        setSummary(true);
        setLoading(false);
    }

    // Fetch doctor do display in a summary view (displays full name and specialization)
    // @ts-ignore
    const [doctorObj, errorDoctor, loadingDoctor, axiosFetchDoctor]: [{}, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

    const getDoctor = () => {
        axiosFetchDoctor({
            axiosInstance: axiosDoctor,
            method: 'GET',
            url: `/get/${doctorId}`,
            requestConfig: {}
        });
    }

    useEffect(() => {
        getDoctor();
    }, [doctorId, date, time])

    // @ts-ignore
    const doctorFetched = doctorObj.doctor

    const toRenderDoctor = () => {
        if (loadingDoctor) {
            return 'Ładowanie...'
        } else if (!loadingDoctor && errorDoctor) {
            return 'Wystąpił błąd.'
        } else if (!loadingDoctor && !errorDoctor) {
            //@ts-ignore
            return `${doctorFetched?.firstname} ${doctorFetched?.lastname}, ${doctorFetched?.specialization}`
        } else return 'Brak wyników.'
    }
    const doctorToRender = toRenderDoctor() as string;

    return (
        <div className={styles.reservationConfirmation}>
            <DataSummary 
                doctor={doctorToRender} 
                doctorId={doctorId} 
                date={date} 
                time={time} 
                setDoctor={setDoctor} 
                setDoctorId={setDoctorId} 
                setDate={setDate} 
                setTime={setTime}
                setCode={setCode} 
                setSummary={setSummary} />
            <EmailForm
                doctorId={doctorId}
                date={date}
                time={time}
                email={undefined}
                createReservation={createReservation}/>
            <img src={spinnerImg} alt="ładowanie..." className={loading ? styles.spinnerActive : styles.spinnerDisabled} />
        </div>
    )
}
