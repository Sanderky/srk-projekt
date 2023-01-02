import CompanyName from "../../Components/CompanyName";
import Logo from "../../Components/Logo";
import ArrowWhite from "../../Assets/Images/expand_arrow_white.png";
import ArrowDark from "../../Assets/Images/expand_arrow_dark.png";
import styles from "./Registration.module.css";
import { useEffect, useState, useRef } from "react";
import React from "react";
import SpecialistSelection from "./Specialist";
import DatePicker from "./DatePicker";
import TimeSlots from "./TimeSlots";
import ReservationConfirmation from "./ReservationConfirmation";

const HelloScreen = () => {
    const scrollDown = () => {
        const section = document.querySelector(`.${styles.landingPage}`);
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return (
        <div className={styles.helloScreen}>
            <CompanyName color={"var(--white)"} size={"var(--header1"} style={{ marginTop: "70px", marginBottom: "10px" }} />
            <Logo width="150px" height="150px" />
            <div className={styles.helloHeader}>Witamy!</div>
            <div className={styles.subHelloHeader}>Internetowa rejestracja wizyty</div>
            <div className={styles.helloInfo}>Tutaj bezproblemowo zarejestrujesz się u jednego ze specjalistów SRK</div>
            <div className={styles.goNextWrapper}>
                <button className={styles.goNextBtn} onClick={() => scrollDown()}>Przejdź dalej</button>
            </div>
        </div>
    )
}

const Header = () => {

    const headerRef = useRef<HTMLDivElement>(null);
    const windowHeight = window.innerHeight;

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY >= windowHeight) {
                headerRef.current?.classList.add(styles.stickyHeader);
            }
            else {
                headerRef.current?.classList.remove(styles.stickyHeader);
            }
        };
        window.addEventListener('scroll', onScroll);
    }, [])

    return <div ref={headerRef} className={styles.header}>
        <CompanyName color={"var(--white)"} size={"var(--header2"} />
        <div className={styles.headerInfo}>Rejestracja wizyty</div>
        <CompanyName color={"var(--white)"} size={"var(--header2"} style={{ visibility: "hidden" }} />
    </div>;
}

interface ExpandableViewProps {
    children: React.ReactElement;
    title: string;
    expandedContentHeight: number;
    status: ExpandableStatus;
    number: number;
    subtitle?: string;
    expanded?: boolean;
    style?: React.CSSProperties;
}

interface SummaryStateProps {
    setCode: (code: string) => void;
    setSummary: (summary: boolean) => void;
}

enum ExpandableStatus {
    Active = "active",
    Blocked = "blocked",
    Done = "done"
}

const ExpandableView = ({ children, style, expandedContentHeight, expanded, title, status, subtitle, number }: ExpandableViewProps) => {
    const [expandedView, setExpand] = useState(expanded ?? false);

    function toggleExpand() {
        setExpand(prevState => !prevState)
    }

    const colorPicker = () => {
        switch (status) {
            case ExpandableStatus.Active: {
                return "var(--dark)";
            }
            case ExpandableStatus.Blocked: {
                return "var(--accentDark)";
            }
            case ExpandableStatus.Done: {
                return "var(--success)";
            }
        }
    }

    const renderIcon = () => {
        const icon = status === ExpandableStatus.Blocked ? ArrowDark : ArrowWhite;
        return <img src={icon} style={{ transform: expandedView ? "rotateZ(0deg)" : "rotateZ(-180deg)", transition: "0.5s" }} alt='' />
    }

    return (
        <div style={{ ...style }}>
            <div
                className={styles.expandBtn}
                onClick={() => status === ExpandableStatus.Blocked ? null : toggleExpand()}
                style={{
                    backgroundColor: colorPicker(),
                    color: status === ExpandableStatus.Blocked ? "var(--subText)" : "var(--white)",
                    paddingTop: subtitle ? "20px" : 0,
                    paddingBottom: subtitle ? "20px" : 0,
                    cursor: status === ExpandableStatus.Blocked ? "default" : "pointer",
                    boxShadow: status === ExpandableStatus.Blocked ? 'none' : ''
                }} >
                <div className={styles.expandInfoWrapper}>
                    <div className={styles.expandNumber} style={{ justifyContent: subtitle ? "flex-start" : "center" }}>{number.toString()}</div>
                    <div className={styles.expandTitles}>
                        <div className={styles.expandTitle}>{title}</div>
                        {subtitle ? <div className={styles.expandSubtitle}>{subtitle}</div> : null}
                    </div>
                </div>
                {renderIcon()}
            </div>
            <div className={styles.expandContent} style={{ height: expandedView ? `${expandedContentHeight}px` : "0" }}>
                {children}
            </div>
        </div>
    );
}

const Footer = () => {
    const year = new Date().getFullYear();
    return <div>
        <div className={styles.footer}>System rejestracji i kolejkowania | {year}</div>
    </div>
}

interface SummaryProps {
    code: string;
    setSummary: (summary: boolean) => void;
}

