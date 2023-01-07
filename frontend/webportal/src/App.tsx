import ConfirmationPanel from './Modules/ConfirmationPanel/ConfirmationPanel';
import DoctorPanel from './Modules/DoctorPanel/DoctorPanel';
import LoginPanel from './Modules/LoginPanel/LoginPanel';
import Registration from './Modules/Registration/Registration';
import QueDisplay from './Modules/QueDisplay/QueDisplay';
import PersistLogin from './Components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth';
function App() {
	return (
		<Routes>
			{/* Not protected */}
			<Route path="/" element={<Registration />} />
			<Route path="loginPanel" element={<LoginPanel />} />
			{/* Protected */}
			<Route element={<PersistLogin />}>
				<Route element={<RequireAuth allowedRoles={['doctor']} />}>
					<Route path="/queueDisplay" element={<QueDisplay />} />
					<Route path="/confirmationPanel" element={<ConfirmationPanel />} />
					<Route path="doctor-panel" element={<DoctorPanel />}></Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
