import styles from './CentralBox.module.css';
import spinnerImg from '../../Assets/Images/spinner.png';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import useIdle from '../../Hooks/useIdleTimer';
import { useReducer, useRef, useEffect } from 'react';

interface SuccessDataProps {
	label: string;
	data: string | number;
	color?: string;
}

interface TicketPayload {
	queId: string;
	visitTime: string;
	reservationCode: string;
	roomNumber: number;
}

const ConfirmationData = ({ label, data, color = 'var(--subText)' }: SuccessDataProps): JSX.Element => {
	return (
		<div className={styles.ConfirmationDataContainer}>
			<div className={styles.ConfirmationDataLabel}>{label}</div>
			<div className={styles.ConfirmationDataLabel} style={{ color: color }}>
				{data}
			</div>
		</div>
	);
};

const defaultState = {
	panelStatus: 'enterInformation',
	time: '-',
	roomNumber: null,
	visitCode: '-',
	queIndex: null,
	loading: false
};

const ACTION = {
	default: 'defaultState',
	loading: 'loading',
	loadingFinished: 'loadingFinished',
	wrongCode: 'wrongCode',
	tooFast: 'tooFast',
	tooLate: 'tooLate',
	duplicate: 'duplicate',
	confirmed: 'confirmed',
	noQue: 'noQue'
};

function reducer(state: any, action: any) {
	switch (action.type) {
		case 'defaultState':
			return defaultState;
		case 'loading':
			return { ...state, loading: true };
		case 'loadingFinished':
			return { ...state, loading: false };
		case 'wrongCode':
			return { ...state, loading: false, panelStatus: 'wrongCode' };
		case 'tooFast':
			return { ...state, loading: false, panelStatus: 'tooFast' };
		case 'tooLate':
			return { ...state, loading: false, panelStatus: 'tooLate' };
		case 'noQue':
			return { ...state, loading: false, panelStatus: 'noQue' };
		case 'duplicate':
			return {
				...state,
				loading: false,
				panelStatus: 'duplicate',
				roomNumber: action.roomNumber,
				visitCode: action.visitCode,
				queIndex: action.queIndex
			};
		case 'confirmed':
			return {
				...state,
				loading: false,
				panelStatus: action.panelStatus,
				roomNumber: action.roomNumber,
				visitCode: action.visitCode,
				visitTime: action.visitTime,
				queIndex: action.queIndex
			};
	}
}

