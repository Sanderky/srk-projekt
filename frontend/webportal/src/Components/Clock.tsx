import { useEffect, useState } from "react";
import React from 'react';

export interface ClockProps {
    style?: React.CSSProperties;
    className?: string;
}

export const Clock = ({style, className}: ClockProps): JSX.Element => {
    const [currentTime, setCurrentTime] = useState<string>("");
    const addZero = (minutes: number): string => minutes < 10 ? "0" + minutes : minutes.toString();
    useEffect(()=>{
        setInterval(()=>{
            const today = new Date();
            setCurrentTime(today.getHours() + ":" + addZero(today.getMinutes()));
        }, 1000);
    }, []);

    return (
        <div className={className} style={style}>{currentTime}</div>
    );
}
