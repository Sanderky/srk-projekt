import { useEffect } from "react";
import styles from './CentralBox.module.css';

const EnterCode = (): JSX.Element => {
    return (
        <div>
            <div className={`${styles.text} ${styles.title}`}>Witaj</div>
            <div className={styles.text}>Podaj swój unikatowy kod aby potwiedzić rejestrację.</div>
            
            <form className={styles.form}>
                <input type="text" className={styles.input} maxLength={5} />
                <button type="submit" className={styles.buttonSend}>Zatwierdź</button>
            </form>
            
        </div>
    );
}

const WrongCode = (): JSX.Element => {
    return (
        <div className={styles.WrongCode}>
            <div className={`${styles.text} ${styles.title}`}>Błędny kod</div>
            <div className={styles.text}>Podany kod nie istnieje. Spróbuj ponownie.</div>
            
            <form className={styles.form}>
                <input type="text" className={styles.input} maxLength={5} />
                <button type="submit" className={`${styles.buttonSend} ${styles.buttonError}`}>Zatwierdź</button>
            </form>

            <div className={styles.buttonWrapper}>
                <button className={styles.buttonNew}>Nowa rejestracja</button>
            </div>
            
            
        </div>
    );
}

const TooFast = (): JSX.Element => {
    return (
        <div className={styles.TooFast}>
            <div className={`${styles.text} ${styles.title}`}>Jesteś za szybko!</div>
            <div className={styles.text}>Proszę przybyć w dzień swojej wizyty.</div>
            <div className={styles.buttonWrapper}>
                <button className={styles.buttonNew}>Nowa rejestracja</button>
            </div>
        </div>
    );
}

interface SuccessDataProps {
    label: string;
    data: string | number;
    color?: string;
}

const ConfirmationData = ({ label, data, color = "var(--subText)"} : SuccessDataProps): JSX.Element => {
    return (
        <div className={styles.ConfirmationDataContainer}>
            <div className={styles.ConfirmationDataLabel}>{label}</div>
            <div className={styles.ConfirmationDataLabel} style={{color: color}}>{data}</div>
        </div>
    );
}

const Success = (): JSX.Element => {
    return (
        <div className={styles.success}>
            <div className={styles.successData}>
                <ConfirmationData label={"Twój numer"} data={"AC3"}/>
                <ConfirmationData label={"Stanowisko:"} data={115}/>
                <ConfirmationData label={"Godzina wizyty:"} data={"10:00"}/>
                <ConfirmationData label={"Miejsce w kolejce:"} data={2}/>
            </div>
            <div className={`${styles.successInfo} ${styles.text}`}>
                Proszę obserwować tablicę wywoławczą i oczekiwać na swoją kolej.
                Po wywołaniu można udać się do swojego stanowiska.
            </div>
            <div className={styles.buttonWrapper}>
                <button className={styles.buttonNew}>Zakończ</button>
            </div>
        </div>
    );
}

const Warning = (): JSX.Element => {
    const addZero = (minutes: number): string => minutes < 10 ? "0" + minutes : minutes.toString();
    const today = new Date();
    const confirmationTime = today.getHours() + ":" + addZero(today.getMinutes());

    return(
        <div className={styles.success}>
            <div className={styles.text} style={{marginBottom: "30px"}}>
                Rejestracja potwierdzona z opóźnieniem.
                Wizyta nadal może się odbyć lecz kolejność przyjęcia mogła ulec zmianie.
            </div>
            <div className={styles.successData}>
                <ConfirmationData label={"Godzina wizyty:"} data={"10:00"}/>
                <ConfirmationData label={"Godzina potwierdzenia:"} data={confirmationTime} color={"var(--warning)"}/>
            </div>
            <div className={styles.buttonWrapper}>
                <button className={styles.buttonNew}>Dalej</button>
            </div>
        </div>
    );
}


interface CentralBoxProps {
    showHelloScreen: () => void;
}

const CentralBox = (props: CentralBoxProps): JSX.Element => {
    useEffect(() => {setInterval(() => props.showHelloScreen(), 30000)}, []);

    return (
        <div className={styles.containerBackground}>
            <div className={styles.container}>
                <EnterCode/>
            </div>
        </div>
    );
}

export default CentralBox;