import { useState, useEffect, useRef } from 'react';
import styles from './AdminPanel.module.css';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import Header from '../../Components/HeaderAdmin';
import useAxiosFunction, { AxiosConfig } from '../../Hooks/useAxiosFunction';
import { ROLES } from '../../config/settings';

// =========================================================================
// DOCTORS
// =========================================================================
interface AddNewDoctorUserProps {
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

function AddNewDoctor({ loading, setLoading }: AddNewDoctorUserProps) {
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
				<label htmlFor="doctorLastname">Nazwisko</label>
				<input name="doctorLastname" type="text" ref={doctorLastname} />
			</div>
			<div className={styles.inputPart}>
				<label htmlFor="doctorSpecialization">Specjalizacja</label>
				<input name="doctorSpecialization" type="text" ref={doctorSpecialization} />
			</div>
			<button className={styles.addNewDoctorButton} disabled={loading ? true : false}>
				{loading ? 'Czekaj...' : 'DODAJ'}
			</button>
		</form>
	);
}

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
	doctors: any;
	error: unknown;
	loadingAxios: boolean;
}

function AllDoctors({ loading, setLoading, doctors, error, loadingAxios }: AllDoctorsProps) {
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

// =========================================================================
// USERS
// =========================================================================

function AddNewUser({ loading, setLoading, doctors, error, loadingAxios }: AllDoctorsProps) {
	const axiosPrivate = useAxiosPrivate();
	const username = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const roleStaff = useRef<HTMLInputElement>(null);
	const roleDoctor = useRef<HTMLInputElement>(null);
	const roleAdmin = useRef<HTMLInputElement>(null);
	const [doctorToLink, setDoctorToLink] = useState<string | undefined>(undefined);

	const handleChange = (value: string) => {
		setDoctorToLink(value);
	};

	const createNewUser = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		const roles = [];
		console.log(roleAdmin.current?.checked);
		console.log(roleDoctor.current?.checked);
		console.log(roleStaff.current?.checked);
		if (roleAdmin.current?.checked) roles.push(ROLES.admin);
		if (roleStaff.current?.checked) roles.push(ROLES.staff);
		if (roleDoctor.current?.checked) roles.push(ROLES.doctor);
		const newUserData = {
			username: username.current?.value,
			password: password.current?.value,
			roles: roles,
			details: {
				doctorId: doctorToLink === 'null' ? null : doctorToLink
			}
		};
		try {
			await axiosPrivate.post('/user/signup', newUserData);
		} catch (error) {
			console.log(error);
		} finally {
			e.target.reset();
			setLoading(false);
		}
	};

	const mappedDoctors = () => {
		if (loadingAxios) {
			return (
				<option value="null" key={null} disabled={true}>
					Brak lekarzy.
				</option>
			);
		} else if (doctors) {
			return doctors.map((doctor: any, i: number) => {
				return (
					<option value={doctor?._id} key={i}>
						{`${doctor.firstname} ${doctor.lastname}`}
					</option>
				);
			});
		}
	};

	return (
		<div className={styles.userContainer}>
			<form className={styles.addUserContainer} onSubmit={(e) => createNewUser(e)}>
				<div className={styles.formInputs}>
					<div className={styles.inputs}>
						<div className={styles.inputPart}>
							<label htmlFor="login">Login</label>
							<input name="login" type="text" ref={username} />
						</div>
						<div className={styles.inputPart}>
							<label htmlFor="password">Hasło</label>
							<input name="password" type="password" ref={password} />
						</div>
					</div>
					<div className={styles.checkBoxes}>
						<div className={styles.singleCheckbox}>
							<input name="roleStaff" type="checkbox" ref={roleStaff} />
							<label htmlFor="roleStaff">Obługa</label>
						</div>
						<div className={styles.singleCheckbox}>
							<input name="roleDoctor" type="checkbox" ref={roleDoctor} />
							<label htmlFor="roleDoctor">Lekarz</label>
						</div>
						<div className={styles.singleCheckbox}>
							<input name="roleAdmin" type="checkbox" ref={roleAdmin} />
							<label htmlFor="roleAdmin">Administrator</label>
						</div>
					</div>
					<div className={styles.linkedDoctor}>
						<h4>Szczegóły</h4>
						<div className={styles.lindekDoctorSelect}>
							<label htmlFor="linkedDoctor">Powiązany lekarz</label>
							<select
								className={styles.roomSelection}
								defaultValue={'null'}
								name="room"
								id="room"
								onChange={(e) => handleChange(e.target.value)}
							>
								<option value="null">Brak powiązania</option>
								{mappedDoctors()}
							</select>
						</div>
					</div>
				</div>
				<button className={styles.addNewUserButton} type="submit" disabled={loading ? true : false}>
					{loading ? 'Czekaj...' : 'DODAJ'}
				</button>
			</form>
		</div>
	);
}

function Separator() {
	return <div className={styles.separator}></div>;
}

// =========================================================================
// CONTENT
// =========================================================================

function Content() {
	const [loading, setLoading] = useState<boolean>(false);
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

	return (
		<main className={styles.content}>
			<div className={styles.mainContainer}>
				<div className={styles.section}>
					<h3>SPECJALIŚCI</h3>
					<AddNewDoctor loading={loading} setLoading={setLoading} />
					<Separator />
					<AllDoctors loading={loading} setLoading={setLoading} doctors={doctors} error={error} loadingAxios={loadingAxios} />
				</div>
				<Separator />
				<div className={styles.section}>
					<h3>UŻYTKOWNICY</h3>
					<AddNewUser loading={loading} setLoading={setLoading} doctors={doctors} error={error} loadingAxios={loadingAxios} />
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
