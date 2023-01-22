import Clock from '../../Components/Clock';
import { useEffect, useState } from 'react';
import styles from './MainDisplay.module.css';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

// =========================================================================
// WAITING CONTAINER
// =========================================================================
interface WaitingProps {
	waitingTickets: any;
}

function Waiting({ waitingTickets }: WaitingProps) {
	const toRender = () => {
		if (waitingTickets.length) {
			return waitingTickets.map((ticket: { visitCode: string }, i: number) => {
				return (
					<div className={styles.waitingTicket} key={i}>
						{ticket.visitCode}
					</div>
				);
			});
		} else {
			return <h3>-</h3>;
		}
	};

	return <div className={`${styles.waitingTicketsContainer} ${styles.ticketContainer}`}>{toRender()}</div>;
}

// =========================================================================
// IN ROOMS CONTAINER
// =========================================================================
interface inRoomProps {
	inRoomTickets: any;
}

const limit = 7;

function InRooms({ inRoomTickets }: inRoomProps) {
	const toRender = () => {
		if (inRoomTickets.length) {
			return inRoomTickets.map((ticket: { visitCode: string; roomNumber: number }, i: number) => {
				return (
					<div className={i === 0 ? `${styles.inRoomTicket} ${styles.blinking}` : styles.inRoomTicket} key={i}>
						<p className={styles.ticketTextBig}>{ticket.visitCode}</p>
						<p className={styles.ticketTextSmall}>
							{inRoomTickets.length < limit ? 'gabinet' : inRoomTickets.length < limit * 2 ? 'gab.' : '-'}
						</p>
						<p className={styles.ticketTextBig}>{ticket.roomNumber}</p>
					</div>
				);
			});
		} else {
			return <h3>-</h3>;
		}
	};

	return (
		<div
			className={`${
				inRoomTickets.length < limit
					? styles.inRoomTicketsContainerQ1
					: inRoomTickets.length < limit * 2
					? styles.inRoomTicketsContainerQ2
					: styles.inRoomTicketsContainerQ3
			} ${styles.ticketContainer}`}
		>
			{toRender()}
		</div>
	);
}

function Separator() {
	return <div className={styles.seperator}></div>;
}

// =========================================================================
// CONTENT
// =========================================================================
export default function MainDisplay() {
	const axiosPrivate = useAxiosPrivate();
	const [tickets, setTickets] = useState([]);
	const [listening, setListening] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!listening) {
			const events = new EventSource('http://localhost:3000/ticket/events');
			events.onmessage = async () => {
				try {
					const response = await axiosPrivate.get('/ticket/get');
					setTickets(response.data.ticket);
				} catch (err) {
					console.log('location');
					navigate('/login-panel', { state: { from: location }, replace: true });
				}
			};
			setListening(true);
		}
	}, [listening, tickets, location, navigate]);

	const ticketsWaiting = tickets.filter((ticket: { inRoom: boolean }) => {
		return ticket.inRoom === false;
	});

	const ticketsInRoom = tickets
		.filter((ticket: { inRoom: boolean }) => {
			return ticket.inRoom === true;
		})
		.reverse();

	return (
		<div className={styles.page}>
			<header className={styles.displayHeader}>
				<h2 style={{ flex: '1', textAlign: 'center' }}>W KOLEJCE</h2>
				<Clock style={{ flex: '1', textAlign: 'center' }} />
				<h2 style={{ flex: '1', textAlign: 'center' }}>OBSŁUGIWANY</h2>
			</header>
			<main className={styles.contentContainer}>
				<Waiting waitingTickets={ticketsWaiting} />
				<Separator />
				<InRooms inRoomTickets={ticketsInRoom} />
			</main>
		</div>
	);
}
