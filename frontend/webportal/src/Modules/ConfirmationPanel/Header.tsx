import React from 'react';
import styles from './Header.module.css';
import { Clock } from "../../Components/Clock";

const Header: React.FC = () => {

    return (
        <div className={styles.container}>
            <div className={styles.logo}>SRK</div>
            <Clock className={styles.clock}/>
        </div>
    );
}

export default Header;