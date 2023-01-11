import styles from './TakingPatientsView.module.css';
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import spinnerImg from '../../Assets/Images/spinner.png';
import axiosQue from '../../APIs/Que';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';

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
	const [ticketInRoom, setTicketInRoom] = useState<string | undefined>();
	const [state, setState] = useState<boolean>(true);

	const [activeTickets, setActiveTickets] = useState([]);
	const [listening, setListening] = useState(false);
	// =========================================================================
	// QUE Handling
	// =========================================================================
	const queIdToFetch = !queId ? localStorage.getItem('queId') : queId;

	useEffect(() => {
		if (!listening) {
			const events = new EventSource('http://localhost:3000/que/events');
			events.onmessage = async (event) => {
				try {
					const response = await axiosPrivate.get(`/que/get/${queIdToFetch}`);
					setActiveTickets(response.data.que.activeTickets);
				} catch (err) {
					console.log(err)
				}
			};
			setListening(true);
		}
		const savedTicketInRoom = localStorage.getItem('ticketInRoom');
		if (savedTicketInRoom) {
			setTicketInRoom(savedTicketInRoom);
		}
	}, [listening, activeTickets]);

	// =========================================================================
	// QUE Rendering
	// =========================================================================
	const queLimit = 5;
	const toRender = () => {
		if (activeTickets?.length) {
			if (activeTickets.length > queLimit) {
				// activeTickets = activeTickets.slice(0, queLimit);
			}
			return activeTickets.map((ticket: { visitCode: string; visitTime: string }, i: number) => {
				return (
					<div className={styles.singleTicket} id={i.toString()}>
						<div className={i === 0 && ticketInRoom ? `${styles.ticketNumber} ${styles.ticketNumberFirst}` : styles.ticketNumber}>
							{ticket?.visitCode}
						</div>
						<div className={styles.visitTime}>{ticket?.visitTime}</div>
					</div>
				);
			});
		} else return <h4>Brak aktywnych biletów</h4>;
	};

	const queJSX = toRender();

	// =========================================================================
	// Panel Controls
	// =========================================================================
	const startVisit = async () => {
		setLoading(true);
		try {
			if (activeTickets.length) {
				const nextInQue: any = activeTickets[0];
				const inRoomTicketId = nextInQue?._id;
				const updateTicketPayload = {
					inRoom: true
				};
				await axiosPrivate.patch(`/ticket/update/${inRoomTicketId}`, updateTicketPayload);
				setTicketInRoom(nextInQue?.visitCode);
				localStorage.setItem('ticketInRoom', nextInQue?.visitCode);
				setLoading(false);
			} else {
				setState((prev) => !prev);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
		}
	};

	const finishVisit = async () => {
		setLoading(true);
		try {
			const ticketId = await axiosPrivate.patch(`/que/shift/${queIdToFetch}`);
		} catch (error) {
			setLoading(false);
		}
		localStorage.removeItem('ticketInRoom');
		setTicketInRoom(undefined);
		setLoading(false);
	};

	const finishTakingPatients = async () => {
		setLoading(true);
		try {
			await axiosPrivate.delete(`/que/delete/${queId}`);
			const updateRoomPayload = {
				available: true,
				occupiedBy: null
			};
			await axiosPrivate.patch(`/room/update?roomNumber=${roomNumber}`, updateRoomPayload);
			setRoomNumber(undefined);
			setRoomSelected(false);
			setQueId(undefined);
			localStorage.removeItem('roomNumber');
			localStorage.removeItem('roomSelected');
			localStorage.removeItem('queId');
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
				<div className={styles.ticketsContainer}>{queJSX}</div>
			</div>
			<div className={styles.panelControlsContainer}>
				<h2 className={styles.currentTicketInfo}>Aktualnie w gabinecie</h2>
				<h1 className={styles.currentTicketValue}>{ticketInRoom ? ticketInRoom : '-'}</h1>
				<div className={styles.buttonsContainer}>
					<button className={`${styles.controlPanelButton} ${styles.buttonEndCurrentVisit}`} onClick={finishVisit}>
						ZAKOŃCZ
					</button>
					<button className={`${styles.controlPanelButton} ${styles.buttonTakeInNext}`} onClick={startVisit}>
						PRZYJMIJ
					</button>
					<button className={`${styles.controlPanelButton} ${styles.buttonFinishTakingIn}`} onClick={finishTakingPatients}>
						ZAKOŃCZ PRZYJMOWANIE
					</button>
				</div>
			</div>
		</div>
	);
}
