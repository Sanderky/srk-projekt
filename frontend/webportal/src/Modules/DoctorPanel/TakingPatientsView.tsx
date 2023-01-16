import styles from './TakingPatientsView.module.css';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { BASE_URL } from '../../config/settings';

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
	const [activeTickets, setActiveTickets] = useState([]);
	const [listening, setListening] = useState(false);
	// =========================================================================
	// QUE Handling
	// =========================================================================

	useEffect(() => {
		const savedQueId = localStorage.getItem('queId');
		if (savedQueId) {
			setQueId(savedQueId);
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (queId) {
			if (!listening) {
				const events = new EventSource(`${BASE_URL}/que/events`);
				events.onmessage = async () => {
					try {
						const response = await axiosPrivate.get(`/que/get/${queId}`);
						setActiveTickets(response.data.que.activeTickets);
					} catch (err: any) {
						console.log(err);
					}
				};
				setListening(true);
			}
		}
	}, [listening, activeTickets, queId]);

	// =========================================================================
	// QUE Rendering
	// =========================================================================
	const queLimit = 5;
	const toRender = () => {
		if (activeTickets?.length) {
			if (activeTickets.length > queLimit) {
				setActiveTickets(activeTickets.slice(0, queLimit));
			}
			return activeTickets.map((ticket: { visitCode: string; visitTime: string }, i: number) => {
				return (
					<div className={styles.singleTicket} key={i}>
						<div
							className={i === 0 && ticketInRoom ? `${styles.ticketNumber} ${styles.ticketNumberFirst}` : styles.ticketNumber}
							id={`${i}C`}
						>
							{ticket?.visitCode}
						</div>
						<div className={styles.visitTime} id={`${i}T`}>
							{ticket?.visitTime}
						</div>
					</div>
				);
			});
		} else return <h4 id={'F'}>Brak aktywnych biletów</h4>;
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
				localStorage.setItem('ticketInRoom', nextInQue?.visitCode);
				setTicketInRoom(nextInQue?.visitCode);
			} else {
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const finishVisit = async () => {
		setLoading(true);
		try {
			const ticket = await axiosPrivate.patch(`/que/shift/${queId}`);
			const ticketId = ticket.data.shiftedTicket;
			await axiosPrivate.delete(`/ticket/delete/${ticketId}`);
			localStorage.removeItem('ticketInRoom');
			setTicketInRoom(undefined);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const finishTakingPatients = async () => {
		setLoading(true);
		try {
			if (ticketInRoom) {
				await finishVisit();
			}
			await axiosPrivate.delete(`/que/delete/${queId}`);
			localStorage.removeItem('queId');
			setQueId(undefined);
			const updateRoomPayload = {
				available: true,
				occupiedBy: null
			};
			await axiosPrivate.patch(`/room/update?roomNumber=${roomNumber}`, updateRoomPayload);
			localStorage.removeItem('roomNumber');
			localStorage.removeItem('roomSelected');
			setRoomNumber(undefined);
			setRoomSelected(false);
		} catch (error) {
			console.log(error);
		} finally {
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
					<button
						className={`${styles.controlPanelButton} ${styles.buttonEndCurrentVisit}`}
						onClick={finishVisit}
						disabled={!ticketInRoom ? true : false}
					>
						ZAKOŃCZ
					</button>
					<button
						className={`${styles.controlPanelButton} ${styles.buttonTakeInNext}`}
						onClick={startVisit}
						disabled={ticketInRoom ? true : false}
					>
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
