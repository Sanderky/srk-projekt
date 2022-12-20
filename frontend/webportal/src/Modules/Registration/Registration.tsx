import CompanyName from "../../Components/CompanyName";
import Logo from "../../Components/Logo";
import ArrowWhite from "../../Assets/Images/expand_arrow_white.png";
import ArrowDark from "../../Assets/Images/expand_arrow_dark.png";
import LoadingIcon from "../../Assets/Images/loading.png";
import styles from "./Registration.module.css";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { SpecialistSelection, VisitDate } from "./Forms";

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

enum ExpandableStatus {
    Active = "active",
    Blocked = "blocked",
    Done = "done"
}

const ExpandableView = ({ children, style, expandedContentHeight, expanded, title, status, subtitle, number }: ExpandableViewProps) => {
    const [expandedView, setExpand] = useState(expanded ?? false);

    const toggleExpand = () => {
        if (expandedView) {
            setExpand(false);
        }
        else {
            setExpand(true);
        }
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
        return <img src={icon} style={{ transform: expandedView ? "rotateZ(0deg)" : "rotateZ(-180deg)", transition: "0.5s" }} />
    }

    const renderSubtitle = () => {
        if (subtitle) {
            return <div className={styles.expandSubtitle}>{subtitle}</div>
        }
        return null;
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
                    cursor: status === ExpandableStatus.Blocked ? "default" : "pointer"
                }} >
                <div className={styles.expandInfoWrapper}>
                    <div className={styles.expandNumber} style={{ justifyContent: subtitle ? "flex-start" : "center" }}>{number.toString()}</div>
                    <div className={styles.expandTitles}>
                        <div className={styles.expandTitle}>{title}</div>
                        {renderSubtitle()}
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
}

const Summary = ({ code }: SummaryProps) => {
    const renderSeparator = () => {
        return <div className={styles.separator}></div>;
    }

    return (
        <div className={styles.summary}>
            <div className={styles.summary_title}>Wizyta zarejestrowana pomyślnie!</div>
            {renderSeparator()}
            <div className={styles.summary_text}>Twój unikatowy kod wizyty:</div>
            <div className={styles.summary_code}>{code}</div>
            <div className={styles.summary_text}>Zachowaj go, będzie Ci potrzebny aby potwierdzić swoją obecność w placówce.</div>
            {renderSeparator()}
            <div className={styles.summary_text}>Potwierdzenie rejestracji wraz z kodem zostało również przesłane na Twój adres email.</div>
            <div>
                <div className={styles.summary_attention}>Uwaga!</div>
                <div className={styles.summary_text}>
                    Proszę przybyć do placówki w dzień swojej wizyty nie wcześniej niż 30 minut przed godziną wizyty. Na miejscu konieczne jest wprowadzenie swojego kodu w terminalu.
                </div>
            </div>
            <div className={`${styles.summary_text} ${styles.summary_newInfo}`}>Chcesz umówić kolejną wizytę?</div>
            <button className={styles.summary_btn}>Nowa wizyta</button>
        </div>
    );
}

const Forms = () => {
    return (
        <div className={styles.expandableWrapper}>
            <ExpandableView expandedContentHeight={500} expanded={true} number={1} title={"Wybierz specjalistę"} status={ExpandableStatus.Active} style={{ marginBottom: "30px" }}>
                <SpecialistSelection />
            </ExpandableView>
            <ExpandableView expandedContentHeight={600} expanded={false} number={2} title={"Wybierz termin wizyty"} status={ExpandableStatus.Active} style={{ marginBottom: "30px" }}>
                <VisitDate />
            </ExpandableView>
            <ExpandableView expandedContentHeight={50} expanded={false} number={3} title={"Formularz rejestracyjny"} status={ExpandableStatus.Blocked}>
                <div>Test</div>
            </ExpandableView>
        </div>
    );
}

const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            <img src={LoadingIcon} className={`${styles.loadingIcon} ${styles.rotating}`} />
        </div>
    );
}

const Registration = () => {
    useEffect(() => { document.title = "SRK - Rejestracja" }, [])

    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(false);
    const [code, setCode] = useState("");


    return (
        <div>
            <HelloScreen />
            <div className={styles.landingPage}>

                <Header />

                <div className={styles.landingPageContent} style={{ justifyContent: loading ? "center" : "flex-start" }}>
                    {summary ? (loading ? <Loading /> : <Summary code={code} />) : <Forms />}
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default Registration;