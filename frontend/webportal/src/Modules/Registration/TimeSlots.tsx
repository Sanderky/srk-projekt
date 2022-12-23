import styles from "./TimeSlots.module.css";
import React, { useEffect } from "react";
import axios from "../../APIs/Slots";
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';

interface SingleSlotProps {
    time: string;
    available: boolean;
    id: string;
    setSelected: (doctorId: string) => void;
}

const SingleSlot = ({ time, available, id, setSelected }: SingleSlotProps) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const doctorButton: HTMLButtonElement = event.currentTarget;
        if (available) {
            setSelected(doctorButton.name);
        }
    }

    return (
        <button type='button' className={`${styles.slotBox} ${available ? styles.slotAvail : styles.slotNotAvail}`} onClick={handleClick} name={id}>
            {time}
        </button>
    );
}

interface TimeSlotsProps {
    doctor: string | undefined;
    date: string | undefined;
    selected: string | undefined;
    setSelected: any
}

export default function TimeSlots({ doctor, date, selected, setSelected }: TimeSlotsProps) {
    // @ts-ignore
    const [slotsObj, error, loading, axiosFetch]: [{}, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

    const getData = () => {
        axiosFetch({
            axiosInstance: axios,
            method: 'GET',
            url: `/get/${doctor}?date=${date}`,
            requestConfig: {}
        });
    }

    useEffect(() => {
        if (doctor && date) {
            getData();
        }
    }, [doctor, date])

    // @ts-ignore
    // console.log(slotsObj.slots.slots)

    let slots: [];
    // @ts-ignore
    if (slotsObj.length === 0) {
        <p className={styles.specialistNotDataText}>Brak wyników.</p>
    } else {
        // @ts-ignore
        slots = slotsObj.slots.slots
    }

    const toRender = () => {
        if (loading) {
            return <p className={styles.specialistNotDataText}>Ładowanie...</p>
        } else if (!loading && error) {
            console.log(error)
            return <p className={styles.specialistNotDataText}>Wystąpił błąd.</p>
        } else if (!loading && !error && slots?.length) {
            return slots.map((slot, i) => {
                // @ts-ignore
                return <SingleSlot time={slot?.start} available={slot?.availability} key={i} id={slot?._id} selected={selected} setSelected={setSelected} />
            })
        } else return <p className={styles.specialistNotDataText}>Brak wyników.</p>
    }
    const slotsJSX = toRender()

    return (
        <div className={styles.slotList}>
            {slotsJSX}
        </div>
    );
}