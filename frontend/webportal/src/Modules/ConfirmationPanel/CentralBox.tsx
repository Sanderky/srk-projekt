// import { useEffect } from "react";
import styles from './CentralBox.module.css';
import spinnerImg from '../../Assets/Images/spinner.png';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { useState } from 'react';
interface SuccessDataProps {
	label: string;
	data: string | number;
	color?: string;
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

const CentralBox = () => {
	const [params, setParams] = useState({ panelStatus: 'enterInformation', time: '-', roomNumber: -1, visitCode: '-', queIndex: -1, loading: false });

	const axiosPrivate = useAxiosPrivate();
	const backToLogin = () => {
		setParams({ panelStatus: 'enterInformation', time: '-', roomNumber: -1, visitCode: '-', queIndex: -1, loading: false });
	};

	const confirmReservation = async (event: any) => {
		setParams((prev) => {
			return { ...prev, loading: true };
		});

		if (event.target.form[0].value === '') {
			setParams((prev) => {
				return { ...prev, loading: false };
			});
			backToLogin();
		}
		event.preventDefault();
		const reservationPayload = { reservationCode: event.target.form[0].value };
		const reservationParams = new URLSearchParams(reservationPayload);
		let reservation;

		try {
			reservation = await axiosPrivate.get(`/reservation/get?${reservationParams}`);
		} catch (error) {
			console.log(error);
			setParams((prev) => {
				return { ...prev, panelStatus: 'wrongCode', loading: false };
			});
			return;
		}
		const reservationData = reservation?.data.reservation;

		const nonUTC = new Date();
		const today = new Date(Date.UTC(nonUTC.getUTCFullYear(), nonUTC.getUTCMonth(), nonUTC.getUTCDate(), 0, 0, 0, 0));
		const reservationDay = new Date(reservationData.day);
		if (reservationDay.getTime() > today.getTime()) {
			setParams((prev) => {
				return { ...prev, loading: false, panelStatus: 'tooFast' };
			});
			return;
		} else if (reservationDay.getTime() < today.getTime()) {
			setParams((prev) => {
				return { ...prev, loading: false, panelStatus: 'tooLate' };
			});
			return;
		}

		if (reservationData.registered) {
			//Get ticket data
			const ticketData = await axiosPrivate.get(`/ticket/get?${reservationParams}`);
			const ticket = ticketData.data.ticket;

			const queId = ticket.queId;
			const queData = await axiosPrivate.get(`/que/get/${queId}`);
			const que = queData.data.que;

			const queIndex = que.activeTickets.findIndex((t: { _id: any }) => t._id === ticket._id);
			setParams((prev) => {
				return { ...prev, roomNumber: que.roomNumber, visitCode: ticket.visitCode, panelStatus: 'duplicate' };
			});
		} else {
			//Create ticket
			const queParams = new URLSearchParams({ doctorId: reservationData.doctorId._id });
			const que = await axiosPrivate.get(`/que/get?${queParams}`);
			const queData = que.data.que;
			const queId = queData._id;

			const ticketPayload: any = {
				queId: queId,
				visitTime: reservationData.time,
				reservationCode: reservationData.reservationCode,
				roomNumber: queData.roomNumber
			};
			const createTicketResponse = await axiosPrivate(`/ticket/create`, ticketPayload);
			const ticket = createTicketResponse.data.ticket;
			const queResponse = createTicketResponse.data.queResponse;

			setParams((prev) => {
				return { ...prev, panelStatus: queResponse.lateStatus, time: ticket.visitTime, roomNumber: queData.roomNumber, visitCode: ticket.visitCode, queIndex: queResponse.queIndex };
			});
			axiosPrivate.post(`/reservation/login/`, reservationPayload);
		}
	};

	const EnterCode = (): JSX.Element => {
		return (
			<div>
				<div className={`${styles.text} ${styles.title}`}>Witaj</div>
				<div className={styles.text}>Podaj swój unikatowy kod rezerwacji</div>
				<form className={styles.form}>
					<input type="text" name="reservationCode" placeholder="Unikatowy kod rezerwacji" className={styles.input} maxLength={8} />
					<button type="submit" onClick={(event) => confirmReservation(event)} className={styles.buttonSend}>
						Zatwierdź
					</button>
				</form>
				<img src={spinnerImg} alt="ładowanie..." className={params.loading ? styles.spinnerActive : styles.spinnerDisabled} />
			</div>
		);
	};

	const Success = (): JSX.Element => {
		return (
			<div className={styles.success}>
				<div className={styles.successData}>
					<ConfirmationData label={'Twój numer:'} data={params.visitCode} />
					<ConfirmationData label={'Gabinet:'} data={params.roomNumber} />
					<ConfirmationData label={'Godzina wizyty:'} data={params.time} />
					<ConfirmationData label={'Miejsce w kolejce:'} data={params.queIndex} />
				</div>
				<div className={`${styles.successInfo} ${styles.text}`}>Proszę obserwować tablicę wywoławczą i oczekiwać na swoją kolej Po wywołaniu można udać się do odpowiedniego gabinetu</div>
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
					<input type="text" className={styles.input} maxLength={10} placeholder="Unikatowy kod rezerwacji" />
					<button type="submit" className={`${styles.buttonSend} ${styles.buttonError}`} onClick={(event) => confirmReservation(event)}>
						Zatwierdź
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
				<img src={spinnerImg} alt="ładowanie..." className={params.loading ? styles.spinnerActive : styles.spinnerDisabled} />
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
					<ConfirmationData label={'Twój numer:'} data={params.visitCode} />
					<ConfirmationData label={'Gabinet:'} data={params.roomNumber} />
					<ConfirmationData label={'Miejsce w kolejce:'} data={params.queIndex} />
					<ConfirmationData label={'Godzina wizyty:'} data={params.time} />
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
					<ConfirmationData label={'Twój numer:'} data={params.visitCode} />
					<ConfirmationData label={'Gabinet:'} data={params.roomNumber} />
					<ConfirmationData label={'Aktualne miejsce w kolejce:'} data={params.queIndex} />
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

	//Automatyczny powrót do ekranu wprowadzania danych po 30 sekundach
	// const componentDidUpdate = () => {
	//     setTimeout(() => {
	//         backToLogin()
	//     }, 30000);
	// } //TODO

	let toRender: any;
	let labelColor;

	console.log(params.panelStatus);
	switch (params.panelStatus) {
		case 'enterInformation':
			labelColor = styles.defaultLabel;
			toRender = <EnterCode />;
			break;
		case 'success':
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
	console.log(toRender);

	return (
		<div className={`${styles.containerBackground} ${labelColor}`}>
			<div className={styles.container}>{toRender}</div>
		</div>
	);
};

export default CentralBox;
