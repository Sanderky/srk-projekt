import styles from "./Forms.module.css";
import searchIcon from "../../Assets/Images/search.png";
import { useState } from "react";

interface SearchBarProps {
    style?: React.CSSProperties;
}

const SearchBar = ({ style }: SearchBarProps) => {
    return (
        <div className={styles.searchWrapper} style={style}>
            <input type={"text"} className={styles.search} placeholder={"Szukaj..."} />
            <img src={searchIcon} className={styles.searchIcon} />
        </div>
    );
}

interface SpecialistBoxProps {
    name: string;
    description: string;
}

const SpecialistBox = ({ name, description }: SpecialistBoxProps) => {
    return (
        <div className={styles.specialistBox}>
            <div className={styles.specialistBoxName}>{name}</div>
            <div className={styles.specialistBoxInfo}>{description}</div>
        </div>
    );
}

const SpecialistsList = () => {
    return (
        <div className={styles.specialistsList}>
            <SpecialistBox name={`test`} description={'test test test'} />
        </div>
    );
}

export const SpecialistSelection = () => {
    return (
        <div className={styles.specialistSelection}>
            <div className={styles.specialistSelectionWrapper}>
                <SearchBar style={{ marginBottom: "50px" }} />
                <SpecialistsList />
            </div>


        </div>
    );
}

interface HourBoxProps {
    hour: string;
}

const HourBox = ({ hour }: HourBoxProps) => {
    return (
        <button className={styles.hourBox}>{hour}</button>
    );
}

interface DayBoxProps {
    day: number;
    active: boolean;
    selected: boolean;
}

const DayBox = ({ day, active, selected }: DayBoxProps) => {

    const addZero = (val: number) => {
        if (val < 10) {
            return `0${val}`;
        } else {
            return `${val}`;
        }
    }

    return <div className={active ? selected ? styles.daySelected : styles.dayActive : styles.dayInactive}>{addZero(day)}</div>;

}

const CalendarMonth = () => {
    const [month, setMonth] = useState(8);
    const [year, setYear] = useState(2022);
    const weekdays = ["po", "wt", "śr", "cz", "pt", "so", "nd"];
    const renderWeekdays = weekdays.map(day => <div>{day}</div>);
    const renderMonthDays = (month: number) => {
        const days = 31;
        const daysArr: JSX.Element[] = [];

        for (let i = 1; i <= days; i++) {
            daysArr.push(<DayBox selected={false} active={true} day={i} />)
        }

        return (
            <div className={styles.calendarMonthDays}>
                {daysArr}
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className={styles.selectWrapper}>
                    <select className={styles.select}>
                        <option value="">Styczeń</option>
                        <option value="">Luty</option>
                        <option value="">Marzec</option>
                        <option value="">Kwiecień</option>
                    </select>
                    <select className={styles.select} style={{ backgroundPositionX: "55px", paddingRight: "25px" }} >
                        <option value="">2022</option>
                        <option value="">2023</option>
                        <option value="">2024</option>
                    </select>
                </div>

            </div>
            <div>
                <div className={styles.calendarMonthWeekdays}>
                    {renderWeekdays}
                </div>
                <div>
                    {renderMonthDays(8)}
                </div>
            </div>
        </div>

    );
}

const Calendar = () => {
    const hours = ["10:00", "15:30"];
    const renderHours = hours.map(hour => <HourBox hour={hour} />);


    return (
        <div className={styles.calendar}>
            <div className={styles.calendarDays}>
                <div className={styles.calendarDaysHeader}>
                    18-08-2022
                </div>
                <div className={styles.calendarDaysBody}>
                    <CalendarMonth />
                </div>
            </div>
            <div className={styles.calendarHours}>
                {renderHours}
            </div>
        </div>
    );
}

export const VisitDate = () => {
    return <Calendar />;
}
