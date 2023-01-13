import { useState, useEffect, useRef } from 'react';
import styles from './AdminPanel.module.css';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import Header from '../../Components/HeaderAdmin';
import axios from '../../APIs/Doctor';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';

interface SingleDoctorProps {
	name: string;
	id: string;
	days: boolean;
	setLoading: (loading: boolean) => void;
}

function SingleDoctor({ name, id, setLoading }: SingleDoctorProps) {
	const axiosPrivate = useAxiosPrivate();
	const deleteDoctor = async () => {
		setLoading(true);
		try {
			await axiosPrivate.delete(`/doctor/delete/${id}`);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.singleDoctor}>
			<p className={styles.doctorBoxName}>{name}</p>
			<p className={styles.doctorBoxId}>ID: {id}</p>
			<button className={styles.doctorDelete} onClick={deleteDoctor}>
				Usuń
			</button>
		</div>
	);
}

interface AllDoctorsProps {
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

function AllDoctors({ loading, setLoading }: AllDoctorsProps) {
	// @ts-ignore
	const [doctorsObj, error, loadingAxios, axiosFetch]: [any, unknown, boolean, (configObj: AxiosConfig) => Promise<void>] = useAxiosFunction();

	const getData = () => {
		axiosFetch({
			method: 'GET',
			url: 'doctor/get',
			requestConfig: {}
		});
	};

	useEffect(() => {
		getData();
	}, [loading]);


	const doctors: any = doctorsObj.doctors;

	const toRender = () => {
		if (loadingAxios) {
			return <p className={styles.doctorNotDataText}>Ładowanie...</p>;
		} else if (!loadingAxios && error) {
			return <p className={styles.doctorNotDataText}>Wystąpił błąd.</p>;
		} else if (!loadingAxios && !error && doctors?.length) {
			return doctors.map((doctor: any, i: number) => {
				return (
					<SingleDoctor
						name={`${doctor?.firstname} ${doctor?.lastname}`}
						days={doctor?.days ? true : false}
						key={i}
						id={doctor?._id}
						setLoading={setLoading}
					/>
				);
			});
		} else return <p className={styles.doctorNotDataText}>Brak wyników.</p>;
	};
	const doctorsJSX = toRender();

	return <div className={styles.doctorsList}>{doctorsJSX}</div>;
}
interface AddNewDoctorProps {
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

function AddNewDoctor({ loading, setLoading }: AddNewDoctorProps) {
	const axiosPrivate = useAxiosPrivate();
	const doctorName = useRef<HTMLInputElement>(null);
	const doctorLastname = useRef<HTMLInputElement>(null);
	const doctorSpecialization = useRef<HTMLInputElement>(null);

	const createNewDoctor = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		const newDoctorData = {
			firstname: doctorName.current?.value,
			lastname: doctorLastname.current?.value,
			specialization: doctorSpecialization.current?.value
		};
		try {
			await axiosPrivate.post('/doctor/create', newDoctorData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
			e.target.reset();
		}
	};

	return (
		<form onSubmit={(e) => createNewDoctor(e)} className={styles.addDoctorContainer}>
			<div className={styles.inputPart}>
				<label htmlFor="doctorName">Imię</label>
				<input name="doctorName" type="text" ref={doctorName} />
			</div>
			<div className={styles.inputPart}>
				<label htmlFor="doctorName">Nazwisko</label>
				<input name="doctorLastname" type="text" ref={doctorLastname} />
			</div>
			<div className={styles.inputPart}>
				<label htmlFor="doctorName">Specjalizacja</label>
				<input name="doctorSpecialization" type="text" ref={doctorSpecialization} />
			</div>
			<button className={styles.addNewDoctorButton} disabled={loading ? true : false}>
				{loading ? 'Czekaj...' : 'DODAJ'}
			</button>
		</form>
	);
}

function Separator() {
	return <div className={styles.separator}></div>;
}

function Content() {
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<main className={styles.content}>
			<div className={styles.mainContainer}>
				<div className={styles.section}>
					<h3>SPECJALIŚCI</h3>
					<AddNewDoctor loading={loading} setLoading={setLoading} />
					<Separator />
					<AllDoctors loading={loading} setLoading={setLoading} />
				</div>
			</div>
		</main>
	);
}

export default function AdminPanel() {
	return (
		<div>
			<Header />
			<Content />
		</div>
	);
}
