import { useEffect } from 'react';
import styles from './RoomSelectionView.module.css';
import axiosRoom from '../../APIs/Room';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';
import { axiosPrivate } from '../../APIs/Axios';

interface RoomSelectionProps {
	roomNumber: number | undefined;
	setRoomNumber: (roomNumber: number | undefined) => void;
	setRoomSelected: (roomSelected: boolean) => void;
	error: boolean;
	setError: (error: boolean) => void;
	setLoading: (loading: boolean) => void;
	setQueId: (queId: string | undefined) => void;
}

export default function RoomSelectionView({ roomNumber, setRoomNumber, setRoomSelected, error, setError, setLoading, setQueId }: RoomSelectionProps) {
	const doctorId = localStorage.getItem('doctorId');
	const handleChange = (value: string) => {
		setRoomNumber(parseInt(value));
		setError(false);
		localStorage.setItem('roomNumber', value);
	};

	const startTakingPatients = async () => {
		if (roomNumber) {
			setLoading(true);
			setRoomSelected(true);
			localStorage.setItem('roomSelected', 'true');

			const createQuePayload = {
				doctorId: doctorId,
				roomNumber: roomNumber
			};
			try {
				const createdQue = await axiosPrivate.post(`/que/create`, createQuePayload);
				const createdQueId = createdQue.data.que._id;
				localStorage.setItem('queId', createdQueId);
				setQueId(createdQueId);

				const updateRoomPayload = {
					available: false,
					occupiedBy: doctorId
				};
				await axiosPrivate.patch(`/room/update?roomNumber=${roomNumber}`, updateRoomPayload);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		} else {
			setError(true);
		}
	};

	// @ts-ignore
	const [roomsObj, errorAxios, loadingAxios, axiosFetch]: [any, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

	const getData = () => {
		axiosFetch({
			method: 'GET',
			url: 'room/get',
			requestConfig: {}
		});
	};

	useEffect(() => {
		getData();
	}, []);

	const rooms: any = roomsObj.rooms;

	const toRender = () => {
		if (loadingAxios) {
			return (
				<option value="null" disabled>
					Ładowanie...
				</option>
			);
		} else if (!loadingAxios && errorAxios) {
			return (
				<option value="null" disabled>
					Wystąpił błąd.
				</option>
			);
		} else if (!loadingAxios && !errorAxios && rooms?.length) {
			return rooms.map((room: any, i: number) => {
				return (
					<option value={room.roomNumber} key={i} disabled={room.available ? false : true}>
						{room.roomNumber}
						{room.available ? '' : '  (Niedostępny)'}
					</option>
				);
			});
		} else
			return (
				<option value="null" disabled>
					Brak wyników.
				</option>
			);
	};
	const roomsJSX = toRender();

	return (
		<div className={styles.roomSelectionContainer}>
			<label className={styles.roomSelectionLabel} htmlFor="room">
				Numer gabinetu
			</label>
			<div className={styles.selectWrapper}>
				<select className={styles.roomSelection} defaultValue={'null'} name="room" id="room" onChange={(e) => handleChange(e.target.value)}>
					<option value="null" disabled>
						Wybierz numer gabinetu
					</option>
					{roomsJSX}
				</select>
			</div>
			<button className={styles.startTakingPatientsButton} disabled={!doctorId ? true : false} type="submit" onClick={startTakingPatients}>
				ROZPOCZNIJ PRZYJMOWANIE
			</button>
			{error ? <p className={styles.errorMessage}>Wybierz numer gabinetu !</p> : <></>}
			{!doctorId ? <p className={styles.errorMessage}>Nie jesteś zalogowany jako lekarz !</p> : <></>}
		</div>
	);
}
