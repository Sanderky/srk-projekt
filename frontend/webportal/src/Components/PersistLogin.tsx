import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../Hooks/useRefreshToken';
import useAuth from '../Hooks/useAuth';
import spinnerImg from '../Assets/Images/spinner.png';
import styles from './PersistLogin.module.css';

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth }: any = useAuth();

	useEffect(() => {
		const veryfiyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				// console.log(err);
			} finally {
				setIsLoading(false);
			}
		};

		!auth?.accessToken ? veryfiyRefreshToken() : setIsLoading(false);
	}, [auth?.accessToken, refresh]);

	return (
		<>
			{isLoading ? (
				<div className={styles.loadingContainer}>
					<img src={spinnerImg} alt="" className={styles.spinner} />
					<p className={styles.text}>Ładowanie...</p>
				</div>
			) : (
				<Outlet />
			)}
		</>
	);
};

export default PersistLogin;
