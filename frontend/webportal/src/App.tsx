import ConfirmationPanel from './Modules/ConfirmationPanel/ConfirmationPanel';
import DoctorPanel from './Modules/DoctorPanel/DoctorPanel';
import LoginPanel from './Modules/LoginPanel/LoginPanel';
import AdminPanel from './Modules/AdminPanel/AdminPanel';
import Registration from './Modules/Registration/Registration';
import MainDisplay from './Modules/MainDisplay/MainDisplay';
import PersistLogin from './Components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth';
import { ROLES } from './config/settings';

function App() {
	return (
		<Routes>
			{/* Not protected */}
			<Route path="/" element={<Registration />} />
			<Route path="login-panel" element={<LoginPanel />} />
			{/* Protected */}
			<Route element={<PersistLogin />}>
				<Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.staff]} />}>
					<Route path="/main-display" element={<MainDisplay />} />
					<Route path="/confirmation-panel" element={<ConfirmationPanel />} />
				</Route>
				<Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.doctor]} />}>
					<Route path="/doctor-panel" element={<DoctorPanel />} />
				</Route>
				<Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
					<Route path="/admin-panel" element={<AdminPanel />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
