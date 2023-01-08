import styles from './TakingPatientsView.module.css';
import axios from 'axios';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
const BASE_URL = 'http://localhost:3000';

interface TakingPatientsProps {
	setRoomNumber: (roomNumber: number | undefined) => void;
	setRoomSelected: (roomSelected: boolean) => void;
	setLoading: (loading: boolean) => void;
	queId: string | undefined;
	setQueId: (queId: string | undefined) => void;
	roomNumber: number;
}

export default function TakingPatientsView({ setRoomNumber, setRoomSelected, setLoading, queId, setQueId, roomNumber }: TakingPatientsProps) {
	const axiosPrivate = useAxiosPrivate();
	const finishTakingPatients = async () => {
		setLoading(true);
		try {
			await axiosPrivate.delete(`/que/delete/${queId}`);
			setQueId(undefined);
			const updateRoomPayload = {
				available: true,
				occupiedBy: null
			};
			await axiosPrivate.patch(`/room/update?roomNumber=${roomNumber}`, updateRoomPayload);
			localStorage.removeItem('roomNumber');
			localStorage.removeItem('roomSelected');
			localStorage.removeItem('queId');
			setRoomNumber(undefined);
			setRoomSelected(false);
			setLoading(false);
		} catch (error) {
			setQueId(undefined);
			setLoading(false);
		}
	};

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
					<button className={`${styles.controlPanelButton} ${styles.buttonFinishTakingIn}`} onClick={finishTakingPatients}>
						ZAKOŃCZ PRZYJMOWANIE
					</button>
				</div>
			</div>
		</div>
	);
}