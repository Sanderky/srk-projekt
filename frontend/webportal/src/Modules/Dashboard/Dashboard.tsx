import { useState, useEffect } from "react";
import styles from './Dashboard.module.css';

const Login = () => {
    const [error, setError] = useState("Dupa dupa");

    // useEffect(() => {

    // }, [])

    const renderErrorMsg = () => {
        return error ? <div className={styles.errorMsg}>{error}</div> : <></>;
    }
    
    return (
        <div>
            <div className={`${styles.logo} ${styles.disableSelecting}`}>SRK</div>
            <div className={`${styles.header} ${styles.disableSelecting}`}>Logowanie</div>
            <form className={styles.loginForm}>
                <div>
                    <div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ""}`}>Email</div>
                    <input className={`${styles.input} ${error ? styles.error : ""}`} type={"text"}></input>
                </div>
                <div>
                    <div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ""}`}>Hasło</div>
                    <input className={`${styles.input} ${error ? styles.error : ""}`} type={"password"}></input>
                </div> 
                {renderErrorMsg()}              
                <button className={styles.submitButton} type={"submit"}>Zaloguj</button>
            </form>
        </div>       
    );

    
}

const Dashboard = () => {
    return (
        <div className={styles.main}>
            <Login/>
        </div>
    ); 
}

export default Dashboard;