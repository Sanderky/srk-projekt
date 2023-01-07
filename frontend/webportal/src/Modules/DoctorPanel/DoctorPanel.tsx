import { useState, useEffect } from 'react';
import styles from './DoctorPanel.module.css';
import logo from '../../Assets/Images/logo.png';
import logoutIcon from '../../Assets/Images/logout.png';
import spinnerImg from '../../Assets/Images/spinner.png';
import Clock from '../../Components/Clock';
import axios from 'axios';
import RoomSelectionView from './RoomSelectionView';
import TakingPatientsView from './TakingPatientsView';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
const doctorId = '63b2258dbb4dc4efaf5b60b3';
const BASE_URL = 'http://localhost:3000';

interface HeaderProps {
	setRoomNumber: (roomNumber: number | undefined) => void;
	roomSelected: boolean;
	setRoomSelected: (roomSelected: boolean) => void;
}

function Header({ setRoomNumber, roomSelected, setRoomSelected }: HeaderProps) {
	const logout = () => {
		setRoomNumber(undefined);
		setRoomSelected(false);
		localStorage.clear();
		window.location.reload();
	};


	return (
		<header>
			<div className={styles.logo}>
				<img className={styles.logoImage} src={logo} alt="Logo" />
				<h1 className={styles.logoText}>SRK</h1>
			</div>
			<Clock />
			{!roomSelected ? (
				<button className={styles.logoutButton} onClick={logout}>
					<p>Wyloguj</p>
					<img className={styles.logoutIcon} src={logoutIcon} alt=">" />
				</button>
			) : (
				<></>
			)}
		</header>
	);
}

interface ContainerHeaderProps {
	roomNumber: number | undefined;
	roomSelected: boolean;
}

function ContainerHeader({ roomNumber, roomSelected }: ContainerHeaderProps) {
	const renderSelectedRoomPart = () => {
		if (roomNumber && roomSelected) {
			return (
				<section className={styles.containerHeaderSection}>
					<h3 className={styles.containerHeaderLeft}>Numer gabinetu:</h3>
					<h1 className={styles.containerHeaderRight}>{roomNumber}</h1>
				</section>
			);
		}
	};
	const [doctorName, setDoctorName] = useState<string>('-');
	const axiosPrivate = useAxiosPrivate();
	const getDoctorName = async () => {
		const fetchedDoctor = await axiosPrivate.get(`/doctor/get/${doctorId}`);
		setDoctorName(`${fetchedDoctor.data.doctor.firstname} ${fetchedDoctor.data.doctor.lastname}`);
	};

	useEffect(() => {
		getDoctorName();
	}, []);

	return (
		<div className={styles.containerHeader}>
			<section className={styles.containerHeaderSection}>
				<h3 className={styles.containerHeaderLeft}>Zalogowano jako:</h3>
				<h1 className={styles.containerHeaderRight}>{doctorName}</h1>
			</section>
			{renderSelectedRoomPart()}
		</div>
	);
}

interface ContentProps {
	roomNumber: number | undefined;
	setRoomNumber: (roomNumber: number | undefined) => void;
	roomSelected: boolean;
	setRoomSelected: (roomSelected: boolean) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	error: boolean;
	setError: (error: boolean) => void;
}

function Content({ roomNumber, setRoomNumber, roomSelected, setRoomSelected, error, setError, loading, setLoading }: ContentProps) {
	const [queId, setQueId] = useState<string | undefined>(undefined);

	useEffect(() => {
		const globalRoomSelected = localStorage.getItem('roomSelected');
		const globalRoomNumber = localStorage.getItem('roomNumber');

		if (globalRoomNumber !== null && globalRoomSelected !== null) {
			setRoomNumber(parseInt(globalRoomNumber));
			setRoomSelected(globalRoomSelected === 'true' ? true : false);
		}
	}, []);

	return (
		<main className={styles.content}>
			<div className={styles.mainContainer}>
				<ContainerHeader roomNumber={roomNumber} roomSelected={roomSelected} />
				{roomNumber && roomSelected ? (
					<TakingPatientsView setRoomNumber={setRoomNumber} setRoomSelected={setRoomSelected} setLoading={setLoading} queId={queId} setQueId={setQueId} roomNumber={roomNumber} />
				) : (
					<RoomSelectionView
						setRoomNumber={setRoomNumber}
						roomNumber={roomNumber}
						setRoomSelected={setRoomSelected}
						error={error}
						setError={setError}
						setLoading={setLoading}
						setQueId={setQueId}
					/>
				)}
			</div>
			{loading ? <img src={spinnerImg} alt="" className={styles.spinner} /> : <></>}
		</main>
	);
}

function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer>
			<p className={styles.footer}>System rejestracji i kolejkowania | {year}</p>
		</footer>
	);
}

export default function DoctorPanel() {
	const [roomNumber, setRoomNumber] = useState<number | undefined>(undefined);
	const [roomSelected, setRoomSelected] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);

	return (
		<div className={styles.page}>
			<Header setRoomNumber={setRoomNumber} roomSelected={roomSelected} setRoomSelected={setRoomSelected} />
			<Content
				roomNumber={roomNumber}
				setRoomNumber={setRoomNumber}
				roomSelected={roomSelected}
				setRoomSelected={setRoomSelected}
				error={error}
				setError={setError}
				loading={loading}
				setLoading={setLoading}
			/>
			<Footer />
		</div>
	);
}
