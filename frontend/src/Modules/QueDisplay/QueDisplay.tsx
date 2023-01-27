import { useEffect, useState } from 'react';
import Que from './Que';
import styles from './QueDisplay.module.css';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
const Description = (): JSX.Element => {
	return (
		<div className={styles.descriptionContainer}>
			<div className={styles.descriptionFixedPart}>
				<h1 className={`${styles.roomNumberTitle} ${styles.descriptionElement}`}>
					Numer <br />
					gabinetu
				</h1>
				<hr className={styles.roomNumberDivider} />
				<h1 className={`${styles.firstTicketTitle} ${styles.descriptionElement}`}>Obsługiwany </h1>
				<h1 className={`${styles.firstTicketTitle} ${styles.descriptionElement}`}>Następny</h1>
			</div>
			<div className={`${styles.otherTicketTitle} ${styles.descriptionElement}`}>
				<div>Pozostali</div>
			</div>
		</div>
	);
};

const QueDisplay = () => {
	const [newQue, setNewQue] = useState([]);
	const [listening, setListening] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!listening) {
			const events = new EventSource('http://localhost:3000/que/events');
			events.onmessage = async (event) => {
				try {
					const response = await axiosPrivate.get('/que/get');
					setNewQue(response.data.que);
				} catch (err) {
					console.log('location');
					navigate('/login-panel', { state: { from: location }, replace: true });
				}
			};
			setListening(true);
		}
	}, [listening, axiosPrivate, location, navigate]);

	const ques = newQue.map((item, index) => {
		return <Que key={index} tickets={item}></Que>;
	});

	return (
		<div className={styles.queDisplay}>
			<div className={styles.activeTicket}>
				<h1 className={styles.callingTicket}>D10</h1>
				<h2 className={styles.roomID}>gabinet 6</h2>
			</div>
			<div className={styles.contentWrapper}>
				<div className={styles.contentContainer}>
					<Description />
					<div className={styles.quesContainer}>{ques}</div>
				</div>
			</div>
		</div>
	);
};

export default QueDisplay;
