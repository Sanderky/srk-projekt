import styles from "./TimeSlots.module.css";
import React, { useEffect } from "react";
import axios from "../../APIs/Slots";
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';

interface SingleSlotProps {
    time: string;
    available: boolean;
    id: string;
    setSelected: (doctor: string) => void;
}

const SingleSlot = ({ time, available, id, setSelected }: SingleSlotProps) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const slotButton: HTMLButtonElement = event.currentTarget;
        if (available) {
            setSelected(time);
        }
    }

    return (
        <button type='button' className={`${styles.slotBox} ${available ? styles.slotAvail : styles.slotNotAvail}`} onClick={handleClick} name={time}>
            {time}
        </button>
    );
}

interface TimeSlotsProps {
    doctor: string | undefined;
    date: string | undefined;
    selected: string | undefined;
    setSelected: (doctor: string | undefined) => void;
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
            return <p className={styles.specialistNotDataText}>Wystąpił błąd. Proszę odświeżyć stronę.</p>
        } else if (!loading && !error && slots?.length) {
            return slots.map((slot, i) => {
                return <SingleSlot                          // @ts-ignore
                            time={slot?.start}              // @ts-ignore
                            available={slot?.availability}  // @ts-ignore
                            key={i} id={slot?._id} 
                            setSelected={setSelected} />
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