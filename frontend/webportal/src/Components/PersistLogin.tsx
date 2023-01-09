import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../Hooks/useRefreshToken';
import useAuth from '../Hooks/useAuth';

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth }: any = useAuth();

	const styles = {
		margin: '3rem',
		fontWeight: 'bold'
	};

	useEffect(() => {
		const veryfiyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		};

		!auth?.accessToken ? veryfiyRefreshToken() : setIsLoading(false);
	}, []);

	return <>{isLoading ? <p style={styles}>Ładowanie...</p> : <Outlet />}</>;
};

export default PersistLogin;
