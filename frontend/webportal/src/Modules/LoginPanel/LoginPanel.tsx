import { useState } from 'react';
import styles from './LoginPanel.module.css';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';

const BASE_URL = 'http://localhost:3000';

const ERROR_MSG = {
	noInputs: 'Wprowadź swój login i hasło.',
	badCredentials: 'Niepoprawna nazwa użytkownika lub hasło.',
	notAllowed: 'Nie masz uprawinień do przeglądania tego zasobu.',
	other: 'Wystąpił błąd.'
};

const LoginPanel = () => {
	const [error, setError] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const { setAuth }: any = useAuth();

	const location = useLocation();
	const navigate = useNavigate();
	const from = location.state?.from?.pathname || '/';

	const renderErrorMsg = () => {
		return error ? <div className={styles.errorMsg}>{error}</div> : <></>;
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${BASE_URL}/user/login`,
				{
					username: username,
					password: password
				},
				{
					headers: { 'Content-type': 'application/json' },
					withCredentials: true
				}
			);
			const accessToken = response.data.accessToken;
			const roles = response.data.userRoles;
			if (response.data.userDetails) {
				if (response.data.userDetails.doctorId) {
					localStorage.setItem('doctorId', response.data.userDetails.doctorId);
				}
			}

			setAuth({ username, password, roles, accessToken });
			navigate(from, { replace: true });
		} catch (err: any) {
			if (!username || !password) {
				setError(ERROR_MSG.noInputs);
			} else if (err.request?.status === 401) {
				setError(ERROR_MSG.badCredentials);
			} else if (err.request?.status === 403) {
				setError(ERROR_MSG.notAllowed);
			} else {
				console.log(err);
				setError(ERROR_MSG.other);
			}
		}
	};

	return (
		<div className={styles.loginWrapper}>
			<div className={`${styles.logo} ${styles.disableSelecting}`}>SRK</div>
			<div className={`${styles.header} ${styles.disableSelecting}`}>Logowanie</div>
			<form className={styles.loginForm} onSubmit={(e) => handleSubmit(e)}>
				<div>
					<div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ''}`}>Nazwa użytkownika</div>
					<input
						className={`${styles.input} ${error ? styles.error : ''}`}
						type={'text'}
						name={'username'}
						onChange={(event) => {
							setUsername(event.target.value);
							setError('');
						}}
						value={username}
						autoComplete={'off'}
						required
					></input>
				</div>
				<div>
					<div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ''}`}>Hasło</div>
					<input
						className={`${styles.input} ${error ? styles.error : ''}`}
						type={'password'}
						name={'password'}
						onChange={(event) => {
							setPassword(event.target.value);
							setError('');
						}}
						value={password}
						autoComplete={'off'}
						required
					></input>
				</div>
				{renderErrorMsg()}
				<button
					className={styles.submitButton}
					type={'submit'}
					onClick={(e) => {
						handleSubmit(e);
					}}
				>
					Zaloguj
				</button>
			</form>
		</div>
	);
};

export default LoginPanel;
