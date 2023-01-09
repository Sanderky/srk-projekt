import React from 'react';
import useAuth from './useAuth';
import axios from 'axios';
import { BASE_URL } from '../config/settings';

const useRefreshToken = () => {
	const { setAuth }: any = useAuth();
	const refresh = async () => {
		const response = await axios.get(`${BASE_URL}/user/refresh`, {
			withCredentials: true
		});
		setAuth((prev: any) => {
			return {
				...prev,
				roles: response.data.roles,
				accessToken: response.data.accessToken
			};
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default useRefreshToken;
