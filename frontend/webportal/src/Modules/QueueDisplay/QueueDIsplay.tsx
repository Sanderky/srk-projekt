import { useState } from "react";
import axios from "axios"



const QueueDisplay = () => {
    let ques = [];
    const events = new EventSource('http://localhost:3000/ticket/events');
    events.onmessage = (event) => {
        const getQueConfig = {
            method: "GET",
            url: "http://localhost:3000/que/get",
            data: {
                doctorId: "6397b76391859488332a649c"
            }
        }
        axios(getQueConfig)
            .then((res) => console.log(res.data.que))
            .catch((err) => console.log(err))
    }
    return (<h1>To  jest testowy komponent ekranu jebanego</h1>);
}

export default QueueDisplay;