import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

export default function useIdle(onIdle: any, idleTime = 30) {
	const [isIdle, setIsIdle] = useState<boolean>();

	const handleOnIdle = () => {
		setIsIdle(true);
		onIdle();
	};
	const { getRemainingTime, getLastActiveTime } = useIdleTimer({
		timeout: 1000 * idleTime,
		onIdle: handleOnIdle,
		debounce: 500
	});
	return {
		getRemainingTime,
		getLastActiveTime,
		isIdle
	};
}
