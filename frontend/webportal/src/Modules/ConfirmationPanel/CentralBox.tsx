import { useEffect } from "react";
import styles from './CentralBox.module.css';
import axios from "axios"
import React from "react";

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



class CentralBox extends React.Component  {
    getReservations = (e:any) => { 
        e.preventDefault();
        console.log(e);
        const configuration = {
            method: "POST",
            url: "http://localhost:3000/reservation/login",
            data: {
                email:e.target.form[0].value,
                reservationCode:e.target.form[1].value,
            }
        }
        axios(configuration)
            .then((res1) => {
            const getQueConfig = {
                method: "GET",
                url: "http://localhost:3000/que/get",
                data: {
                doctorId: res1.data.reservations[0].doctorId,
                }
            }
    
            axios(getQueConfig)
                .then((res2) => {
                    const addToQueConfig = {
                        method:"POST",
                        url:"http://localhost:3000/ticket/create",
                        data:{
                            queId: res2.data.que[0]._id,
                            visitTime:res1.data.reservations[0].time
                        }
                    }
    
                    axios(addToQueConfig)
                        .then((res3)=>{
                            console.log(res3)
                            this.setState({pageStatus:"success"});
                        })
                        .catch((err) => {console.log(err)})
                    console.log(res2.data.que[0]._id)
                    console.log(res1.data.reservations[0].time)
                })
                .catch((err) => console.log("Nie znaleziono kolejki"))
        })
            .catch((error) => {console.log(error)});
    }

    EnterCode = (): JSX.Element => {
        return (
            <div>
                <div className={`${styles.text} ${styles.title}`}>Witaj</div>
                <div className={styles.text}>Podaj swój unikatowy kod oraz adres email aby potwiedzić rejestrację.</div>
                
                <form className={styles.form}>
                    <input type="text" name="email" placeholder="Adres email" className={styles.input} maxLength={50} />
                    <input type="text" name="reservationCode" placeholder="Unikatowy kod rezerwacji" className={styles.input} maxLength={8} />
                    <button type="submit" onClick = {(e) => {this.getReservations(e)}} className={styles.buttonSend}>Zatwierdź</button>
                </form>
                
            </div>
        );
    }

    // useEffect(() => {setInterval(() => props.showHelloScreen(), 30000)}, []);
    render(){
        return (
            <div className={styles.containerBackground}>
                <div className={styles.container}>
                    <this.EnterCode/>
                </div>
            </div>
        );
    }
}

export default CentralBox;