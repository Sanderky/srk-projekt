import { useState, useRef, useEffect } from 'react';
import styles from './LoginPanel.module.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import spinnerImg from '../../Assets/Images/spinner.png';
import { BASE_URL, ERROR_MSG } from '../../config/settings';

const LoginPanel = () => {
	const [error, setError] = useState<string | undefined>();
	const [loading, setLoading] = useState<boolean>(false);
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const { setAuth }: any = useAuth();

	const location = useLocation();
	const navigate = useNavigate();
	const from = location.state?.from?.pathname || '/';
	const rolesAllowed = location.state.rolesAllowed;

	const allowed = useState(location.state.roleAllowed);
	const roleExists = useState(location.state.roleExists);

	useEffect(() => {
		if (!allowed && roleExists) {
			setError(ERROR_MSG.notAllowed);
		}
	}, [allowed, roleExists]);

	const renderErrorMsg = () => {
		return error ? <div className={styles.errorMsg}>{error}</div> : <></>;
	};

	const handleSubmit = async (e: any) => {
		setLoading(true);
		const username = usernameRef.current?.value;
		const password = passwordRef.current?.value;
		e.preventDefault();
		try {
			const response = await axios.post(
				`${BASE_URL}/user/login`,
				{
					username: username,
					password: password,
					allowedRoles: rolesAllowed
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
			setLoading(false);
			navigate(from, { replace: true });
		} catch (err: any) {
			if (!username || !password || err.request?.status === 400) {
				setError(ERROR_MSG.noInputs);
			} else if (err.request?.status === 401) {
				setError(ERROR_MSG.badCredentials);
			} else if (err.request?.status === 403) {
				setError(ERROR_MSG.notAllowed);
			} else {
				console.log(err);
				setError(ERROR_MSG.other);
			}
			setLoading(false);
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
						autoComplete={'off'}
						ref={usernameRef}
						required
						onChange={(e) => setError(undefined)}
					></input>
				</div>
				<div>
					<div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ''}`}>Hasło</div>
					<input
						className={`${styles.input} ${error ? styles.error : ''}`}
						type={'password'}
						name={'password'}
						ref={passwordRef}
						autoComplete={'off'}
						required
						onChange={(e) => setError(undefined)}
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
				{loading ? <img src={spinnerImg} alt="" className={styles.spinner} /> : <></>}
			</form>
		</div>
	);
};

export default LoginPanel;
