// import { useState } from 'react';
// import Header from './Header';
// import HelloScreen from './HelloScreen';
import logo from '../../Assets/Images/logo.png';
import Clock from '../../Components/Clock';
import CentralBox from './CentralBox';
import styles from './ConfirmationPanel.module.css';

function Header() {
	return (
		<header>
			<div className={styles.logo}>
				<img className={styles.logoImage} src={logo} alt="Logo" />
				<h1 className={styles.logoText}>SRK</h1>
			</div>
			<Clock />
		</header>
	);
}

const ConfirmationPanel = () => {
	return (
		<div className={styles.main}>
			<Header />
			<div className={styles.centralBoxWrapper}>
				<CentralBox />
			</div>
		</div>
	);
	// }
};

export default ConfirmationPanel;
