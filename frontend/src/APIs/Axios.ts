import axios from 'axios';
import { BASE_URL } from '../config/settings';

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});
