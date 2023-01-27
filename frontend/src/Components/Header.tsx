import axios from 'axios';
import useAuth from '../Hooks/useAuth';
import { BASE_URL } from '../config/settings';
import Clock from './Clock';
import logo from '../Assets/Images/logo.png';
import logoutIcon from '../Assets/Images/logout.png';
import styles from './Header.module.css';

interface HeaderProps {
	setRoomNumber: (roomNumber: number | undefined) => void;
	roomSelected: boolean;
	setRoomSelected: (roomSelected: boolean) => void;
}

export default function Header({ setRoomNumber, roomSelected, setRoomSelected }: HeaderProps) {
	const { setAuth }: any = useAuth();
	const logout = async () => {
		setRoomNumber(undefined);
		setRoomSelected(false);
		localStorage.clear();
		setAuth({});
		try {
			await axios.get(`${BASE_URL}/user/logout`, { withCredentials: true });
		} catch (error) {
			console.log(error);
		}
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
