import styles from "./Specialist.module.css";
import searchIcon from "../../Assets/Images/search.png";
import React, { useEffect } from "react";
import axios from "../../APIs/Doctor";
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';


interface SearchBarProps {
    style?: React.CSSProperties;
}

const SearchBar = ({ style }: SearchBarProps) => {
    return (
        <div className={styles.searchWrapper} style={style}>
            <img src={searchIcon} className={styles.searchIcon} />
            <input type={"text"} className={styles.search} placeholder={"Szukaj..."} />
        </div>
    );
}

interface SpecialistBoxProps {
    name: string;
    description: string;
    selected: string | undefined;
    id: string;
    setSelectedId: (doctorId: string) => void;
    setSelected: (doctor: string) => void;
}

const SpecialistBox = ({ name, description, selected, id, setSelected, setSelectedId }: SpecialistBoxProps) => {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const doctorButton: HTMLButtonElement = event.currentTarget;
        setSelectedId(doctorButton.name);
        setSelected(name);
    }

    return (
        <button type='button' className={styles.specialistBox} onClick={handleClick} name={id}>
            <p className={styles.specialistBoxName}>{name}</p>
            <p className={styles.specialistBoxInfo}>{description}</p>
        </button>
    );
}

const SpecialistsList = (props: { selected: string | undefined; setSelected: any; setSelectedId: any;}) => {
    // @ts-ignore
    const [doctorsObj, error, loading, axiosFetch]: [{}, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

    const getData = () => {
        axiosFetch({
            axiosInstance: axios,
            method: 'GET',
            url: '/get',
            requestConfig: {}
        });
    }

    useEffect(() => {
        getData();
    }, [])

    // @ts-ignore
    const doctors: [] = doctorsObj.doctors

    const toRender = () => {
        if (loading) {
            return <p className={styles.specialistNotDataText}>Ładowanie...</p>
        } else if (!loading && error) {
            return <p className={styles.specialistNotDataText}>Wystąpił błąd.</p>
        } else if (!loading && !error && doctors?.length) {
            return doctors.map((doctor, i) => {
                return <SpecialistBox                                           // @ts-ignore
                            name={`${doctor?.firstname} ${doctor?.lastname}`}   // @ts-ignore
                            description={doctor?.specialization}                // @ts-ignore
                            key={i} id={doctor?._id} 
                            selected={props.selected} 
                            setSelected={props.setSelected} 
                            setSelectedId={props.setSelectedId} />
            })
        } else return <p className={styles.specialistNotDataText}>Brak wyników.</p>
    }
    const doctorsJSX = toRender()

    return (
        <div className={styles.specialistsList}>
            {doctorsJSX}
        </div>
    );
}

export default function SpecialistSelection(props: { selected: string | undefined; setSelectedId: any; setSelected: any }) {
    return (
        <div className={styles.specialistSelection}>
            <div className={styles.specialistSelectionWrapper}>
                <SearchBar style={{ marginBottom: "20px" }} />
                <SpecialistsList 
                    selected={props.selected} 
                    setSelected={props.setSelected} 
                    setSelectedId={props.setSelectedId}/>
            </div>
        </div>
    );
}
