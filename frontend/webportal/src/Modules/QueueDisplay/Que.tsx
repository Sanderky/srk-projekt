import { useState } from "react";
import TicketNumber from "./TicketNumber";

const Que = (props:any) => {

const ques = props.tickets.activeTickets.map((item:any,index:any) => {
    console.log(props.tickets.activeTickets[0].visitCode)
    return <TicketNumber key={index} visitCode={item.visitCode}></TicketNumber>
})
    console.log(ques);
    return (<div style={{"border":"4px solid green","width":"300px"}}><h4>Numer stanowiska: {props.tickets.roomNumber}</h4>{ques}</div>)
}

export default Que;