import { useState, useEffect } from "react";
import styles from './Dashboard.module.css';
import axios from 'axios'

const Login = () => {
    const [error, setError] = useState("");

    // useEffect(() => {

    // }, [])

    const renderErrorMsg = () => {
        return error ? <div className={styles.errorMsg}>{error}</div> : <></>;
    }
    
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(e)
        const configuration = {
            method: "post",
            url: "http://localhost:4000/user/login",
            data: {
                username:e.target.form[0].value,
                password:e.target.form[1].value,
            },
        }
        axios(configuration)
            .then((result) => {console.log(result)})//TODO Gdzie co jak dalej
            .catch((error) => {console.log(error)});
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setRegister] = useState(false);
    
    return (
        <div>
            <div className={`${styles.logo} ${styles.disableSelecting}`}>SRK</div>
            <div className={`${styles.header} ${styles.disableSelecting}`}>Logowanie</div>
            <form className={styles.loginForm} onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ""}`}>Email</div>
                    <input className={`${styles.input} ${error ? styles.error : ""}`} type={"text"} name={"username"}></input>
                </div>
                <div>
                    <div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ""}`}>Hasło</div>
                    <input className={`${styles.input} ${error ? styles.error : ""}`} type={"password"} name={"password"}></input>
                </div> 
                {renderErrorMsg()}              
                <button className={styles.submitButton} type={"submit"} onClick = {(e) => { handleSubmit(e)}}>Zaloguj</button>
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
