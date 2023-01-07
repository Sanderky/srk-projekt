import { useEffect } from 'react';
import styles from './RoomSelectionView.module.css';
import axios from 'axios';
import axiosRoom from '../../APIs/Room';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { axiosPrivate } from '../../APIs/Axios';
const doctorId = '63b2258dbb4dc4efaf5b60b3';
const BASE_URL = 'http://localhost:3000';

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

			const token = localStorage.getItem('token');
			const config = {
				headers: { Authorization: token! }
			};
			const createQuePayload = {
				doctorId: doctorId,
				roomNumber: roomNumber
			};
			try {
				const createdQue = await axiosPrivate.post(`/que/create`, createQuePayload);
				const createdQueId = createdQue.data.que._id;
				setQueId(createdQueId);

				const updateRoomPayload = {
					available: false,
					occupiedBy: doctorId
				};
				await axiosPrivate.patch(`/room/update?roomNumber=${roomNumber}`, updateRoomPayload);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		} else {
			setError(true);
		}
	};

	// @ts-ignore
	const [roomsObj, errorAxios, loadingAxios, axiosFetch]: [{}, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

	const getData = () => {
		axiosFetch({
			axiosInstance: axiosRoom,
			method: 'GET',
			url: '/get',
			requestConfig: {}
		});
	};

	useEffect(() => {
		getData();
	}, []);

	// @ts-ignore
	const rooms: [] = roomsObj.rooms;

	const toRender = () => {
		if (loadingAxios) {
			return (
				<option value="null" disabled>
					Ładowanie
				</option>
			);
		} else if (!loadingAxios && errorAxios) {
			return (
				<option value="null" disabled>
					Wystąpił bład.
				</option>
			);
		} else if (!loadingAxios && !errorAxios && rooms?.length) {
			return rooms.map((room, i) => {
				return (
					// @ts-ignore
					<option value={room.roomNumber} key={i} disabled={room.available ? null : true}>
						{/* @ts-ignore */}
						{room.roomNumber}
						{/* @ts-ignore */}
						{room.available ? null : '  (Niedostępny)'}
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
			<button className={styles.startTakingPatientsButton} type="submit" onClick={startTakingPatients}>
				ROZPOCZNIJ PRZYJMOWANIE
			</button>
			{error ? <p className={styles.errorMessage}>Wybierz numer gabinetu !</p> : <></>}
		</div>
	);
}
