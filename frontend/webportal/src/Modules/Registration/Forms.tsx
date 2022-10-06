import styles from "./Forms.module.css";
import searchIcon from "../../Assets/Images/search.png";

interface SearchBarProps {
    style?: React.CSSProperties;
}

const SearchBar = ({style}: SearchBarProps) => {
    return (
        <div className={styles.searchWrapper} style={style}>
            <input type={"text"} className={styles.search} placeholder={"Szukaj..."}/>
            <img src={searchIcon} className={styles.searchIcon}/>
        </div>
    );
}

interface SpecialistBoxProps {
    name: string;
    description: string;
}

const SpecialistBox = ({name, description}: SpecialistBoxProps) => {
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
            <SpecialistBox name={`test`} description={'test test test'}/>
        </div>
    );
}

export const SpecialistSelection = () => {
    return (       
        <div className={styles.specialistSelection}>
            <div className={styles.specialistSelectionWrapper}>
                <SearchBar style={{marginBottom: "50px"}}/>
                <SpecialistsList/>
            </div>


        </div>
    );
}

interface HourBoxProps {
    hour: string;
}

const HourBox = ({ hour }: HourBoxProps) => {
    return (
        <div className={styles.hourBox}>{hour}</div>
    );
}

const Calendar = () => {
    const hours = ["10:00", "15:30"];
    const renderHours = hours.map(hour => <HourBox hour={hour}/>);
  

    return (
        <div className={styles.calendar}>
            <div className={styles.calendarDays}>
                
            </div>
            <div className={styles.calendarHours}>
                {renderHours}
            </div>
        </div>
    );
}

export const VisitDate = () => {
    return <Calendar/>;
}
