import styles from './TimeSlots.module.css';
import React, { useEffect } from 'react';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';

interface SingleSlotProps {
	time: string;
	available: boolean;
	id: string;
	setSelected: (doctor: string) => void;
}

const SingleSlot = ({ time, available, setSelected }: SingleSlotProps) => {
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (available) {
			setSelected(time);
		}
	};

	return (
		<button type="button" className={`${styles.slotBox} ${available ? styles.slotAvail : styles.slotNotAvail}`} onClick={handleClick} name={time}>
			{time}
		</button>
	);
};

interface TimeSlotsProps {
	doctor: string | undefined;
	date: string | undefined;
	selected: string | undefined;
	setSelected: (doctor: string | undefined) => void;
}

export default function TimeSlots({ doctor, date, selected, setSelected }: TimeSlotsProps) {
	// @ts-ignore
	const [slotsObj, error, loading, axiosFetch]: [any, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

	useEffect(() => {
		if (doctor && date) {
			axiosFetch({
				method: 'GET',
				url: `slots/get/${doctor}?date=${date}`,
				requestConfig: {}
			});
			setSelected(undefined);
		}
		// eslint-disable-next-line
	}, [doctor, date]);

	let slots: any;
	if (slotsObj.length === 0) {
		<p className={styles.specialistNotDataText}>Brak wyników.</p>;
	} else {
		slots = slotsObj.slots.slots;
	}

	const toRender = () => {
		if (loading) {
			return <p className={styles.specialistNotDataText}>Ładowanie...</p>;
		} else if (!loading && error) {
			return <p className={styles.specialistNotDataText}>Wystąpił błąd. Proszę odświeżyć stronę.</p>;
		} else if (!loading && !error && slots?.length) {
			return slots.map((slot: any, i: number) => {
				return <SingleSlot time={slot?.start} available={slot?.availability} key={i} id={slot?._id} setSelected={setSelected} />;
			});
		} else return <p className={styles.specialistNotDataText}>Brak wyników.</p>;
	};
	const slotsJSX = toRender();

	return <div className={styles.slotList}>{slotsJSX}</div>;
}
