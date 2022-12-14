import { useEffect, useState } from "react";
import axios from "axios"
import Que from "./Que";

const QueueDisplay = () => {
    const [newQue,setNewQue] = useState([])
    const [listening,setListening] = useState(false);

    useEffect(() => {
        if(!listening){
            const events = new EventSource('http://localhost:3000/ticket/events');
            events.onmessage = (event) => { 
            console.log("Dostałem message")
            const getQueConfig = {
                method: "GET",
                url: "http://localhost:3000/que/get",
            }
            axios(getQueConfig)
                .then((res) => {
                    setNewQue(res.data.que)
                    console.log(res.data.que);
                })
                .catch((err) => console.log(err))
            }
            setListening(true)
        }
    },[listening]);
    
    const ques = newQue.map((item,index) => {
        return <Que key={index} tickets={item}></Que>
    })

   return <>{ques}</>
}

export default QueueDisplay;