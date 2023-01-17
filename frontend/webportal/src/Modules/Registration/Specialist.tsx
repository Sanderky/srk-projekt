import styles from './Specialist.module.css';
import searchIcon from '../../Assets/Images/search.png';
import React, { useEffect, useState } from 'react';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';

interface SearchBarProps {
	style?: React.CSSProperties;
	doctorsDefault: { firstname: string; lastname: string; specialization: string; _id: string }[];
	setDoctors: (doctors: { firstname: string; lastname: string; specialization: string; _id: string }[]) => void;
}

const SearchBar = ({ style, doctorsDefault, setDoctors }: SearchBarProps) => {
	const filterData = (searchPhrase: string) => {
		searchPhrase = searchPhrase.toLowerCase();
		if (searchPhrase !== '' && doctorsDefault) {
			const filteredDoctors = doctorsDefault.filter((doctor) => {
				return `${doctor.firstname}${doctor.lastname}${doctor.specialization}`.toLowerCase().indexOf(searchPhrase) > -1;
			});
			setDoctors(filteredDoctors);
		} else {
			setDoctors(doctorsDefault);
		}
	};

	return (
		<div className={styles.searchWrapper} style={style}>
			<img src={searchIcon} className={styles.searchIcon} alt="Szukaj" />
			<input type={'text'} className={styles.search} placeholder={'Szukaj...'} onChange={(e) => filterData(e.target.value)} />
		</div>
	);
};

interface SpecialistBoxProps {
	name: string;
	description: string;
	id: string;
	setSelectedId: (doctorId: string) => void;
	setSelected: (doctor: string) => void;
}

const SpecialistBox = ({ name, description, id, setSelected, setSelectedId }: SpecialistBoxProps) => {
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const doctorButton: HTMLButtonElement = event.currentTarget;
		setSelectedId(doctorButton.name);
		setSelected(name);
	};

	return (
		<button type="button" className={styles.specialistBox} onClick={handleClick} name={id}>
			<p className={styles.specialistBoxName}>{name}</p>
			<p className={styles.specialistBoxInfo}>{description}</p>
		</button>
	);
};

interface SpecialistListProps {
	loading: boolean;
	error: unknown;
	setSelected: (doctor: string) => void;
	setSelectedId: (doctorId: string) => void;
	doctors: { firstname: string; lastname: string; specialization: string; _id: string }[];
}

const SpecialistsList = ({ loading, error, setSelected, setSelectedId, doctors }: SpecialistListProps) => {
	const toRender = () => {
		if (loading) {
			return <p className={styles.specialistNotDataText}>Ładowanie...</p>;
		} else if (!loading && error) {
			return <p className={styles.specialistNotDataText}>Wystąpił błąd.</p>;
		} else if (!loading && !error && doctors?.length) {
			return doctors.map((doctor: any, i: number) => {
				return (
					<SpecialistBox
						name={`${doctor?.firstname} ${doctor?.lastname}`}
						description={doctor?.specialization}
						key={i}
						id={doctor?._id}
						setSelected={setSelected}
						setSelectedId={setSelectedId}
					/>
				);
			});
		} else return <p className={styles.specialistNotDataText}>Brak wyników.</p>;
	};
	const doctorsJSX = toRender();

	return <div className={styles.specialistsList}>{doctorsJSX}</div>;
};

interface SpecialistSelectionProps {
	setSelected: (doctor: string) => void;
	setSelectedId: (doctorId: string) => void;
}

export default function SpecialistSelection({ setSelected, setSelectedId }: SpecialistSelectionProps) {
	const [doctors, setDoctors] = useState<{ firstname: string; lastname: string; specialization: string; _id: string }[]>([]);
	const [doctorsDefault, setDoctorsDefault] = useState<{ firstname: string; lastname: string; specialization: string; _id: string }[]>([]);
	// @ts-ignore
	const [doctorsObj, error, loading, axiosFetch]: [
		{ doctors: { firstname: string; lastname: string; specialization: string; _id: string }[] },
		unknown,
		boolean,
		(configObj: AxiosConfig) => Promise<void>
	] = useAxiosFunction();

	useEffect(() => {
		axiosFetch({
			method: 'GET',
			url: 'doctor/get',
			requestConfig: {}
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		setDoctors(doctorsObj.doctors);
		setDoctorsDefault(doctorsObj.doctors);
	}, [doctorsObj]);

	return (
		<div className={styles.specialistSelection}>
			<div className={styles.specialistSelectionWrapper}>
				<SearchBar style={{ marginBottom: '20px' }} doctorsDefault={doctorsDefault} setDoctors={setDoctors} />
				<SpecialistsList setSelected={setSelected} setSelectedId={setSelectedId} doctors={doctors} loading={loading} error={error} />
			</div>
		</div>
	);
}
