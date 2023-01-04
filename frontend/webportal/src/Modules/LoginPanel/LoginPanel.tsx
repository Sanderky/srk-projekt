import { useState, useEffect } from "react";
import styles from './LoginPanel.module.css';
import axios from 'axios'
import { redirect, useNavigate, useParams } from "react-router-dom";

const LoginPanel = () => {
    const [error, setError] = useState<string | undefined>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate()
    let { directTo }: any = useParams()

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/user/login",
            data: {
                username: username,
                password: password,
            },
        }
        axios(configuration)
            .then((result) => {
                console.log(result)
                localStorage.setItem('token', result.data.token)
                console.log(directTo)
                navigate("/" + directTo)
            })
            .catch((error) => {
                console.log(error)
                setError(error)
            });
    }

    return (
        <div className={styles.loginWrapper}>
            <div className={`${styles.logo} ${styles.disableSelecting}`}>SRK</div>
            <div className={`${styles.header} ${styles.disableSelecting}`}>Logowanie</div>
            <form className={styles.loginForm} onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ""}`}>Login</div>
                    <input className={`${styles.input} ${error ? styles.error : ""}`} type={"text"} name={"username"}
                        onChange={event => { setUsername(event.target.value); setError(undefined) }}></input>
                </div>
                <div>
                    <div className={`${styles.label} ${styles.disableSelecting} ${error ? styles.error : ""}`}>Hasło</div>
                    <input className={`${styles.input} ${error ? styles.error : ""}`} type={"password"} name={"password"}
                        onChange={event => { setPassword(event.target.value); setError(undefined) }}></input>
                </div>
                {error ? <div className={styles.errorMsg}>Błędny login lub hasło</div> : null}
                <button className={styles.submitButton} type={"submit"} onClick={(e) => { handleSubmit(e) }}>Zaloguj</button>
            </form>
        </div>
    );
}

export default LoginPanel;
