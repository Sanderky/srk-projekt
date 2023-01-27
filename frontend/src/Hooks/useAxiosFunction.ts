import { useState, useEffect } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

export interface AxiosConfig {
	method: string;
	url: string;
	requestConfig: {};
}

const useAxiosFunction = () => {
	const [response, setResponse] = useState([]);
	const [error, setError] = useState<unknown>();
	const [loading, setLoading] = useState(false);
	const [controller, setController] = useState<AbortController>();
	const axiosPrivate = useAxiosPrivate();
	const axiosFetch = async (configObj: AxiosConfig) => {
		const { method, url, requestConfig = {} } = configObj;

		try {
			setLoading(true);
			const ctrl = new AbortController();
			setController(ctrl);
			const res = await axiosPrivate(url, {
				method: method,
				signal: ctrl.signal,
				...requestConfig
			});
			setResponse(res.data);
		} catch (error) {
			console.log(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		//useEffect cleanup function
		return () => controller && controller.abort();
		// eslint-disable-next-line
	}, []);

	return [response, error, loading, axiosFetch];
};

export default useAxiosFunction;