const CentralBox = () => {
	const [state, dispatch] = useReducer(reducer, defaultState);
	const codeInputRef = useRef<HTMLInputElement>(null);

	const axiosPrivate = useAxiosPrivate();
	const backToLogin = () => {
		dispatch({ type: ACTION.default });
	};

	// =========================================================================
	// CONFIRMATION Handling
	// =========================================================================
	const confirmReservation = async (e: any) => {
		dispatch({ type: ACTION.loading });
		e.preventDefault();

		const reservationCode = codeInputRef.current?.value;
		//If no code -> return
		if (!reservationCode) {
			backToLogin();
			return;
		}
		// Fetch reservation with given code
		let reservation;
		try {
			reservation = await axiosPrivate.get(`/reservation/get?reservationCode=${reservationCode}`);
		} catch (error) {
			console.log(error);
			dispatch({ type: ACTION.wrongCode });
			return;
		}
		const reservationData = reservation?.data.reservation;

		// Check if day in the reservation is today
		const nonUTC = new Date();
		const today = new Date(Date.UTC(nonUTC.getUTCFullYear(), nonUTC.getUTCMonth(), nonUTC.getUTCDate(), 0, 0, 0, 0));
		const reservationDay = new Date(reservationData.day);
		if (reservationDay.getTime() > today.getTime()) {
			dispatch({ type: ACTION.tooFast });
			return;
		} else if (reservationDay.getTime() < today.getTime()) {
			dispatch({ type: ACTION.tooLate });
			return;
		}
		// Check whether reservation was already confirmed
		if (reservationData.registered) {
			// If so -> fetch ticket data and current place in the que
			try {
				const ticketData = await axiosPrivate.get(`/ticket/get?reservationCode=${reservationCode}`);
				const ticket = ticketData.data.ticket;

				const queId = ticket.queId;
				const queData = await axiosPrivate.get(`/que/get/${queId}`);
				const que = queData.data.que;

				const queIndex = que.activeTickets.findIndex((t: { _id: any }) => t._id === ticket._id);
				dispatch({ type: ACTION.duplicate, roomNumber: que.roomNumber, visitCode: ticket.visitCode, queIndex: queIndex });
			} catch (error) {
				console.log(error);
			}
		} else {
			//If not -> create new ticket
			try {
				const queParams = new URLSearchParams({ doctorId: reservationData.doctorId._id });
				const que = await axiosPrivate.get(`/que/get?${queParams}`);
				const queData = que.data.que;
				const queId = queData._id;

				const ticketPayload: TicketPayload = {
					queId: queId,
					visitTime: reservationData.time,
					reservationCode: reservationData.reservationCode,
					roomNumber: queData.roomNumber
				};
				const createTicketResponse = await axiosPrivate.post('/ticket/create', ticketPayload);

				const ticket = createTicketResponse.data.ticket;
				const queResponse = createTicketResponse.data.queResponse;
				// Set state and display appropriate panel
				dispatch({
					type: ACTION.confirmed,
					panelStatus: queResponse.lateStatus,
					time: ticket.visitTime,
					roomNumber: queData.roomNumber,
					visitCode: ticket.visitCode,
					visitTime: ticket.visitTime,
					queIndex: queResponse.queIndex
				});
				const reservationPayload = {
					reservationCode: reservationCode
				};
				axiosPrivate.post(`/reservation/login/`, reservationPayload);
			} catch (error) {
				dispatch({ type: ACTION.noQue });
				console.log(error);
			}
		}
	};
	//Return to default screen after idle time
	const { isIdle, getLastActiveTime } = useIdle(backToLogin, 30);
	useEffect(() => {
		console.log(`Last seen activity: ${getLastActiveTime()?.toLocaleTimeString()}. Proceeding to login screen...`);
		// eslint-disable-next-line
	}, [isIdle]);

	// =========================================================================
	// SUB-Components
	// =========================================================================
	const EnterCode = (): JSX.Element => {
		return (
			<div>
				<div className={`${styles.text} ${styles.title}`}>Witaj</div>
				<div className={styles.text}>Podaj swój unikatowy kod rezerwacji</div>
				<form className={styles.form} onSubmit={(e) => confirmReservation(e)}>
					<input
						type="text"
						name="reservationCode"
						placeholder="Unikatowy kod rezerwacji"
						className={styles.input}
						maxLength={8}
						ref={codeInputRef}
						autoComplete={'off'}
					/>
					<button type="submit" className={styles.buttonSend}>
						POTWIERDŹ
					</button>
				</form>
				<img src={spinnerImg} alt="ładowanie..." className={state.loading ? styles.spinnerActive : styles.spinnerDisabled} />
			</div>
		);
	};

	const Success = (): JSX.Element => {
		return (
			<div className={styles.success}>
				<div className={styles.successData}>
					<ConfirmationData label={'Twój numer:'} data={state.visitCode} />
					<ConfirmationData label={'Gabinet:'} data={state.roomNumber} />
					<ConfirmationData label={'Godzina wizyty:'} data={state.visitTime} />
					<ConfirmationData label={'Miejsce w kolejce:'} data={state.queIndex} />
				</div>
				<div className={`${styles.successInfo} ${styles.text}`}>
					Proszę obserwować tablicę wywoławczą i oczekiwać na swoją kolej. <br /> Po wywołaniu można udać się do odpowiedniego gabinetu
				</div>
				<div className={styles.buttonWrapper}>
					<button
						type="submit"
						onClick={() => {
							backToLogin();
						}}
						className={styles.buttonNew}
					>
						Zakończ
					</button>
				</div>
			</div>
		);
	};

	const WrongCode = (): JSX.Element => {
		return (
			<div className={styles.WrongCode}>
				<div className={`${styles.text} ${styles.title}`}>Błędny kod</div>
				<div className={styles.text}>
					Podany kod jest nieprawidłowy <br /> Spróbuj ponownie
				</div>

				<form className={styles.form}>
					<input type="text" className={styles.input} maxLength={10} placeholder="Unikatowy kod rezerwacji" ref={codeInputRef} />
					<button type="submit" className={`${styles.buttonSend} ${styles.buttonError}`} onClick={(e) => confirmReservation(e)}>
						POTWIERDŹ
					</button>
					<button
						type="submit"
						onClick={() => {
							backToLogin();
						}}
						className={styles.buttonNew}
					>
						Powrót
					</button>
				</form>
				<img src={spinnerImg} alt="ładowanie..." className={state.loading ? styles.spinnerActive : styles.spinnerDisabled} />
			</div>
		);
	};

	const NoQue = (): JSX.Element => {
		return (
			<div className={styles.TooFast}>
				<div className={`${styles.text} ${styles.title}`} style={{ marginBottom: '30px' }}>
					Lekarz obecnie nie przyjmuje
				</div>
				<div className={styles.text} style={{ marginBottom: '30px' }}>
					Specjalista, u którego chcesz potwierdzić wizytę obecnie nie prowadzi przyjęć.
				</div>
				<div className={styles.text}>Prosimy spróbować ponownie później.</div>
				<div className={styles.buttonWrapper}>
					<button
						className={styles.buttonNew}
						onClick={() => {
							backToLogin();
						}}
					>
						Powrót
					</button>
				</div>
			</div>
		);
	};

	const Warning = (): JSX.Element => {
		const addZero = (minutes: number): string => (minutes < 10 ? '0' + minutes : minutes.toString());
		const today = new Date();
		const confirmationTime = today.getHours() + ':' + addZero(today.getMinutes());

		return (
			<div className={styles.success}>
				<div className={styles.text} style={{ marginBottom: '30px' }}>
					Rejestracja potwierdzona z opóźnieniem <br />
					Kolejność przyjęcia mogła ulec zmianie
				</div>
				<div className={styles.successData}>
					<ConfirmationData label={'Twój numer:'} data={state.visitCode} />
					<ConfirmationData label={'Gabinet:'} data={state.roomNumber} />
					<ConfirmationData label={'Miejsce w kolejce:'} data={state.queIndex} />
					<ConfirmationData label={'Godzina wizyty:'} data={state.visitTime} />
					<ConfirmationData label={'Godzina potwierdzenia:'} data={confirmationTime} color={'var(--yellow)'} />
				</div>
				<div className={styles.buttonWrapper}>
					<button
						className={styles.buttonNew}
						onClick={() => {
							backToLogin();
						}}
					>
						Powrót
					</button>
				</div>
			</div>
		);
	};

	const Duplicate = (): JSX.Element => {
		return (
			<div className={styles.success}>
				<div className={styles.text} style={{ marginBottom: '30px' }}>
					Rezerwacja została już potwierdzona
				</div>
				<div className={styles.successData}>
					<ConfirmationData label={'Twój numer:'} data={state.visitCode} />
					<ConfirmationData label={'Gabinet:'} data={state.roomNumber} />
					<ConfirmationData label={'Aktualne miejsce w kolejce:'} data={state.queIndex} />
				</div>
				<div className={styles.buttonWrapper}>
					<button
						className={styles.buttonNew}
						onClick={() => {
							backToLogin();
						}}
					>
						Powrót
					</button>
				</div>
			</div>
		);
	};

	const TooFast = (): JSX.Element => {
		return (
			<div className={styles.TooFast}>
				<div className={`${styles.text} ${styles.title}`}>Jesteś za szybko!</div>
				<div className={styles.text}>Proszę przybyć w dzień swojej wizyty.</div>
				<div className={styles.buttonWrapper}>
					<button
						className={styles.buttonNew}
						onClick={() => {
							backToLogin();
						}}
					>
						Powrót
					</button>
				</div>
			</div>
		);
	};

	const TooLate = (): JSX.Element => {
		return (
			<div className={styles.TooLate}>
				<div className={`${styles.text} ${styles.title}`}>Jesteś za późno!</div>
				<div className={styles.text}>Przykro nam, termin Twojej wizyty minął.</div>
				<div className={styles.buttonWrapper}>
					<button
						className={styles.buttonNew}
						onClick={() => {
							backToLogin();
						}}
					>
						Powrót
					</button>
				</div>
			</div>
		);
	};

	// =========================================================================
	//RENDERING
	// =========================================================================

	let toRender: JSX.Element;
	let labelColor;

	switch (state.panelStatus) {
		case 'enterInformation':
			labelColor = styles.defaultLabel;
			toRender = <EnterCode />;
			break;
		case 'noQue':
			labelColor = styles.warningLabel;
			toRender = <NoQue />;
			break;
		case 'onTime':
			labelColor = styles.successLabel;
			toRender = <Success />;
			break;
		case 'duplicate':
			labelColor = styles.warningLabel;
			toRender = <Duplicate />;
			break;
		case 'late':
			labelColor = styles.warningLabel;
			toRender = <Warning />;
			break;
		case 'tooFast':
			labelColor = styles.warningLabel;
			toRender = <TooFast />;
			break;
		case 'tooLate':
			labelColor = styles.warningLabel;
			toRender = <TooLate />;
			break;
		case 'wrongCode':
			labelColor = styles.wrongCodeLabel;
			toRender = <WrongCode />;
			break;
		default:
			labelColor = styles.defaultLabel;
			toRender = <EnterCode />;
	}

	return (
		<div className={`${styles.containerBackground} ${labelColor}`}>
			<div className={styles.container}>{toRender}</div>
		</div>
	);
};

export default CentralBox;