const Summary = ({ code, setSummary }: SummaryProps) => {
    const renderSeparator = () => {
        return <div className={styles.separator}></div>;
    }

    const newReservation = () => {
        setSummary(false);
    }

    return (
        <div className={styles.summaryWrapper}>
            <div className={styles.summaryBackground}>
                <div className={styles.summary}>
                    <div className={styles.summary_title}>Wizyta zarejestrowana pomyślnie!</div>
                    {renderSeparator()}
                    <div className={styles.summary_text}>Twój unikatowy kod wizyty:</div>
                    <div className={styles.summary_code}>{code}</div>
                    <div className={styles.summary_text}>Zachowaj go, będzie Ci potrzebny aby potwierdzić swoją obecność w placówce.</div>
                    {renderSeparator()}
                    <div className={styles.summary_text}>Potwierdzenie rejestracji wraz z kodem zostało również przesłane na Twój adres email.</div>
                </div>
            </div>
            <p className={`${styles.summary_text} ${styles.summary_newInfo}`}>Chcesz umówić kolejną wizytę?</p>
            <button className={styles.summary_btn} onClick={(e) => { newReservation() }}>Nowa wizyta</button>
        </div>
    );
}

const Forms = ({ setCode, setSummary }: SummaryStateProps) => {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>();
    const [selectedDoctor, setSelectedDoctor] = useState<string>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>();

    function checkDate() {
        if (!selectedDoctorId) {
            return ExpandableStatus.Blocked
        }
        else if (selectedDoctorId && !selectedDate) {
            return ExpandableStatus.Active
        } else if (selectedDoctorId && selectedDate) {
            return ExpandableStatus.Done
        } else return ExpandableStatus.Blocked
    }

    function checkTime() {
        if (!selectedDoctorId && !selectedDate) {
            return ExpandableStatus.Blocked
        }
        else if (selectedDoctorId && selectedDate && !selectedTime) {
            return ExpandableStatus.Active
        } else if (selectedDoctorId && selectedDate && selectedTime) {
            return ExpandableStatus.Done
        } else return ExpandableStatus.Blocked
    }

    function checkAll() {
        if (!selectedDoctorId && !selectedDate && !selectedTime) {
            return ExpandableStatus.Blocked
        }
        else if (selectedDoctorId && selectedDate && selectedTime) {
            return ExpandableStatus.Active
        } else if (selectedDoctorId && selectedDate && selectedTime) {
            return ExpandableStatus.Done
        } else return ExpandableStatus.Blocked
    }

    return (
        <div className={styles.expandableWrapper}>
            <ExpandableView expandedContentHeight={500} expanded={true} number={1} title={"Wybierz specjalistę"} subtitle={selectedDoctor} status={selectedDoctorId ? ExpandableStatus.Done : ExpandableStatus.Active} style={{ marginBottom: "30px" }}>
                <SpecialistSelection
                    selected={selectedDoctorId}
                    setSelectedId={setSelectedDoctorId}
                    setSelected={setSelectedDoctor} />
            </ExpandableView>
            <ExpandableView expandedContentHeight={600} expanded={false} number={2} title={"Wybierz termin wizyty"} subtitle={selectedDate?.toLocaleDateString()} status={checkDate()} style={{ marginBottom: "30px" }}>
                {selectedDoctorId ?
                    <DatePicker
                        selected={selectedDate}
                        setSelected={setSelectedDate} />
                    : <div>Wybierz lekarza.</div>}
            </ExpandableView>
            <ExpandableView expandedContentHeight={300} expanded={false} number={3} title={"Wybierz godzinę wizyty"} subtitle={selectedTime} status={checkTime()} style={{ marginBottom: "30px" }}>
                {selectedDate && selectedDoctorId ?
                    <TimeSlots
                        doctor={selectedDoctorId}
                        date={selectedDate?.toISOString()}
                        selected={selectedTime}
                        setSelected={setSelectedTime} />
                    : <div>Wybierz datę i lekarza.</div>}
            </ExpandableView>
            <ExpandableView expandedContentHeight={580} expanded={false} number={4} title={"Formularz rejestracyjny"} status={checkAll()} style={{ marginBottom: "30px" }}>
                {selectedDate && selectedDoctorId && selectedTime ?
                    <ReservationConfirmation
                        doctor={selectedDoctor}
                        doctorId={selectedDoctorId}
                        date={selectedDate}
                        time={selectedTime}
                        setDoctor={setSelectedDoctor}
                        setDoctorId={setSelectedDoctorId}
                        setDate={setSelectedDate}
                        setTime={setSelectedTime}
                        setCode={setCode}
                        setSummary={setSummary} />
                    : <div>Wybierz datę, lekarza i czas wizyty.</div>}
            </ExpandableView>
        </div>
    );
}

const Registration = () => {
    useEffect(() => { document.title = "SRK - Rejestracja" }, [])

    const [summary, setSummary] = useState(false);
    const [code, setCode] = useState<string>('');


    return (
        <div>
            <HelloScreen />
            <div className={styles.landingPage}>
                <Header />

                <div className={styles.landingPageContent} style={{ justifyContent: "flex-start" }}>
                    {summary ? <Summary code={code} setSummary={setSummary} /> : <Forms setCode={setCode} setSummary={setSummary} />}
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default Registration;