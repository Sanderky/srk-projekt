import { useState, useEffect } from 'react';

export interface AxiosConfig {
    axiosInstance: any;
    method: string;
    url: string;
    requestConfig: {};
}

const useAxiosFunction = () => {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState<unknown>();
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState<AbortController>();

    const axiosFetch = async (configObj: AxiosConfig) => {
        const {
            axiosInstance,
            method,
            url,
            requestConfig = {}
        } = configObj;

        try {
            setLoading(true)
            const ctrl = new AbortController();
            setController(ctrl);
            const res = await axiosInstance[method.toLowerCase()](url, {
                ...requestConfig,
                signal: ctrl.signal
            })
            setResponse(res.data);
        } catch (error) {
            console.log(error);
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        //useEffect cleanup function
        return () => controller && controller.abort()
    }, [controller])

    return [response, error, loading, axiosFetch];
}

export default useAxiosFunction 