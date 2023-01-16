// import { useState } from 'react';
// import Header from './Header';
// import HelloScreen from './HelloScreen';
import logo from '../../Assets/Images/logo.png';
import Clock from '../../Components/Clock';
import CentralBox from './CentralBox';
import styles from './ConfirmationPanel.module.css';

function Header() {
	return (
		<div className={styles.confirmHeader}>
			<div className={styles.headerWrapper}>
				<div className={styles.logo}>
					<img className={styles.logoImage} src={logo} alt="Logo" />
					<h1 className={styles.logoText}>SRK</h1>
				</div>
				<Clock />
			</div>
		</div>
	);
}

const ConfirmationPanel = () => {
	return (
		<div className={styles.main}>
			<Header />
			<CentralBox />
		</div>
	);
	// }
};

export default ConfirmationPanel;
